<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;
use App\Models\OrderItem;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order; 
    public $items;

    public function __construct(Order $order, $items)
    {
        $this->order = $order;
        $this->items = $items;
    }
 
    public function build()
    {
        return $this->subject('Confirmación de tu pedido')
                    ->markdown('emails.orders.confirmation')
                    ->with([
                        'order' => $this->order,
                        'items' => $this->items,
                    ]);
    }
}
