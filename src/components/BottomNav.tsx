import React from 'react';
import { ShoppingBag, Package, History, BarChart3, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'billing',
      label: 'முகப்பு',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      id: 'products',
      label: 'பொருட்கள்',
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 'history',
      label: 'வரலாறு',
      icon: <History className="w-6 h-6" />
    },
    {
      id: 'sales',
      label: 'விற்பனை',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      id: 'settings',
      label: 'அமைப்புகள்',
      icon: <Settings className="w-6 h-6" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-30 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150 min-w-[64px] ${
                isActive
                  ? 'text-emerald-700 font-bold bg-emerald-50 scale-105 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className={isActive ? 'text-emerald-700 stroke-[2.5]' : 'text-slate-500'}>
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
