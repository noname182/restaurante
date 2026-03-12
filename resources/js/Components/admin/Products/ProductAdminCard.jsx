import { router } from "@inertiajs/react";
import { useState } from "react";
import { Edit, Trash2, ChevronDown, Package, Layers} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddVariantRow from './AddVariantRow';
import DeleteProductModal from './DeleteProductModal';
import DeleteVariantModal from './DeleteVariantModal';

export default function ProductAdminCard({ product, onEdit, onDelete }) {
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDelVariantModalOpen, setIsDelVariantModalOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);


    const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

    // Función que ejecuta la eliminación física en MariaDB
    const handleConfirmVariantDelete = (options = {}) => {
        if (variantToDelete) {
            router.delete(route('admin.variants.destroy', variantToDelete.id), {
                ...options, 
                preserveScroll: true,
                onSuccess: () => {
                    setIsDelVariantModalOpen(false);
                    setVariantToDelete(null);
                },
                onError: () => {
                    alert("Hubo un error al eliminar la variante");
                }
            });
        }
    };
    const handleConfirmProductDelete = (options = {}) => {
        if (productToDelete) {
            router.delete(route('admin.products.destroy', productToDelete.id), {
                ...options, 
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                }
            });
        }
    };
    return (
        <div className="bg-white rounded-[32px] border border-gray-400 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col">
            <div className="p-6 flex-1"> {/* flex-1 para empujar el panel hacia abajo si es necesario */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-h-[110px]"> 
                        <h3 className="text-xl font-bold text-black transition-colors line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                        {product.description ? (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2 font-medium italic leading-relaxed">
                                {product.description}
                            </p>
                        ) : (
                            // Espaciador invisible para mantener la altura si no hay descripción
                            <div className="mt-2 text-sm text-gray-500 italic">Sin descripción</div>
                        )}
                    </div>

                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all shrink-0">
                        <button 
                            onClick={() => onEdit(product)} 
                            className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-300 rounded-xl transition-all active:scale-95"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            onClick={() => {
                                setProductToDelete(product); 
                                setIsDeleteModalOpen(true);
                            }} 
                            className="p-2.5 text-gray-500 hover:text-red-900 hover:bg-gray-300 rounded-xl transition-all active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-[#804000]">
                            <Layers size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Variantes</p>
                            <p className="text-sm font-bold text-gray-800">{product.variants?.length || 0} Presentaciones</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        
                        <div className={`p-2 rounded-lg ${totalStock > 0 ? 'bg-gray-100 text-[#804000]' : 'bg-red-50 text-red-500'}`}>
                            
                            <Package size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Stock Total</p>
                            <p className="text-sm font-bold text-gray-800">{totalStock} Bolsas</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                    {isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown size={14} />
                    </motion.div>
                </button>
            </div>

            
            {/* Panel de Variantes */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        layout 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50/50 border-t border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-4"> {/* Aumentamos el espaciado vertical */}
                            
                            {/* Lista de Pesos y Precios */}
                            <div className="space-y-2">
                                {product.variants?.map((variant) => (
                                    <div key={variant.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">
                                                    {variant.weight >= 1000 ? `${variant.weight / 1000}kg` : `${variant.weight}g`}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-mono">{variant.sku}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-black">
                                                    BOB {parseFloat(variant.price).toFixed(2).replace('.', ',')}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-700">
                                                    {variant.stock} bolsas {/* Aquí se mostrará el stock real */}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => { setVariantToDelete(variant); setIsDelVariantModalOpen(true); }}
                                                className="p-2 text-gray-500 hover:text-red-900 hover:bg-gray-300 rounded-lg"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SECCIÓN DE BENEFICIOS (NUEVO UBICACIÓN) */}
                            <div className="bg-indigo-200 rounded-2xl p-4 border border-indigo-100">
                                <p className="text-[10px] uppercase font-black text-blue mb-3 ml-1 tracking-wider">
                                    Beneficios Nutricionales
                                </p>
                                {product.benefits && product.benefits.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {product.benefits.map((b, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-white text-[11px] font-bold text-gray-600 rounded-xl shadow-sm border border-indigo-50 flex items-center gap-2">
                                            
                                                {b.benefit}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[12px] text-gray-700 italic ml-1">Ningún beneficio registrado</p>
                                )}
                            </div>

                            {/* 3. Botón para agregar variante */}
                            <button 
                                onClick={() => setIsVariantModalOpen(true)}
                                className="w-full py-3 border-2 border-indigo-300 rounded-2xl text-indigo-700 font-bold text-xs hover:bg-indigo-100 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                            >
                                + Nueva Presentación
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modales */}
            <AddVariantRow 
                isOpen={isVariantModalOpen} 
                onClose={() => setIsVariantModalOpen(false)} 
                product={product} 
            />

            <DeleteProductModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmProductDelete}
                productName={product.name}
            />

            <DeleteVariantModal 
                isOpen={isDelVariantModalOpen}
                onClose={() => setIsDelVariantModalOpen(false)}
                onConfirm={handleConfirmVariantDelete}
                variantWeight={variantToDelete?.weight}
            />
        </div>
    );
}