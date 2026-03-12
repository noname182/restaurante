<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductMultimedia;
use Inertia\Inertia;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\Request;

class AdminCategoryProductsController extends Controller
{
    // Mostrar productos de una categoría
    public function index($categoryId)
    {
        $category = Category::select('id', 'name', 'description')->findOrFail($categoryId);

        $products = Product::where('category_id', $categoryId)
            ->with(['multimedia', 'variants.values.attribute'])
            ->select('id', 'name', 'description', 'price', 'available')
            ->paginate(6)
            ->onEachSide(1);

        return Inertia::render('Admin/CategoryProducts', [
            'category' => $category,
            'products' => $products
        ]);
    }

    // Crear producto con multimedia
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'files' => 'nullable|array|max:10',
            'files.*' => 'file|max:51200|mimes:jpeg,jpg,png,gif,mp4,mov,avi',
        ]);

        $product = Product::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'available' => 1,
        ]);

        $this->handleMultimediaUpload($request, $product);

        return response()->json([
            'status' => 'success',
            'product' => $product->load('multimedia')
        ]);
    }

    // Actualizar producto y multimedia
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'files' => 'nullable|array|max:10',
            'files.*' => 'file|max:51200|mimes:jpeg,jpg,png,gif,mp4,mov,avi',
            'removed_media_ids' => 'nullable|array',
            'removed_media_ids.*' => 'exists:product_multimedia,id',
        ]);

        // Actualizar datos del producto
        $product->update($request->only('name', 'description', 'price'));

        // Eliminar multimedia removida
        if ($request->filled('removed_media_ids')) {
            ProductMultimedia::whereIn('id', $request->removed_media_ids)->delete();
        }

        // Subir archivos nuevos
        $this->handleMultimediaUpload($request, $product);

        return response()->json([
            'status' => 'success',
            'product' => $product->load('multimedia')
        ]);
    }

    // Eliminar producto completo
    public function destroy(Product $product)
    {
        $product->multimedia()->delete();

        foreach ($product->variants as $variant) {
            $variant->values()->detach();
            $variant->delete();
        }

        $product->delete();

        return response()->json(['status' => 'success']);
    }

    // Eliminar multimedia individual
    public function destroyMultimedia($productId, $mediaId)
    {
        $media = ProductMultimedia::findOrFail($mediaId);
        $media->delete();

        return response()->json(['status' => 'success']);
    }

    private function handleMultimediaUpload(Request $request, Product $product)
{
    if ($request->hasFile('files')) {
        $uploadApi = new UploadApi();

        foreach ($request->file('files') as $file) {
            $resourceType = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image';

            $upload = $uploadApi->upload($file->getRealPath(), [
                'folder' => "products/{$product->id}",
                'resource_type' => $resourceType
            ]);

            ProductMultimedia::create([
                'product_id' => $product->id,
                'url' => $upload['secure_url'],
                'type' => $resourceType,
            ]);
        }
    }
}
}
