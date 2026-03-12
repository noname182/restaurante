import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PlatosXPedido() {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const formatearFechaLarga = (fecha) => {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(fecha + "T00:00:00").toLocaleDateString('es-ES', opciones).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <Head title="Estadísticas - Terraza Melchor" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#3a3a44] rounded-[2rem] p-8 shadow-2xl relative text-center"
            >
                {/* BOTÓN VOLVER */}
                <Link 
                    href={route('home')} 
                    className="absolute top-8 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Menú</span>
                </Link>

                {/* LOGO */}
                <div className="flex justify-center mb-6 pt-4">
                    <div className="text-center border-2 border-white/20 px-4 py-2 rounded-lg italic font-bold text-sm">
                        TERRAZA MELCHOR
                    </div>
                </div>

                <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-8">
                    Registro de Platos <br /> por Pedido
                </h2>

                {/* SELECTOR DE FECHA  */}
                <div className="space-y-3 mb-6">
                    <div className="bg-[#1a1a1a] py-2 px-4 rounded-xl border border-white/10 inline-block">
                        <span className="text-[10px] text-[#96be8c] font-black uppercase tracking-[0.2em]">
                            Consultando Día:
                        </span>
                        <p className="text-sm font-bold tracking-widest mt-1">
                            {formatearFechaLarga(fechaSeleccionada)}
                        </p>
                    </div>

                    <div className="relative max-w-[200px] mx-auto">
                        <input 
                            type="date" 
                            className="w-full bg-[#4a4a55] border-none rounded-lg p-2 text-white text-xs text-center focus:ring-2 focus:ring-[#96be8c] cursor-pointer"
                            value={fechaSeleccionada}
                            onChange={e => setFechaSeleccionada(e.target.value)}
                        />
                    </div>
                </div>

                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-6">
                    Sin registros en este día
                </p>

                {/* TABLA DE ESTADÍSTICAS */}
                <div className="border-2 border-white rounded-xl overflow-hidden text-xs uppercase font-bold">
                    {/* Encabezados */}
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5">
                        <div className="p-2 border-r-2 border-white">Cantidad</div>
                        <div className="p-2 border-r-2 border-white">Del Día</div>
                        <div className="p-2">Del Mes</div>
                    </div>
                    
                    {/* Espacio vacío para datos */}
                    <div className="grid grid-cols-3 h-16 border-b-2 border-white">
                        <div className="border-r-2 border-white"></div>
                        <div className="border-r-2 border-white"></div>
                        <div></div>
                    </div>

                    {/* Fila Total Platos */}
                    <div className="grid grid-cols-3 border-b-2 border-white bg-white/5 items-center">
                        <div className="p-2 border-r-2 border-white leading-tight">Total <br/><span className="text-[8px] opacity-60">de platos</span></div>
                        <div className="p-2 border-r-2 border-white text-lg">0</div>
                        <div className="p-2 text-lg">0</div>
                    </div>

                    {/* Fila Total Pedidos */}
                    <div className="grid grid-cols-3 items-center">
                        <div className="p-2 border-r-2 border-white leading-tight">Total <br/><span className="text-[8px] opacity-60">de pedidos</span></div>
                        <div className="p-2 border-r-2 border-white text-lg">0</div>
                        <div className="p-2 text-lg">0</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}