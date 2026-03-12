<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantMultimedia extends Model
{
    // Es vital definir la tabla porque no sigue el estándar plural de Laravel
    protected $table = 'variant_multimedia';
    
    protected $fillable = ['variant_id', 'multimedia_id'];
}