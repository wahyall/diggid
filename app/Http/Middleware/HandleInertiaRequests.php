<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Facades\Route;

class HandleInertiaRequests extends Middleware {
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'front';
    protected $externalRootView = [
        'dashboard',
        'front',
    ];

    public function handle(Request $request, Closure $next) {
        $route = Route::currentRouteName();
        if ($route == 'dashboard.login') {
            $this->rootView = 'front';
        } else if (explode('.', $route)[0] == 'dashboard') {
            $this->rootView = 'dashboard';
        } else if (explode('.', $route)[0] == 'front') {
            $this->rootView = 'front';
        }
        return parent::handle($request, $next);
    }

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request) {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request) {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'csrf_token' => csrf_token(),
            'route' => Route::current()
        ]);
    }
}
