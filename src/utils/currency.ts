/**
 * Format numbers as Indian Rupee string (e.g. ₹1,250 or ₹90)
 */
export function formatINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  
  const num = Number(amount);
  
  // Format with Indian numbering system
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  });
  
  return `₹${formatted}`;
}

export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
