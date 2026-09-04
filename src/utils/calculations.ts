import { BillItem } from '../types';

/**
 * Calculate row total safely avoiding JS floating point inaccuracies
 */
export function calculateRowTotal(unitPrice: number, quantity: number): number {
  const p = Math.max(0, Number(unitPrice) || 0);
  const q = Math.max(0, Number(quantity) || 0);
  return Math.round((p * q) * 100) / 100;
}

/**
 * Calculate total for the entire bill items list
 */
export function calculateBillTotal(items: BillItem[]): number {
  const sum = items.reduce((acc, item) => {
    // Only calculate rows that have a product selected or price > 0
    if (item.nameTamil && item.nameTamil.trim() !== '') {
      return acc + (item.total || calculateRowTotal(item.unitPrice, item.quantity));
    }
    return acc;
  }, 0);
  
  return Math.round(sum * 100) / 100;
}

/**
 * Calculate change to be returned to customer
 */
export function calculateChange(totalAmount: number, cashReceived: number): number {
  const change = (cashReceived || 0) - (totalAmount || 0);
  return Math.max(0, Math.round(change * 100) / 100);
}
