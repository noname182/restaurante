<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReporteVentasExport;
use Barryvdh\DomPDF\Facade\Pdf; // Nota: PDF → Pdf con P mayúscula
 
 
class ReportController extends Controller
{
    public function ventas(Request $request)
    {
        $desde = $request->query('desde');
        $hasta = $request->query('hasta');

        if (!$desde || !$hasta) {
            return response()->json([
                'status' => 'error',
                'message' => 'Debes enviar una fecha desde y hasta.'
            ], 400);
        }

        if ($desde > $hasta) {
            [$desde, $hasta] = [$hasta, $desde];
        }

        $detalle = $this->getDetalle($desde, $hasta);
        $totales = $this->getTotales($desde, $hasta);
        $productos = $this->getProductos($desde, $hasta);

        return response()->json([
            'status' => 'success',
            'rango' => compact('desde', 'hasta'),
            'totales' => $totales,
            'detalle' => $detalle,
            'productos' => $productos
        ]);
    }

    private function getDetalle($desde, $hasta)
    {
        return DB::table('orders as o')
            ->join('order_items as oi', 'oi.order_id', '=', 'o.id')
            ->join('products as p', 'p.id', '=', 'oi.product_id')
            ->whereBetween(DB::raw('DATE(o.created_at)'), [$desde, $hasta])
            ->select(
                'o.id as pedido',
                'p.name as producto',
                'oi.quantity as cantidad',
                'oi.subtotal as subtotal'
            )
            ->get();
    }

    private function getTotales($desde, $hasta)
    {
        return DB::table('orders as o')
            ->join('order_items as oi', 'oi.order_id', '=', 'o.id')
            ->whereBetween(DB::raw('DATE(o.created_at)'), [$desde, $hasta])
            ->selectRaw('
                COUNT(DISTINCT o.id) as total_pedidos,
                SUM(o.total) as total_vendido,
                SUM(oi.quantity) as total_items_vendidos
            ')
            ->first();
    }

    private function getProductos($desde, $hasta)
    {
        return DB::table('order_items as oi')
            ->join('products as p', 'p.id', '=', 'oi.product_id')
            ->join('orders as o', 'o.id', '=', 'oi.order_id')
            ->whereBetween(DB::raw('DATE(o.created_at)'), [$desde, $hasta])
            ->select(
                'p.name as producto',
                DB::raw('SUM(oi.quantity) as cantidad_total'),
                DB::raw('SUM(oi.subtotal) as total_generado')
            )
            ->groupBy('p.name')
            ->orderByDesc('total_generado')
            ->get();
    }

    /* ================= EXPORTADORES ================= */

    public function exportExcel(Request $request)
    {
        return Excel::download(
            new ReporteVentasExport($request->desde, $request->hasta),
            'reporte_ventas.xlsx'
        );
    }

    public function exportCsv(Request $request)
    {
        return Excel::download(
            new ReporteVentasExport($request->desde, $request->hasta),
            'reporte_ventas.csv'
        );
    }

    public function exportPdf(Request $request)
    {
        $data = [
            'detalle' => $this->getDetalle($request->desde, $request->hasta),
            'totales' => $this->getTotales($request->desde, $request->hasta),
            'productos' => $this->getProductos($request->desde, $request->hasta),
            'desde' => $request->desde,
            'hasta' => $request->hasta
        ];

        $pdf = Pdf::loadView('reportes.ventas-pdf', $data);
        return $pdf->download('reporte_ventas.pdf');
    }



    public function productos()
{
    $productos = DB::table('order_items as oi')
        ->join('products as p', 'p.id', '=', 'oi.product_id')
        ->select(
            'p.name as producto',
            DB::raw('SUM(oi.quantity) as cantidad_total'),
            DB::raw('SUM(oi.subtotal) as total_generado')
        )
        ->groupBy('p.name')
        ->orderByDesc('total_generado')
        ->get();

    return response()->json([
        'status' => 'success',
        'productos' => $productos
    ]);
}

/* ================= EXPORTADORES PRODUCTOS ================= */

public function exportExcelProductos()
{
    return Excel::download(
        new \App\Exports\ReporteProductosExport(),
        'reporte_productos.xlsx'
    );
}

public function exportCsvProductos()
{
    return Excel::download(
        new \App\Exports\ReporteProductosExport(),
        'reporte_productos.csv'
    );
}

public function exportPdfProductos()
{
    // Cargar productos con sus variantes y los atributos de cada variante
    $productos = \App\Models\Product::with(['variants.values.attribute'])->get();

    $pdf = Pdf::loadView('reportes.productos-pdf', compact('productos'));
    return $pdf->download('reporte_productos.pdf');
}


}
