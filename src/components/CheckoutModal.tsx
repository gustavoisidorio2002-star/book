import React, { useState } from 'react';
import { CartItem, GoogleUser, Order } from '../types';
import { formatBRL } from '../utils/formatters';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Copy, 
  Check, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  googleUser: GoogleUser;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  googleUser,
  discountAmount,
  onOrderCompleted,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito'>('PIX');
  const [address, setAddress] = useState('Av. Paulista, 1000 - Bela Vista, São Paulo - SP');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(googleUser.name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 299 ? 0 : 29.90;
  const pixDiscount = paymentMethod === 'PIX' ? subtotal * 0.05 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount - pixDiscount + shipping);

  const pixCode = `00020126580014br.gov.bcb.pix0136nexus-store-${Date.now()}520400005303986540${finalTotal.toFixed(2)}5802BR5910NEXUSSTORE6009SAOPAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: googleUser.name,
        customerEmail: googleUser.email,
        customerAvatar: googleUser.avatar,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.imageUrl,
          quantity: i.quantity,
          price: i.product.price,
        })),
        totalAmount: finalTotal,
        discount: discountAmount + pixDiscount,
        status: paymentMethod === 'PIX' ? 'Aprovado' : 'Aprovado',
        paymentMethod,
        createdAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        shippingAddress: address,
      };

      setIsProcessing(false);
      setOrderSuccess(newOrder);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  return (
    <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#E0E0E0]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] border border-[#D4AF37]/40 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-white text-base tracking-wide">Finalizar Pedido com Google</h3>
              <p className="text-xs text-[#888888]">Checkout Seguro Criptografado</p>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-white rounded-full hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {!orderSuccess ? (
            <>
              {/* Authenticated User Banner */}
              <div className="p-4 bg-[#161616] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={googleUser.avatar}
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full border border-[#D4AF37]/40 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{googleUser.name}</p>
                    <p className="text-xs text-[#888888]">{googleUser.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#1F1C14] px-2.5 py-1 rounded border border-[#D4AF37]/30">
                  Google ID Ativo
                </span>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-[#C0C0C0] uppercase tracking-wider mb-1.5">
                  Endereço de Entrega
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161616] border border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white"
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#C0C0C0] uppercase tracking-wider mb-2">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      paymentMethod === 'PIX'
                        ? 'border-[#D4AF37] bg-[#1A1812] ring-1 ring-[#D4AF37]'
                        : 'border-[#2A2A2A] bg-[#161616] hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm">
                        <QrCode className="w-5 h-5" />
                        <span>PIX Instantâneo</span>
                      </div>
                      <span className="text-[9px] font-extrabold bg-[#D4AF37] text-black px-1.5 py-0.5 rounded uppercase">
                        5% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888888]">Aprovação imediata com QR Code</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cartão de Crédito')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      paymentMethod === 'Cartão de Crédito'
                        ? 'border-[#D4AF37] bg-[#1A1812] ring-1 ring-[#D4AF37]'
                        : 'border-[#2A2A2A] bg-[#161616] hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                        <span>Cartão de Crédito</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#888888]">Parcele em até 12x</p>
                  </button>
                </div>
              </div>

              {/* Payment Details Form/QR */}
              {paymentMethod === 'PIX' ? (
                <div className="p-4 bg-[#161616] rounded-xl border border-[#2A2A2A] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded-lg border border-[#333333] shadow-xs flex items-center justify-center shrink-0">
                    <div className="text-center space-y-1">
                      <QrCode className="w-16 h-16 mx-auto text-black" />
                      <span className="text-[9px] font-mono text-black font-bold block">PIX QR Code</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <p className="text-xs font-bold text-[#E0E0E0]">Código PIX Copia e Cola:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixCode}
                        className="flex-1 text-[11px] font-mono bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#A0A0A0] truncate select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3 py-2 bg-[#D4AF37] hover:bg-[#e2bd46] text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedPix ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[#888888]">
                      Abra o aplicativo do seu banco e selecione a opção <strong className="text-[#D4AF37]">PIX Copia e Cola</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#161616] rounded-xl border border-[#2A2A2A] space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888888] mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-white font-mono"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#888888] mb-1">Nome Impresso</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#888888] mb-1">Validade / CVV</label>
                      <input
                        type="text"
                        defaultValue="12/29 • 888"
                        className="w-full px-3 py-2 text-xs bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Breakdown */}
              <div className="p-4 bg-[#161616] rounded-xl border border-[#2A2A2A] space-y-2 text-xs">
                <div className="flex justify-between text-[#888888]">
                  <span>Itens ({items.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="font-serif-editorial text-white">{formatBRL(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-semibold">
                    <span>Cupom de Desconto</span>
                    <span className="font-serif-editorial">-{formatBRL(discountAmount)}</span>
                  </div>
                )}
                {pixDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-semibold">
                    <span>Desconto Pagamento PIX (5%)</span>
                    <span className="font-serif-editorial">-{formatBRL(pixDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888888]">
                  <span>Frete</span>
                  <span>{shipping === 0 ? <strong className="text-[#D4AF37]">GRÁTIS</strong> : formatBRL(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#222222]">
                  <span>Total Final:</span>
                  <span className="text-[#D4AF37] font-serif-editorial text-lg">{formatBRL(finalTotal)}</span>
                </div>
              </div>

              {/* Confirm Action Button */}
              <button
                id="confirm-checkout-order-btn"
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processando Pagamento...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Confirmar Pagamento • {formatBRL(finalTotal)}</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Order Success View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-white">Pedido Realizado com Sucesso!</h3>
                <p className="text-sm text-[#888888] mt-1">
                  Obrigado, {googleUser.givenName}! Enviamos o comprovante para <strong className="text-white">{googleUser.email}</strong>.
                </p>
              </div>

              <div className="bg-[#161616] p-4 rounded-xl border border-[#2A2A2A] text-left space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#222222]">
                  <span className="text-[#888888]">Número do Pedido:</span>
                  <span className="font-mono font-bold text-[#D4AF37] text-sm">{orderSuccess.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Status:</span>
                  <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">{orderSuccess.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Forma de Pagamento:</span>
                  <span className="font-semibold text-white">{orderSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Valor Total:</span>
                  <span className="font-bold text-[#D4AF37] font-serif-editorial text-sm">{formatBRL(orderSuccess.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Entrega:</span>
                  <span className="text-[#E0E0E0] truncate max-w-[280px]">{orderSuccess.shippingAddress}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  id="order-success-close-btn"
                  onClick={onClose}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-md text-xs cursor-pointer"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
