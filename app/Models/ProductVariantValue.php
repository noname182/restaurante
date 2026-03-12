public function exportPdfProductos()
{
    // Cargar productos con sus variantes y los atributos de cada variante
    $productos = \App\Models\Product::with(['variants.values.attribute'])->get();

    $pdf = Pdf::loadView('reportes.productos-pdf', compact('productos'));
    return $pdf->download('reporte_productos.pdf');
}
