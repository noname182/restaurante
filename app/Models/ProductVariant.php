<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    protected $table = 'product_variants';

    protected $fillable = [
        'sku',
        'product_id',
        'weight',    
        'price',       
        'stock',     
        'available',  
    ];

    protected $casts = [
        'available' => 'boolean',
        'price' => 'decimal:2',
        'stock' => 'integer',
        'weight' => 'integer',
    ];

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // Para las fotos de Holli a través de la tabla puente del SQL
    public function multimedia(): BelongsToMany {
        return $this->belongsToMany(
            ProductMultimedia::class, 
            'variant_multimedia', 
            'variant_id', 
            'multimedia_id'
        );
    }
}