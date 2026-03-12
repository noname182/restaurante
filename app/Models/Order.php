<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\OrderItem;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
 
    protected $fillable = [
        'status_id', 
        'total', 
        'customer_name', 
        'customer_phone', 
        'customer_address', 
        'customer_address_reference', 
        'customer_email',
    ];
    protected $casts = [
        'total' => 'decimal:2',
    ];

    // Relaciones
    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'status_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
