<?php

namespace App\Http\Controllers;

use App\Http\Resources\MetricResource;
use App\Services\MetricService;
use Carbon\Carbon;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

class MetricController extends Controller
{
    public function __construct(private readonly MetricService $service) {}

    public function show(Request $request, string $slug)
    {
        try {
            // opcional: aceitar ?today=YYYY-MM-DD para testes
            $today = $request->query('today');
            $todayCarbon = $today ? Carbon::parse($today, 'America/Sao_Paulo') : null;

            $payload = $this->service->getMetric($slug, $todayCarbon);
            return new MetricResource($payload);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'error' => 'Métrica inválida',
                'detail' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (RequestException $e) {
            // API externa retornou erro HTTP
            return response()->json([
                'error'  => 'Falha em dependência externa',
                'detail' => $e->getMessage(),
            ], 424);
        } catch (ConnectionException $e) {
            // timeout / conexão
            return response()->json([
                'error'  => 'Tempo excedido ao consultar serviço externo',
                'detail' => $e->getMessage(),
            ], Response::HTTP_GATEWAY_TIMEOUT);
        }
    }
}
