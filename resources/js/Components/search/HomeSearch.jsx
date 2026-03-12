import { router } from '@inertiajs/react';
import SearchBar from "./Search";

export default function HomeSearch() {
    const handleSearch = (query) => {
        // Por ahora solo probamos que capture el texto
        console.log("Navegando hacia resultados con:", query); // <-- Si ves esto, el problema es el Router o Laravel
        router.get('/buscar', { search: query });
    };

    return (
        <section className="relative w-full bg-white py-16 md:py-24 px-6 overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                {/* Texto Principal */}
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                    Cualquier botella,<br className="hidden md:block" /> 
                    en cualquier lugar.
                </h1>
                
                {/* Subtexto descriptivo */}
                <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Tu licorería de confianza con entrega inmediata hasta la puerta de tu casa.
                </p>

                {/* Contenedor del Buscador */}
                <div className="max-w-2xl mx-auto">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Decoración de fondo (opcional para que no se vea tan vacío) */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        </section>
    );
}