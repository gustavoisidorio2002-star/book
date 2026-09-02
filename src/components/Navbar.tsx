import React, { useState } from 'react';
import { GoogleUser, ManagerUser, CartItem, StoreCategory } from '../types';
import { 
  ShoppingBag, 
  Search, 
  User, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Package, 
  Sparkles,
  ChevronDown,
  ExternalLink,
  Layers
} from 'lucide-react';

interface NavbarProps {
  googleUser: GoogleUser | null;
  managerUser: ManagerUser | null;
  cartItems: CartItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: StoreCategory;
  onSelectCategory: (cat: StoreCategory) => void;
  onOpenGoogleAuth: () => void;
  onGoogleLogout: () => void;
  onOpenManagerLogin: () => void;
  onOpenManagerDashboard: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
}

const CATEGORIES: StoreCategory[] = [
  'Todos',
  'Smartphones',
  'Informática',
  'Áudio & Vídeo',
  'Smart Home',
  'Acessórios'
];

export const Navbar: React.FC<NavbarProps> = ({
  googleUser,
  managerUser,
  cartItems,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenGoogleAuth,
  onGoogleLogout,
  onOpenManagerLogin,
  onOpenManagerDashboard,
  onOpenCart,
  onOpenOrders,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A] shadow-md">
      {/* Top Banner with Quick Highlights and Manager Link */}
      <div className="bg-[#121212] text-[#888888] text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Ofertas Especiais com Frete Seguro
          </span>
          <span className="hidden sm:inline text-[#333333]">•</span>
          <span className="hidden sm:inline text-[#A0A0A0]">
            Até 12x sem juros ou 5% OFF extra via PIX
          </span>
        </div>

        <div className="flex items-center gap-3">
          {managerUser ? (
            <button
              id="header-manager-dashboard-btn"
              onClick={onOpenManagerDashboard}
              className="inline-flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black px-2.5 py-0.5 rounded font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              Painel do Gestor Ativo
            </button>
          ) : (
            <button
              id="header-manager-login-btn"
              onClick={onOpenManagerLogin}
              className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#D4AF37] hover:text-[#e2bd46] px-2.5 py-0.5 rounded font-semibold text-[11px] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Acesso Gestor
            </button>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:scale-105 transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury text-xl tracking-widest text-white block leading-tight uppercase">
                  Nexus<span className="text-[#D4AF37]">Store</span>
                </span>
                <span className="text-[9px] font-semibold text-[#888888] uppercase tracking-widest block font-sans">
                  Coleção & Destaques
                </span>
              </div>
            </a>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar produtos, coleções e destaques..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#121212] hover:bg-[#161616] focus:bg-[#181818] border border-[#2A2A2A] focus:border-[#D4AF37] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-[#666666]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-[#888888] hover:text-[#D4AF37]"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons: Google Account & Cart */}
          <div className="flex items-center gap-3">
            {/* Google Account Menu / Login Button */}
            {googleUser ? (
              <div className="relative">
                <button
                  id="google-user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-[#2A2A2A] hover:border-[#D4AF37]/50 bg-[#121212] hover:bg-[#1A1A1A] transition-all cursor-pointer"
                >
                  <img
                    src={googleUser.avatar}
                    alt={googleUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#2A2A2A]"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#E0E0E0] leading-tight flex items-center gap-1">
                      {googleUser.givenName}
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] inline" />
                    </p>
                    <p className="text-[10px] text-[#888888] truncate max-w-[120px]">
                      {googleUser.email}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-[#141414] rounded-xl shadow-2xl border border-[#2A2A2A] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-3 border-b border-[#222222]">
                      <p className="text-[10px] uppercase font-semibold text-[#888888] tracking-wider">Conectado via Google</p>
                      <p className="text-sm font-bold text-white mt-0.5">{googleUser.name}</p>
                      <p className="text-xs text-[#888888] truncate">{googleUser.email}</p>
                    </div>

                    <div className="p-1">
                      <button
                        id="user-menu-my-orders-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenOrders();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-[#E0E0E0] hover:bg-[#1E1E1E] hover:text-[#D4AF37] rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        Meus Pedidos & Rastreio
                      </button>
                    </div>

                    <div className="border-t border-[#222222] p-1">
                      <button
                        id="user-menu-logout-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          onGoogleLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Desconectar Conta Google
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="google-login-trigger-btn"
                onClick={onOpenGoogleAuth}
                className="flex items-center gap-2 bg-white text-black hover:bg-[#E0E0E0] px-4 py-2.5 rounded font-semibold text-xs transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Login via Google</span>
                <span className="sm:hidden">Google</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              id="open-cart-drawer-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-lg bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#D4AF37]/50 text-[#E0E0E0] hover:text-[#D4AF37] transition-all cursor-pointer group"
              aria-label="Ver Carrinho de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span 
                  id="cart-count-badge"
                  className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform animate-in zoom-in"
                >
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-[#1C1C1C]">
          <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest pl-1 hidden sm:inline font-sans">Coleções:</span>
          <div className="flex items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1 rounded text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-[#141414] text-[#888888] border border-[#2A2A2A] hover:text-white hover:border-[#3A3A3A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
