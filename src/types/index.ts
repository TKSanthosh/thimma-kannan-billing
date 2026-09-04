export type UnitType = 'பீஸ்' | 'பாக்கெட்' | 'கிலோ' | 'கிராம்' | 'லிட்டர்' | 'டஜன்' | 'கட்டு';

export interface Product {
  id: string;
  nameTamil: string;
  price: number;
  unit: UnitType;
  searchTerms: string[];
  category?: string;
  isCustom?: boolean;
  createdAt: number;
}

export interface BillItem {
  id: string; // unique row id
  productId?: string;
  nameTamil: string;
  unitPrice: number;
  quantity: number;
  unit: UnitType;
  total: number;
  isCustomPrice?: boolean;
}

export type PaymentMethod = 'பணம்' | 'UPI';

export interface Bill {
  id: string;
  billNumber: number;
  items: BillItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  changeGiven?: number;
  createdAt: number;
  formattedDate: string;
  formattedTime: string;
}

export interface ShopSettings {
  id: string;
  shopName: string;
  tagline: string;
  phone: string;
  address: string;
  lastBillNumber: number;
  currencySymbol: string;
}

export type TabType = 'billing' | 'products' | 'history' | 'sales' | 'settings';
