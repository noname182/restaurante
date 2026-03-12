import React from 'react';
import { X, Upload } from 'lucide-react';

export default function ImageViewer({ isOpen, src, onClose, onFileSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
            <div className="bg-white rounded-[40px] p-8 max-w-md w-full flex flex-col items-center shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Imagen de la Variante</h3>
                
                {/* Previsualización optimizada para productos de Holli */}
                <div className="w-64 h-64 bg-gray-50 rounded-[32px] overflow-hidden border-4 border-gray-100 mb-8 relative group">
                    <img 
                        src={src || 'https://via.placeholder.com/600x600?text=Sin+Imagen'} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt="Vista previa de variante"
                        onError={(e) => {
                            // Si la imagen falla, ponemos un color de fondo gris
                            e.target.src = "https://via.placeholder.com/600x600?text=Error+al+cargar";
                        }}
                    />
                    {/* Overlay sutil para indicar que es un visualizador */}
                    <div className="absolute inset-0 bg-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Acción de carga vinculada a Cloudinary */}
                <button 
                    onClick={onFileSelect}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                    <Upload size={20} /> Seleccionar nueva foto
                </button>

                <button 
                    onClick={onClose} 
                    className="mt-6 text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase text-xs tracking-widest"
                >
                    Cerrar Vista
                </button>
            </div>
        </div>
    );
}