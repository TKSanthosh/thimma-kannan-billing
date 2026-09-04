import React from 'react';
import { CheckCircle, Share2, Printer, PlusCircle, X } from 'lucide-react';
import { Bill, ShopSettings } from '../types';
import { formatINR } from '../utils/currency';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  settings?: ShopSettings;
  onNewBill: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  bill,
  settings,
  onNewBill
}) => {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let text = `*${settings?.shopName || 'திம்ம கண்ணன்'}*\n`;
    text += `${settings?.tagline || 'பூஜை பொருட்கள் & மளிகை கடை'}\n`;
    text += `பில் எண்: #${bill.billNumber}\n`;
    text += `தேதி: ${bill.formattedDate} ${bill.formattedTime}\n`;
    text += `------------------------\n`;
    
    bill.items.forEach((item, i) => {
      if (item.nameTamil) {
        text += `${i + 1}. ${item.nameTamil} x ${item.quantity} = ${formatINR(item.total)}\n`;
      }
    });
    
    text += `------------------------\n`;
    text += `*மொத்தம்: ${formatINR(bill.totalAmount)}*\n`;
    text += `முறை: ${bill.paymentMethod}\n`;
    text += `நன்றி! மீண்டும் வருக!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white p-4 text-center shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-1 text-amber-300">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-amber-100 font-tamil">பில் முடிந்தது!</h2>
          <p className="text-xs text-emerald-200">பில் விவரம் வெற்றிகரமாக சேமிக்கப்பட்டது</p>
        </div>

        {/* Printable Bill Area */}
        <div id="printable-receipt" className="p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {/* Shop & Bill Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <h3 className="text-xl font-extrabold text-slate-900 font-tamil">
              {settings?.shopName || 'திம்ம கண்ணன்'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {settings?.tagline || 'பூஜை பொருட்கள் & மளிகை'}
            </p>
            {settings?.phone && (
              <p className="text-xs text-slate-500 font-mono">தொலைபேசி: {settings.phone}</p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 font-medium">
              <span className="font-bold text-slate-900">பில் எண்: #{bill.billNumber}</span>
              <span>{bill.formattedDate} {bill.formattedTime}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider font-tamil">
              <span>பொருள்</span>
              <span className="text-center">அளவு</span>
              <span className="text-right">தொகை</span>
            </div>
            
            {bill.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex-1 truncate pr-2 font-tamil font-bold text-slate-800">
                  {item.nameTamil}
                </div>
                <div className="w-12 text-center text-slate-600 font-mono">
                  {item.quantity}
                </div>
                <div className="w-16 text-right font-bold text-slate-900 font-tamil">
                  {formatINR(item.total)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-lg font-black text-slate-900 font-tamil">
              <span>மொத்தம்:</span>
              <span className="text-2xl text-emerald-800">{formatINR(bill.totalAmount)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600 font-tamil">
              <span>பணம் செலுத்திய முறை:</span>
              <span className="font-bold text-slate-800">{bill.paymentMethod}</span>
            </div>

            {bill.cashReceived && bill.cashReceived > 0 && (
              <>
                <div className="flex justify-between items-center text-xs text-slate-600 font-tamil">
                  <span>பெறப்பட்ட பணம்:</span>
                  <span className="font-semibold">{formatINR(bill.cashReceived)}</span>
                </div>
                {bill.changeGiven !== undefined && bill.changeGiven > 0 && (
                  <div className="flex justify-between items-center text-xs text-amber-800 font-bold font-tamil">
                    <span>மீதம் கொடுக்கப்பட்டது:</span>
                    <span>{formatINR(bill.changeGiven)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-center text-xs text-slate-400 italic pt-2 border-t border-slate-200 font-tamil">
            நன்றி! மீண்டும் வருக!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5 shrink-0">
          <button
            onClick={() => {
              onNewBill();
              onClose();
            }}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold text-lg shadow-md flex items-center justify-center gap-2 font-tamil transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>புதிய பில்</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp பகிர்</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>அச்சிடு</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
