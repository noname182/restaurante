export default function Banner({img}) {
  return (
    <section className="animate-slide-in-bottom relative w-full h-[500px] md:h-screen overflow-hidden bg-gray-900">
     
      <div className="absolute inset-0">
        <img
          src={img || "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"}
          alt="Vehículos Pragbati"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80';
          }}
        />
       
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
      </div>

      
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-3xl">
         
          <h1 className="text-white font-black leading-tight mb-6">
            <span className="block text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Soluciones en
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl mt-2">
              Transporte
            </span>
          </h1>

        
          <p className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed mb-8">
            Conoce nuestra gama de productos
          </p>

         
          <div className="w-24 h-1 bg-white mb-8"></div>
        </div>
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}