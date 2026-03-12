import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Info, Package } from 'lucide-react';
import GeneralInfoTab from './GeneralInfoTab';
import InventoryTab from './InventoryTab';
import ImageViewer from './ImageViewer';
import { router } from '@inertiajs/react';

export default function ProductEditModal({ isOpen, onClose, product }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('general');
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    // Estado inicial limpio según tu DB de productos
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        benefits: [],
        variants: []
    });

    useEffect(() => {
        if (product) {
            setFormData({ 
                id: product.id,
                name: product.name,
                description: product.description || '',
                benefits: product.benefits?.map(b => b.benefit) || [], 
                variants: product.variants || [] 
            });
        }
    }, [product]);

    const handleBenefitsChange = (newBenefits) => {
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target.result;
            const newVariants = [...formData.variants];
            newVariants[uploadingVariantIndex].preview = base64Image;
            newVariants[uploadingVariantIndex].newFile = file; 
            setFormData({ ...formData, variants: newVariants });
            setPreviewImage(base64Image); 
        };
        reader.readAsDataURL(file);
    };

    const handleClose = () => {
        if (product) {
            setFormData({ 
                id: product.id,
                name: product.name,
                description: product.description || '',
                benefits: product.benefits?.map(b => b.benefit) || [], 
                variants: product.variants || [] 
            });
        }
        onClose(); 
    };

    const handleSubmit = () => {
        if (loading) return;
        if (!formData.name?.trim()) return alert("El nombre es obligatorio");
        setLoading(true);
        const data = new FormData();
        data.append('_method', 'PUT'); 
        
        data.append('id', formData.id);
        data.append('name', formData.name);
        data.append('description', formData.description || '');

        formData.benefits.forEach((benefit, index) => {
            data.append(`benefits[${index}]`, benefit);
        });

        formData.variants.forEach((v, index) => {
            data.append(`variants[${index}][id]`, v.id);
            data.append(`variants[${index}][sku]`, v.sku);
            // Envío de precio con punto decimal
            data.append(`variants[${index}][price]`, String(v.price).replace(',', '.'));
            data.append(`variants[${index}][stock]`, v.stock);
            
            data.append(`variants[${index}][weight]`, v.weight || '');

            if (v.newFile) {
                data.append(`variants[${index}][newFile]`, v.newFile);
            }
        });

        router.post(route('admin.products.update', formData.id), data, {
            onSuccess: () => onClose(),
            onFinish: () => setLoading(false),
            forceFormData: true,
            preserveScroll: true
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    {/* Cambio de Título a Producto */}
                    <h2 className="text-2xl font-bold text-gray-900 text-left">Editar Producto</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="flex px-6 border-b border-gray-100 bg-gray-50/50">
                    <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Info size={18} /> Información General</button>
                    <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'inventory' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Package size={18} /> Inventario y Variantes</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'general' ? (
                        <GeneralInfoTab 
                            formData={formData} 
                            onChange={handleInputChange} 
                            onBenefitsChange={handleBenefitsChange} // <--- Nueva prop
                        />
                    ) : (
                        <InventoryTab 
                            variants={formData.variants} 
                            onVariantChange={handleVariantChange}
                            onImageClick={(index) => {
                                const v = formData.variants[index];
                              
                                const url = v.preview || (v.multimedia && v.multimedia.length > 0 ? v.multimedia[0].url : null);

                                setUploadingVariantIndex(index);
                                setPreviewImage(url);
                                setShowImageViewer(true);
                            }}
                        />
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button onClick={handleClose} className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">Cancelar</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading} // Bloqueo físico del botón
                        className={`px-8 py-3 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed opacity-80' 
                                : 'bg-gray-900 hover:bg-indigo-600 shadow-indigo-200'}`}
                    >
                        {loading ? (
                            <>
                                {/* Spinner para indicar que se están subiendo archivos o procesando datos */}
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            {showImageViewer && (
                <ImageViewer 
                    isOpen={showImageViewer} 
                    src={previewImage} 
                    onClose={() => setShowImageViewer(false)} 
                    onFileSelect={() => fileInputRef.current.click()} 
                />
            )}
        </div>
    );
}