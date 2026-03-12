import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartIcon({ onClick }) {
  const { cartCount } = useCart();

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 flex items-center cursor-pointer z-50"
      onClick={onClick}
    >
      <div
        className="
          bg-darkGray
          w-12
          h-40
          rounded-l-full
          shadow-xl
          flex
          flex-col
          items-center
          justify-center
          relative
          transition-all
          duration-300
          hover:bg-darkTurquoise
        "
      >
        <ShoppingCart size={32} className="text-turquoise" />

        {cartCount > 0 && (
          <span
            className="
              absolute
              top-12  
              right-1
              bg-turquoise
              text-darkGray
              text-xs
              font-bold
              w-7
              h-7
              rounded-full
              flex
              items-center
              justify-center
              shadow-md
            "
          >
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
}
