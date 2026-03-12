import React from 'react';
import { Eye } from 'lucide-react';

export default function InventoryTab({ variants, onVariantChange, onImageClick }) {
    return (
        <div className="space-y-4">
            {/* Cabecera de la tabla ajustada */}
            <div className="flex gap-4 px-4 text-[10px] font-black text-gray-400 uppercase">
                <div className="flex-1 text-left">Código (SKU)</div>
                <div className="w-24 text-left">Peso (Gramos)</div> {/* Cambio: Volumen -> Peso */}
                <div className="w-32 text-right">Precio (BOB)</div>
                <div className="w-24 text-center">Stock</div>
                <div className="w-16 text-center">Imagen</div>
            </div>

            {variants.map((v, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* SKU: Identificador único autogenerado */}
                    <div className="flex-1 p-2 bg-white/50 rounded-lg text-sm text-black text-left font-mono truncate">
                        {v.sku || 'N/A'}
                    </div>
                    
                    {/* Peso: Solo números para gramos */}
                    <div className="w-24">
                        <input 
                            type="text" 
                            inputMode="numeric"
                            value={v.weight || ''} 
                            onChange={(e) => {
                                // Limpiamos para que solo acepte números enteros
                                const val = e.target.value.replace(/\D/g, '');
                                onVariantChange(index, 'weight', val);
                            }}
                            placeholder="Ej: 1000"
                            className="w-full p-2 bg-white rounded-lg border-none text-left text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>
                    
                    {/* Precio: Con manejo de coma visual */}
                    <div className="w-32">
                        <input 
                            type="text" 
                            inputMode="decimal"
                            value={String(v.price || '').replace('.', ',')} 
                            onChange={(e) => {
                                // Permitimos números y una sola coma
                                let val = e.target.value.replace('.', ',');
                                val = val.replace(/[^0-9,]/g, '');
                                const parts = val.split(',');
                                if (parts.length > 2) return;
                                onVariantChange(index, 'price', val);
                            }}
                            className="w-full p-2 bg-white rounded-lg border-none text-right text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>

                    {/* Stock: Cantidad de bolsas disponibles */}
                    <div className="w-24 text-center">
                        <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => onVariantChange(index, 'stock', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border-none text-center font-bold focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>

                    {/* Visor de Imagen: Para gestionar Cloudinary */}
                    <div className="w-16 flex justify-center">
                        <button 
                            type="button"
                            onClick={() => onImageClick(index)}
                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}