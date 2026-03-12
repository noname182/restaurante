<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductNutritionalBenefit extends Model
{
    // Nombre de la tabla que vimos en tu captura
    protected $table = 'product_nutritional_benefits';

    protected $fillable = [
        'product_id',
        'benefit'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}