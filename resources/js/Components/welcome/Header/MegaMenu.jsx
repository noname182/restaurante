import { Link, router } from '@inertiajs/react'; // Añadimos router aquí

export default function MegaMenu({ parentCategory, subCategories, type = 'categories' }) {
  if (!parentCategory || !subCategories || subCategories.length === 0) return null;

  const isOtros = parentCategory.slug === 'otros';
  const isNuevos = type === 'products';

  // --- FUNCIÓN DE BÚSQUEDA AUTOMÁTICA ---
  const handleMenuSearch = (e, searchTerm) => {
    e.preventDefault();
    e.stopPropagation();
    // Usamos tu ruta funcional /buscar
    router.get('/buscar', { search: searchTerm }); 
  };

  return (
    <div className={`absolute top-full left-0 bg-white shadow-2xl border border-gray-100 rounded-b-2xl p-6 z-[100] flex flex-col animate-fade-in-down ${isOtros ? 'w-[450px]' : 'w-[600px]'}`}>
      
      <div className="flex gap-6">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            {isNuevos ? 'Últimos Lanzamientos' : (isOtros ? 'Explorar categorías' : `Sub-Categorías de ${parentCategory.name}`)}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {subCategories.map((item) => (
              /* CAMBIO: Usamos un botón para las categorías para disparar la búsqueda */
              <button 
                key={item.id} 
                onClick={(e) => isNuevos ? null : handleMenuSearch(e, item.name)}
                className="group flex items-center gap-3 text-left w-full"
              >
                {/* Si es producto nuevo, mantenemos el Link original o lo ajustamos si es necesario */}
                {isNuevos ? (
                   <Link href={`/producto/${item.slug}`} className="flex items-center gap-3">
                      {item.image_url && (
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                      <div>
                        <span className="block text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{item.name}</span>
                        <span className="block text-[11px] text-gray-400 leading-none">{item.price} BOB</span>
                      </div>
                   </Link>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <span className="block text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-gray-400 leading-none">
                        {item.description}
                      </span>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Lateral: Botón "Ver todo" arreglado */}
        {!isOtros && !isNuevos && (
          <div className="w-1/3 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
            <img 
              src={parentCategory.image || 'https://via.placeholder.com/150'} 
              alt={parentCategory.name} 
              className="h-32 object-contain mb-3"
            />
            <button 
              onClick={(e) => handleMenuSearch(e, parentCategory.name)} // Busca el nombre del padre
              className="text-xs font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors text-center"
            >
              Ver todo {parentCategory.name}
            </button>
          </div>
        )}
      </div>

      {/* Botón inferior para Otros categorías */}
      {isOtros && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <button 
            onClick={(e) => handleMenuSearch(e, "Licores")} // Búsqueda general para "otros"
            className="text-xs font-bold bg-gray-100 text-gray-800 px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all"
          >
            Ver demás categorías
          </button>
        </div>
      )}
    </div>
  );
}