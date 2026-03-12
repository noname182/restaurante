<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Cart;

class CartController extends Controller
{
  
    public function add(Request $request)
{ 
    Cart::add([
    'id' => $request->id,
    'name' => $request->nombre,
    'qty' => (int) $request->cantidad ?? 1,
    'price' => (float) $request->precio,
    'weight' => 0,
    'options' => [
        'uuid' => uniqid(),
        'image' => $request->image ?? null,
        'sku' => $request->sku ?? null,
        'variant' => $request->variant ?? null,
        'stock' => $request->stock ?? null,
    ]
]);

    return response()->json([
        'success' => true,
        'cart' => Cart::content()->values(),
        'cartCount' => Cart::count(),
        'total' => Cart::total()
    ]);
}

    public function update(Request $request, $rowId)
{
    $request->validate(['cantidad' => 'required|integer|min:1']);
    
    $item = Cart::get($rowId);
    $stock = $item->options->stock ?? 9999;

    if ($request->cantidad > $stock) {
        return response()->json([
            'success' => false,
            'message' => "No hay suficiente stock. Máximo disponible: $stock",
        ]);
    }

    Cart::update($rowId, $request->cantidad);

    return response()->json([
        'success' => true,
        'cart' => Cart::content()->values(),
        'cartCount' => Cart::count(),
        'cartTotal' => Cart::total(),
    ]);
}

    // Eliminar producto
    public function remove($rowId)
    {
        Cart::remove($rowId);

        return response()->json([
            'success' => true,
            'cart' => Cart::content()->values(),
            'cartCount' => Cart::count(),
            'cartTotal' => Cart::total(),
        ]);
    }

    // Vaciar carrito
    public function clear()
    {
        Cart::destroy();

        return response()->json([
            'success' => true,
            'cart' => [],
            'cartCount' => 0,
            'cartTotal' => 0,
        ]);
    }

    // Obtener datos del carrito (para contador)
    public function data()
    {
        return response()->json([
            'success' => true,
            'cart' => Cart::content()->values(),
            'cartCount' => Cart::count(),
            'total' => Cart::total()
        ]);
    }
}
