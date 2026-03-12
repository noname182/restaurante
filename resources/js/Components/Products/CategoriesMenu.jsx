// CategoriesMenu.jsx
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function CategoriesMenu({ categories }) {
    const { url } = usePage(); // para obtener la URL actual
    const activeSlug = url.split('/').pop(); // toma el último segmento de la URL

    return (
        <div className="w-full bg-black py-3 shadow-lg">
            <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto scrollbar-hide px-4">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products/${cat.slug}`}
                        className={`
                            flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300
                            ${activeSlug === cat.slug
                                ? 'bg-white text-black shadow-xl transform scale-105'
                                : 'bg-gray-900 text-white hover:bg-white hover:text-black hover:scale-105'}
                        `}
                    >
                        <span className="font-bold uppercase tracking-wide">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
