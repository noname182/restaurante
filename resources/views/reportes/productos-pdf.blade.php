<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Productos</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
        h1 { text-align: center; }
        h2 { margin-bottom: 5px; }
    </style>
</head>
<body>
    <h1>Reporte de Productos</h1>

    @foreach($productos as $p)
        <h2>Producto: {{ $p->name }} (ID: {{ $p->id }}) - Precio Base: {{ number_format($p->price, 2) }}</h2>

        @if($p->variants->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Precio</th>
                    <th>Atributos</th>
                </tr>
            </thead>
            <tbody>
                @foreach($p->variants as $v)
                <tr>
                    <td>{{ $v->sku }}</td>
                    <td>{{ number_format($v->price, 2) }}</td>
                    <td>
                        @foreach($v->values as $val)
                            {{ $val->attribute->name ?? '' }}: {{ $val->value }}@if(!$loop->last), @endif
                        @endforeach
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
            <p>No tiene variantes.</p>
        @endif
    @endforeach
</body>
</html>
