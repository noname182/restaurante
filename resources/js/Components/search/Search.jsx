import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleAction = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAction();
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full max-w-3xl mx-auto">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Busca tu bebida favorita..."
          className="w-full pl-12 pr-4 py-4 rounded-xl md:rounded-l-xl md:rounded-r-none border-none bg-white text-black shadow-lg text-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* El botón naranja de tu referencia */}
      <button
        onClick={handleAction}
        className="bg-[#d45d12] hover:bg-[#b04a0e] text-white font-bold py-4 px-8 rounded-xl md:rounded-r-xl md:rounded-l-none shadow-lg transition-colors duration-300 flex items-center justify-center"
      >
        <span>Search</span>
      </button>
    </div>
  );
}