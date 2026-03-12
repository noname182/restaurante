import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DesktopNav from './DesktopNav'; 
import MobileNav from './MobileNav';
import { useCart } from "@/Contexts/CartContext"; 
import { ShoppingCart, Menu } from "lucide-react"; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { url, props } = usePage();
  const { cartCount } = useCart(); 

  const appConfig = props['app_config'] || {};
  const accountData = appConfig['account'] || null;
  const logoUrl = accountData ? accountData.logo_path : null;

  const NAV_LINKS = [
    { name: 'paginaInicio', href: route('paginaInicio'), label: 'Inicio' },
    { name: 'paginaProductos', href: route('paginaProductos'), label: 'Productos' },
    { name: 'paginaPersonalizada', href: route('paginaPersonalizada'), label: 'Comida personalizada' },
    { name: 'paginaContactos', href: route('paginaContactos'), label: 'Contacto' },
  ];

  // Dividimos los links para el efecto "abrazo" al logo
  const leftLinks = NAV_LINKS.slice(0, 2);
  const rightLinks = NAV_LINKS.slice(2, 4);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="w-full sticky top-0 z-50 shadow-sm bg-[#dec390]">
        {/* --- CONTENEDOR PRINCIPAL --- */}
        <div className="container mx-auto px-6 h-28 flex items-center justify-center relative">
          
          {/* 🛒 1. BLOQUE IZQUIERDO (550px) - Alineado a la DERECHA */}
          <div className="w-[550px] flex items-center justify-end gap-10">
            {/* Carrito al extremo izquierdo del bloque de 550px */}
            <Link href={route('cart.index')} className="relative p-2 text-gray-700 hover:text-[#008542]">
              <ShoppingCart size={28} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#008542] text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Links Izquierda pegados al logo */}
            <div className="hidden lg:block">
              <DesktopNav links={leftLinks} currentUrl={url} />
            </div>
          </div>

          {/* 🐶 2. BLOQUE CENTRAL (Logo fijo) */}
          <div className="flex-none z-50 px-6">
            <Link href="/" className="block transform transition-transform duration-300 hover:scale-110">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Holli" className="h-28 w-auto object-contain drop-shadow-lg" />
              ) : (
                <div className="h-16 w-16 bg-white border rounded-full" />
              )}
            </Link>
          </div>

          {/* 📞 3. BLOQUE DERECHO (550px) - Alineado a la IZQUIERDA */}
          <div className="w-[550px] flex items-center justify-start gap-10">
            {/* Links Derecha pegados al logo */}
            <div className="hidden lg:block">
              <DesktopNav links={rightLinks} currentUrl={url} />
            </div>

            {/* Botón Menú Móvil / Espaciador */}
            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-black">
                <Menu size={32} />
              </button>
            </div>
          </div>

        </div>
      </header>

      <MobileNav 
        isOpen={mobileMenuOpen}
        links={NAV_LINKS}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
}