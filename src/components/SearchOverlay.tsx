import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import restaurants from '../data/restaurant.json';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (id: string) => void;
}

export default function SearchOverlay({ isOpen, onClose, onSelectRestaurant }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.category.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
    r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#f9f9f9] flex flex-col pointer-events-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header / Input Area */}
      <div className="flex items-center px-6 py-8 border-b border-[#c6c6c6]">
        <Search className="w-8 h-8 text-[#000] mr-4 opacity-50" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="BUSCAR..."
          className="flex-1 bg-transparent outline-none placeholder:text-[#c6c6c6] text-[#1b1b1b] uppercase"
          style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}
        />
        <button onClick={onClose} className="ml-4 hover:opacity-60 active:opacity-40 transition-opacity">
          <X className="w-10 h-10 text-[#000]" />
        </button>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {filteredRestaurants.length === 0 ? (
          <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#777', marginTop: '20px' }}>
            No se encontraron resultados para "{query}"
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredRestaurants.map(r => (
              <div 
                key={r.id}
                onClick={() => {
                  onSelectRestaurant(r.id);
                  onClose();
                }}
                className="group cursor-pointer border border-[#c6c6c6] bg-white p-6 hover:border-[#000] transition-colors"
                style={{ borderRadius: 0 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', color: '#1b1b1b', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {r.name}
                  </h3>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#1b1b1b', fontSize: '1.2rem', marginLeft: '12px' }}>↗</span>
                </div>
                <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.9rem', color: '#5f5e5e', marginBottom: '12px' }}>
                  {r.category.join(' · ')}
                </p>
                <div style={{ height: '1px', backgroundColor: '#e2e2e2', marginBottom: '12px' }} />
                <span className="block" style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777' }}>
                  {r.address}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
