<?php

return [
    // slugs permitidos e títulos exibidos no frontend
    'map' => [
        'geral'        => 'Taxa de completamento geral',
        'base-x'       => 'Base X',
        'base-y'       => 'Base Y',
        'base-z'       => 'Base Z',
        'base-w'       => 'Base W',
    ],

    // TTL do cache em segundos (fallback ao .env)
    'cache_ttl' => (int) env('METRICS_CACHE_TTL', 300),
];
