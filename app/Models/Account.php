<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    // Definimos los campos que se pueden llenar/leer
    protected $fillable = [
        'owner_name',
        'bank_name',
        'account_number',
        'account_type',
        'qr_image_path',
        'whatsapp_number',
        'logo_path',
    ];
}