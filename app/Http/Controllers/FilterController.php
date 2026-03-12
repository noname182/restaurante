<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;
use App\Models\Category;
use App\Models\Product;

class FilterController extends Controller
{
    public function filter()
    {
        // Traemos atributos con sus valores
        $attributes = ProductAttribute::with('values')->get();

        // Transformamos para React
        $filtersData = $attributes->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name, // React usará 'name' como label
                'values' => $attribute->values->map(function ($value) {
                    return [
                        'value' => $value->value,      // lo que se guardará
                        'label' => ucfirst($value->value), // lo que se muestra
                    ];
                })->values(),
            ];
        });

        // Retornamos Inertia
        return Inertia::render('Welcome', [
            'categories' => Category::all(),
            'products' => Product::all(),
            'filtersData' => $filtersData,
            'search' => '',
            'page' => 1,
            'hasMore' => false,
        ]);
    }
}
