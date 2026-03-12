<?php
// app/Models/AdminAccount.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminAccount extends Authenticatable
{
    protected $table = 'admin_accounts';
    
    // ✅ CAMBIO: El ID sí es autoincremental en tu DB
    public $incrementing = true; 
    
    protected $fillable = ['username', 'email', 'password'];
    protected $hidden = ['password'];
}
