// resources/js/Components/admin/Categorias/CategoryManager.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";
import EditCategoryModal from "./EditCategoryModal";
import AddCategoryModal from "./AddCategoryModal"; 
import DeleteCategoryModal from "./DeleteCategoryModal"; 

export default function CategoryManager({ categories = [] }) {
    const [expandedId, setExpandedId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    const [selectedForEdit, setSelectedForEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState(null);

    // 1. Manejo de Pestañas (Tabs)
    const [activeTab, setActiveTab] = useState('parents');

    // 2. Filtrado dinámico: Usamos esta lista para el Grid
    const filteredCategories = activeTab === 'parents' 
        ? categories.filter(cat => cat.parent_id === null) 
        : categories.filter(cat => cat.parent_id !== null);

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            {/* Barra de Acciones y Pestañas */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
                {/* Botón Agregar */}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                    <Plus size={18} /> Agregar Categoría
                </button>

                {/* Selector de Niveles (Tabs) */}
                <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('parents')}
                        className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                            activeTab === 'parents' 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Principales
                    </button>
                    <button 
                        onClick={() => setActiveTab('subs')}
                        className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                            activeTab === 'subs' 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Subcategorías
                    </button>
                </div>
            </div>

            {/* Grid de Cards: Ahora usa filteredCategories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {filteredCategories.map((cat) => (
                    <CategoryCard 
                        key={cat.id} 
                        cat={cat} 
                        isExpanded={expandedId === cat.id} 
                        onToggle={() => setExpandedId(expandedId === cat.id ? null : cat.id)} 
                        onEdit={(c) => { setSelectedForEdit(c); setIsEditModalOpen(true); }}
                        onDelete={(c) => { setSelectedForDelete(c); setIsDeleteModalOpen(true); }}
                    />
                ))}
            </div>

            {/* Modal de Edición */}
            <EditCategoryModal 
                key={selectedForEdit?.id || 'edit'} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                category={selectedForEdit} 
            />

            {/* Modal de Creación: Importante pasar 'categories' para el select */}
            <AddCategoryModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                categories={categories} 
            />

            {/* Modal de Eliminación */}
            <DeleteCategoryModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                category={selectedForDelete} 
            />
        </div>
    );
}