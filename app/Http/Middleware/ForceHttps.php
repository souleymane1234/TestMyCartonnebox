<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class ForceHttps
{
    public function handle($request, Closure $next)
    {
        if (App::environment('production')) {
            $request->setTrustedProxies([$request->getClientIp()], \Illuminate\Http\Request::HEADER_X_FORWARDED_ALL);

            if (!$request->secure()) {
                return redirect()->secure($request->getRequestUri());
            }
        }

        return $next($request);
    }
}
