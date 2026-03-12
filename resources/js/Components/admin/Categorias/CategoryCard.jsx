// resources/js/Components/admin/Categorias/CategoryCard.jsx
import { motion, AnimatePresence } from "framer-motion";
import { PencilLine, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react"; // Agregamos ChevronUp e ImageIcon que faltaban

export default function CategoryCard({ cat, isExpanded, onToggle, onEdit, onDelete }) {
    return (
        <motion.div 
            layout
            className={`bg-white rounded-[2.5rem] border transition-all overflow-hidden ${
                isExpanded 
                ? 'ring-2 ring-indigo-500 border-transparent shadow-2xl shadow-indigo-100/50' 
                : 'border-gray-300 shadow-xl shadow-gray-400'
            }`}
        >
            {/* Cabecera */}
            <div className="p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3 ml-2">
                    <h3 className="text-sm font-black text-black uppercase tracking-widest">{cat.name}</h3>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(cat); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                        <PencilLine size={16} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                    </button>

                    <button 
                        onClick={() => onDelete(cat)} 
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <div onClick={onToggle} className="bg-gray-50 p-2.5 rounded-full hover:bg-indigo-50 cursor-pointer transition-colors">
                    {isExpanded ? <ChevronUp size={18} className="text-black"/> : <ChevronDown size={18} className="text-black"/>}
                </div>
            </div>

            {/* Contenido Expandible - Recuperando el diseño original */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="px-8 pb-8 space-y-6"
                    >
                        <div className="h-px bg-gray-100/50 mb-2" />

                        {/* Label y Campo de Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-black uppercase tracking-tight px-1">Nombre</label>
                            <div className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium text-gray-600 h-11 flex items-center shadow-inner">
                                {cat.name}
                            </div>
                        </div>

                        {/* Label y Campo de Descripción */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-black uppercase tracking-tight px-1">Descripción</label>
                            <div className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium text-gray-500 h-16 overflow-y-auto leading-tight shadow-inner">
                                {cat.description || "Sin descripción..."}
                            </div>
                        </div>

                        {/* Label e Imagen */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-black uppercase tracking-tight px-1">Imagen</label>
                            <div className="w-full h-32 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 overflow-hidden relative">
                                {cat.image ? (
                                    <img src={cat.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}