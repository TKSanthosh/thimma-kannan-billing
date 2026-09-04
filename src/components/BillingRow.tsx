import React, { useState } from 'react';
import { Minus, Plus, Trash2, Search, Edit2, Check } from 'lucide-react';
import { BillItem } from '../types';
import { formatINR } from '../utils/currency';

interface BillingRowProps {
  item: BillItem;
  rowIndex: number;
  onOpenSearch: (rowId: string) => void;
  onUpdateQuantity: (rowId: string, newQty: number) => void;
  onUpdatePrice: (rowId: string, newPrice: number) => void;
  onRemove: (rowId: string) => void;
}

export const BillingRow: React.FC<BillingRowProps> = ({
  item,
  rowIndex,
  onOpenSearch,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(item.unitPrice.toString());
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [tempQty, setTempQty] = useState(item.quantity.toString());

  const isFilled = Boolean(item.nameTamil && item.nameTamil.trim() !== '');

  const handleSavePrice = () => {
    const p = parseFloat(tempPrice);
    if (!isNaN(p) && p >= 0) {
      onUpdatePrice(item.id, p);
    } else {
      setTempPrice(item.unitPrice.toString());
    }
    setIsEditingPrice(false);
  };

  const handleSaveQty = () => {
    const q = parseFloat(tempQty);
    if (!isNaN(q) && q > 0) {
      onUpdateQuantity(item.id, q);
    } else {
      setTempQty(item.quantity.toString());
    }
    setIsEditingQty(false);
  };

  // 1. EMPTY ROW
  if (!isFilled) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300/80 p-3 shadow-sm hover:border-emerald-500 transition-all flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenSearch(item.id)}
          className="flex-1 flex items-center gap-2.5 py-3 px-4 bg-emerald-50/70 active:bg-emerald-100/90 rounded-xl text-emerald-800 font-bold text-base md:text-lg text-left transition-all border border-emerald-200/80 shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Search className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="font-tamil text-emerald-900 tracking-wide">[ பொருளை தேடுக ]</span>
        </button>

        <div className="flex items-center gap-2 px-2 text-slate-400 font-semibold text-lg shrink-0">
          <span className="w-8 text-center text-slate-500 font-mono">1</span>
          <span className="text-slate-400 font-mono text-base font-bold">₹0</span>
        </div>
      </div>
    );
  }

  // 2. FILLED ROW
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-all space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Product Name & Unit Price (Left Column) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
              {rowIndex + 1}
            </span>
            <button
              onClick={() => onOpenSearch(item.id)}
              className="text-left font-bold text-xl text-slate-900 font-tamil truncate hover:text-emerald-700 transition-colors leading-tight"
            >
              {item.nameTamil}
            </button>
          </div>

          {/* Unit Price Display & Inline Editor */}
          <div className="mt-1 ml-8 flex items-center gap-1.5">
            {isEditingPrice ? (
              <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-300">
                <span className="text-xs text-slate-600 font-bold">₹</span>
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePrice()}
                  className="w-16 px-1 py-0.5 text-sm font-bold text-slate-900 bg-white border border-amber-400 rounded focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSavePrice}
                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempPrice(item.unitPrice.toString());
                  setIsEditingPrice(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded-md transition-colors border border-slate-200/60"
                title="விலையை மாற்ற தட்டவும்"
              >
                <span>{formatINR(item.unitPrice)} / {item.unit}</span>
                <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                {item.isCustomPrice && (
                  <span className="text-[10px] text-amber-600 font-bold">(மாற்றப்பட்டது)</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Row Amount (Right Column) */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-black text-slate-900 font-tamil tracking-tight">
            {formatINR(item.total)}
          </div>
        </div>
      </div>

      {/* Controls Row: Quantity (Center) & Delete Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 font-tamil">அளவு:</span>
          {/* Quantity Controls */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200 shadow-inner">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl transition-all ${
                item.quantity <= 1
                  ? 'bg-slate-200/60 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-800 shadow-sm active:bg-slate-200 active:scale-95'
              }`}
              title="குறைக்க"
            >
              <Minus className="w-5 h-5 stroke-[3]" />
            </button>

            {isEditingQty ? (
              <div className="flex items-center gap-1 px-1">
                <input
                  type="number"
                  value={tempQty}
                  onChange={(e) => setTempQty(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveQty()}
                  className="w-12 text-center text-lg font-black text-slate-900 bg-white border border-emerald-500 rounded-lg focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveQty}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempQty(item.quantity.toString());
                  setIsEditingQty(true);
                }}
                className="w-12 text-center text-2xl font-black text-slate-900 font-mono hover:text-emerald-700 transition-colors"
                title="அளவை மாற்ற தட்டவும்"
              >
                {item.quantity}
              </button>
            )}

            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm flex items-center justify-center font-black text-xl active:scale-95 transition-all"
              title="அதிகரிக்க"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Delete Row Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="w-11 h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 border border-rose-200/80 flex items-center justify-center transition-all active:scale-90 shadow-2xs"
          title="நீக்க"
        >
          <Trash2 className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
