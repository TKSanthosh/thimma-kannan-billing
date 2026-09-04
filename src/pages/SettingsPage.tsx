import React, { useState } from 'react';
import { Settings, Save, Download, Upload, RotateCcw, Store, Phone, MapPin, Check, Smartphone } from 'lucide-react';
import { ShopSettings } from '../types';
import { updateShopSettings, exportDatabaseBackup, importDatabaseBackup, resetDefaultProducts } from '../services/storage';

interface SettingsPageProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onRefreshAll: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onRefreshAll
}) => {
  const [shopName, setShopName] = useState(settings.shopName || 'திம்ம கண்ணன்');
  const [tagline, setTagline] = useState(settings.tagline || 'பூஜை பொருட்கள் & மளிகை கடை');
  const [phone, setPhone] = useState(settings.phone || '');
  const [address, setAddress] = useState(settings.address || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateShopSettings({
      shopName: shopName.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      address: address.trim()
    });
    onUpdateSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportBackup = async () => {
    const jsonStr = await exportDatabaseBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thimma-kannan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        if (window.confirm('இந்த கோப்பிலிருந்து தரவை மீட்டமைக்கவா? தற்போதைய தரவு மாற்றப்படும்.')) {
          const success = await importDatabaseBackup(content);
          if (success) {
            alert('தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது!');
            onRefreshAll();
          } else {
            alert('தரவு மீட்டமைப்பில் பிழை ஏற்பட்டது. கோப்பை சரிபார்க்கவும்.');
          }
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetProducts = async () => {
    if (window.confirm('மாதிரி பொருட்களை மீண்டும் ஏற்ற வேண்டுமா?')) {
      await resetDefaultProducts();
      alert('மாதிரி பொருட்கள் மீட்டமைக்கப்பட்டன!');
      onRefreshAll();
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-28 space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 font-tamil">கடை அமைப்புகள்</h2>
        <p className="text-xs text-slate-500 font-medium">கடை விவரங்கள் மற்றும் தரவு சேமிப்பு</p>
      </div>

      {/* Shop Info Form */}
      <form onSubmit={handleSaveInfo} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 font-tamil border-b border-slate-100 pb-3">
          <Store className="w-5 h-5 text-emerald-600" />
          <h3>கடை தகவல்</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
            கடையின் பெயர்:
          </label>
          <input
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-600 font-tamil"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
            குறிப்பு / அடைமொழி:
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 font-tamil"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
            தொலைபேசி எண்:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 font-tamil">
            முகவரி:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="கடை வீதி, தமிழ்நாடு"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 font-tamil"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 font-tamil transition-all"
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>சேமிக்கப்பட்டது!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>விவரங்களை சேமிக்க</span>
            </>
          )}
        </button>
      </form>

      {/* Backup & Restore Box */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
        <h3 className="font-bold text-base text-slate-900 font-tamil">தரவு சேமிப்பு & மீட்டமைத்தல் (Backup)</h3>
        <p className="text-xs text-slate-500">
          அனைத்து பில்கள் மற்றும் பொருட்கள் உங்கள் மொபைலிலேயே பாதுகாப்பாக சேமிக்கப்படுகின்றன (Offline-first).
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="py-3 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-slate-300 shadow-2xs font-tamil transition-all"
          >
            <Download className="w-5 h-5 text-emerald-600" />
            <span>தரவு ஏற்றுமதி (Backup)</span>
          </button>

          <label className="py-3 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-slate-300 shadow-2xs font-tamil cursor-pointer transition-all">
            <Upload className="w-5 h-5 text-indigo-600" />
            <span>தரவு இறக்குமதி (Restore)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={handleResetProducts}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-200 font-tamil transition-all"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>மாதிரி பொருட்களை மீட்டமைக்க</span>
          </button>
        </div>
      </div>

      {/* App Info Box */}
      <div className="text-center text-xs text-slate-500 space-y-1 pt-2 font-tamil">
        <p className="font-bold text-slate-700">திம்ம கண்ணன் - மொபைல் பில்லிங் PWA</p>
        <p>பதிப்பு 1.0.0 • Offline Ready • GitHub Pages</p>
      </div>
    </div>
  );
};
