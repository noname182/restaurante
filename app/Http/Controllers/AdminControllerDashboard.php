<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product; // Ahora usamos el modelo Product directamente
use App\Models\ProductVariant; // Para gestionar el stock de los sacos

class AdminControllerDashboard extends Controller
{
    /**
     * Página principal del panel admin: Lista de Productos y Stock
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 10);
        $search  = $request->string('search', '');

        // Obtenemos los productos con sus variantes para ver el stock
        $products = Product::with('variants')
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->paginate($perPage)
            ->onEachSide(1);

        return Inertia::render('Admin/AdminDashboard', [
            'products' => $products, // Enviamos productos en lugar de categorías
            'filters'  => ['search' => $search],
        ]);
    }

    /**
     * Actualizar stock o precio de una variante rápidamente (AJAX)
     */
    public function updateVariant(Request $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);
        
        $request->validate([
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $variant->update([
            'stock' => $request->stock,
            'price' => $request->price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inventario actualizado correctamente',
            'variant' => $variant
        ]);
    }

    /**
     * Eliminar un producto y todas sus variantes de forma segura
     */
    public function destroyProduct($id)
    {
        $product = Product::findOrFail($id);

        // Borramos variantes primero para mantener la integridad de la DB
        $product->variants()->delete();
        $product->delete();

        return redirect()->back()->with('message', 'Producto eliminado con éxito');
    }
}