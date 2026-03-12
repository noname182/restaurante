import React from "react";
import { Cookie, Wind, Box } from 'lucide-react';

export default function Step4Preferences({ data, setData, prevStep, processing }) {
    
    const formats = [
        { id: 'croqueta', label: 'Croqueta', icon: Cookie, desc: 'Textura clásica' },
        { id: 'deshidratado', label: 'Deshidratado', icon: Wind, desc: 'Liofilizado premium' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-left text-left">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 4 – Preferencias finales</h2>
                <p className="text-gray-500 text-sm">Personaliza la presentación y cantidad de tu pedido.</p>
            </div>

            {/* Formato */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">Formato de la comida</label>
                <div className="grid grid-cols-2 gap-5">
                    {formats.map((item) => {
                        const Icon = item.icon;
                        const isSelected = data.food_format === item.id;
                        return (
                            <button key={item.id} type="button" onClick={() => setData('food_format', item.id)}
                                className={`py-6 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 transition-all ${
                                    isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                                }`}
                            >
                                <Icon size={32} />
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    <span className="text-[10px] opacity-70">{item.desc}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tamaño Kibble dinámico */}
            <div className="space-y-4 animate-in zoom-in-95">
                <label className="text-sm font-bold text-gray-700 ml-1">Tamaño de la croqueta / presentación</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Pequeño', 'Mediano', 'Grande'].map((size) => (
                        <button key={size} type="button" onClick={() => setData('kibble_size', size.toLowerCase())}
                            className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                                data.kibble_size === size.toLowerCase() ? 'border-[#008542] bg-green-50 text-[#008542]' : 'border-gray-100 text-gray-400'
                            }`}
                        >
                            <span className="text-xs">{size}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cantidad Mensual */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Cantidad mensual estimada (kg)</label>
                <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Ej: 5kg, 10kg o 15.5kg" value={data.monthly_quantity}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] transition-all"
                        onChange={e => setData('monthly_quantity', e.target.value)} />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-400 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-200 transition-all">Atrás</button>
                <button type="submit" disabled={processing || !data.monthly_quantity}
                    className={`w-2/3 py-4 rounded-2xl font-bold shadow-lg transition-all ${
                        data.monthly_quantity ? 'bg-[#008542] text-white hover:bg-[#006d35]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}>
                    {processing ? 'Enviando...' : 'Finalizar Pedido'}
                </button>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mt-8">
                <p className="text-[14px] text-amber-700 italic leading-relaxed text-center">
                    "Las formulaciones personalizadas se realizan bajo la información proporcionada por el tutor y no reemplazan la asesoría veterinaria profesional."
                </p>
            </div>
        </div>
    );
}