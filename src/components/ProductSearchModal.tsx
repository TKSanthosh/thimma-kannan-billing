import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { searchProducts } from '../services/productSearch';
import { formatINR } from '../utils/currency';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = searchProducts(query, products);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] h-[85vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-green-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100">பொருளை தேடுக</h2>
              <p className="text-xs text-emerald-200">ஆங்கிலத்தில் தட்டச்சு செய்யவும் (English Typing)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="எ.கா: k, ku, kung, man, kar..."
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full pl-4 pr-12 py-3.5 text-lg font-semibold text-slate-800 bg-white border-2 border-emerald-500 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder:text-slate-400 placeholder:font-normal"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 active:scale-90 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-3 text-emerald-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            )}
          </div>

          {/* Quick letter chips for one-touch filtering */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-medium shrink-0 ml-1">விரைவு:</span>
            {['k', 'ku', 'kung', 'man', 'kar', 'sam', 'ooth', 'san', 'vi', 'deep'].map(shortcut => (
              <button
                key={shortcut}
                onClick={() => {
                  setQuery(shortcut);
                  inputRef.current?.focus();
                }}
                className={`px-3 py-1 rounded-full font-bold uppercase transition-all shrink-0 ${
                  query === shortcut
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 active:bg-emerald-100'
                }`}
              >
                {shortcut}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod, index) => (
              <button
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-100 active:scale-[0.98] border ${
                  index === 0 && query.trim().length > 0
                    ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0 ${
                    index === 0 && query.trim().length > 0
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {index === 0 && query.trim().length > 0 ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      prod.nameTamil.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-tamil leading-snug">
                      {prod.nameTamil}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      அலகு: <span className="text-slate-700 font-semibold">{prod.unit}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-emerald-700 font-tamil">
                    {formatINR(prod.price)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    1 {prod.unit}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-semibold text-slate-700">பொருட்கள் எதுவும் கிடைக்கவில்லை</p>
              <p className="text-xs text-slate-400 mt-1">வேறு ஆங்கில எழுத்துக்களை தட்டச்சு செய்து பார்க்கவும்</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
