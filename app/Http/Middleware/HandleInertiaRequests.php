<?php

namespace App\Http\Middleware;

use App\Models\Account; // Importamos el modelo de tu tabla BNB
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las propiedades compartidas por defecto.
     */
    public function share(Request $request): array
    {
        $account = \DB::table('accounts')->first();
        return array_merge(parent::share($request), [
            // DATOS GLOBALES DE LA APP (
            'app_config' => [
                'account' => Account::first(), // Trae logo, qr, bnb y whatsapp
            ],
            // Datos del usuario 
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'order_id' => $request->session()->get('flash.order_id'),
            ],
            'appLogo' => $account ? $account->logo_path : null,
        ]);
    }
}