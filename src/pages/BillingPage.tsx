import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { BillItem, Product, Bill, ShopSettings, PaymentMethod } from '../types';
import { BillingRow } from '../components/BillingRow';
import { ProductSearchModal } from '../components/ProductSearchModal';
import { PaymentModal } from '../components/PaymentModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { calculateBillTotal, calculateRowTotal } from '../utils/calculations';
import { formatINR } from '../utils/currency';
import { getNextBillNumber, saveBill } from '../services/storage';

interface BillingPageProps {
  products: Product[];
  settings: ShopSettings;
}

const createEmptyItem = (): BillItem => ({
  id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
  nameTamil: '',
  unitPrice: 0,
  quantity: 1,
  unit: 'பீஸ்',
  total: 0
});

export const BillingPage: React.FC<BillingPageProps> = ({ products, settings }) => {
  const [items, setItems] = useState<BillItem[]>([createEmptyItem()]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [currentBillNumber, setCurrentBillNumber] = useState<number>(1001);

  // Load next sequential bill number on mount
  useEffect(() => {
    getNextBillNumber().then(num => setCurrentBillNumber(num));
  }, []);

  const totalAmount = calculateBillTotal(items);
  const validItemsCount = items.filter(i => i.nameTamil && i.nameTamil.trim() !== '').length;

  const handleOpenSearch = (rowId: string) => {
    setActiveRowId(rowId);
    setIsSearchOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    if (!activeRowId) return;

    setItems(prevItems => {
      const rowIndex = prevItems.findIndex(i => i.id === activeRowId);
      if (rowIndex === -1) return prevItems;

      const updated = [...prevItems];
      const currentQty = updated[rowIndex].quantity || 1;
      const rowTotal = calculateRowTotal(product.price, currentQty);

      updated[rowIndex] = {
        ...updated[rowIndex],
        productId: product.id,
        nameTamil: product.nameTamil,
        unitPrice: product.price,
        quantity: currentQty,
        unit: product.unit,
        total: rowTotal,
        isCustomPrice: false
      };

      // AUTOMATIC NEXT ROW CREATION:
      // If the mother just filled the last row, automatically append a fresh empty row
      const isLastRow = rowIndex === updated.length - 1;
      if (isLastRow) {
        updated.push(createEmptyItem());
      }

      return updated;
    });

    setIsSearchOpen(false);
  };

  const handleUpdateQuantity = (rowId: string, newQty: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === rowId) {
          const qty = Math.max(1, newQty);
          return {
            ...item,
            quantity: qty,
            total: calculateRowTotal(item.unitPrice, qty)
          };
        }
        return item;
      })
    );
  };

  const handleUpdatePrice = (rowId: string, newPrice: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === rowId) {
          const p = Math.max(0, newPrice);
          return {
            ...item,
            unitPrice: p,
            isCustomPrice: true,
            total: calculateRowTotal(p, item.quantity)
          };
        }
        return item;
      })
    );
  };

  const handleRemoveRow = (rowId: string) => {
    setItems(prevItems => {
      const filtered = prevItems.filter(item => item.id !== rowId);
      // Always ensure at least 1 empty row is present
      if (filtered.length === 0 || !filtered.some(i => !i.nameTamil)) {
        return filtered.length === 0 ? [createEmptyItem()] : [...filtered, createEmptyItem()];
      }
      return filtered;
    });
  };

  const handleResetBill = () => {
    setItems([createEmptyItem()]);
    getNextBillNumber().then(num => setCurrentBillNumber(num));
  };

  const handleCompleteBill = async (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    changeGiven?: number
  ) => {
    const validItems = items.filter(i => i.nameTamil && i.nameTamil.trim() !== '');
    if (validItems.length === 0) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ta-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const billData: Omit<Bill, 'id'> = {
      billNumber: currentBillNumber,
      items: validItems,
      totalAmount,
      paymentMethod,
      cashReceived,
      changeGiven,
      createdAt: now.getTime(),
      formattedDate,
      formattedTime
    };

    const saved = await saveBill(billData);
    setCompletedBill(saved);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] pb-32">
      {/* Top Banner / Table Headers */}
      <div className="bg-slate-200/90 px-4 py-2 text-xs font-bold text-slate-700 flex justify-between items-center sticky top-[64px] z-20 backdrop-blur-sm border-b border-slate-300">
        <div className="w-1/2 font-tamil text-slate-800">பொருள்</div>
        <div className="w-1/4 text-center font-tamil text-slate-800">அளவு</div>
        <div className="w-1/4 text-right font-tamil text-slate-800">தொகை</div>
      </div>

      {/* Bill Rows List */}
      <div className="p-3 space-y-3 max-w-lg mx-auto w-full flex-1">
        {items.map((item, index) => (
          <BillingRow
            key={item.id}
            item={item}
            rowIndex={index}
            onOpenSearch={handleOpenSearch}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onRemove={handleRemoveRow}
          />
        ))}
      </div>

      {/* Fixed Sticky Bottom Total & Action Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-emerald-600/30 p-3.5 shadow-2xl z-20">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          {/* Total Display */}
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-slate-500 font-tamil">
              மொத்தம் ({validItemsCount} பொருட்கள்)
            </div>
            <div className="text-3xl font-black text-emerald-800 font-tamil tracking-tight leading-none mt-0.5">
              {formatINR(totalAmount)}
            </div>
          </div>

          {/* Complete Bill CTA Button */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            disabled={validItemsCount === 0}
            className={`flex-1 py-4 px-5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-lg transition-all font-tamil active:scale-[0.97] ${
              validItemsCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/30'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            <span>பில் முடிக்க</span>
          </button>
        </div>
      </div>

      {/* Product Search Modal */}
      <ProductSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={totalAmount}
        onCompleteBill={handleCompleteBill}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        bill={completedBill}
        settings={settings}
        onNewBill={handleResetBill}
      />
    </div>
  );
};
