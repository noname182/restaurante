import React from 'react';

export default function OrderTabs({ currentView, setView, handleTypeChange }) {
    const onTabClick = (type) => {
        setView(type); // Cambio visual rápido
        handleTypeChange(type); // Petición al servidor
    };

    return (
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button 
                onClick={() => onTabClick('compra')}
                className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${currentView === 'compra' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Compras Directas
            </button>
            <button 
                onClick={() => onTabClick('personalizado')}
                className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${currentView === 'personalizado' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Personalizados
            </button>
        </div>
    );
}