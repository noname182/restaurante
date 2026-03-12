<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Http\Resources\FeaturedProductResource;
use App\Http\Resources\EventResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Models\ProductNutritionalBenefit;

class ProductController extends Controller
{
    

    /**
     * sirve para obtener los productos destacados y enviarlos a la vista welcome
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection 
     * AnonymousResourceCollection: Es el nombre técnico de lo que devuelve el método ::collection().
     */



    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $perPage = 30;

        $productCrudo = $this->getFilteredProducts($request, $perPage);
        
        // Forzamos la carga de relaciones
        $productCrudo->load(['variants.multimedia', 'benefits']);

       

        $product = FeaturedProductResource::collection($productCrudo)->additional([
            'meta' => ['total' => $productCrudo->total()]
        ]);
        return Inertia::render('Products', [
            'search'           => $search,
            'page'             => $productCrudo->currentPage(),
            'product'          => $product,
            'totalProducts'    => $productCrudo->total(),
            'featuredProducts' => [],
        ]);
    }

    public function home()
    {
        return Inertia::render('Welcome', [
            'featuredProducts' => [], // Aquí podrías mandar solo los más vendidos
        ]);
    }

    public function search(Request $request)
    {
        $texto = $request->input('search');

        // --- Búsqueda de Variantes basada en el SQL de Holli ---
        $variants = ProductVariant::with([
                'product.benefits', // Cargamos los nuevos beneficios nutricionales
                'variantMultimedia.multimedia' // Cargamos las imágenes (vía tabla pivote variant_multimedia)
            ])
            ->where('available', 1)
            ->where(function($q) use ($texto) {
                // Buscamos por nombre del producto (en la tabla products)
                $q->whereHas('product', function($pq) use ($texto) {
                    $pq->where('name', 'LIKE', "%{$texto}%")
                    ->orWhere('description', 'LIKE', "%{$texto}%");
                })
                // O buscamos en los campos de la variante (en product_variants)
                ->orWhere('sku', 'LIKE', "%{$texto}%")
                ->orWhere('weight', 'LIKE', "%{$texto}%"); // Cambiamos 'volume' por 'weight'
            })
            ->get();

        // --- Agrupación ---
        // Como no hay categorías, agrupamos por el nombre del producto para evitar duplicados visuales
        $groupedResults = $variants->groupBy(function($variant) {
            return $variant->product->name;
        });

        return Inertia::render('ResultPage', [
            'search' => $texto,
            'groupedResults' => $groupedResults 
        ]);
    }

    private function getFilteredProducts(Request $request, $perPage = 12)
    {
        $search = $request->query('search', '');
        $filters = $request->except(['search', 'page']);

        $queryProducts = Product::with([
            'benefits', // Cargamos los beneficios para que no salgan vacíos
            'variants' => function($query) {
                // Quitamos el filtro 'available' si no existe esa columna en tu DB
                $query->with('multimedia'); // ACTIVADO: Esto trae las fotos de Cloudinary
            }, 
        ]);

        if ($search) {
            $queryProducts->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhereHas('variants', function($v) use ($search) {
                        $v->where('sku', 'like', "%$search%")
                        ->orWhere('weight', 'like', "%$search%"); 
                    });
            });
        }

        // Filtros dinámicos (Asegúrate de que $key sea 'price', 'weight' o 'stock')
        foreach ($filters as $key => $value) {
            if ($value && in_array($key, ['price', 'weight', 'stock'])) {
                $queryProducts->whereHas('variants', function ($q) use ($key, $value) {
                    $q->where($key, $value); 
                });
            }
        }

        return $queryProducts->paginate($perPage)->withQueryString();
    }

    

    public function show($slug, $id)
    {
        $product = Product::with([
                'variants', // Para ver los precios según el peso (2kg, 10kg)
                'benefits', // La nueva tabla que creamos para las huellitas verdes
                'variantMultimedia.multimedia' // Las fotos reales del producto
            ])
            ->findOrFail($id);

        return Inertia::render('Products/Show', [ // Cambiamos 'ShowVehicle' a algo neutro
            'product' => [
                'id'          => $product->id,
                'name'        => $product->name,
                'description' => $product->description,
                
                // Beneficios Nutricionales (Paso 3 del Plan)
                'benefits' => $product->benefits->map(fn($b) => [
                    'text' => $b->benefit_text,
                    'icon' => 'huellita-verde' // Aplicando Identidad Visual
                ]),

                // Variantes de Peso
                'variants' => $product->variants->map(fn($v) => [
                    'id'    => $v->id,
                    'weight'=> $v->weight,
                    'price' => $v->price,
                    'stock' => $v->stock
                ]),
            ]
        ]);
    }

    /**
     * Vista principal del administrador de productos
     */
    public function adminIndex(Request $request)
    {
        $perPage = $request->integer('perPage', 24);

        $productsQuery = Product::with(['variants.multimedia', 'benefits'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Catalog', [
            'products' => FeaturedProductResource::collection($productsQuery)->resolve(),
        ]);
    }

    /**
     * Para actualizar el stock o precio rápido desde la Card
     */
    public function updateVariantStock(Request $request, $id)
    {
        $variant = \App\Models\ProductVariant::findOrFail($id);
        // Añadimos 'weight' para que el admin pueda corregir si la bolsa es de 5kg o 10kg
        $variant->update($request->only(['stock', 'price', 'available', 'weight']));
        
        return back()->with('message', 'Inventario de Holli actualizado');
    }

    public function store(Request $request)
    {
        // 1. Validamos (ya vimos que llegan bien en el log)
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'benefits'    => 'nullable|array', 
        ]);

        // 2. Creamos el producto base
        $product = Product::create([
            'name'        => $validated['name'],
            'description' => $validated['description'],
            'slug'        => \Str::slug($validated['name']),
        ]);

        // 3. REGISTRO EN LA BASE DE DATOS: Recorremos el array del log
        if ($request->has('benefits') && is_array($request->benefits)) {
            foreach ($request->benefits as $benefitText) {
                if (!empty($benefitText)) {
                    // Esta línea hace el INSERT real en MariaDB
                    $product->benefits()->create([
                        'benefit' => $benefitText
                    ]);
                }
            }
        }
            return redirect()->back()->with('success', 'Producto y beneficios guardados correctamente.');
    }

    
    public function update(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $product = Product::findOrFail($id);

            // 1. Actualizar Producto (Nombre y Descripción)
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'slug' => \Illuminate\Support\Str::slug($request->name),
            ]);

            // 2. Sincronizar Beneficios (Opcional según tu lógica)
            if ($request->has('benefits')) {
                $product->benefits()->delete(); 
                foreach ($request->benefits as $benefitText) {
                    if (!empty($benefitText)) {
                        // CAMBIO: 'benefit_text' -> 'benefit'
                        $product->benefits()->create(['benefit' => $benefitText]);
                    }
                }
            }

            // 3. ACTUALIZAR VARIANTES Y MULTIMEDIA (El punto crítico)
            if ($request->has('variants') && is_array($request->variants)) { //
                foreach ($request->variants as $index => $variantData) {

                    $variant = \App\Models\ProductVariant::findOrFail($variantData['id']);
                    
                    // Si hay una foto nueva para esta variante en el Modal
                    if ($request->hasFile("variants.{$index}.newFile")) {
                        $file = $request->file("variants.{$index}.newFile");
                        
                        // Reescalado 600x600 WebP
                        $img = Image::read($file)->cover(600, 600)->toWebp(75);

                        try {
                            $base64Image = "data:image/webp;base64," . base64_encode((string)$img);
                            $result = cloudinary()->uploadApi()->upload($base64Image, [
                                'folder' => 'holli_productos'
                            ]);

                            if (isset($result['secure_url'])) {
                                // Buscamos si ya tiene una foto en la tabla pivote
                                $pivot = \DB::table('variant_multimedia')->where('variant_id', $variant->id)->first();

                                if ($pivot) {
                                    // Si ya existía, actualizamos la URL en product_multimedia
                                    \App\Models\ProductMultimedia::where('id', $pivot->multimedia_id)
                                        ->update([
                                            'url' => $result['secure_url'],
                                            'sort_order' => 1
                                            // Eliminados 'type' y 'multimedia_type_id' por no existir en DB
                                        ]);
                                } else {
                                    // Si es nueva, creamos el registro multimedia
                                    $newMultimedia = \App\Models\ProductMultimedia::create([
                                        'url' => $result['secure_url'],
                                        'sort_order' => 1
                                    ]);
                                    
                                    // Creamos el vínculo en la pivote
                                    \DB::table('variant_multimedia')->insert([
                                        'variant_id' => $variant->id,
                                        'multimedia_id' => $newMultimedia->id
                                    ]);
                                }
                            }
                        } catch (\Exception $e) {
                            \Log::error('Error Cloudinary Holli: ' . $e->getMessage());
                        }
                    }
                }
                // 4. Actualizar datos de la variante (Precio, Stock y PESO)
                $variant->update([
                    'price' => str_replace(',', '.', $variantData['price']),
                    'stock' => $variantData['stock'],
                    'weight' => $variantData['weight'] ?? $variant->weight 
                ]);
            }
            
            return back()->with('message', 'Producto Holli actualizado con éxito');
        });
    }

    public function addVariant(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'weight' => 'required|integer|min:0',
            'price'      => 'required|numeric',
            'stock'      => 'required|integer',
            'image_file' => 'nullable|image|max:2048', 
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Crear la variante (Sin columna de imagen, según tu SQL)
            $variant = \App\Models\ProductVariant::create([
                'product_id' => $request->product_id,
                'weight'     => $request->weight, 
                'price'      => $request->price,
                'stock'      => $request->stock,
                'sku'        => "HOLLI-" . uniqid(), // SKU único
                'available'  => 1
            ]);

            // 2. Si hay imagen, crear el vínculo en la tabla puente
            if ($request->hasFile('image_file')) {
                try {
                    // Procesamiento de imagen
                    $img = \Intervention\Image\Laravel\Facades\Image::read($request->file('image_file'))
                        ->cover(600, 600)
                        ->encodeByExtension('webp', quality: 75);

                    // Subida a Cloudinary
                    $result = cloudinary()->uploadApi()->upload(
                        "data:image/webp;base64," . base64_encode($img), 
                        ['folder' => 'holli_productos']
                    );

                    if (isset($result['secure_url'])) {
                        // A. Crear registro en product_multimedia
                        $multimedia = \App\Models\ProductMultimedia::create([
                            'url' => $result['secure_url'],
                            'type' => 'image',
                            'multimedia_type_id' => 1 
                        ]);

                        // B. ESTA ES LA CONEXIÓN: Insertar en la tabla puente variant_multimedia
                        // Tal como indica tu Diego_bd.sql
                        \DB::table('variant_multimedia')->insert([
                            'variant_id'    => $variant->id,
                            'multimedia_id' => $multimedia->id
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error('Error de imagen Holli: ' . $e->getMessage());
                }
            }

            return back()->with('message', 'Presentación añadida y vinculada correctamente');
        });
    }


    public function destroy(Product $product)
    {
        return DB::transaction(function () use ($product) {
            // 1. Limpiamos las fotos de las variantes en Cloudinary
            $variants = $product->variants()->get();

            foreach ($variants as $variant) {
                // Buscamos multimedia a través de la tabla puente de tu SQL
                $multimedia = $variant->multimedia; 
                
                foreach ($multimedia as $media) {
                    // Borrar de Cloudinary
                    $publicId = $this->extractPublicId($media->url);
                    if ($publicId) {
                        cloudinary()->uploadApi()->destroy($publicId);
                    }
                    $media->delete(); 
                }
            }

            // 2. Al borrar el producto padre, el SQL se encarga de:
            // - variant_multimedia (Cascade)
            // - product_variants (Cascade)
            // - product_nutritional_benefits (Cascade)
            $product->delete();

            return back()->with('message', 'Alimento Holli y todos sus datos eliminados correctamente');
        });
    }

    private function extractPublicId($url)
    {
        // Ejemplo de URL: https://res.cloudinary.com/demo/image/upload/v12345/productos/perro_holli.jpg
        // El publicId sería "productos/perro_holli"
        
        $path = parse_url($url, PHP_URL_PATH);
        if (!$path) return null;

        $parts = explode('/', $path);
        $filename = end($parts); // perro_holli.jpg
        
        // Eliminamos la extensión para obtener el ID limpio
        $publicId = pathinfo($filename, PATHINFO_FILENAME);
        
        // Si tus imágenes están en una carpeta dentro de Cloudinary (ej: "productos/"), 
        // debes incluir el nombre de la carpeta antes del ID.
        return $publicId; 
    }

    private function getPublicIdFromUrl($url)
    {
        // Esta lógica extrae el nombre del archivo de la URL de Cloudinary
        $path = parse_url($url, PHP_URL_PATH);
        $segments = explode('/', $path);
        $lastSegment = end($segments);
        return pathinfo($lastSegment, PATHINFO_FILENAME);
    }

    public function destroyVariant(\App\Models\ProductVariant $variant)
    {
        return DB::transaction(function () use ($variant) {
            // 1. Limpiamos las imágenes tanto en la base de datos como en Cloudinary
            foreach ($variant->multimedia as $media) {
                // A. Extraer el ID de Cloudinary para borrar el archivo real
                $publicId = $this->extractPublicId($media->url);
                if ($publicId) {
                    cloudinary()->uploadApi()->destroy($publicId);
                }

                // B. Borrar el registro de la tabla product_multimedia
                $media->delete(); 
            }

            // 2. La tabla puente 'variant_multimedia' se limpia sola 
            // gracias al ON DELETE CASCADE de tu SQL
            $variant->delete();

            return back()->with('message', 'Presentación de alimento eliminada correctamente');
        });
    }

    public function showDetailed($id)
    {
        // Cargamos la variante con su producto, beneficios y su multimedia
        $variant = \App\Models\ProductVariant::with([
            'product.nutritionalBenefits', 
            'multimedia' // Asegúrate de tener esta relación definida en tu modelo Variant
        ])->findOrFail($id);

        return Inertia::render('ProductShow', [
            'variant' => $variant
        ]);
    }


}

