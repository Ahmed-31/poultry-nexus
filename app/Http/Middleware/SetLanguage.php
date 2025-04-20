<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SetLanguage
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next)
    : Response
    {
        $acceptLanguage = $request->header('Accept-Language', 'en');
        $locale = Str::before($acceptLanguage, ',');
        $supported = ['en', 'ar', 'en_US', 'ar_EG'];
        if (!in_array($locale, $supported)) {
            $locale = 'en';
        }
        App::setLocale($locale);
        Carbon::setLocale($locale);
        return $next($request);
    }
}
