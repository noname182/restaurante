import React from 'react';
import { Link } from '@inertiajs/react';

export default function MobileNav({ isOpen, links, setMobileMenuOpen }) {

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[10000] transition-all duration-300 ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* PARED VERDE CON ANIMACIÓN */}
      <div
        className={`
          fixed top-0 right-0 h-dvh w-[85%] max-w-[360px]
          bg-[#008542] shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Botón X */}
        <div className="flex justify-end p-6">
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="p-1 text-white"
          >
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {links && links.length > 0 ? (
            links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-10 py-7 text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 hover:bg-[#006b35] transition"
              >
                {link.label}
              </Link>
            ))
          ) : (
            <>
              <Link href="/" className="w-full px-10 py-7 text-white text-lg font-bold uppercase border-b border-white/10">INICIO</Link>
              <Link href="/productos" className="w-full px-10 py-7 text-white text-lg font-bold uppercase border-b border-white/10">PRODUCTOS</Link>
              <Link href="/personalizado" className="w-full px-10 py-7 text-white text-lg font-bold uppercase border-b border-white/10">COMIDA PERSONALIZADA</Link>
              <Link href="/contacto" className="w-full px-10 py-7 text-white text-lg font-bold uppercase border-b border-white/10">CONTACTO</Link>
            </>
          )}
        </div>

        <div className="p-12 flex justify-center opacity-20">
          <div className="h-1.5 w-16 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}