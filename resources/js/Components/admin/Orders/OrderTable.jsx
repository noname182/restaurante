import React from 'react';

export default function OrderTable({ orders, view, updateStatus, openDetails }) {
    return (
        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-white overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Cliente</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Monto / Info</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Estado Actual</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Gestión</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders.data.map(order => (
                        <tr key={order.id} className="group hover:bg-green-50/30 transition-all border-b border-gray-50">
                            <td className="p-6">
                                <p className="text-[18px] font-black text-gray-800 leading-none uppercase tracking-tighter">
                                    {order.tutor_name}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1 font-bold">🆔 ID: #{order.id}</p>
                            </td>
                            <td className="p-6 font-black text-[#008542]">
                                <span className="flex items-center gap-2">
                                    🐾 <span className="uppercase tracking-widest text-xs">{order.pet_name}</span>
                                </span>
                            </td>
                            <td className="p-6">
                                <select 
                                    value={order.status} 
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    className="border-none rounded-full px-6 pr-10 py-2 text-[12px] font-black uppercase appearance-none bg-amber-100 text-amber-700 shadow-sm transition-all focus:ring-2 focus:ring-amber-300"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="procesando">Procesando</option>
                                    <option value="completado">Completado</option>
                                </select>
                            </td>
                            <td className="p-6 text-center">
                                <button 
                                    onClick={() => openDetails(order)} 
                                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#008542] transition-all shadow-md"
                                >
                                    Ver Expediente
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}