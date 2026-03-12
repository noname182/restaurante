import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteProductModal({ isOpen, onClose, onConfirm, productName }) {
    const [isDeleting, setIsDeleting] = useState(false);

    // Limpiamos el estado al abrir/cerrar
    useEffect(() => {
        if (!isOpen) setIsDeleting(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        
        onConfirm({
            onFinish: () => setIsDeleting(false)
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={!isDeleting ? onClose : null}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">¿Eliminar producto?</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Estás a punto de borrar <span className="font-bold text-slate-900">"{productName}"</span>. 
                            Esta acción eliminará de forma permanente el producto y todas sus presentaciones.
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={onClose} 
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className={`flex-1 py-3 px-4 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 
                                    ${isDeleting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'}`}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} /> Eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}