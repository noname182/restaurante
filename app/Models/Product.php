<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\ProductNutritionalBenefit;

class Product extends Model
{
    // Solo las columnas que existen en tu tabla 'products'
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relación con las variantes (pesos/precios)
     * Un producto tiene muchas variantes.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    /**
     * Relación con los Beneficios Nutricionales (Huellitas)
     * Un producto tiene muchos beneficios.
     */
    public function benefits()
    {
        return $this->hasMany(ProductNutritionalBenefit::class, 'product_id');
    }

    /**
     * Relación con los anuncios asociados
     * Según tu tabla 'product_anuncios'.
     */
    public function anuncios()
    {
        return $this->belongsToMany(Anuncio::class, 'product_anuncios', 'product_id', 'anuncio_id')
                    ->withTimestamps();
    }

    public function variantMultimedia()
    {
        // Relación a través de la tabla pivote que mostraste
        return $this->hasManyThrough(
            ProductMultimedia::class, // Tabla destino final
            VariantMultimedia::class, // Tabla intermedia
            'product_id',             // Llave en tabla intermedia (asumiendo que apunta al producto o variante)
            'id',                     // Llave en tabla destino
            'id',                     // Llave local
            'multimedia_id'           // Llave foránea en intermedia
        );
    }


    public function nutritionalBenefits()
    {
        // Un producto tiene muchos beneficios nutricionales
        return $this->hasMany(ProductNutritionalBenefit::class, 'product_id');
    }
}