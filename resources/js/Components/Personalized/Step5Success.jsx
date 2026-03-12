import React from "react";
import { CheckCircle, MessageCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react'; // 1. Importar usePage

export default function Step5Success({ data }) {
    // 2. Extraer los datos de configuración de la misma forma que en Contacto
    const { props } = usePage();
    const appConfig = props['app_config'] || {};
    const accountData = appConfig['account'] || null;
    
    // 3. Obtener el número real de WhatsApp (con respaldo por si falla)
    const whatsappNumber = accountData?.whatsapp_number || "59174618956"; 
    
    // 4. Construir el mensaje
    const message = `Hola! Acabo de enviar mi solicitud de comida personalizada para ${data.pet_name}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
            <div className="flex justify-center">
                <div className="bg-green-100 p-6 rounded-full">
                    <CheckCircle size={60} className="text-[#008542]" />
                </div>
            </div>
            
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Pedido Recibido!</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Hemos guardado la información de <strong>{data.pet_name}</strong> en nuestro sistema. Haz clic abajo para coordinar el pago por WhatsApp.
                </p>
            </div>

            <div className="pt-4">
                <a 
                    href={whatsappUrl} // 5. Usar la URL dinámica corregida
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 rounded-[25px] font-black shadow-xl hover:bg-[#128C7E] transition-all hover:scale-[1.05]"
                >
                    <MessageCircle size={24} />
                    CONTACTAR POR WHATSAPP
                </a>
            </div>
        </div>
    );
}