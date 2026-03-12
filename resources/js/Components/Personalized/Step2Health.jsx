import React from "react";
import { Activity, Droplets, ShieldAlert, Soup, Scale } from 'lucide-react';

export default function Step2HealthConditions({ data, setData, nextStep, prevStep }) {
    
    const conditions = [
        { id: 'diabetes', label: 'Diabetes', icon: Activity },
        { id: 'renal', label: 'Problemas Renales', icon: Droplets },
        { id: 'alergia', label: 'Alergias', icon: ShieldAlert },
        { id: 'digestivo', label: 'Sensibilidad Digestiva', icon: Soup },
        { id: 'sobrepeso', label: 'Sobrepeso', icon: Scale },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight text-left">PASO 2 – Condiciones de salud</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {conditions.map((item) => {
                    const Icon = item.icon;
                    const isSelected = data.health_conditions.includes(item.id);
                    return (
                        <button key={item.id} type="button"
                            onClick={() => {
                                const newValue = isSelected 
                                    ? data.health_conditions.filter(i => i !== item.id) 
                                    : [...data.health_conditions, item.id];
                                setData('health_conditions', newValue);
                            }}
                            className={`py-6 flex flex-col items-center gap-3 rounded-3xl border-2 transition-all ${
                                isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                            }`}
                        >
                            <Icon size={28} />
                            <span className="font-bold text-xs uppercase tracking-wider text-center px-2">{item.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">¿Alguna otra condición?</label>
                <textarea placeholder="Describe brevemente detalles médicos..."
                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] h-24 p-4"
                    onChange={e => setData('other_health_details', e.target.value)}
                    value={data.other_health_details}
                />
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