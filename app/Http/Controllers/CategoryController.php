<?php

namespace App\Http\Controllers;

// ELIMINADO: use App\Models\Category; (Esto causaba el error)
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product; // Importamos solo lo que sí existe

class CategoryController extends Controller
{
    /**
     * Muestra la página del catálogo centrada en Productos y Variantes
     */
    public function index()
    {
        // Cargamos los productos con sus variantes de peso y fotos
        $products = Product::with(['variants', 'variantMultimedia.multimedia'])->get();

        return Inertia::render('Admin/Catalog', [
            'categories' => [], // Enviamos un array vacío para no romper React
            'products'   => $products
        ]);
    }

    /**
     * El resto de métodos (store, update, destroy) de categorías 
     * ya no son funcionales sin el modelo, pero los dejamos vacíos 
     * o comentados para no romper las rutas de Laravel por ahora.
     */
    
    public function update(Request $request, $id) { return back(); }
    public function store(Request $request) { return back(); }
    public function destroy($id) { return back(); }
}