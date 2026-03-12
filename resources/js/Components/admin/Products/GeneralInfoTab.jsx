import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

export default function GeneralInfoTab({ formData, onChange, onBenefitsChange }) {
    const [benefitInput, setBenefitInput] = useState('');

    const handleAddBenefit = () => {
        if (benefitInput.trim()) {
            // Enviamos la nueva lista al padre (ProductEditModal)
            onBenefitsChange([...(formData.benefits || []), benefitInput.trim()]);
            setBenefitInput('');
        }
    };

    const handleRemoveBenefit = (index) => {
        const filtered = formData.benefits.filter((_, i) => i !== index);
        onBenefitsChange(filtered);
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Nombre del Producto */}
            <div className="text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    Nombre del Producto
                </label>
                <input 
                    name="name" 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={onChange} 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" 
                />
            </div>

            {/* Descripción */}
            <div className="text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    Descripción del Producto
                </label>
                <textarea 
                    name="description" 
                    value={formData.description || ''} 
                    onChange={onChange} 
                    rows="4" 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium text-gray-900" 
                />
            </div>

            {/* NUEVA SECCIÓN: Beneficios Nutricionales */}
            <div className="text-left bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-100/50">
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase mb-4 ml-1">
                    <Sparkles size={14} /> Beneficios Nutricionales
                </label>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                        placeholder="Agregar un nuevo beneficio"
                        className="flex-1 p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
                    />
                    <button 
                        type="button"
                        onClick={handleAddBenefit}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Lista de burbujas (Tags) */}
                <div className="flex flex-wrap gap-2">
                    {formData.benefits?.map((benefit, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-indigo-50 shadow-sm animate-in zoom-in duration-200"
                        >
                            <span className="text-xs font-bold text-gray-600">{benefit}</span>
                            <button 
                                type="button"
                                onClick={() => handleRemoveBenefit(index)}
                                className="text-red-300 hover:text-red-500 p-0.5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {(!formData.benefits || formData.benefits.length === 0) && (
                        <p className="text-[11px] text-gray-400 italic ml-1">No hay beneficios agregados todavía.</p>
                    )}
                </div>
            </div>
        </div>
    );
}