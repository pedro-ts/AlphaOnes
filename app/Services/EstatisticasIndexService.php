<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class EstatisticasIndexService
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
    


}
