import React from "react";
import { Dog } from 'lucide-react';

export default function Step1BasicInfo({ data, setData, nextStep, errors }) {
    
    const isStep1Valid = () => {
        const isEmailValid = !data.email || (data.email.trim() !== '' && data.email.includes('@'));
        return (
            data.tutor_name?.trim().length > 2 &&
            data.whatsapp_number?.trim().length >= 8 &&
            data.pet_name?.trim() !== '' &&
            data.pet_age_value !== '' && 
            data.pet_age_value > 0 &&
            data.pet_weight_value !== '' && 
            data.pet_weight_value > 0 &&
            data.pet_size !== '' &&
            isEmailValid
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight text-left">PASO 1 – Información básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* --- SECCIÓN TUTOR --- */}
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">Nombre del Tutor</label>
                    <input type="text" placeholder="Ej: Juan Pérez Ramirez" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('tutor_name', e.target.value)} value={data.tutor_name} />
                    {errors.tutor_name && <p className="text-red-500 text-xs ml-2">{errors.tutor_name}</p>}
                </div>
                    
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">Número de WhatsApp (min 8 numeros)</label>
                    <input type="text" placeholder="Ej: 77000000"  
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('whatsapp_number', e.target.value)} value={data.whatsapp_number} />
                    {errors.whatsapp_number && <p className="text-red-500 text-xs ml-2">{errors.whatsapp_number}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">Correo Electrónico (opcional)</label>
                    <input type="email" placeholder="ejemplo@correo.com" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('email', e.target.value)} value={data.email} />
                    {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email}</p>}
                </div>

                {/* --- SECCIÓN MASCOTA --- */}
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">Nombre de la Mascota</label>
                    <input type="text" placeholder="Ej: Bobby" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('pet_name', e.target.value)} value={data.pet_name} />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">
                        Edad de la Mascota
                    </label>
                    
                    <div className="flex gap-2">
                        {/* Input Numérico */}
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Ej: 3" 
                            className="w-1/3 rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all font-bold"
                            onChange={e => setData('pet_age_value', e.target.value)} 
                            value={data.pet_age_value || ''} 
                        />
                        
                        {/* ComboBox de Unidad */}
                        <select 
                            className="flex-1 rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all uppercase font-black text-xs tracking-widest cursor-pointer"
                            onChange={e => setData('pet_age_unit', e.target.value)}
                            value={data.pet_age_unit || 'años'}
                        >
                            <option value="años">Año(s)</option>
                            <option value="meses">Mes(es)</option>
                        </select>
                    </div>
                    
                    {/* Error de validación (si existiera) */}
                    {errors.pet_age && <p className="text-red-500 text-xs ml-2">{errors.pet_age}</p>}
                </div>
                    
                <div className="space-y-2">
                    <label className="text-[14px] font-black uppercase text-gray-700 ml-2">
                        Peso Actual de la Mascota
                    </label>
                    
                    <div className="flex gap-2">
                        {/* Input para el Peso (Permite decimales como 12.5) */}
                        <input 
                            type="number" 
                            step="0.1" // Permite incrementos decimales
                            min="0.1"
                            placeholder="Ej: 12.5" 
                            className="w-1/2 rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all font-bold"
                            onChange={e => setData('pet_weight_value', e.target.value)} 
                            value={data.pet_weight_value || ''} 
                        />
                        
                        {/* ComboBox de Unidad de Peso */}
                        <select 
                            className="flex-1 rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all uppercase font-black text-xs tracking-widest cursor-pointer"
                            onChange={e => setData('pet_weight_unit', e.target.value)}
                            value={data.pet_weight_unit || 'kg'}
                        >
                            <option value="kg">Kilogramos (kg)</option>
                            <option value="g">Gramos (g)</option>
                        </select>
                    </div>
                    
                    {/* Error de validación de Laravel */}
                    {errors.pet_weight && <p className="text-red-500 text-xs ml-2">{errors.pet_weight}</p>}
                </div>
            </div>

            {/* --- COMPORTAMIENTO --- */}
            <div className="space-y-2 text-left"> 
                <label className="text-[14px] font-bold text-gray-700 ml-1">COMPORTAMIENTO Y ACTIVIDAD HABITUAL (OPCIONAL)</label>
                <textarea 
                    placeholder="Cuéntanos cómo es su día a día (ej: paseos diarios, nivel de energía, duerme mucho, etc)"
                    className="w-full rounded-2xl border-gray-100 bg-gray-100 focus:ring-[#008542] h-32 p-4"
                    onChange={e => setData('activity_level', e.target.value)}
                    value={data.activity_level}
                />
            </div>

            {/* --- TAMAÑO --- */}
            <div className="space-y-4 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Categoría de tamaño</label>
                <div className="grid grid-cols-3 gap-5">
                    {[
                        { label: 'Pequeño', val: 'pequeño', size: 20 },
                        { label: 'Mediano', val: 'mediano', size: 28 },
                        { label: 'Grande', val: 'grande', size: 36 }
                    ].map((item) => (
                        <button key={item.val} type="button" onClick={() => setData('pet_size', item.val)}
                            className={`py-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all group ${
                                data.pet_size === item.val ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            <Dog size={item.size} strokeWidth={data.pet_size === item.val ? 2.5 : 1.5} />
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button type="button" onClick={nextStep} disabled={!isStep1Valid()}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    isStep1Valid() ? 'bg-[#008542] text-white hover:bg-[#006d35]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Continuar al Paso 2
            </button>
            <p className="text-[13px] text-gray-400 mt-4 text-center italic">
                * Por favor, completa todos los campos necesarios para avanzar en tu plan personalizado de Holli.
            </p>
        </div>
    );
}