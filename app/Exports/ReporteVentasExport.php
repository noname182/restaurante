<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;

class ReporteVentasExport implements FromCollection
{
    protected $desde;
    protected $hasta;

    public function __construct($desde, $hasta)
    {
        $this->desde = $desde;
        $this->hasta = $hasta;
    }

    public function collection()
    {
        return DB::table('order_items as oi')
            ->join('products as p', 'p.id', '=', 'oi.product_id')
            ->join('orders as o', 'o.id', '=', 'oi.order_id')
            ->whereBetween(DB::raw('DATE(o.created_at)'), [$this->desde, $this->hasta])
            ->select('o.id', 'p.name', 'oi.quantity', 'oi.subtotal')
            ->get();
    }
}
