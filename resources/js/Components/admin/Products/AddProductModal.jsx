import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Save, Package, Tag, FileText, Plus, CheckCircle } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        benefits: [], 
    });
    const [loading, setLoading] = useState(false);
    
    const [currentBenefit, setCurrentBenefit] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Función para añadir el beneficio a la lista del formulario
    const addBenefit = () => {
        if (currentBenefit.trim()) {
            setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, currentBenefit.trim()]
            }));
            setCurrentBenefit(''); 
        }
    };

    // Función para remover un beneficio antes de guardar
    const removeBenefit = (index) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        if (!formData.name) {
            alert("El nombre del producto es obligatorio");
            return;
        }
        setLoading(true);
        router.post(route('admin.products.store'), formData, {
            onSuccess: () => {
                onClose();
                setFormData({ 
                    name: '',
                    description: '',
                    benefits: [],
                });
            },
            onFinish: () => setLoading(false),
            preserveScroll: true
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
                            <p className="text-sm text-gray-500">Registra la información base y beneficios</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Nombre del Producto */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre del Producto</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    value={formData.name}
                                    placeholder='digite un nombre para el producto'
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Descripción</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    placeholder='digite una descripcion para el producto'
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* SECCIÓN DE BENEFICIOS */}
                        <div className="bg-indigo-50/50 p-5 rounded-[24px] border border-indigo-100">
                            <label className="block text-sm font-bold text-indigo-900 mb-3 ml-1">Beneficios Nutricionales</label>
                            <div className="flex gap-2">
                                <input
                                    value={currentBenefit}
                                    onChange={(e) => setCurrentBenefit(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                    placeholder="Digite los beneficios que tiene el producto"
                                    className="flex-1 px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addBenefit}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Lista de beneficios agregados */}
                            <div className="mt-4 space-y-2">
                                {formData.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-indigo-50 shadow-sm animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                            <CheckCircle size={14} className="text-green-500" />
                                            {benefit}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(index)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} // Evita la interacción física mientras carga
                            className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 
                                ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            {loading ? (
                                <>
                                    {/* Un pequeño spinner para dar feedback profesional */}
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Crear Producto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}