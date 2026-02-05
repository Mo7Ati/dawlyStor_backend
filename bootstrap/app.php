<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HandleLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
require_once __DIR__ . '/../app/Helpers/functions.php';

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['admin_appearance', 'sidebar_state', 'locale']);

        $middleware->web(append: [
            HandleLocale::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->redirectUsersTo(function (Request $request) {
            return route(getPanel() . '.index');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Instantiate the ExceptionHandler
        $exceptionHandler = new \App\Exceptions\ExceptionHandler();

        $exceptions->render(function (Throwable $e) use ($exceptionHandler) {
            Log::error('API Exception', [
                'message' => $e->getMessage(),
            ]);

            // Handle API or JSON-based responses
            if (request()->is('api/*'))
                return $exceptionHandler->handleApiException($e);
            // Handle Web-based (non-API) responses
        });
    })->create();
