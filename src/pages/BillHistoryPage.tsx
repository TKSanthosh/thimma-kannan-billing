import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, ChevronRight, Banknote, QrCode } from 'lucide-react';
import { Bill, ShopSettings } from '../types';
import { getAllBills } from '../services/storage';
import { formatINR } from '../utils/currency';
import { ReceiptModal } from '../components/ReceiptModal';

interface BillHistoryPageProps {
  settings: ShopSettings;
}

export const BillHistoryPage: React.FC<BillHistoryPageProps> = ({ settings }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filter, setFilter] = useState<'today' | 'yesterday' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const loadBills = async () => {
    const list = await getAllBills();
    setBills(list);
  };

  useEffect(() => {
    loadBills();
  }, []);

  const now = new Date();
  const todayStr = now.toLocaleDateString('ta-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toLocaleDateString('ta-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const filteredBills = bills.filter(b => {
    // Filter by date
    if (filter === 'today' && b.formattedDate !== todayStr) return false;
    if (filter === 'yesterday' && b.formattedDate !== yesterdayStr) return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const numMatch = b.billNumber.toString().includes(q);
      const itemMatch = b.items.some(i => i.nameTamil.toLowerCase().includes(q));
      return numMatch || itemMatch;
    }

    return true;
  });

  return (
    <div className="p-4 max-w-lg mx-auto pb-24 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 font-tamil">பில் வரலாறு</h2>
        <p className="text-xs text-slate-500 font-medium">முடிந்த பில்களின் விவரங்கள்</p>
      </div>

      {/* Date Filter Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setFilter('today')}
          className={`py-2 px-3 rounded-xl font-bold text-xs transition-all font-tamil ${
            filter === 'today'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          இன்று
        </button>
        <button
          onClick={() => setFilter('yesterday')}
          className={`py-2 px-3 rounded-xl font-bold text-xs transition-all font-tamil ${
            filter === 'yesterday'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          நேற்று
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`py-2 px-3 rounded-xl font-bold text-xs transition-all font-tamil ${
            filter === 'all'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          அனைத்தும்
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="பில் எண் அல்லது பொருள் தேடுக..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-emerald-600 font-tamil"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Bills List */}
      <div className="space-y-2.5">
        {filteredBills.length > 0 ? (
          filteredBills.map(bill => (
            <button
              key={bill.id}
              onClick={() => setSelectedBill(bill)}
              className="w-full text-left bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-slate-900 font-mono">
                    #{bill.billNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {bill.formattedTime}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    bill.paymentMethod === 'UPI'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {bill.paymentMethod === 'UPI' ? <QrCode className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                    <span>{bill.paymentMethod}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 truncate mt-1 font-tamil">
                  {bill.items.map(i => `${i.nameTamil} (${i.quantity})`).join(', ')}
                </p>
              </div>

              <div className="text-right shrink-0 flex items-center gap-2">
                <span className="text-xl font-black text-emerald-800 font-tamil">
                  {formatINR(bill.totalAmount)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          ))
        ) : (
          <div className="bg-white p-8 rounded-3xl text-center text-slate-500 border border-slate-200">
            <History className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700 font-tamil">பில்கள் எதுவும் இல்லை</p>
          </div>
        )}
      </div>

      {/* Bill Receipt Modal View */}
      <ReceiptModal
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBill(null)}
        bill={selectedBill}
        settings={settings}
        onNewBill={() => setSelectedBill(null)}
      />
    </div>
  );
};
