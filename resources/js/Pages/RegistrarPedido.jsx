import { useForm, Link } from "@inertiajs/react"; // Importamos Link
import { motion } from "framer-motion";

export default function Welcome() {
    const { data, setData, post, processing } = useForm({
        fecha: new Date().toISOString().split('T')[0],
        nombre_plato: '',
        cliente: '',
        cantidad: 0,
        metodo_entrega: 'R', 
        nota: ''
    });

    return (
        <div className="min-h-screen bg-[#2c2c34] text-white font-sans flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#3a3a44] rounded-[2rem] p-8 shadow-2xl relative" // Añadimos relative
            >
                {/* BOTÓN VOLVER */}
                <Link 
                    href={route('home')} 
                    className="absolute top-8 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Menú</span>
                </Link>

                {/* Header con Logo */}
                <div className="flex flex-col items-center mb-6 pt-4"> {/* Añadimos un poco de padding top */}
                    <div className="w-48 mb-2">
                        <div className="text-center border-2 border-white/20 py-2 rounded-lg italic font-bold">
                            TERRAZA MELCHOR
                        </div>
                    </div>
                </div>

                <form className="space-y-5">
                
                    <div className="space-y-1">
                        <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                            <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                            Fecha
                        </label>
                        <input 
                            type="date" 
                            className="w-full bg-[#4a4a55] border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#96be8c]"
                            value={data.fecha}
                            onChange={e => setData('fecha', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                            <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                            Nombre del Plato
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-[#96be8c]"
                            placeholder="Escribe el plato..."
                            onChange={e => setData('nombre_plato', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                            <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                            Apellido & Nombre
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-[#96be8c]"
                            onChange={e => setData('cliente', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                                <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                                Platos
                            </label>
                            <input 
                                type="number" 
                                className="w-full bg-[#e0e0e0] border-none rounded-lg p-4 text-black text-center text-xl font-bold"
                                value={data.cantidad}
                                onChange={e => setData('cantidad', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[#96be8c] font-bold text-sm flex items-center gap-2">
                                <span className="bg-[#96be8c] text-[#2c2c34] rounded-full w-5 h-5 flex items-center justify-center text-xs">5</span>
                                Método de Entrega
                            </label>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setData('metodo_entrega', 'R')}
                                    className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center transition-all ${data.metodo_entrega === 'R' ? 'border-[#96be8c] bg-[#96be8c]/10' : 'border-transparent bg-[#4a4a55]'}`}
                                >
                                    <span className="text-xl">🏪</span>
                                    <span className="text-[10px] font-bold">R</span>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setData('metodo_entrega', 'M')}
                                    className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center transition-all ${data.metodo_entrega === 'M' ? 'border-[#96be8c] bg-[#96be8c]/10' : 'border-transparent bg-[#4a4a55]'}`}
                                >
                                    <span className="text-xl">🏍️</span>
                                    <span className="text-[10px] font-bold">M</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-4">
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 font-bold">Total</p>
                        <h2 className="text-5xl font-black italic">0 <span className="text-2xl not-italic">Bs.</span></h2>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-lg border border-white/10 uppercase tracking-widest"
                    >
                        Guardar
                    </button>

                    <div className="space-y-1">
                        <label className="text-gray-400 font-bold text-xs uppercase">Nota</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#e0e0e0] border-none rounded-lg p-2 text-black text-sm"
                            onChange={e => setData('nota', e.target.value)}
                        />
                    </div>
                </form>
            </motion.div>
        </div>
    );
}