import React, { useState, useEffect } from "react";
import { FileUp, FileText, Beef, Wheat, Droplet, X, Eye } from 'lucide-react';

export default function Step3Veterinary({ data, setData, nextStep, prevStep }) {
    useEffect(() => {
        // Si hay un archivo y es imagen, creamos la URL. 
        // React se encargará de limpiar el objeto cuando el componente cambie.
        return () => {
            if (data.diet_file && data.diet_file instanceof File) {
                // Esto es opcional pero recomendado en aplicaciones de alto rendimiento
            }
        };
    }, [data.diet_file]);
    

    const restrictionsList = [
        { id: 'bajo_proteina', label: 'Bajo en Proteína', icon: Beef },
        { id: 'bajo_grasa', label: 'Bajo en Grasa', icon: Droplet },
        { id: 'bajo_carbo', label: 'Bajo en Carbohidratos', icon: Wheat },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-left">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 3 – Indicaciones veterinarias</h2>
                <p className="text-gray-500 text-sm">Adjunta la receta y define restricciones específicas.</p>
            </div>

            {/* Carga de Archivo */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Subir dieta recomendada (PDF o Imagen)</label>
                
                <div className={`border-2 border-dashed rounded-[32px] p-8 transition-all flex flex-col items-center justify-center gap-4 min-h-[250px] ${
                    data.diet_file ? 'border-[#008542] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-[#008542]/50'
                }`}>
                    <input 
                        type="file" 
                        id="diet_file" 
                        className="hidden" 
                        accept=".pdf,image/*"
                        onChange={(e) => setData('diet_file', e.target.files[0])} 
                    />

                    {data.diet_file ? (
                        <div className="relative w-full flex flex-col items-center gap-4">
                            {/* Botón para eliminar/cambiar archivo */}
                            <button 
                                onClick={() => setData('diet_file', null)}
                                className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                            >
                                <X size={16} />
                            </button>

                            {/* LÓGICA DE PREVISUALIZACIÓN */}
                            {data.diet_file.type.startsWith('image/') ? (
                                <div className="relative group">
                                    <img 
                                        src={URL.createObjectURL(data.diet_file)} 
                                        alt="Vista previa" 
                                        className="max-h-40 rounded-2xl shadow-md border-4 border-white object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                        <Eye className="text-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <FileText size={64} className="text-[#008542]" />
                                    <span className="bg-white px-4 py-1 rounded-full text-[10px] font-black uppercase text-[#008542] shadow-sm border border-green-100">
                                        Archivo PDF listo
                                    </span>
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]">
                                    {data.diet_file.name}
                                </p>
                                <p className="text-[10px] text-gray-400 uppercase">
                                    {(data.diet_file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="diet_file" className="cursor-pointer flex flex-col items-center gap-4 text-center w-full">
                            <div className="bg-white p-6 rounded-full shadow-sm text-gray-400 group-hover:text-[#008542] transition-colors">
                                <FileUp size={40} />
                            </div>
                            <div className="space-y-1">
                                <span className="block text-sm font-bold text-gray-600">Haz clic para subir la dieta</span>
                                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">PDF, PNG o JPG (Máx. 10MB)</span>
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {/* Restricciones rápidas */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">Restricciones nutricionales</label>
                <div className="grid grid-cols-3 gap-4">
                    {restrictionsList.map((item) => {
                        const Icon = item.icon;
                        const isSelected = data.restrictions.includes(item.id);
                        return (
                            <button key={item.id} type="button"
                                onClick={() => {
                                    const newValue = isSelected 
                                        ? data.restrictions.filter(i => i !== item.id) 
                                        : [...data.restrictions, item.id];
                                    setData('restrictions', newValue);
                                }}
                                className={`py-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all ${
                                    isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                                }`}
                            >
                                <Icon size={24} />
                                <span className="font-bold text-[10px] uppercase text-center px-1 tracking-tighter">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Requerimientos o restricciones de ingredientes</label>
                <textarea placeholder="Ej: No puede comer pollo, evitar el arroz..."
                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] h-32 p-4 transition-all"
                    onChange={e => setData('specific_requirements', e.target.value)} value={data.specific_requirements} />
            </div>

            <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-400 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-200 transition-all">Atrás</button>
                <button type="button" onClick={nextStep} className="w-2/3 bg-[#008542] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#006d35] transition-all">
                    Continuar
                </button>
            </div>
        </div>
    );
}