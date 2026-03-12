// resources/js/Components/admin/Categorias/AddCategoryModal.jsx
import { useForm } from '@inertiajs/react';
import { X, Upload } from 'lucide-react';

export default function AddCategoryModal({ isOpen, onClose, categories = [] }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        parent_id: null,
        image_url: '',
        image_file: null, // Para la subida a Cloudinary
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'), {
            forceFormData: true, // Obligatorio para enviar archivos
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Nueva Categoría</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Campo categoria padre */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                Categoría Superior (Opcional)
                            </label>
                            <select 
                                value={data.parent_id || ''} 
                                onChange={e => setData('parent_id', e.target.value || null)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="">Ninguna</option>
                                {/* Solo mostramos las categorías que no tienen padre para evitar niveles infinitos */}
                                {categories.filter(c => c.parent_id === null).map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre</label>
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                required
                            />
                        </div>

                        {/* Campo Descripción */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Descripción</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 min-h-[50px]"
                            />
                        </div>
                        
                        {/* Campo Imagen (Archivo) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">URL de la Imagen (Opcional)</label>
                            <input 
                                type="text" 
                                value={data.image_url}
                                onChange={e => setData('image_url', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 mb-3"
                            />
                            
                            {/* Separador visual */}
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="px-3 text-xs font-bold text-gray-400 uppercase">O sube un archivo</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    onChange={e => setData('image_file', e.target.files[0])}
                                    className="hidden" 
                                    id="add-category-image"
                                    accept="image/*"
                                />
                                <label 
                                    htmlFor="add-category-image"
                                    className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer group-hover:bg-indigo-100 transition-all"
                                >
                                    <Upload size={20} className="text-indigo-500" />
                                    <span className="text-indigo-600 font-semibold">
                                        {data.image_file ? data.image_file.name : 'Seleccionar imagen'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Crear Categoría'}
                            </button>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}