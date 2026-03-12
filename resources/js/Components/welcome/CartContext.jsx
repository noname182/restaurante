import React from 'react';
import Layout from "@/Layouts/MainLayout";
import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
    // Usamos cartCount y total que son los nombres en tu Context
    const { cart, removeFromCart, updateQuantity, total, cartCount } = useCart();

    return (
        <Layout>
            <Head title="Tu Carrito" />
            
            <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Mi Carrito</h1>
                        <span className="bg-[#008542] text-white px-4 py-1 rounded-full text-sm font-bold">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {/* Corrección de la lógica condicional de React */}
                    {cart.length === 0 ? (
                        /* ESTADO VACÍO */
                        <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100 px-6">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-gray-300" size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">
                                Parece que aún no has añadido nada. ¡Explora nuestros productos naturales!
                            </p>
                            {/* Corrección: Usamos Link de Inertia en lugar de etiquetas Blade */}
                            <Link 
                                href={route('paginaProductos')} 
                                className="inline-flex items-center gap-2 bg-[#008542] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006d35] transition-all"
                            >
                                <ArrowLeft size={18} />
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        /* LISTA DE PRODUCTOS */
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="bg-white p-5 rounded-[32px] shadow-sm flex items-center gap-4 sm:gap-6 border border-gray-50 hover:border-green-100 transition-colors"
                                    >
                                        {/* Imagen */}
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                                            <p className="text-[#008542] font-black text-sm">{item.price.toFixed(2)} BOB</p>
                                        </div>

                                        {/* Contador - 1 + */}
                                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#008542] shadow-sm hover:bg-red-50 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold text-gray-800 w-4 text-center text-sm">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#008542] shadow-sm hover:bg-green-50 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Eliminar */}
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* RESUMEN Y PAGO */}
                            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-[#008542]/5 mt-10">
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>{total.toFixed(2)} BOB</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Envío</span>
                                        <span className="italic font-medium text-[#008542]">A coordinar</span>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-black text-lg">Total</span>
                                       
                                        <span className="text-3xl font-black text-[#008542]">{total.toFixed(2)} BOB</span>
                                    </div>
                                </div>

                                <button 
                                    className="w-full bg-[#008542] text-white py-5 rounded-[25px] font-black text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    FINALIZAR PEDIDO
                                </button>
                                
                                <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold">
                                    Pago contra entrega o transferencia
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}