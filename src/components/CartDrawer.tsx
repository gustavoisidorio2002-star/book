import React, { useState } from 'react';
import { CartItem, GoogleUser } from '../types';
import { formatBRL } from '../utils/formatters';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  googleUser: GoogleUser | null;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenGoogleAuth: () => void;
  onProceedToCheckout: (appliedDiscount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  googleUser,
  onUpdateQuantity,
  onRemoveItem,
  onOpenGoogleAuth,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 299 || subtotal === 0 ? 0 : 29.90;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const clean = couponCode.trim().toUpperCase();
    if (clean === 'BEMVINDO10' || clean === 'GOOGLE10') {
      setDiscountPercent(10);
      setCouponSuccess('Cupom de 10% aplicado com sucesso!');
    } else if (clean === 'GESTAO20' || clean === 'DESTAQUE20') {
      setDiscountPercent(20);
      setCouponSuccess('Cupom VIP de 20% aplicado com sucesso!');
    } else {
      setCouponError('Cupom inválido ou expirado. Tente BEMVINDO10');
    }
  };

  const handleCheckoutClick = () => {
    if (!googleUser) {
      onOpenGoogleAuth();
      return;
    }
    onProceedToCheckout(discountAmount, couponCode);
  };

  return (
    <div id="cart-drawer" className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121212] border-l border-[#2A2A2A] shadow-2xl flex flex-col text-[#E0E0E0]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-[#0A0A0A]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] border border-[#D4AF37]/40 text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-white text-base tracking-wide">Meu Carrinho</h3>
                <p className="text-xs text-[#888888]">
                  {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 text-[#888888] hover:text-white hover:bg-[#222222] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Notice / Google Account Status */}
          {!googleUser ? (
            <div className="bg-[#18150D] border-b border-[#D4AF37]/30 p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#E6C665]">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Faça login com Google para concluir a compra</span>
              </div>
              <button
                id="cart-google-login-btn"
                onClick={onOpenGoogleAuth}
                className="bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors shrink-0 text-[10px] cursor-pointer"
              >
                Conectar
              </button>
            </div>
          ) : (
            <div className="bg-[#121A15] border-b border-emerald-900/40 p-2.5 px-4 flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cliente: <strong className="text-white">{googleUser.name}</strong></span>
              </div>
              <span className="text-[10px] text-emerald-500 font-mono">Conta Verificada</span>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#666666] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#444444]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-sm font-serif-luxury">Seu carrinho está vazio</h4>
                <p className="text-xs text-[#888888] max-w-xs">
                  Explore nossos produtos em destaque e adicione seus itens favoritos.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#e2bd46] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Ver Vitrine de Ofertas
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  id={`cart-item-${item.product.id}`}
                  className="flex gap-3 p-3 bg-[#161616] rounded-xl border border-[#2A2A2A] items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-[#2A2A2A] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#D4AF37] font-serif-editorial mt-0.5">
                      {formatBRL(item.product.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#2A2A2A] bg-[#0E0E0E] rounded-md overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#252525] text-[#A0A0A0] hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#252525] text-[#A0A0A0] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#666666] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Remover produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#222222] bg-[#0E0E0E] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Cupom (BEMVINDO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white uppercase font-medium placeholder:text-[#666666]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#222222] hover:bg-[#2e2e2e] text-[#D4AF37] border border-[#333333] text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] font-semibold text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] font-semibold text-rose-400">
                  {couponError}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888]">
                  <span>Subtotal</span>
                  <span className="font-serif-editorial text-white">{formatBRL(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-semibold">
                    <span>Desconto ({discountPercent}%)</span>
                    <span className="font-serif-editorial">-{formatBRL(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888888]">
                  <span>Frete</span>
                  <span>{shipping === 0 ? <strong className="text-[#D4AF37]">GRÁTIS</strong> : formatBRL(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#222222]">
                  <span>Total</span>
                  <span className="text-[#D4AF37] font-serif-editorial text-lg">{formatBRL(total)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                id="cart-checkout-action-btn"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#e2bd46] active:bg-[#c9a42f] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {!googleUser ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    </svg>
                    <span>Fazer Login Google para Finalizar</span>
                  </>
                ) : (
                  <>
                    <span>Finalizar Compra</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
