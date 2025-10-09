<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class EstatisticasService
{
    /**
     * Bases (sem alterações)
     */
    public function obterBases(): array
    {
        $url = rtrim(config('services.externalsys.base_url'), '/');
        $rota = "/campaigns";
        $apiKey = config('services.externalsys.key');
        $porPagina = 100;
        $NaoAtivas = 0;

        $response = Http::get($url . $rota, [
            'api_token' => $apiKey,
            'paused'    => $NaoAtivas,
            'per_page'  => $porPagina
        ]);

        $lista = Arr::get($response, 'data', $response);

        return array_values(array_map(
            fn($item) => [
                'id'   => Arr::get($item, 'id'),
                'name' => Arr::get($item, 'name'),
            ],
            (array) $lista
        ));
    }

    /**
     * Para cada campanha:
     * - Busca listas/metrics (paginado)
     * - Busca listas/qualifications (paginado)
     * - Agrega qualificações por list.id -> grafico{ label[], values[] }
     * - Mescla ao layout solicitado
     */
    public function obterMetricasCampanhas(array $campaignIds, string $inicio, string $fim): array
    {
        $resultado = [];

        foreach ($campaignIds as $campaignId) {
            $campaignId = (string) $campaignId;

            // 1) métricas por lista
            $listasMetrics = $this->coletarListasPaginadasMetrics($campaignId, $inicio, $fim);

            // 2) qualificações por lista
            $qualRows = $this->coletarListasPaginadasQualifications($campaignId, $inicio, $fim);

            // 3) agrega qualificações -> arrays para Chart.js
            $graficosPorLista = $this->montarGraficoPorLista($qualRows);

            // 4) monta saida: lista1, lista2...
            $fmt = [];
            $i = 1;
            foreach ($listasMetrics as $item) {
                $listId = Arr::get($item, 'list.id');

                $grafico = $graficosPorLista[$listId] ?? [
                    'label'  => [],
                    'values' => [],
                ];

                $fmt["lista{$i}"] = array_merge(
                    $this->mapaCamposMetrics($item),
                    ['grafico' => $grafico]
                );
                $i++;
            }

            $resultado[$campaignId] = $fmt;
        }

        return $resultado;
    }

    /**
     * GET /campaigns/{id}/lists/metrics  (paginado)
     */
    private function coletarListasPaginadasMetrics(string $campaignId, string $inicio, string $fim): array
    {
        $baseUrl = rtrim(config('services.externalsys.base_url'), '/');
        $apiKey  = config('services.externalsys.key');

        $pagina = 1;
        $acumulado = [];
        $totalPaginas = 1;

        do {
            try {
                $res = Http::timeout(15)
                    ->retry(3, 250)
                    ->acceptJson()
                    ->get("{$baseUrl}/campaigns/{$campaignId}/lists/metrics", [
                        'start_date' => $inicio,
                        'end_date'   => $fim,
                        'page'       => $pagina,
                        'trashed'    => ['campaign'],
                        'api_token'  => $apiKey,
                    ])
                    ->throw();

                $json = $res->json();

                $dados = Arr::get($json, 'data', []);
                if (is_array($dados)) {
                    $acumulado = array_merge($acumulado, $dados);
                }

                $paginacao    = Arr::get($json, 'meta.pagination', []);
                $totalPaginas = (int) Arr::get($paginacao, 'total_pages', 1);
                $pagina++;
            } catch (RequestException | ConnectionException $e) {
                report($e);
                break;
            }
        } while ($pagina <= $totalPaginas);

        return $acumulado;
    }

    /**
     * GET /campaigns/{id}/lists/qualifications  (paginado)
     * Retorna as linhas brutas (cada linha tem list.id e qualifications[])
     */
    private function coletarListasPaginadasQualifications(string $campaignId, string $inicio, string $fim): array
    {
        $baseUrl = rtrim(config('services.externalsys.base_url'), '/');
        $apiKey  = config('services.externalsys.key');

        $pagina = 1;
        $acumulado = [];
        $totalPaginas = 1;

        do {
            try {
                $res = Http::timeout(15)
                    ->retry(3, 250)
                    ->acceptJson()
                    ->get("{$baseUrl}/campaigns/{$campaignId}/lists/qualifications", [
                        'start_date' => $inicio,
                        'end_date'   => $fim,
                        'page'       => $pagina,
                        'trashed'    => ['campaign'],
                        'api_token'  => $apiKey,
                    ])
                    ->throw();

                $json = $res->json();

                $dados = Arr::get($json, 'data', []);
                if (is_array($dados)) {
                    $acumulado = array_merge($acumulado, $dados);
                }

                // Algumas respostas podem não trazer meta.pagination; trata como 1 página
                $paginacao    = Arr::get($json, 'meta.pagination', null);
                $totalPaginas = $paginacao ? (int) Arr::get($paginacao, 'total_pages', 1) : 1;
                $pagina++;
            } catch (RequestException | ConnectionException $e) {
                report($e);
                break;
            }
        } while ($pagina <= $totalPaginas);

        return $acumulado;
    }

    /**
     * Agrega qualifications por list.id:
     * - Soma counts de mesmo "name" no período
     * - Preserva ordem de primeira ocorrência
     * Saída: [ listId => ['label' => [...], 'values' => [...] ] ]
     */
    private function montarGraficoPorLista(array $qualRows): array
    {
        $porLista = [];

        foreach ($qualRows as $row) {
            $listId = Arr::get($row, 'list.id');
            if ($listId === null) {
                continue;
            }

            $quals = Arr::get($row, 'qualifications', []);
            foreach ((array) $quals as $q) {
                $name  = (string) Arr::get($q, 'name', '');
                $count = (int) Arr::get($q, 'count', 0);
                if ($name === '') {
                    continue;
                }

                if (!isset($porLista[$listId])) {
                    $porLista[$listId] = [
                        'counts' => [],
                        'order'  => [],
                    ];
                }

                if (!array_key_exists($name, $porLista[$listId]['counts'])) {
                    $porLista[$listId]['counts'][$name] = 0;
                    $porLista[$listId]['order'][] = $name; // mantém ordem de 1ª aparição
                }

                $porLista[$listId]['counts'][$name] += $count;
            }
        }

        $out = [];
        foreach ($porLista as $listId => $bucket) {
            $labels = $bucket['order'];
            $values = array_map(fn($label) => (int) $bucket['counts'][$label], $labels);

            $out[$listId] = [
                'label'  => $labels, // conforme solicitado
                'values' => $values,
            ];
        }

        return $out;
    }

    /**
     * Campos de métricas na forma solicitada
     */
    private function mapaCamposMetrics(array $item): array
    {
        return [
            'id da lista'                  => Arr::get($item, 'list.id'),
            'horario'                      => Arr::get($item, 'list.created_at'),
            'nome'                         => Arr::get($item, 'list.name'),
            'Total telefones'              => (int) Arr::get($item, 'phones.total', 0),
            'Falhas'                       => (int) Arr::get($item, 'calls.failed', 0),
            'Caixa postal pós atendimento' => (int) Arr::get($item, 'calls.mailbox', 0),
            'Caixa postal pré atendimento' => (int) Arr::get($item, 'calls.not_answered_due_progress_amd', 0),
            'Abandonadas'                  => (int) Arr::get($item, 'calls.abandoned', 0),
            'Atendidas'                    => (int) Arr::get($item, 'connected.total', 0),
            'Não atendidas'                => (int) Arr::get($item, 'calls.not_answered', 0),
        ];
    }
}
