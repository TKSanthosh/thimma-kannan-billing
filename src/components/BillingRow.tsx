import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Trash2, Search, X, Check } from 'lucide-react';
import { BillItem, Product } from '../types';
import { searchProducts } from '../services/productSearch';
import { formatINR } from '../utils/currency';

interface BillingRowProps {
  item: BillItem;
  rowIndex: number;
  products: Product[];
  isLastRow: boolean;
  onSelectProduct: (rowId: string, product: Product) => void;
  onUpdateQuantity: (rowId: string, newQty: number) => void;
  onUpdatePrice: (rowId: string, newPrice: number) => void;
  onRemove: (rowId: string) => void;
  onClearRow: (rowId: string) => void;
}

export const BillingRow: React.FC<BillingRowProps> = ({
  item,
  rowIndex,
  products,
  isLastRow,
  onSelectProduct,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove,
  onClearRow
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [priceInput, setPriceInput] = useState(item.unitPrice ? item.unitPrice.toString() : '');

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFilled = Boolean(item.nameTamil && item.nameTamil.trim() !== '');

  // Keep price input in sync when product changes
  useEffect(() => {
    setPriceInput(item.unitPrice ? item.unitPrice.toString() : '');
  }, [item.unitPrice, item.productId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = isOpen ? searchProducts(query, products) : [];

  const handleSelect = (prod: Product) => {
    onSelectProduct(item.id, prod);
    setQuery('');
    setPriceInput(prod.price.toString());
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handlePriceChange = (val: string) => {
    setPriceInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      onUpdatePrice(item.id, num);
    } else if (val === '') {
      onUpdatePrice(item.id, 0);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-150 p-3 relative ${
      isOpen ? 'z-40 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-xs hover:border-slate-300'
    }`}>
      {/* Top Line: Product Name Fillup & Delete */}
      <div className="flex items-center gap-2 relative">
        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
          {rowIndex + 1}
        </span>

        {/* Product Autocomplete Fillup Input */}
        {!isFilled ? (
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="பொருளை தட்டச்சு செய்க (எ.கா: ku, man, kar)..."
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border-2 border-emerald-400 focus:border-emerald-600 focus:bg-white rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal focus:outline-none transition-all font-tamil"
            />
            <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between min-w-0 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-lg md:text-xl font-black text-slate-900 font-tamil truncate">
                {item.nameTamil}
              </h3>
              <span className="text-xs text-slate-500 font-semibold shrink-0">
                ({item.unit})
              </span>
            </div>
            <button
              type="button"
              onClick={() => onClearRow(item.id)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors ml-1"
              title="பொருளை மாற்றுக"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Delete Row Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isLastRow && !isFilled}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
            isLastRow && !isFilled
              ? 'text-slate-300 cursor-not-allowed'
              : 'bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 active:scale-90 shadow-2xs'
          }`}
          title="வரிசையை நீக்க"
        >
          <Trash2 className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Bottom Line: Price Fillup, Quantity Controls & Row Total Amount */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 gap-2">
        {/* Directly Editable Price Fillup Field */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500 font-tamil">விலை:</span>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs font-bold text-slate-500">₹</span>
            <input
              type="number"
              min="0"
              step="any"
              value={priceInput}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0"
              className="w-20 pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white rounded-xl text-base font-black text-slate-900 font-mono focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500 font-tamil">அளவு:</span>
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1 || !isFilled}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                item.quantity <= 1 || !isFilled
                  ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-800 shadow-2xs active:bg-slate-200 active:scale-95'
              }`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <span className="w-8 text-center text-lg font-black text-slate-900 font-mono">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={!isFilled}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                !isFilled
                  ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-2xs active:scale-95'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Row Total Amount */}
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-slate-400 block font-tamil leading-none">தொகை</span>
          <span className="text-xl font-black text-emerald-800 font-tamil tracking-tight">
            {formatINR(item.total)}
          </span>
        </div>
      </div>

      {/* Floating Autocomplete Suggestions Dropdown */}
      {isOpen && !isFilled && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-[52px] bg-white rounded-2xl border-2 border-emerald-500 shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100"
        >
          {suggestions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {suggestions.map((prod, index) => (
                <button
                  key={prod.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(prod);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    index === 0
                      ? 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {index === 0 ? <Check className="w-4 h-4 stroke-[3]" /> : prod.nameTamil.charAt(0)}
                    </span>
                    <div>
                      <span className="text-lg font-bold font-tamil block leading-snug">
                        {prod.nameTamil}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        1 {prod.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700 font-tamil">
                      {formatINR(prod.price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs font-semibold text-slate-400 font-tamil">
              பொருட்கள் எதுவும் கிடைக்கவில்லை
            </div>
          )}
        </div>
      )}
    </div>
  );
};
