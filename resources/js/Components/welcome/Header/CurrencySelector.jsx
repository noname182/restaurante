import { useState, useRef, useEffect } from 'react';

export default function CurrencySelector({ currencies, selectedCurrency, setSelectedCurrency }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-44 flex justify-end">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 px-3 border border-gray-100 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <img src={`https://flagcdn.com/w20/${selectedCurrency.flag}.png`} className="w-5 h-auto" />
          <span className="whitespace-nowrap">{selectedCurrency.label}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform text-black ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] py-2">
          {currencies.map((item) => (
            <button 
              key={item.code}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${selectedCurrency.code === item.code ? 'bg-blue-50 text-blue-700' : ''}`}
              onClick={() => { setSelectedCurrency(item); setIsOpen(false); }}
            >
              <img src={`https://flagcdn.com/w20/${item.flag}.png`} className="w-5 h-auto" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}