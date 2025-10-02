<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Clients\MetricClient;
use App\Clients\ExternalSystemMetricClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MetricClient::class, ExternalSystemMetricClient::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
