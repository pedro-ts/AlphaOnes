<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class EstatisticasService
{
    // Exemplo de método
    // public function getById(string $id): array
    // {
    //     $baseUrl = config('services.reports.base_url');

    //     try {
    //         $res = Http::timeout(10)
    //             ->retry(3, 200)
    //             ->acceptJson()
    //             ->withHeaders([
    //                 'Authorization' => 'Bearer ' . config('services.reports.token'),
    //             ])
    //             ->get("{$baseUrl}/reports/{$id}")
    //             ->throw();

    //         return $res->json();
    //     } catch (RequestException | ConnectionException $e) {
    //         report($e);
    //         abort(502, 'Falha ao consultar provedor externo');
    //     }
    // }
    // app/Services/EstatisticasService.php

    public function obterBases(): array
    {
        $url = rtrim(config('services.externalsys.base_url'), '/');
        $rota = "/campaigns";
        $apiKey = config('services.externalsys.key');
        $porPagina = 100;
        $NaoAtivas = 0; //boolean

        // CORRIGIDO: $url . $rota (não usar +)
        $response = Http::get($url . $rota, [
            'api_token' => $apiKey,
            'paused'    => $NaoAtivas,
            'per_page'  => $porPagina
        ]);
        // a API pode devolver em 'data' ou a lista direta
        $lista = Arr::get($response, 'data', $response);


        // retorna apenas id e name
        return array_values(array_map(
            fn($item) => [
                'id'   => Arr::get($item, 'id'),
                'name' => Arr::get($item, 'name'),
            ],
            (array) $lista
        ));
    }


    /**
     * Busca TODAS as listas e métricas de várias campanhas no período informado
     * e devolve no formato:
     * [
     *   "{id_campanha}" => [
     *      "lista1" => [...campos...],
     *      "lista2" => [...campos...],
     *      ...
     *   ],
     *   "{id_campanha_2}" => [...]
     * ]
     */
    public function obterMetricasCampanhas(array $campaignIds, string $inicio, string $fim): array
    {
        $resultado = [];

        foreach ($campaignIds as $campaignId) {
            $listas = $this->coletarListasPaginadas((string)$campaignId, $inicio, $fim);

            // monta "lista1", "lista2", ... na ordem retornada
            $fmt = [];
            $i = 1;
            foreach ($listas as $item) {
                $fmt["lista{$i}"] = $this->mapaCampos($item);
                $i++;
            }

            $resultado[(string)$campaignId] = $fmt;
        }

        return $resultado;
    }

    /**
     * Consome a API paginada para uma campanha e período
     * Retorna um array com todos os itens de "data"
     */
    private function coletarListasPaginadas(string $campaignId, string $inicio, string $fim): array
    {
        $baseUrl = rtrim(config('services.externalsys.base_url'), '/'); // ex: https://3c.fluxoti.com/api/v1
        $apiKey  = config('services.externalsys.key');

        $pagina = 1;
        $acumulado = [];

        do {
            try {
                $res = Http::timeout(15)
                    ->retry(3, 250) // 3 tentativas, 250ms entre elas
                    ->acceptJson()
                    ->get("{$baseUrl}/campaigns/{$campaignId}/lists/metrics", [
                        'start_date'        => $inicio,
                        'end_date'          => $fim,
                        'page'              => $pagina,
                        'trashed'           => ['campaign'], // trashed[0]=campaign
                        'api_token'         => $apiKey,
                    ])
                    ->throw();

                $json = $res->json();

                $dados = Arr::get($json, 'data', []);
                if (is_array($dados)) {
                    $acumulado = array_merge($acumulado, $dados);
                }

                $paginacao   = Arr::get($json, 'meta.pagination', []);
                $totalPaginas = (int) Arr::get($paginacao, 'total_pages', 1);
                $pagina++;
            } catch (RequestException | ConnectionException $e) {
                report($e);
                // Falha desta página: encerra o loop e devolve o que já foi possível
                break;
            }
        } while ($pagina <= ($totalPaginas ?? 1));

        return $acumulado;
    }

    /**
     * Converte um item bruto da API para o layout solicitado
     */
    private function mapaCampos(array $item): array
    {
        return [
            'id da lista'                     => Arr::get($item, 'list.id'),
            'nome'                            => Arr::get($item, 'list.name'),
            'Total telefones'                 => (int) Arr::get($item, 'phones.total', 0),
            'Falhas'                          => (int) Arr::get($item, 'calls.failed', 0),
            'Caixa postal pós atendimento'    => (int) Arr::get($item, 'calls.mailbox', 0),
            'Caixa postal pré atendimento'    => (int) Arr::get($item, 'calls.not_answered_due_progress_amd', 0),
            'Abandonadas'                     => (int) Arr::get($item, 'calls.abandoned', 0),
            'Atendidas'                       => (int) Arr::get($item, 'connected.total', 0),
            'Não atendidas'                   => (int) Arr::get($item, 'calls.not_answered', 0),
        ];
    }
}
