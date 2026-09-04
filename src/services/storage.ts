import Dexie, { type Table } from 'dexie';
import { Product, Bill, ShopSettings, BillItem } from '../types';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { generateSearchTerms } from '../utils/transliteration';

export class ShopDatabase extends Dexie {
  products!: Table<Product, string>;
  bills!: Table<Bill, string>;
  settings!: Table<ShopSettings, string>;

  constructor() {
    super('ThimmaKannanShopDB');
    
    this.version(1).stores({
      products: 'id, nameTamil, price, unit, createdAt',
      bills: 'id, billNumber, totalAmount, paymentMethod, createdAt, formattedDate',
      settings: 'id'
    });
  }
}

export const db = new ShopDatabase();

const DEFAULT_SETTINGS: ShopSettings = {
  id: 'shop_config',
  shopName: 'திம்ம கண்ணன்',
  tagline: 'பூஜை பொருட்கள் & மளிகை கடை',
  phone: '9876543210',
  address: 'கடை வீதி, தமிழ்நாடு',
  lastBillNumber: 1000,
  currencySymbol: '₹'
};

const DRAFT_BILL_KEY = 'tk_draft_bill_items';
const PRODUCTS_LOCAL_KEY = 'tk_products_cache';
const SETTINGS_LOCAL_KEY = 'tk_settings_cache';
const BILLS_LOCAL_KEY = 'tk_bills_cache';

/**
 * Save draft bill in localStorage so tab switches or refreshes retain all items
 */
export function saveDraftBill(items: BillItem[]): void {
  try {
    localStorage.setItem(DRAFT_BILL_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save draft bill to localStorage', err);
  }
}

/**
 * Load draft bill from localStorage
 */
export function loadDraftBill(): BillItem[] | null {
  try {
    const saved = localStorage.getItem(DRAFT_BILL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load draft bill from localStorage', err);
  }
  return null;
}

/**
 * Clear draft bill from localStorage
 */
export function clearDraftBill(): void {
  try {
    localStorage.removeItem(DRAFT_BILL_KEY);
  } catch (err) {
    console.error('Failed to clear draft bill', err);
  }
}

/**
 * Initialize database with default products and settings
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check localStorage cache first
    const cachedProds = localStorage.getItem(PRODUCTS_LOCAL_KEY);
    if (!cachedProds) {
      localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    }

    const cachedSettings = localStorage.getItem(SETTINGS_LOCAL_KEY);
    if (!cachedSettings) {
      localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }

    const productCount = await db.products.count();
    if (productCount === 0) {
      await db.products.bulkAdd(DEFAULT_PRODUCTS);
    }

    const settings = await db.settings.get('shop_config');
    if (!settings) {
      await db.settings.put(DEFAULT_SETTINGS);
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

/**
 * Get all products (IndexedDB with instant localStorage fallback)
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const list = await db.products.toArray();
    if (list.length > 0) {
      localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Dexie error, reading from localStorage:', err);
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem(PRODUCTS_LOCAL_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return DEFAULT_PRODUCTS;
}

/**
 * Add a new product
 */
export async function addProduct(
  nameTamil: string,
  price: number,
  unit: Product['unit'],
  customAliases: string[] = []
): Promise<Product> {
  const newProduct: Product = {
    id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    nameTamil: nameTamil.trim(),
    price: Math.max(0, Number(price) || 0),
    unit,
    searchTerms: generateSearchTerms(nameTamil, customAliases),
    isCustom: true,
    createdAt: Date.now()
  };

  try {
    await db.products.put(newProduct);
  } catch {}

  const current = await getAllProducts();
  const updated = [newProduct, ...current.filter(p => p.id !== newProduct.id)];
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(updated));

  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(product: Product): Promise<void> {
  product.searchTerms = generateSearchTerms(product.nameTamil);
  try {
    await db.products.put(product);
  } catch {}

  const current = await getAllProducts();
  const updated = current.map(p => p.id === product.id ? product : p);
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(updated));
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await db.products.delete(id);
  } catch {}

  const current = await getAllProducts();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(updated));
}

/**
 * Reset products to defaults
 */
export async function resetDefaultProducts(): Promise<void> {
  try {
    await db.products.clear();
    await db.products.bulkAdd(DEFAULT_PRODUCTS);
  } catch {}
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(DEFAULT_PRODUCTS));
}

/**
 * Get next sequential bill number
 */
export async function getNextBillNumber(): Promise<number> {
  const settings = await getShopSettings();
  const nextNum = (settings.lastBillNumber || 1000) + 1;
  return nextNum;
}

/**
 * Save completed bill and increment bill number
 */
export async function saveBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  const fullBill: Bill = {
    ...bill,
    id: 'bill_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
  };

  try {
    await db.bills.put(fullBill);
  } catch {}

  // Sync to bills in localStorage
  const existingBills = await getAllBills();
  const updatedBills = [fullBill, ...existingBills.filter(b => b.id !== fullBill.id)];
  localStorage.setItem(BILLS_LOCAL_KEY, JSON.stringify(updatedBills));

  // Update last bill number in settings
  const settings = await getShopSettings();
  if (fullBill.billNumber >= settings.lastBillNumber) {
    settings.lastBillNumber = fullBill.billNumber;
    await updateShopSettings(settings);
  }

  // Clear draft bill since bill is completed
  clearDraftBill();

  return fullBill;
}

/**
 * Get all completed bills
 */
export async function getAllBills(): Promise<Bill[]> {
  try {
    const list = await db.bills.orderBy('createdAt').reverse().toArray();
    if (list.length > 0) {
      localStorage.setItem(BILLS_LOCAL_KEY, JSON.stringify(list));
      return list;
    }
  } catch {}

  try {
    const cached = localStorage.getItem(BILLS_LOCAL_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return [];
}

/**
 * Get shop settings
 */
export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const settings = await db.settings.get('shop_config');
    if (settings) {
      localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(settings));
      return settings;
    }
  } catch {}

  try {
    const cached = localStorage.getItem(SETTINGS_LOCAL_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  return DEFAULT_SETTINGS;
}

/**
 * Update shop settings
 */
export async function updateShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
  const current = await getShopSettings();
  const updated = { ...current, ...settings };
  try {
    await db.settings.put(updated);
  } catch {}
  localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Export all DB data as JSON for offline backup
 */
export async function exportDatabaseBackup(): Promise<string> {
  const products = await getAllProducts();
  const bills = await getAllBills();
  const settings = await getShopSettings();

  const backupData = {
    version: 1,
    exportDate: new Date().toISOString(),
    shopName: settings.shopName,
    products,
    bills,
    settings
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * Import backup data from JSON
 */
export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid backup file');
    }

    try {
      await db.products.clear();
      await db.products.bulkAdd(data.products);
      if (data.bills && Array.isArray(data.bills)) {
        await db.bills.clear();
        await db.bills.bulkAdd(data.bills);
      }
      if (data.settings) {
        await db.settings.put(data.settings);
      }
    } catch {}

    localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(data.products));
    if (data.bills) localStorage.setItem(BILLS_LOCAL_KEY, JSON.stringify(data.bills));
    if (data.settings) localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(data.settings));

    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
