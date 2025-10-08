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
        $NaoAtivas = 0;

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
}
