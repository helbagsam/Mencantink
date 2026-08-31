import React, { useState } from 'react';
import { NavTab, Currency } from '../types';
import { BatikLogo } from './BatikLogo';
import { Menu, X, UserCheck, Grid, BookOpen, Users, ShoppingCart, Truck, Globe, Home } from 'lucide-react';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAuth: () => void;
  cartCount?: number;
  currency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  onOpenAuth,
  cartCount = 0,
  currency = 'IDR',
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-4 h-4 inline mr-1" /> },
    { id: 'education', label: 'Edukasi Batik', icon: <BookOpen className="w-4 h-4 inline mr-1" /> },
    { id: 'marketplace', label: 'Pasar Nusantara', icon: <Grid className="w-4 h-4 inline mr-1" /> },
    { id: 'heritage', label: 'Warisan Budaya', icon: <BookOpen className="w-4 h-4 inline mr-1" /> },
    { id: 'community', label: 'Komunitas & Event', icon: <Users className="w-4 h-4 inline mr-1" /> },
    { id: 'portal', label: 'Portal Pengrajin', icon: <UserCheck className="w-4 h-4 inline mr-1" /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 fixed top-0 w-full z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center gap-2">
        {/* Brand / Logo */}
        <button 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <BatikLogo size={38} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-serif-garamond text-base sm:text-lg md:text-xl font-bold text-[#000666] tracking-wide leading-none whitespace-nowrap">
              BATIK NUSANTARA
            </span>
            <span className="text-[8px] sm:text-[9px] font-sans tracking-widest text-[#a14000] uppercase font-bold mt-1 whitespace-nowrap">
              Komunitas Pengrajin Batik Indonesia
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-3 2xl:gap-5 text-xs font-sans uppercase tracking-wider font-semibold">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-all duration-200 py-1.5 px-2 rounded-lg relative focus:outline-none flex items-center gap-1 whitespace-nowrap shrink-0 text-[11px] xl:text-xs ${
                  isActive
                    ? 'text-[#000666] font-bold border-b-2 border-[#000666] bg-slate-50/80'
                    : 'text-slate-600 hover:text-[#000666] hover:bg-slate-50/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1.5 text-xs font-bold text-slate-700 shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#a14000] shrink-0" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent border-none text-[11px] font-bold uppercase cursor-pointer focus:ring-0 p-0 pr-1 text-slate-800"
            >
              <option value="IDR">ID | IDR</option>
              <option value="USD">EN | USD</option>
            </select>
          </div>

          {/* Cart & Tracking Icon Group */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 gap-1 shrink-0">
            <button
              onClick={() => onTabChange('cart')}
              className={`px-2.5 py-1.5 rounded-full relative transition-all flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shrink-0 ${
                currentTab === 'cart' ? 'bg-[#000666] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px] xl:text-xs">Keranjang</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 bg-[#c85a17] text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('tracking')}
              className={`px-2.5 py-1.5 rounded-full relative transition-all flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shrink-0 ${
                currentTab === 'tracking' ? 'bg-[#c85a17] text-white shadow-sm' : 'text-[#a14000] hover:bg-slate-200'
              }`}
              title="Pesanan Saya & Lacak Pengiriman"
            >
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px] xl:text-xs">Pesanan Saya</span>
            </button>
          </div>

          <button
            onClick={onOpenAuth}
            className="hidden 2xl:block border border-[#000666] text-[#000666] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#000666] hover:text-white transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            Masuk
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-800 rounded-md focus:outline-none hover:bg-slate-100 ml-2"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 shadow-xl">
          {/* Mobile Currency Switcher */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs font-bold">
            <span className="text-slate-600 uppercase tracking-wider">Mata Uang / Currency:</span>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value as Currency)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs py-1 px-2 font-bold focus:ring-0"
            >
              <option value="IDR">ID | IDR (Rp)</option>
              <option value="USD">EN | USD ($)</option>
            </select>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-between ${
                currentTab === item.id
                  ? 'bg-[#000666] text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              {currentTab === item.id && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center border border-[#000666] text-[#000666] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#000666] hover:text-white transition-all"
            >
              Masuk / Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
