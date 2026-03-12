import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

export default function Products({ categories: initialCategories = [], search: initialSearch = '', page: initialPage = 1, hasMore: initialHasMore = false }) {
  const [categories, setCategories] = useState(initialCategories);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleVerMasCategorias = async () => {
    try {
      setLoading(true);
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const nextOffset = categories.length;

      const params = new URLSearchParams({ offset: nextOffset });
      const response = await fetch(`/ventas/json?${params.toString()}`, {
        headers: { 'X-CSRF-TOKEN': token },
      });

      const data = await response.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(prev => [...prev, ...data.categories]);
        setHasMore(data.hasMore);
      } else setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <section className="text-white p-4">
        {categories.map((category, idx) => {
          const filteredProducts = category.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const hasChildren = category.children && category.children.length > 0;

          return (
            <div key={category.id} className="mb-12">
              {idx !== 0 && (
                <hr className="border-grayCustom/30 my-12" />
              )}

              
              <div className="relative mb-6">
                <h2
                  className="
                text-4xl
                md:text-5xl
                font-bold
                tracking-[2px]
                uppercase
                pl-4
                py-2
                border-l-[6px]
                border-turquoise
                text-turquoise
              "
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {category.name}
                </h2>

                {category.description && (
                  <p className="text-grayCustom mt-2 italic pl-4">
                    {category.description}
                  </p>
                )}
              </div>

              {filteredProducts.length > 0 && (
                <CategorySwiper products={filteredProducts} />
              )}

              
              {hasChildren &&
                category.children.map(sub => {
                  const filteredSubProducts = sub.products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  return (
                    <div key={sub.id} className="mt-12">
                      <h3
                        className="
                      text-2xl
                      md:text-3xl
                      font-semibold
                      tracking-wide
                      pl-3
                      border-l-4
                      border-darkTurquoise
                      text-grayCustom
                      mb-10
                    "
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {sub.name}
                      </h3>

                      {filteredSubProducts.length > 0 && (
                        <CategorySwiper products={filteredSubProducts} />
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}

       
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleVerMasCategorias}
              disabled={loading}
              className="
            px-8
            py-3
            rounded-xl
            border
            border-turquoise
            text-turquoise
            font-semibold
            hover:bg-turquoise
            hover:text-darkGray
            transition
            disabled:opacity-50
          "
            >
              {loading ? 'Cargando...' : 'Ver más categorías'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function CategorySwiper({ products }) {
  if (!products || products.length === 0) return null;

  const isDesktopCarousel = products.length > 3;

  return isDesktopCarousel ? (
    <Swiper
      className="z-[1] py-6"
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      style={{
        '--swiper-navigation-color': '#01a387',
        '--swiper-pagination-color': '#01a387',
      }}
    >
      {products.map(product => {
        const outOfStock =
          product.variants?.reduce((sum, v) => sum + v.stock, 0) === 0;

        return (
          <SwiperSlide
            key={product.id}
            className={`
              w-full
              h-full
              relative
              overflow-hidden
              rounded-3xl
              shadow-xl
              bg-white
              text-black
              flex
              justify-center
              border
              ${outOfStock ? 'border-darkTurquoise opacity-80' : 'border-gray-200'}
            `}
          >
            <ProductCard product={product} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}