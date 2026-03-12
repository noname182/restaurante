<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Product;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

   protected $fillable = [
    'order_id',
    'variant_id',
    'quantity',
    'price',
    'subtotal',
];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relaciones

    // Pedido al que pertenece
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    // Producto del pedido
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
