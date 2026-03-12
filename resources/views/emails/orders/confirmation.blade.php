<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pedido Maro</title>
</head> 

<body style="margin:0; padding:0; background-color:#f2f2f2; font-family:Arial, sans-serif;">

<!-- Wrapper general (fondo normal) -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f2; padding:40px 0;">
    <tr>
        <td align="center">

            <!-- CARD OSCURA -->
            <table width="600" cellpadding="0" cellspacing="0"
                   style="background-color:#231f20; border-radius:14px; padding:32px;">
                <tr>
                    <td>

                        <!-- Logo -->
                        <div style="text-align:center; margin-bottom:25px;">
                            <img
                                src="https://res.cloudinary.com/dnbklbswg/image/upload/v1765627552/Captura_de_pantalla_2025-12-13_075927-removebg-preview_m4lqsz.png"
                                alt="Maro"
                                style="width:150px;"
                            >
                        </div>

                        <!-- Título -->
                        <h2 style="text-align:center; color:#ffffff; margin-bottom:8px;">
                            ¡Gracias por tu compra, {{ $order->customer_name }}!
                        </h2>

                        <p style="text-align:center; color:#cccccc; margin-bottom:25px;">
                            Hemos recibido tu pedido correctamente
                        </p>

                        <!-- ID DEL PEDIDO (MEJORADO) -->
                        <div style="
                            background:#2f2b2c;
                            padding:18px;
                            border-radius:12px;
                            text-align:center;
                            margin-bottom:30px;
                            border:1px solid #3a3637;
                        ">
                            <p style="margin:0; font-size:13px; color:#bfbfbf; letter-spacing:1px;">
                                NÚMERO DE PEDIDO
                            </p>
                            <p style="
                                margin:8px 0 0;
                                font-size:26px;
                                font-weight:bold;
                                color:#ffffff;
                                letter-spacing:2px;
                            ">
                                #{{ $order->id }}
                            </p>
                            <p style="margin-top:8px; font-size:12px; color:#aaaaaa;">
                                Usa este número como referencia en tu transferencia
                            </p>
                        </div>

                        <!-- Tabla -->
                        <table width="100%" cellpadding="0" cellspacing="0"
                               style="border-collapse:collapse; margin-bottom:25px; color:#ffffff;">
                            <thead>
                                <tr style="background-color:#2f2b2c;">
                                    <th style="padding:10px; text-align:left;">Producto</th>
                                    <th style="padding:10px; text-align:center;">Cant.</th>
                                    <th style="padding:10px; text-align:right;">Precio</th>
                                    <th style="padding:10px; text-align:right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                                                @foreach($items as $item)
                                <tr>
                                    <td style="padding:10px; border-bottom:1px solid #3a3637;">
                                        {{ $item['name'] }}

                                        @if(!empty($item['size']))
                                            <br>
                                            <small style="color:#b0b0b0;">
                                                {{ $item['size'] }}
                                            </small>
                                        @endif
                                    </td>

                                    <td style="padding:10px; text-align:center; border-bottom:1px solid #3a3637;">
                                        {{ $item['quantity'] }}
                                    </td>

                                    <td style="padding:10px; text-align:right; border-bottom:1px solid #3a3637;">
                                        {{ number_format($item['price'], 0) }}
                                    </td>

                                    <td style="padding:10px; text-align:right; border-bottom:1px solid #3a3637;">
                                        {{ number_format($item['subtotal'], 0) }}
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="padding:12px; text-align:right; font-weight:bold;">
                                        Total
                                    </td>
                                    <td style="padding:12px; text-align:right; font-weight:bold; font-size:16px;">
                                        {{ number_format($order->total, 0) }} $
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <!-- Información de pago -->
                        <div style="
                            background:#2f2b2c;
                            padding:18px;
                            border-radius:12px;
                            color:#e0e0e0;
                        ">
                            <strong style="color:#ffffff;">Información importante</strong>
                            <ul style="padding-left:18px; margin-top:10px;">
                                <li>
                                    Realiza la transferencia usando como referencia el
                                    <strong>#{{ $order->id }}</strong>.
                                </li>
                                <li>
                                    Envía tu comprobante de pago al correo o WhatsApp del vendedor.
                                </li>
                                <li>
                                    Tu pedido será procesado una vez confirmado el pago.
                                </li>
                            </ul>
                        </div>

                        <!-- Footer -->
                        <p style="margin-top:30px; text-align:center; color:#bfbfbf; font-size:13px;">
                            Gracias por confiar en <strong style="color:#ffffff;">Maro</strong> 🤍<br>
                            Cualquier duda, estamos para ayudarte.
                        </p>

                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

</body>
</html>
