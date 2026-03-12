import { Link } from '@inertiajs/react';

export default function DesktopNav({ links }) {
  return (
    <nav className="flex items-stretch h-16 bg-[#dec390]">
      {links.map((link) => {
        // La magia: Ziggy verifica si esta es la ruta activa por su NOMBRE
        const isActive = route().current(link.name);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`
              relative flex items-center justify-center px-8 h-full
              font-bold text-sm tracking-widest transition-all duration-300
              ${isActive 
                ? 'bg-verdeProfundo text-white' 
                : 'text-verdeProfundo hover:bg-doradoSuave hover:text-white'
              }
            `}
          >
            {link.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}