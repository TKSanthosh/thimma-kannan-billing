import React from 'react';
import { Flame, Sparkles, RefreshCw } from 'lucide-react';
import { ShopSettings } from '../types';

interface HeaderProps {
  settings?: ShopSettings;
  billNumber?: number;
  onNewBill?: () => void;
  showNewBillBtn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  billNumber,
  onNewBill,
  showNewBillBtn = false
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white px-4 py-3 shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center shadow-inner text-amber-300">
            <Flame className="w-6 h-6 text-amber-300 animate-pulse fill-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide text-amber-100 font-tamil flex items-center gap-1.5">
              {settings?.shopName || 'திம்ம கண்ணன்'}
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h1>
            <p className="text-xs text-emerald-200 font-medium">
              {settings?.tagline || 'பூஜை பொருட்கள் & மளிகை'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {billNumber && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">பில் எண்</div>
              <div className="text-base font-extrabold text-amber-300 leading-none">#{billNumber}</div>
            </div>
          )}

          {showNewBillBtn && onNewBill && (
            <button
              onClick={onNewBill}
              title="புதிய பில்"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-2.5 rounded-xl border border-emerald-400/40 shadow-sm flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
