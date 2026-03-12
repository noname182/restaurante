<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductMultimedia extends Model
{
    // Forzamos el nombre de la tabla por seguridad
    protected $table = 'product_multimedia';

    // 1. Fillable actualizado: Eliminamos product_id y multimedia_type_id
    protected $fillable = [
        'url',        // URL de Cloudinary (reescalada a 600px y WebP)
        'sort_order', // Orden de visualización
    ];

    /**
     * 2. Relación con Variantes (Muchos a Muchos)
     * Una imagen puede estar vinculada a varias presentaciones (1kg, 5kg, etc.)
     */
    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductVariant::class, 
            'variant_multimedia', 
            'multimedia_id', 
            'variant_id'
        );
    }
}