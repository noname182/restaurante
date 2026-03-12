<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class AdminProductVariantsController extends Controller
{
    // Obtener atributos y valores de un producto
    public function getAttributes(Product $product)
    {
        $attributes = ProductAttribute::with('values')->get();

        $variants = $product->variants()->with('values.attribute')->get();

        return response()->json([
            'product' => $product,
            'attributes' => $attributes,
            'variants' => $variants
        ]);
    }

    // Crear nuevas variantes automáticamente
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'weight'     => 'required|integer|min:0',
            'price'      => 'required|numeric|min:0',
            'stock'      => 'required|integer|min:0',
            'image_file' => 'nullable|image|max:5120',
        ]);

        // Usamos una transacción para integridad de datos
        return DB::transaction(function () use ($request) {
            $product = Product::findOrFail($request->product_id);
            
            // Generación de SKU según tu estándar Holli
            $recetaCode = strtoupper(substr(Str::slug($product->name), 0, 3));
            $sku = "HOLLI-{$recetaCode}-{$request->weight}G";

            $variant = ProductVariant::create([
                'product_id' => $request->product_id,
                'weight'     => $request->weight,
                'sku'        => $sku,
                'price'      => $request->price,
                'stock'      => $request->stock,
            ]);

            if ($request->hasFile('image_file')) {
                $file = $request->file('image_file');

                // Procesamiento a WebP 600x600
                $img = Image::read($file)
                    ->cover(600, 600)
                    ->toWebp(80);

                // Subida a Cloudinary como Base64 para mantener el procesado
                $upload = Cloudinary::upload("data:image/webp;base64," . base64_encode((string)$img), [
                    'folder' => 'holli_products',
                    'public_id' => Str::random(20)
                ]);

                $cloudinaryUrl = $upload->getSecurePath();

                // Registro en product_multimedia según tu nuevo modelo
                $multimedia = ProductMultimedia::create([
                    'url'        => $cloudinaryUrl,
                    'sort_order' => 1,
                ]);
                \Log::info("ID Multimedia creado: " . $multimedia->id); // ¿Aparece esto en el log?
                // Vinculación en tabla pivote
                VariantMultimedia::create([
                    'variant_id'    => $variant->id,
                    'multimedia_id' => $multimedia->id,
                ]);
            }

            return response()->json([
                'status' => 'success', 
                'variant' => $variant->load('multimedia') // Para confirmar el vínculo
            ]);
        });
    }

    public function update(Request $request, ProductVariant $variant)
    {
        $request->validate([
            'weight'   => 'required|integer|min:0', // Importante para Holli
            'price'    => 'nullable|numeric|min:0',
            'stock'    => 'required|integer|min:0',
            'newFile'  => 'nullable|image|max:5120', // El archivo del modal
        ]);

        // 1. Actualizamos datos básicos de la variante
        $variant->update([
            'weight' => $request->weight,
            'price'  => $request->price,
            'stock'  => $request->stock,
        ]);

        // 2. Si el usuario subió una foto nueva en el modal
        if ($request->hasFile('newFile')) {
            $file = $request->file('newFile');

            // Procesamos a 600x600 WebP
            $img = \Intervention\Image\Laravel\Facades\Image::read($file)
                ->cover(600, 600)
                ->toWebp(80);

            // Subimos a Cloudinary
            $upload = \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload(
                "data:image/webp;base64," . base64_encode((string)$img),
                ['folder' => 'holli_products']
            );
            $cloudinaryUrl = $upload->getSecurePath();

            // 3. Actualizamos o Creamos el registro multimedia
            $multimedia = \App\Models\ProductMultimedia::create([
                'url'        => $cloudinaryUrl,
                'sort_order' => 1,
            ]);

            // 4. Sincronizamos el vínculo (eliminamos el viejo y ponemos el nuevo)
            \App\Models\VariantMultimedia::updateOrCreate(
                ['variant_id' => $variant->id],
                ['multimedia_id' => $multimedia->id]
            );
        }

        return response()->json([
            'status' => 'success', 
            'variant' => $variant->load('multimedia') // Cargamos la foto para el "ojo"
        ]);
    }


public function destroy(ProductVariant $variant)
{
    $variant->values()->detach();
    $variant->delete();

    return response()->json(['status' => 'success']);
}
}
