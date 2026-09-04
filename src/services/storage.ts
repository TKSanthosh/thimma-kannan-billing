import Dexie, { type Table } from 'dexie';
import { Product, Bill, ShopSettings } from '../types';
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

/**
 * Initialize database with default products and settings if empty
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const productCount = await db.products.count();
    if (productCount === 0) {
      await db.products.bulkAdd(DEFAULT_PRODUCTS);
      console.log('Default Tamil pooja products populated.');
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
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const list = await db.products.toArray();
    if (list.length === 0) {
      await initializeDatabase();
      return await db.products.toArray();
    }
    return list;
  } catch {
    return DEFAULT_PRODUCTS;
  }
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

  await db.products.put(newProduct);
  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(product: Product): Promise<void> {
  product.searchTerms = generateSearchTerms(product.nameTamil);
  await db.products.put(product);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  await db.products.delete(id);
}

/**
 * Reset products to defaults
 */
export async function resetDefaultProducts(): Promise<void> {
  await db.products.clear();
  await db.products.bulkAdd(DEFAULT_PRODUCTS);
}

/**
 * Get next sequential bill number
 */
export async function getNextBillNumber(): Promise<number> {
  const settings = await db.settings.get('shop_config') || DEFAULT_SETTINGS;
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

  await db.bills.put(fullBill);

  // Update last bill number in settings
  const settings = await db.settings.get('shop_config') || DEFAULT_SETTINGS;
  if (fullBill.billNumber >= settings.lastBillNumber) {
    settings.lastBillNumber = fullBill.billNumber;
    await db.settings.put(settings);
  }

  return fullBill;
}

/**
 * Get all completed bills (sorted newest first)
 */
export async function getAllBills(): Promise<Bill[]> {
  try {
    const list = await db.bills.orderBy('createdAt').reverse().toArray();
    return list;
  } catch (err) {
    console.error('Failed to get bills:', err);
    return [];
  }
}

/**
 * Get shop settings
 */
export async function getShopSettings(): Promise<ShopSettings> {
  const settings = await db.settings.get('shop_config');
  return settings || DEFAULT_SETTINGS;
}

/**
 * Update shop settings
 */
export async function updateShopSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
  const current = await getShopSettings();
  const updated = { ...current, ...settings };
  await db.settings.put(updated);
  return updated;
}

/**
 * Export all DB data as JSON for offline backup
 */
export async function exportDatabaseBackup(): Promise<string> {
  const products = await db.products.toArray();
  const bills = await db.bills.toArray();
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

    await db.products.clear();
    await db.products.bulkAdd(data.products);

    if (data.bills && Array.isArray(data.bills)) {
      await db.bills.clear();
      await db.bills.bulkAdd(data.bills);
    }

    if (data.settings) {
      await db.settings.put(data.settings);
    }

    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
