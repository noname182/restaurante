// Components/Pagination.jsx
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap justify-center mt-10 gap-2">
            {links.map((link, key) => (
                link.url === null ? (
                    <div key={key} className="px-4 py-2 text-gray-400 border rounded-lg text-sm">
                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </div>
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                            link.active 
                            ? 'bg-[#008542] text-white border-[#008542]' 
                            : 'bg-white text-gray-700 hover:bg-green-50'
                        }`}
                    >
                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </Link>
                )
            ))}
        </div>
    );
}