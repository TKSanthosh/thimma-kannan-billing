import React, { useState, useEffect } from 'react';
import { TabType, Product, ShopSettings } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BillingPage } from './pages/BillingPage';
import { ProductsPage } from './pages/ProductsPage';
import { BillHistoryPage } from './pages/BillHistoryPage';
import { SalesPage } from './pages/SalesPage';
import { SettingsPage } from './pages/SettingsPage';
import { getAllProducts, getShopSettings, initializeDatabase } from './services/storage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('billing');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    id: 'shop_config',
    shopName: 'திம்ம கண்ணன்',
    tagline: 'பூஜை பொருட்கள் & மளிகை கடை',
    phone: '9876543210',
    address: 'கடை வீதி, தமிழ்நாடு',
    lastBillNumber: 1000,
    currencySymbol: '₹'
  });
  const [billingKey, setBillingKey] = useState<number>(1);

  const loadData = async () => {
    await initializeDatabase();
    const [prods, sett] = await Promise.all([
      getAllProducts(),
      getShopSettings()
    ]);
    setProducts(prods);
    setSettings(sett);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetBilling = () => {
    setBillingKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-tamil text-slate-900 select-none pb-safe">
      {/* Top Header */}
      <Header
        settings={settings}
        showNewBillBtn={currentTab === 'billing'}
        onNewBill={handleResetBilling}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {currentTab === 'billing' && (
          <BillingPage
            key={billingKey}
            products={products}
            settings={settings}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            products={products}
            onRefresh={loadData}
          />
        )}

        {currentTab === 'history' && (
          <BillHistoryPage
            settings={settings}
          />
        )}

        {currentTab === 'sales' && (
          <SalesPage />
        )}

        {currentTab === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={setSettings}
            onRefreshAll={loadData}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />
    </div>
  );
};

export default App;
