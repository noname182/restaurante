import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '@/Components/welcome/Header/Header';
import Footer from '@/Components/welcome/Footer';
import { CartProvider } from '@/Contexts/CartContext';

export default function Layout({ title, children }) {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        // Bloqueo total al empezar cualquier petición
        const start = router.on('start', () => {
            setIsBlocked(true);
            document.body.style.overflow = 'hidden'; // Evita incluso el scroll
        });

        // Liberación total al terminar
        const finish = router.on('finish', () => {
            setIsBlocked(false);
            document.body.style.overflow = 'unset';
        });

        return () => { start(); finish(); };
    }, []);

    return (
        <CartProvider>
            <Head title={title} />

            <div className="min-h-screen flex flex-col bg-white text-darkGray relative">
                
                {/* --- EL ESCUDO ANTI-CLIC --- */}
                {isBlocked && (
                    <div 
                        className="fixed inset-0 z-[10000] cursor-wait bg-black/5" 
                        style={{ 
                            pointerEvents: 'all', 
                            touchAction: 'none'   
                        }} 
                    />
                )}

                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </CartProvider>
    );
}