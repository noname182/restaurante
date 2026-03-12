<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Ventas</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
    </style>
</head>
<body>
    <h2>Reporte de Ventas</h2>
    <p>Desde: {{ $desde }} — Hasta: {{ $hasta }}</p>

    <h3>Resumen General</h3>
    <p>Total de pedidos: {{ $totales->total_pedidos ?? 0 }}</p>
    <p>Total vendido: $ {{ $totales->total_vendido ?? 0 }}</p>
    <p>Total de ítems vendidos: {{ $totales->total_items_vendidos ?? 0 }}</p>

    <h3>Detalle de Pedidos</h3>
    <table>
        <thead>
            <tr>
                <th>Pedido</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal ($)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($detalle as $d)
            <tr>
                <td>{{ $d->pedido }}</td>
                <td>{{ $d->producto }}</td>
                <td>{{ $d->cantidad }}</td>
                <td>{{ $d->subtotal }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h3>Productos Vendidos</h3>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad Total</th>
                <th>Total Generado (v)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($productos as $p)
            <tr>
                <td>{{ $p->producto }}</td>
                <td>{{ $p->cantidad_total }}</td>
                <td>{{ $p->total_generado }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
