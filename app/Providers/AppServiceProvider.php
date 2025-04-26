<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Products\ProductExcelParser;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ProductExcelParser::class, function () {
            return new ProductExcelParser(app()->getLocale());
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
