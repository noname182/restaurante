<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function descontar(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.sku' => 'required|string',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request, &$order) {
                $total = 0;

                // Crear orden simulada con datos fijos
                $order = Order::create([
                    'customer_name' => 'Encargado',
                    'customer_phone' => '12345678', // teléfono de la empresa
                    'customer_email' => 'empresa@example.com', // email de la empresa
                    'status_id' => 1, // estatus fijo
                    'payment_method_id' => 3, // efectivo
                    'total' => 0, // se calcula luego
                ]);

                foreach ($request->items as $item) {
                    $variant = ProductVariant::where('sku', $item['sku'])->lockForUpdate()->first();

                    if (!$variant) {
                        throw new \Exception("SKU no encontrado: {$item['sku']}");
                    }

                    if ($variant->stock < $item['qty']) {
                        throw new \Exception("Stock insuficiente para SKU {$item['sku']}");
                    }

                    // Descontar stock
                    $variant->stock -= $item['qty'];
                    $variant->save();

                    // Crear item de la orden
                    $subtotal = $variant->price * $item['qty'];
                    $total += $subtotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $variant->product_id,
                        'sku' => $variant->sku,
                        'quantity' => $item['qty'],
                        'price' => $variant->price,
                        'subtotal' => $subtotal,
                    ]);
                }

                // Actualizar total de la orden
                $order->update(['total' => $total]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Stock descontado y orden creada correctamente',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
