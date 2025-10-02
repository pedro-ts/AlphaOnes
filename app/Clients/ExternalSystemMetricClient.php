<?php

namespace App\Clients;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ExternalSystemMetricClient implements MetricClient
{
    protected string $baseUrl;
    protected string $key;
    protected int $timeoutMs;
    protected int $retry;

    public function __construct()
    {
        $cfg = config('services.externalsys');
        $this->baseUrl   = rtrim($cfg['base_url'] ?? '', '/');
        $this->key       = $cfg['key'] ?? '';
        $this->timeoutMs = (int) ($cfg['timeout_ms'] ?? 3000);
        $this->retry     = (int) ($cfg['retry'] ?? 2);
    }

    public function getTodayValue(string $slug, Carbon $date): string
    {
        // TODO: trocar endpoint e parsing conforme sua API externa
        $resp = Http::withHeaders(['Authorization' => "Bearer {$this->key}"])
            ->timeout($this->timeoutMs / 1000)
            ->retry($this->retry, 200)
            ->get("{$this->baseUrl}/metrics/{$slug}/today", [
                'date' => $date->toDateString(),
            ])
            ->throw()
            ->json();

        // Exemplo de parsing:
        return (string) ($resp['value_percent'] ?? '0%');
    }

    public function getDailyValues(string $slug, array $dates): array
    {
        // Estratégia básica: 1 chamada por dia (iremos otimizar depois)
        $out = [];
        foreach ($dates as $d) {
            /** @var Carbon $d */
            $resp = Http::withHeaders(['Authorization' => "Bearer {$this->key}"])
                ->timeout($this->timeoutMs / 1000)
                ->retry($this->retry, 200)
                ->get("{$this->baseUrl}/metrics/{$slug}/by-day", [
                    'date' => $d->toDateString(),
                ])
                ->throw()
                ->json();

            $out[$d->toDateString()] = (int) ($resp['value'] ?? 0);
        }
        return $out;
    }
}
