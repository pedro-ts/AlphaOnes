<?php

namespace App\Services;

use App\Clients\MetricClient;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

class MetricService
{
    public function __construct(
        private readonly MetricClient $client
    ) {}

    /**
     * Retorna o payload completo esperado pelo React:
     * [
     *   'titulo'  => string,
     *   'valor'   => string,    // percent do dia atual
     *   'dias'    => [ '01/10', ... x10 ],
     *   'valores' => [120, 80, ... x10 ],
     * ]
     */
    public function getMetric(string $slug, ?Carbon $today = null): array
    {
        $title = $this->titleFor($slug);

        $today = ($today?->copy() ?? Carbon::now('America/Sao_Paulo'))->startOfDay();

        // 1) Gera 10 datas de hoje para trás, inclusivo
        $dates = $this->lastNDates($today, 10); // Collection<Carbon> ordenada ascendente por data

        // 2) Busca "valor" do dia atual com cache
        $valor = $this->getTodayPercentCached($slug, $today);

        // 3) Busca valores diários com cache por dia
        $perDay = $this->getDailyValuesCached($slug, $dates);

        // 4) Monta resposta alinhando pelas 10 datas geradas
        [$diasPtBr, $valores] = $this->projectSeries($dates, $perDay);

        return [
            'titulo'  => $title,
            'valor'   => $valor,
            'dias'    => $diasPtBr,
            'valores' => $valores,
        ];
    }

    // ----------------- helpers -----------------

    private function titleFor(string $slug): string
    {
        $map = config('metrics.map', []);
        if (!array_key_exists($slug, $map)) {
            throw new InvalidArgumentException("Métrica inválida: {$slug}");
        }
        return $map[$slug];
    }

    /**
     * Ex.: se today=10/10, retorna [01/10 ... 10/10] como Collection<Carbon> ASC.
     */
    private function lastNDates(Carbon $today, int $n): Collection
    {
        // cria do mais antigo para o mais novo
        return collect(range($n - 1, 0))
            ->reverse()
            ->map(fn($i) => $today->copy()->subDays($i));
    }

    /**
     * Cacheia o percent do dia atual.
     */
    private function getTodayPercentCached(string $slug, Carbon $today): string
    {
        $ttl = (int) config('metrics.cache_ttl', 300);
        $key = "metric:{$slug}:today:{$today->toDateString()}";

        return Cache::remember($key, $ttl, function () use ($slug, $today) {
            return $this->client->getTodayValue($slug, $today);
        });
    }

    /**
     * Cacheia valores por dia. Cria 1 chave por data.
     * Retorna ['YYYY-MM-DD' => int].
     */
    private function getDailyValuesCached(string $slug, Collection $dates): array
    {
        $ttl = (int) config('metrics.cache_ttl', 300);

        // Primeiro tenta pegar do cache
        $result = [];
        $misses = [];

        foreach ($dates as $d) {
            $dayKey = "metric:{$slug}:day:{$d->toDateString()}";
            $cached = Cache::get($dayKey);

            if ($cached === null) {
                $misses[] = $d;
            } else {
                $result[$d->toDateString()] = (int) $cached;
            }
        }

        // Para as datas não cacheadas, consulta o cliente
        if (!empty($misses)) {
            $fetched = $this->client->getDailyValues($slug, $misses->all()); // ['Y-m-d' => int]

            foreach ($misses as $d) {
                $key = $d->toDateString();
                $val = (int) ($fetched[$key] ?? 0);
                $result[$key] = $val;
                Cache::put("metric:{$slug}:day:{$key}", $val, $ttl);
            }
        }

        ksort($result); // garante ordenação por data
        return $result;
    }

    /**
     * Projeta:
     * - dias em 'dd/mm'
     * - valores em array[int] na mesma ordem das datas pedidas
     */
    private function projectSeries(Collection $dates, array $perDay): array
    {
        $diasPtBr = [];
        $valores  = [];

        foreach ($dates as $d) {
            $iso = $d->toDateString();           // YYYY-MM-DD
            $diasPtBr[] = $d->format('d/m');     // dd/mm
            $valores[]  = (int) ($perDay[$iso] ?? 0);
        }

        return [$diasPtBr, $valores];
    }
}
