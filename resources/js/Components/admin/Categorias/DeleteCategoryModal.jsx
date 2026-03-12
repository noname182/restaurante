// resources/js/Components/admin/Categorias/DeleteCategoryModal.jsx
import { useForm } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteCategoryModal({ isOpen, onClose, category }) {
    if (!isOpen || !category) return null;

    const { delete: destroy, processing } = useForm();

    const handleDelete = (e) => {
        e.preventDefault();
        // Usamos el método delete de Inertia hacia la ruta destroy
        destroy(route('categories.destroy', category.id), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-red-50">
                <div className="p-8">
                    {/* Encabezado de Alerta */}
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-50 rounded-full text-red-500">
                            <AlertTriangle size={40} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Eliminar categoría?</h2>
                        <p className="text-gray-500">
                            Estás a punto de eliminar <span className="font-bold text-gray-800">"{category.name}"</span>. 
                            Esta acción no se puede deshacer y borrará la imagen de Cloudinary.
                        </p>
                    </div>

                    <form onSubmit={handleDelete} className="space-y-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-200"
                        >
                            {processing ? 'Eliminando...' : 'Sí, eliminar definitivamente'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            No, mantener categoría
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}