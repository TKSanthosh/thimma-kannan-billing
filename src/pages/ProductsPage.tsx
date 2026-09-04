import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Package } from 'lucide-react';
import { Product, UnitType } from '../types';
import { formatINR } from '../utils/currency';
import { addProduct, updateProduct, deleteProduct } from '../services/storage';

interface ProductsPageProps {
  products: Product[];
  onRefresh: () => void;
}

const UNIT_OPTIONS: UnitType[] = ['பீஸ்', 'பாக்கெட்', 'கிலோ', 'கிராம்', 'லிட்டர்', 'டஜன்', 'கட்டு'];

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [nameTamil, setNameTamil] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<UnitType>('பாக்கெட்');
  const [customAliases, setCustomAliases] = useState('');

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setNameTamil('');
    setPrice('');
    setUnit('பாக்கெட்');
    setCustomAliases('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setNameTamil(prod.nameTamil);
    setPrice(prod.price.toString());
    setUnit(prod.unit);
    // filter out internal 1-2 char prefixes for clean alias view
    const aliases = prod.searchTerms.filter(t => t.length > 2 && !t.includes(prod.nameTamil)).slice(0, 5);
    setCustomAliases(aliases.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTamil.trim()) return;

    const numPrice = parseFloat(price) || 0;
    const aliasArray = customAliases
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (editingProduct) {
      await updateProduct({
        ...editingProduct,
        nameTamil: nameTamil.trim(),
        price: numPrice,
        unit
      });
    } else {
      await addProduct(nameTamil.trim(), numPrice, unit, aliasArray);
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`'${name}' பொருளை நிச்சயமாக நீக்க வேண்டுமா?`)) {
      await deleteProduct(id);
      onRefresh();
    }
  };

  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nameTamil.toLowerCase().includes(q) ||
      p.searchTerms.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 max-w-lg mx-auto pb-24 space-y-4">
      {/* Top Header & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-tamil">பொருட்கள் பட்டியல்</h2>
          <p className="text-xs text-slate-500 font-medium">மொத்தம்: {products.length} பொருட்கள்</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl font-bold text-sm flex items-center gap-1.5 shadow-md font-tamil transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>புதிய பொருள்</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="பொருளின் பெயரை தேடுக..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-base font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-emerald-600"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filtered.length > 0 ? (
          filtered.map(prod => (
            <div
              key={prod.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 font-tamil leading-tight">
                  {prod.nameTamil}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-extrabold text-emerald-700 font-tamil">
                    {formatINR(prod.price)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ {prod.unit}</span>
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-all"
                  title="திருத்துக"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(prod.id, prod.nameTamil)}
                  className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 flex items-center justify-center transition-all"
                  title="நீக்குக"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-3xl text-center text-slate-500 border border-slate-200">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">பொருட்கள் எதுவும் இல்லை</p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
            <div className="p-4 bg-gradient-to-r from-emerald-800 to-green-800 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-100 font-tamil">
                {editingProduct ? 'பொருள் திருத்துதல்' : 'புதிய பொருள் சேர்த்தல்'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
                  பொருளின் பெயர் (தமிழ்): *
                </label>
                <input
                  type="text"
                  required
                  value={nameTamil}
                  onChange={(e) => setNameTamil(e.target.value)}
                  placeholder="எ.கா: குங்குமம்"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-tamil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
                    விற்பனை விலை (₹): *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
                    அளவு அலகு (Unit):
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-tamil"
                  >
                    {UNIT_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
                  கூடுதல் தேடல் வார்த்தைகள் (ஆங்கிலத்தில், கமாவால் பிரிக்கவும்):
                </label>
                <input
                  type="text"
                  value={customAliases}
                  onChange={(e) => setCustomAliases(e.target.value)}
                  placeholder="எ.கா: kungumam, kumkum, red powder"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  (தானாகவே தமிழ் உச்சரிப்புக்கு ஏற்ப தேடல் வார்த்தைகள் உருவாக்கப்படும்)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 font-tamil transition-all"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>சேமிக்க</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
