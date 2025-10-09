<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\EstatisticasService;

class EstatisticasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function bases(EstatisticasService $service)
    {
        // Obtem a lista de bases que será exibida nos filtros, lembrar de salvar não só o nome mas também o id, pois o id é o que será usado para fazer as buscas em bases filtradas
        $dados = $service->obterBases();
        return response()->json($dados);
    }
    public function campanha(Request $request, EstatisticasService $service)
    {
        // { "ids": ["2615","..."], "inicio": "2025-10-01", "fim": "2025-10-08" }
        $ids    = (array) $request->input('ids', []);
        $inicio = (string) $request->input('inicio');
        $fim    = (string) $request->input('fim');

        if (empty($ids) || $inicio === '' || $fim === '') {
            return response()->json(['error' => 'Parâmetros inválidos'], 422);
        }

        $dados = $service->obterMetricasCampanhas($ids, $inicio, $fim);
        return response()->json($dados);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
