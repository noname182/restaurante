<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderDeliveredAdmin;
use App\Mail\OrderDeliveredCustomer;
use App\Models\CustomOrder;

class OrderController extends Controller
{
    /**
     * 🔥 NUEVA: Crear orden desde el Checkout (Paso 1)
     * Guarda los datos en MariaDB antes de pasar al QR.
     */
    
    public function store(Request $request)
    {
        // 1. Validación
        $request->validate([
            'customer_name'    => 'required|string',
            'customer_phone'   => 'required|string',
            'customer_address' => 'required|string',
            'total'            => 'required|numeric',
            'cart'             => 'required|array|min:1',
            'cart.*.variant_id' => 'required|exists:product_variants,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 2. Crear la Orden principal (QUITAMOS variant_id de aquí)
                $order = Order::updateOrCreate(
                    ['id' => $request->order_id], // Condición de búsqueda
                    [
                        'customer_name'              => $request->customer_name,
                        'customer_phone'             => $request->customer_phone,
                        'customer_email'             => $request->customer_email,
                        'customer_address'           => $request->customer_address,
                        'customer_address_reference' => $request->customer_address_reference,
                        'total'                      => $request->total,
                        'status_id'                  => 1,
                    ]
                );

                // 💡 LIMPIEZA DE ITEMS: Si estamos actualizando, borramos los items viejos 
                // para insertar los nuevos del carrito actualizado
                $order->items()->delete(); 

                foreach ($request->cart as $item) {
                    OrderItem::create([
                        'order_id'   => $order->id,
                        'variant_id' => $item['variant_id'],
                        'quantity'   => $item['quantity'],
                        'price'      => $item['price'],
                        'subtotal'   => $item['subtotal'],
                    ]);
                }

                return back()->with('flash', [
                    'order_id' => $order->id
                ]);
            });

        } catch (\Exception $e) {
            \Log::error("❌ Error al crear pedido completo: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la orden: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Listar todas las órdenes (Panel Admin)
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'compra');

        if ($type === 'personalizado') {
            // Obtenemos datos de la tabla custom_orders
            $orders = CustomOrder::with(['status'])->orderByDesc('id')->paginate(10);
        } else {
            // Obtenemos compras directas con sus productos
            $orders = \App\Models\Order::with(['status', 'items.variant.product'])
                    ->orderByDesc('id')->paginate(10);
        }

        return \Inertia\Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'currentType' => $type
        ]);
    }

    /**
     * Mostrar detalle completo de la orden
     */
    public function show(Order $order)
    {
        // Cargamos los items y la relación variante -> producto para saber qué compró
        $order->load(['status', 'items.variant.product']); 
        
        return response()->json($order); // Esto lo usaremos para el Modal de detalle
    }

    /**
     * Actualizar estado (Cambio rápido desde la tabla)
     */
    
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status_id' => 'required|integer|exists:order_status,id',
        ]);

        $oldStatus = (int)$order->status_id;
        $newStatus = (int)$request->status_id;

        // Solo ejecutamos lógica de stock si el estado realmente cambió
        if ($oldStatus !== $newStatus) {
            try {
                DB::transaction(function () use ($order, $oldStatus, $newStatus) {
                    
                    // CASO A: De "Cualquiera" a "Pagado" (ID 2) -> RESTAR STOCK
                    if ($newStatus === 2) {
                        foreach ($order->items as $item) {
                            $variant = $item->variant; // Asumiendo relación 'variant' en OrderItem
                            if ($variant) {
                                $variant->decrement('stock', $item->quantity);
                            }
                        }
                    }

                    // CASO B: De "Pagado" (ID 2) a "Cualquiera" (ej. Pendiente) -> SUMAR STOCK (Devolución)
                    if ($oldStatus === 2 && $newStatus !== 2) {
                        foreach ($order->items as $item) {
                            $variant = $item->variant;
                            if ($variant) {
                                $variant->increment('stock', $item->quantity);
                            }
                        }
                    }

                    // Finalmente actualizamos el estado del pedido
                    $order->update(['status_id' => $newStatus]);
                });

                return back()->with('success', 'Estado y stock actualizados.');

            } catch (\Exception $e) {
                \Log::error("Error de stock: " . $e->getMessage());
                return back()->with('error', 'No se pudo actualizar el stock: ' . $e->getMessage());
            }
        }

        return back();
    }
    public function destroy(Order $order)
    {
        try {
            $order->items()->delete(); 

            // 2. Ahora eliminamos la orden principal
            $order->delete();

            return back()->with('success', 'Compra eliminada correctamente.');
        } catch (\Exception $e) {
            \Log::error("Error al eliminar pedido: " . $e->getMessage());
            return back()->with('error', 'No se pudo eliminar el pedido porque tiene datos vinculados.');
        }
    }
}