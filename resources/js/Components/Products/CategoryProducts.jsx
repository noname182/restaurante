import React from "react";
import ProductCard from '@/Components/welcome/ProductCard'; // Usamos tu tarjeta estrella

export default function CategoryProducts({ category }) {
    if (!category) return null;

    // Función para renderizar la grilla de botellas
    const renderProductsGrid = (variants) => (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
            {variants.map((v) => (
                // Pasamos la variante a la ProductCard que ya conoce la DB de licores
                <ProductCard key={v.id} product={v} />
            ))}
        </div>
    );

    return (
        <div className="w-full pb-20 space-y-12">
            {/* Título de la Categoría Seleccionada */}
            <div className="bg-white py-10 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                        {category.name}
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl italic">
                        {category.description || "Selección exclusiva de nuestra bodega."}
                    </p>
                </div>
            </div>

            {/* Productos Directos de esta Categoría */}
            {category.products?.length > 0 ? (
                renderProductsGrid(category.products)
            ) : !category.children?.length && (
                <div className="text-center py-20">
                    <p className="text-gray-400 italic text-xl">No hay botellas disponibles en esta sección. 🍾</p>
                </div>
            )}

            {/* Subcategorías (Vino Tinto, Blanco, etc.) */}
            {category.children?.length > 0 && (
                <div className="space-y-20">
                    {category.children.map((sub) => (
                        <div key={sub.id} className="animate-fade-in">
                            <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">
                                    {sub.name}
                                </h2>
                                <div className="flex-grow h-[1px] bg-gray-200"></div>
                            </div>

                            {sub.products?.length > 0 ? (
                                renderProductsGrid(sub.products)
                            ) : (
                                <p className="text-center text-gray-400 italic">Próximamente más ingresos.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}