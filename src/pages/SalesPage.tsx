import React, { useState, useEffect } from 'react';
import { BarChart3, Banknote, QrCode, TrendingUp, Package, Calendar } from 'lucide-react';
import { Bill } from '../types';
import { getAllBills } from '../services/storage';
import { formatINR } from '../utils/currency';

export const SalesPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  useEffect(() => {
    getAllBills().then(setBills);
  }, []);

  const now = new Date();
  const todayStr = now.toLocaleDateString('ta-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const oneWeekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  const filteredBills = bills.filter(b => {
    if (timeFilter === 'today') return b.formattedDate === todayStr;
    if (timeFilter === 'week') return b.createdAt >= oneWeekAgo;
    if (timeFilter === 'month') return b.createdAt >= oneMonthAgo;
    return true;
  });

  const totalSales = filteredBills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalBillsCount = filteredBills.length;

  const cashSales = filteredBills
    .filter(b => b.paymentMethod === 'பணம்')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const upiSales = filteredBills
    .filter(b => b.paymentMethod === 'UPI')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  // Top products calculation
  const productQuantities: Record<string, { name: string; qty: number; total: number }> = {};
  filteredBills.forEach(b => {
    b.items.forEach(item => {
      if (!item.nameTamil) return;
      if (!productQuantities[item.nameTamil]) {
        productQuantities[item.nameTamil] = { name: item.nameTamil, qty: 0, total: 0 };
      }
      productQuantities[item.nameTamil].qty += item.quantity;
      productQuantities[item.nameTamil].total += item.total;
    });
  });

  const topProducts = Object.values(productQuantities).sort((a, b) => b.qty - a.qty).slice(0, 8);

  return (
    <div className="p-4 max-w-lg mx-auto pb-24 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 font-tamil">விற்பனை அறிக்கை</h2>
        <p className="text-xs text-slate-500 font-medium">வருமானம் மற்றும் பில் புள்ளிவிவரங்கள்</p>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl text-xs font-bold font-tamil">
        <button
          onClick={() => setTimeFilter('today')}
          className={`py-2 rounded-xl transition-all ${
            timeFilter === 'today' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          இன்று
        </button>
        <button
          onClick={() => setTimeFilter('week')}
          className={`py-2 rounded-xl transition-all ${
            timeFilter === 'week' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          வாரம்
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`py-2 rounded-xl transition-all ${
            timeFilter === 'month' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          மாதம்
        </button>
        <button
          onClick={() => setTimeFilter('all')}
          className={`py-2 rounded-xl transition-all ${
            timeFilter === 'all' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          அனைத்தும்
        </button>
      </div>

      {/* Main Revenue Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 rounded-3xl p-5 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between text-emerald-200 text-xs font-bold uppercase tracking-wider font-tamil">
          <span>மொத்த விற்பனை தொகை</span>
          <TrendingUp className="w-5 h-5 text-amber-300" />
        </div>
        <div className="text-4xl font-black text-amber-300 font-tamil tracking-tight">
          {formatINR(totalSales)}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-emerald-600/60 text-xs font-medium text-emerald-100">
          <span>மொத்த பில்கள்:</span>
          <span className="font-extrabold text-base text-white">{totalBillsCount}</span>
        </div>
      </div>

      {/* Cash vs UPI Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cash Box */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold font-tamil">
            <Banknote className="w-4 h-4" />
            <span>பணம் (Cash)</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-tamil">
            {formatINR(cashSales)}
          </div>
        </div>

        {/* UPI Box */}
        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold font-tamil">
            <QrCode className="w-4 h-4" />
            <span>UPI (Online)</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-tamil">
            {formatINR(upiSales)}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base font-tamil">
          <Package className="w-5 h-5 text-emerald-600" />
          <h3>அதிகம் விற்பனையான பொருட்கள்</h3>
        </div>

        {topProducts.length > 0 ? (
          <div className="space-y-2.5 divide-y divide-slate-100">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm text-slate-900 font-tamil truncate">
                    {p.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-600 font-mono mr-2">
                    {p.qty} அளவு
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 font-tamil">
                    {formatINR(p.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4 font-tamil">
            விற்பனை விவரங்கள் இல்லை
          </p>
        )}
      </div>
    </div>
  );
};
