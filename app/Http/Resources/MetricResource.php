<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MetricResource extends JsonResource
{
    /**
     * Espera um array: ['titulo','valor','dias','valores']
     */
    public function toArray(Request $request): array
    {
        return [
            'titulo'  => $this->resource['titulo'],
            'valor'   => $this->resource['valor'],
            'dias'    => $this->resource['dias'],
            'valores' => $this->resource['valores'],
        ];
    }
}
