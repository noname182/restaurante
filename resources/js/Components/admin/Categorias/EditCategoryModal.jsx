// resources/js/Components/admin/Categorias/EditCategoryModal.jsx
import { useForm } from "@inertiajs/react"; 
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Upload } from "lucide-react";
import { useRef, useEffect } from "react";

export default function EditCategoryModal({ isOpen, onClose, category }) {
    // 1. IMPORTANTE: Si no hay categoría, no renderizamos nada para evitar la pantalla blanca
    if (!isOpen || !category) return null;

    const fileInput = useRef();

    // 2. CORRECCIÓN VITAL: Agregamos 'errors' y 'processing' a la desestructuración
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: category?.name || "",
        description: category?.description || "",
        image_url: category?.image || "",
        image_file: null,
    });

    // Sincronizamos los datos cuando el modal recibe una categoría nueva
    useEffect(() => {
        if (category) {
            setData({
                _method: 'put',
                name: category.name || "",
                description: category.description || "",
                image_url: category.image || "",
                image_file: null,
            });
        }
    }, [category]);

    const handleUpdate = (e) => {
        e.preventDefault();
        
        // Usamos post() aunque sea una actualización, porque llevamos un archivo
        post(route('categories.update', category.id), {
            forceFormData: true, 
            onSuccess: () => onClose(),
            preserveScroll: true
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
                    className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 p-10 border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-black uppercase italic tracking-tighter">Editar Categoría</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase ml-1">Nombre</label>
                            <input 
                                type="text" value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" 
                            />
                            {/* Ahora 'errors' ya no dará error de "not defined" */}
                            {errors.name && <div className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase ml-1">Descripción</label>
                            <textarea 
                                rows="3" value={data.description} 
                                onChange={(e) => setData('description', e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase ml-1">Imagen</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" value={data.image_url} 
                                    onChange={(e) => setData('image_url', e.target.value)} 
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium text-gray-700 outline-none shadow-inner" 
                                />
                                <button type="button" onClick={() => fileInput.current.click()} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all active:scale-90">
                                    <Upload size={20} />
                                </button>
                                <input type="file" ref={fileInput} hidden accept="image/*" onChange={(e) => setData('image_file', e.target.files[0])} />
                            </div>

                            <div className="w-full h-32 mt-2 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center">
                                {data.image_file ? (
                                    <img src={URL.createObjectURL(data.image_file)} className="w-full h-full object-cover" />
                                ) : data.image_url ? (
                                    <img src={data.image_url} className="w-full h-full object-cover" />
                                ) : ( <ImageIcon size={40} className="opacity-20" /> )}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase hover:bg-gray-200 transition-all">Cancelar</button>
                            <button type="submit" disabled={processing} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                                {processing ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}