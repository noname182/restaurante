<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MultimediaType extends Model
{
    // Especificar el nombre correcto de la tabla
    protected $table = 'multimedia_type';

    protected $fillable = [
        'name',
        'is_empty'
    ];

    protected $casts = [
        'is_empty' => 'boolean'
    ];

    public function productMultimedia()
    {
        return $this->hasMany(ProductMultimedia::class, 'multimedia_type_id');
    }
}