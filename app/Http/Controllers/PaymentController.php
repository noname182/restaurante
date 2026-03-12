<?php

namespace App\Http\Controllers;

use App\Models\Account; // Asegúrate de tener el modelo Account creado
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        // Traemos la cuenta de Diego Herrera que insertamos antes
        $cuenta = Account::first(); 

        return Inertia::render('PaymentPage', [
            'cuenta' => $cuenta,
            'total' => 0 // Monto estático por ahora como pediste
        ]);
    }
}