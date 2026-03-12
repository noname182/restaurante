<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    // Muestra la página de configuración con los datos actuales
    public function edit()
    {
        // Usamos optional() o verificamos si existe para evitar el error 500
        $account = Account::first();
        
        return Inertia::render('Admin/Configuration', [
            'account' => $account
        ]);
    }

    // Actualiza los datos y maneja la imagen del QR
    public function updatePassword(Request $request)
    {
        // 1. Validación estándar
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        // 2. Obtener el admin actual
        $user = auth()->user(); 

        // 3. Verificar clave actual
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        // 4. EL PASO DEFINITIVO: 
        // Buscamos al admin por su ID usando tu modelo específico
        $admin = \App\Models\AdminAccount::find($user->id); 
        
        // 5. Asignación directa y guardado
        $admin->password = Hash::make($request->new_password);
        $admin->save(); 

        // 6. Refrescar la sesión para evitar que te saque del sistema
        auth()->login($admin);

        return back()->with('message', 'La contraseña ha sido actualizada correctamente.');
    }
    public function update(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $account = Account::first();

            if ($request->hasFile('logo_image')) {
                try {
                    $file = $request->file('logo_image');
                    // Reescalado 600x600 WebP (Lógica de ProductController)
                    $img = Image::read($file)->cover(600, 600)->toWebp(75);
                    $base64Image = "data:image/webp;base64," . base64_encode((string)$img);

                    $result = cloudinary()->uploadApi()->upload($base64Image, [
                        'folder' => 'system_branding'
                    ]);

                    if (isset($result['secure_url'])) {
                        $account->logo_path = $result['secure_url'];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error Cloudinary Logo: ' . $e->getMessage());
                }
            }

            if ($request->hasFile('qr_image')) {
                try {
                    $file = $request->file('qr_image');
                    
                    $img = Image::read($file)->toPng(); 
                    $base64Image = "data:image/png;base64," . base64_encode((string)$img);

                    $result = cloudinary()->uploadApi()->upload($base64Image, [
                        'folder' => 'payment_qrs',
                        'format' => 'png', // Forzamos formato sin pérdida
                        'transformation' => [
                            'quality' => 'auto:best' // Le decimos a Cloudinary que no escatime en calidad
                        ]
                    ]);

                    if (isset($result['secure_url'])) {
                        $account->qr_image_path = $result['secure_url'];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error Cloudinary QR: ' . $e->getMessage());
                }
            }
            $account->update([
                'owner_name' => $request->owner_name,
                'bank_name' => $request->bank_name,
                'account_number' => $request->account_number,
                'account_type'    => $request->account_type ?? $account->account_type,
                'whatsapp_number' => $request->whatsapp_number,
            ]);

            return back()->with('message', 'Configuraciones actualizadas con éxito');
        });
    }
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        // 1. Validación estricta para MariaDB
        $request->validate([
            'username' => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('admin_accounts')->ignore($user->id)
            ],
            'email' => [
                'required', 
                'email', 
                'max:255', 
                Rule::unique('admin_accounts')->ignore($user->id)
            ],
        ]);

        // 2. Actualización de los datos del administrador
        $user->update([
            'username' => $request->username,
            'email' => $request->email,
        ]);

        // 3. Retorno con mensaje de éxito para Inertia
        return back()->with('message', 'Perfil de administrador actualizado con éxito.');
    }
}