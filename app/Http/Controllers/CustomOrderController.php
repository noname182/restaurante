<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Facades\Storage;
class CustomOrderController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Datos recibidos:', $request->all());

        $request->validate([
            'tutor_name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'pet_name' => 'required|string|max:255',
            'pet_age' => 'required|string|max:50',
            'pet_weight' => 'required|string|max:100',
            'pet_size' => 'required|in:pequeño,mediano,grande',
            'food_format' => 'required|in:croqueta,deshidratado',
            'monthly_quantity' => 'required|string|max:100',
            'diet_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', 
        ]);

        $data = $request->all();
        unset($data['status']);
        $data['status_id'] = 1;

        if ($request->hasFile('diet_file')) {
            $file = $request->file('diet_file');
            $extension = strtolower($file->getClientOriginalExtension());

            try {
                if ($extension === 'pdf') {
                    // --- OPCIÓN A: PDF (Almacenamiento Local) ---
                    // Se guarda en storage/app/public/diets y se accede vía /storage/diets/
                    $path = $file->store('diets', 'public');
                    $data['diet_file_url'] = asset('storage/' . $path);
                    \Log::info('PDF guardado localmente en: ' . $data['diet_file_url']);
                } else {
                    // --- OPCIÓN B: IMÁGENES (Cloudinary) ---
                    $result = cloudinary()->uploadApi()->upload(
                        $file->getRealPath(), 
                        [
                            'folder' => 'natural_holli/diets',
                            'resource_type' => 'image'
                        ]
                    );

                    if (isset($result['secure_url'])) {
                        $data['diet_file_url'] = $result['secure_url'];
                        \Log::info('Imagen guardada en Cloudinary: ' . $data['diet_file_url']);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error al procesar archivo de dieta: ' . $e->getMessage());
            }
        }

        CustomOrder::create($data);

        return Redirect::back()->with('success', '¡Pedido Holli recibido!');
    }

    public function updateStatus(Request $request, CustomOrder $customOrder)
    {
        Log::info('Iniciando actualización de estado personalizado', [
            'custom_order_id' => $customOrder->id,
            'status_id_recibido' => $request->status_id,
            'todo_el_request' => $request->all()
        ]);
        // Validamos que llegue un número válido
        $request->validate([
            'status_id' => 'required|integer|exists:order_status,id',
        ]);

        // Guardamos en la columna que renombraste
        $customOrder->update([
            'status_id' => $request->status_id
        ]);

        return redirect()->back();// Esto refresca los datos en React automáticamente
    }

    public function destroy(CustomOrder $customOrder)
    {   
        try {
            if ($customOrder->diet_file_url) {
                $url = $customOrder->diet_file_url;

                // 1. Identificamos si el archivo es local (PDF) o de Cloudinary (Imagen)
                if (str_contains($url, '/storage/diets/')) {
                    // --- LÓGICA LOCAL (PDF) ---
                    // Extraemos el nombre del archivo de la URL (ej: diets/archivo.pdf)
                    $filePath = 'diets/' . basename($url);
                    
                    // Verificamos si existe en el disco público y lo eliminamos
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                        \Log::info('Archivo PDF eliminado del servidor local: ' . $filePath);
                    }
                } else {
                    // --- LÓGICA CLOUDINARY (IMÁGENES) ---
                    // Extraemos el publicId para la API de Cloudinary
                    $publicId = "natural_holli/diets/" . pathinfo($url, PATHINFO_FILENAME);
                    
                    cloudinary()->uploadApi()->destroy($publicId, [
                        'resource_type' => 'image' 
                    ]);
                    \Log::info('Imagen eliminada de Cloudinary: ' . $publicId);
                }
            }

            // 2. Eliminamos el registro de MariaDB
            $customOrder->delete();

            return redirect()->back()->with('success', 'Pedido y archivos eliminados correctamente.');
        } catch (\Exception $e) {
            \Log::error('Error al eliminar pedido personalizado: ' . $e->getMessage());
            return redirect()->back()->with('error', 'No se pudo eliminar el registro.');
        }
    }
}