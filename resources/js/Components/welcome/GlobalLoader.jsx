import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Se activa al hacer clic en un link o botón de navegación
        const start = router.on('start', () => setLoading(true));
        
        // Se desactiva cuando la nueva página termina de cargar
        const finish = router.on('finish', () => setLoading(false));

        return () => {
            start();
            finish();
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/20 backdrop-blur-[1px] cursor-wait">
            {/* Opcional: Un pequeño spinner café para que el usuario sepa que está cargando */}
            <div className="animate-spin h-10 w-10 border-4 border-[#6F4E37] border-t-transparent rounded-full" />
        </div>
    );
}