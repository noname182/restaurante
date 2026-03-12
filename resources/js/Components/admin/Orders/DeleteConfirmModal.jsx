import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, isDeleting }) { 
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Bloqueamos el clic fuera si está eliminando */}
                    <div 
                        onClick={!isDeleting ? onClose : null} 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <div className="relative bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-sm text-center">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className={`text-red-500 ${isDeleting ? 'animate-pulse' : ''}`} size={32} />
                        </div>

                        <h3 className="text-xl font-black text-gray-800 mb-2">
                            {isDeleting ? 'Eliminando...' : 'Eliminar pedido?'}
                        </h3>
                        
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Esta acción es permanente para: <strong>{title}</strong>, estas seguro de eliminar esa orden?
                        </p>

                        <div className="flex flex-col gap-3">
                            {/* 2. Aplicamos el bloqueo físico y visual al botón */}
                            <button 
                                onClick={onConfirm}
                                disabled={isDeleting} 
                                className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    isDeleting 
                                    ? 'bg-red-300 cursor-not-allowed opacity-80' 
                                    : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                                }`}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Procesando...
                                    </>
                                ) : 'Sí, eliminar ahora'}
                            </button>
                            
                            {/* Ocultamos el cancelar mientras procesa */}
                            {!isDeleting && (
                                <button onClick={onClose} className="w-full py-2 text-gray-400 font-semibold text-sm hover:text-gray-600">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}