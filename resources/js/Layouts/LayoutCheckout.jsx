import { Head } from '@inertiajs/react';
import Header from '@/Components/welcome/Header/Header';
import Footer from '@/Components/welcome/Footer';
import { CartProvider } from '@/Contexts/CartContext';

export default function Layout({ title, auth, children }) {
  return (
    <CartProvider>
      <Head title={title || "Carrito de Compras"} />

     
      <div className="min-h-screen flex flex-col bg-white text-black relative">

     
        <Header auth={auth} className="bg-white text-black shadow-sm" />

        
        <main className="flex-1 container mx-auto px-6 py-12">
          {children}
        </main>

        <Footer className="bg-black text-white" />


      </div>
    </CartProvider>
  );
}
