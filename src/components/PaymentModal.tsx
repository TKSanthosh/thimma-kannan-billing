import React, { useState, useEffect } from 'react';
import { X, Banknote, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { PaymentMethod } from '../types';
import { formatINR, parseNumber } from '../utils/currency';
import { calculateChange } from '../utils/calculations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onCompleteBill: (paymentMethod: PaymentMethod, cashReceived?: number, changeGiven?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onCompleteBill
}) => {
  const [method, setMethod] = useState<PaymentMethod>('பணம்');
  const [cashInput, setCashInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMethod('பணம்');
      setCashInput(totalAmount.toString());
    }
  }, [isOpen, totalAmount]);

  if (!isOpen) return null;

  const cashVal = parseNumber(cashInput);
  const changeVal = calculateChange(totalAmount, cashVal);

  const handleQuickCash = (addAmount: number) => {
    setCashInput((prev) => {
      const current = parseNumber(prev);
      return (current + addAmount).toString();
    });
  };

  const handleExactCash = () => {
    setCashInput(totalAmount.toString());
  };

  const handleRoundCash = (roundTo: number) => {
    const nextRound = Math.ceil(totalAmount / roundTo) * roundTo;
    setCashInput(nextRound.toString());
  };

  const handleSubmit = () => {
    if (method === 'பணம்') {
      onCompleteBill('பணம்', cashVal, changeVal);
    } else {
      onCompleteBill('UPI');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-green-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100">பணம் செலுத்துதல்</h2>
              <p className="text-xs text-emerald-200">பில் கட்டணம் பெறுக</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Total Amount Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-3xl border border-emerald-300 text-center shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-tamil">
              மொத்த தொகை
            </span>
            <div className="text-4xl font-black text-emerald-900 font-tamil mt-0.5 tracking-tight">
              {formatINR(totalAmount)}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 font-tamil">
              பணம் செலுத்தும் முறை:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('பணம்')}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-lg transition-all border-2 ${
                  method === 'பணம்'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-6 h-6" />
                <span>பணம் (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-lg transition-all border-2 ${
                  method === 'UPI'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-6 h-6" />
                <span>UPI (GPay/PhonePe)</span>
              </button>
            </div>
          </div>

          {/* Cash Details View */}
          {method === 'பணம்' ? (
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 font-tamil">
                  பணம் பெறப்பட்டது:
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-2xl font-bold text-slate-500 font-tamil">₹</span>
                  <input
                    type="number"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3.5 text-3xl font-black text-slate-900 bg-white border-2 border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              {/* Quick Cash Chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExactCash}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-700 active:bg-emerald-50 active:border-emerald-500 shadow-2xs font-tamil"
                >
                  சரியான தொகை ({formatINR(totalAmount)})
                </button>
                <button
                  type="button"
                  onClick={() => handleRoundCash(100)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-700 active:bg-emerald-50 shadow-2xs"
                >
                  ₹100
                </button>
                <button
                  type="button"
                  onClick={() => handleRoundCash(500)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-700 active:bg-emerald-50 shadow-2xs"
                >
                  ₹500
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(50)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-700 active:bg-emerald-50 shadow-2xs"
                >
                  +₹50
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(100)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-700 active:bg-emerald-50 shadow-2xs"
                >
                  +₹100
                </button>
              </div>

              {/* Change Return Box */}
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-sm text-amber-900 font-tamil">
                  மீதம் கொடுக்க வேண்டியது:
                </span>
                <span className="text-2xl font-black text-amber-900 font-tamil">
                  {formatINR(changeVal)}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl text-center space-y-2">
              <QrCode className="w-12 h-12 mx-auto text-indigo-600" />
              <p className="text-base font-bold text-indigo-900 font-tamil">
                QR குறியீடு ஸ்கேன் செய்து ₹{totalAmount} பெறவும்
              </p>
              <p className="text-xs text-indigo-600 font-medium">
                GPay / PhonePe / Paytm செயலிகள் மூலம் பெறலாம்
              </p>
            </div>
          )}

          {/* Complete Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-2 font-tamil"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>பில் முடிக்க</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
