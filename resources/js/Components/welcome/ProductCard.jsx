import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ variant }) {
    const [isVisiting, setIsVisiting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    // 1. DEFINIR VARIABLES DE STOCK EN EL NIVEL SUPERIOR (Para que todos las vean)
    const stockActual = variant.stock || 0; 
    const stockMaximo = stockActual; // Alias para claridad
    const esBajoStock = stockActual > 0 && stockActual <= 5;

    // 2. FORMATEO DE NOMBRE E IMAGEN
    const getFormattedWeight = (grams) => {
        if (grams >= 1000) return `${(grams / 1000).toString().replace('.', ',')}kg`;
        return `${grams}g`;
    };
    const displayName = `${variant.baseName} ${getFormattedWeight(variant.weight)}`;
    const imageUrl = variant.image || "https://via.placeholder.com/600x800?text=Sin+Imagen";

    // 3. FUNCIONES DE ACCIÓN
    const handleSeeDetail = () => {
        if (isVisiting) return;
        setIsVisiting(true);
        router.visit(route('products.showDetailed', variant.id), {
            onFinish: () => setIsVisiting(false)
        });
    };

    const confirmAdd = () => {
        if (quantity > stockMaximo || stockMaximo === 0) return;

        const itemParaElCarrito = {
            id: variant.id,
            name: displayName,
            price: variant.price,
            image: imageUrl,
        };

        addToCart(itemParaElCarrito, quantity);
        
        // 💡 Tip: Cerrar el modal y quizás mostrar una notificación pequeña
        setIsModalOpen(false);
        setQuantity(1);
        
        // Opcional: Redirigir al carrito automáticamente si quieres evitar el paso extra
        // router.visit(route('cart.index')); 
    };

    return (
        <>
            {/* --- CARD PRINCIPAL --- */}
            <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col h-full border border-gray-100 text-left">
                <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
                    <img src={imageUrl} alt={displayName} className="w-full h-full object-contain" />
                </div>

                <h3 className="text-xs font-bold text-gray-800 leading-tight mb-2 h-8 overflow-hidden">
                    {displayName}
                </h3>

                <div className="mt-auto">
                    <div className="flex flex-col mb-3">
                        <span className="text-[#008542] font-black text-base">
                            {variant.price.toFixed(2)} BOB
                        </span>
                        {/* Indicador de stock en la card */}
                        {stockActual > 0 ? (
                            <span className={`text-[9px] font-bold uppercase mt-0.5 ${esBajoStock ? 'text-amber-500' : 'text-gray-400'}`}>
                                {esBajoStock ? 'ÚLTIMAS ' : ''}{stockActual} bolsas disponibles
                            </span>
                        ) : (
                            <span className="text-[9px] font-bold uppercase mt-0.5 text-red-500">Sin stock disponible</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <button onClick={handleSeeDetail} disabled={isVisiting} className="w-full border-2 border-[#008542] text-[#008542] text-[10px] py-2 rounded-lg font-bold uppercase hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50">
                            {isVisiting ? 'Cargando...' : 'Ver Detalle'}
                        </button>

                        <button 
                            onClick={() => stockActual > 0 && setIsModalOpen(true)}
                            disabled={isVisiting || stockActual <= 0}
                            className={`w-full text-[10px] py-2 rounded-lg font-bold uppercase transition-all ${
                                stockActual > 0 ? 'bg-[#008542] hover:bg-[#006d35] text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed opacity-70'
                            }`}
                        >
                            {stockActual > 0 ? 'Agregar' : 'Agotado'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL CENTRAL DE CANTIDAD --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-sm text-center">
                            <h3 className="text-xl font-black text-gray-800 mb-1 uppercase tracking-tighter">Añadir al carrito</h3>
                            <p className="text-gray-500 text-xs mb-6 italic">{displayName}</p>

                            {/* Selector con bloqueo de stock */}
                            <div className="flex items-center justify-center gap-8 mb-4">
                                <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-2xl text-[#008542] font-bold hover:bg-gray-50"> - </button>
                                <span className="text-4xl font-black text-gray-800 w-12">{quantity}</span>
                                <button 
                                    onClick={() => quantity < stockMaximo && setQuantity(q => q + 1)} // Uso correcto de stockMaximo
                                    disabled={quantity >= stockMaximo}
                                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                                        quantity >= stockMaximo ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-100 text-[#008542] hover:bg-gray-50'
                                    }`}
                                > + </button>
                            </div>

                            <div className="h-6 mb-4">
                                {quantity >= stockMaximo && (
                                    <p className="text-[10px] text-amber-600 font-bold uppercase animate-pulse">
                                        ⚠️ Has alcanzado el límite de stock disponible
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={confirmAdd} className="w-full bg-[#008542] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                                    Confirmar ({(variant.price * quantity).toFixed(2)} BOB)
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="w-full py-2 text-gray-400 font-semibold text-sm hover:text-gray-600">Cancelar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}