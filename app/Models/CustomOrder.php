<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomOrder extends Model
{
    use HasFactory;

    /**
     * Definimos el nombre de la tabla (opcional si sigue la convención)
     */
    protected $table = 'custom_orders';

    /**
     * Atributos que se pueden asignar masivamente.
     * Basado exactamente en tu estructura de MariaDB.
     */
    protected $fillable = [
        'tutor_name',
        'whatsapp_number',
        'email',
        'pet_name',
        'pet_age',
        'pet_weight',
        'pet_size',
        'activity_level',
        'health_conditions',
        'other_health_details',
        'diet_file_url',
        'specific_requirements',
        'restrictions',
        'food_format',
        'kibble_size',
        'monthly_quantity',
        'status_id', 
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     * CRUCIAL: Esto permite que los arrays del formulario React se guarden correctamente.
     */
    protected $casts = [
        'health_conditions' => 'array', // De JSON string a PHP array
        'restrictions' => 'array',      // De JSON string a PHP array
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Opcional: Definir valores por defecto para nuevos registros.
     */
    protected $attributes = [
        'status_id' => 1, // 1 es el ID para "Pendiente" en tu tabla
    ];

    public function status()
    {
        // Conecta con la tabla order_status
        return $this->belongsTo(OrderStatus::class, 'status_id');
    }
}