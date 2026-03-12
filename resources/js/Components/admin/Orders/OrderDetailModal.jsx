import React from 'react';

export default function OrderDetailModal({ order, type, close }) {
    if (!order) return null;

    // Función simplificada para detectar si el archivo es local o de Cloudinary
    const getFileUrl = (url) => {
        if (!url) return '';
        // Si es una imagen de Cloudinary, le añadimos el flag de descarga por si acaso
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/fl_attachment/');
        }
        // Si es local (/storage/...), devolvemos la URL tal cual
        return url;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 shadow-2xl animate-in zoom-in duration-300">
                
                {/* --- CABECERA --- */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Detalles del Pedido</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase italic">
                            {type === 'personalizado' ? `Tutor: ${order.tutor_name}` : `Cliente: ${order.customer_name}`}
                        </p>
                    </div>
                    <button onClick={close} className="text-gray-300 hover:text-red-500 font-black text-2xl transition-colors">×</button>
                </div>

                <div className="space-y-6">
                    {/* --- INFO TUTOR (Mantenemos tu diseño) --- */}
                    <div className="bg-[#111827] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden mb-6">
                        <div className="relative z-10">
                            <p className="text-[12px] font-black opacity-50 uppercase tracking-[0.3em] mb-4">Información del Tutor</p>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                                {order.tutor_name || order.customer_name}
                            </h3>
                            <div className="flex flex-wrap gap-6 text-sm font-bold">
                                <p className="flex items-center gap-2 italic">📞 {order.whatsapp_number || order.customer_phone}</p>
                                <p className="flex items-center gap-2 italic">
                                    <span>📧</span>
                                    {order.customer_email || order.email ? (
                                        <span className="text-gray-200">{order.customer_email || order.email}</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs opacity-60">Sin correo registrado</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-10 text-[120px]">👤</div>
                    </div>

                    {/* --- UBICACIÓN --- */}
                    <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100 shadow-inner mb-8">
                        <p className="text-[12px] font-black text-[#008542] uppercase mb-4 tracking-widest flex items-center gap-2">📍 Punto de Entrega</p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Dirección Exacta:</p>
                                <p className="text-sm font-bold text-gray-800">{order.customer_address || 'Dirección no especificada'}</p>
                            </div>
                            <div className="pt-3 border-t border-gray-200/50">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Referencia del lugar:</p>
                                <p className="text-xs text-gray-500 font-medium italic leading-relaxed">{order.customer_address_reference || 'Sin referencia adicional.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTENIDO DINÁMICO --- */}
                    {type === 'personalizado' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Ficha Técnica Mascota */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[30px]">
                                    <p className="text-[9px] font-black text-orange-600 uppercase mb-2 italic">Mascota</p>
                                    <p className="text-xl font-black text-gray-800 uppercase leading-none">{order.pet_name}</p>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1">{order.pet_size} • {order.pet_age}</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-[30px]">
                                    <p className="text-[9px] font-black text-blue-600 uppercase mb-2 italic">Físico</p>
                                    <p className="text-xl font-black text-gray-800 uppercase leading-none">{order.pet_weight}</p>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1">Actividad: {order.activity_level || 'N/A'}</p>
                                </div>
                                <div className="bg-green-50 border border-green-100 p-6 rounded-[30px]">
                                    <p className="text-[9px] font-black text-green-600 uppercase mb-2 italic">Plan Holli</p>
                                    <p className="text-xl font-black text-gray-800 uppercase leading-none">{order.food_format}</p>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1">Cant: {order.monthly_quantity}</p>
                                </div>
                            </div>

                            {/* Notas del Pedido */}
                            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
                                <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">📝 Notas del Pedido</p>
                                <p className="text-sm text-gray-700 font-medium italic">
                                    "{order.specific_requirements || 'Sin requerimientos adicionales.'}"
                                </p>
                            </div>

                            {/* --- SECCIÓN HÍBRIDA: DOCUMENTACIÓN ADJUNTA --- */}
                            <div className="pt-4">
                                <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">📋 Documentación Adjunta</p>
                                {order.diet_file_url ? (
                                    <div className="space-y-4">
                                        {order.diet_file_url.toLowerCase().endsWith('.pdf') ? (
                                            /* Visor para PDF Local: Sin bloqueos de terceros */
                                            <div className="w-full h-[450px] rounded-[35px] overflow-hidden border-2 border-gray-100 shadow-inner bg-gray-50">
                                                <iframe
                                                    src={order.diet_file_url}
                                                    className="w-full h-full"
                                                    frameBorder="0"
                                                ></iframe>
                                            </div>
                                        ) : (
                                            /* Vista Previa para Imagen (Cloudinary o Local) */
                                            <div className="bg-white border-2 border-dashed border-green-200 rounded-[35px] p-6 flex flex-col items-center">
                                                <img src={order.diet_file_url} className="max-h-64 rounded-2xl shadow-md" alt="Dieta" />
                                            </div>
                                        )}

                                        {/* Botón de Descarga Universal */}
                                        <div className="flex justify-center">
                                            <a 
                                                href={getFileUrl(order.diet_file_url)} 
                                                download={`Dieta_Holli_${order.pet_name || 'Mascota'}`}
                                                className="inline-flex items-center gap-2 bg-[#008542] text-white px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#006d35] transition-all shadow-lg"
                                            >
                                                <span>📥</span> Descargar Archivo
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-[35px] p-8 text-center border border-gray-100 italic text-gray-400 text-xs">
                                        Sin archivo adjunto.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* --- COMPRAS DIRECTAS --- */
                        <div className="space-y-4">
                            <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-4">🛒 Resumen de Compra</p>
                            <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-sm">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-5 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">
                                                {item.quantity}x {item.variant?.product?.name || 'Producto'}
                                            </span>
                                            {item.variant?.weight && (
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    Formato: {item.variant.weight >= 1000 
                                                        ? `${(item.variant.weight / 1000)} kg` 
                                                        : `${item.variant.weight} g`}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-black text-[#008542] bg-green-50 px-3 py-1 rounded-full">
                                            {item.subtotal} BOB
                                        </span>
                                    </div>
                                ))}
                                <div className="bg-gray-900 p-5 flex justify-between items-center text-white">
                                    <span className="text-xs font-black uppercase tracking-widest">Total Pagado</span>
                                    <span className="text-lg font-black">{order.total} BOB</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={close} className="w-full mt-10 bg-gray-100 hover:bg-gray-200 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Cerrar Panel</button>
            </div>
        </div>
    );
}