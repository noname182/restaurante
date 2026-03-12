<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        $product = $this->resource;
        $selectedVariant = $product->variants->first();

        return [
            'id'          => $product->id,
            'name'        => $product->name,
            'slug'        => $product->slug,
            'description' => $product->description, 
            'benefits'    => $product->benefits, 
            
            // Datos de la primera variante (cabecera)
            'price'       => (float) ($selectedVariant?->price ?? 0),
            'stock'       => (int) ($selectedVariant?->stock ?? 0),
            'weight'      => (int) ($selectedVariant?->weight ?? 0),
            'sku'         => $selectedVariant?->sku ?? 'S/S',
            
            'variants' => $product->variants->map(function($v) use ($product) {
                $url = $v->multimedia->first()?->url ?? null;

                // 🚨 LOG DE CONTROL: Esto te dirá en storage/logs/laravel.log si el valor existe o es null
                \Log::info("DEPURACIÓN RESOURCE - Var ID: {$v->id} | Imagen: " . ($url ?? 'NULO'));
                return [
                    'id'        => $v->id,
                    'baseName'  => $product->name,
                    'price'     => (float) $v->price,
                    'weight'    => (int) $v->weight,
                    'stock'     => (int) ($v->stock ?? 0),
                    'sku'       => $v->sku,
                    'image'    => $url, // Aquí se asigna el valor
                    
                    // 2. Para el MODAL del Admin (el array completo que necesita para el edit)
                    'multimedia' => $v->multimedia->map(fn($m) => [
                        'id'  => $m->id,
                        'url' => $m->url,
                    ]),
                ];
            }),
        ];
    }
}