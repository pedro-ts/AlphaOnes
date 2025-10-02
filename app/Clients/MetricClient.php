<?php

namespace App\Clients;

use Carbon\Carbon;

interface MetricClient
{
    /**
     * Retorna o "valor" do dia atual da métrica (string% ou número).
     */
    public function getTodayValue(string $slug, Carbon $date): string;

    /**
     * Retorna valores por dia para as datas pedidas.
     * Saída: ['2025-10-01' => 120, '2025-09-30' => 80, ...]
     */
    public function getDailyValues(string $slug, array $dates): array;
}
