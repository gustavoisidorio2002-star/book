import React from 'react';
import { Order, GoogleUser } from '../types';
import { formatBRL } from '../utils/formatters';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  googleUser: GoogleUser | null;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  googleUser,
}) => {
  if (!isOpen) return null;

  const userOrders = googleUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === googleUser.email.toLowerCase() ||
          o.customerName.toLowerCase() === googleUser.name.toLowerCase()
      )
    : [];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Em Preparação':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Enviado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregue':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="orders-history-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#E0E0E0]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] border border-[#D4AF37]/40 text-[#D4AF37]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-white text-base tracking-wide">Meus Pedidos Realizados</h3>
              <p className="text-xs text-[#888888]">Histórico de compras vinculadas à sua Conta Google</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-white rounded-full hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#555555] mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-base font-serif-luxury">Nenhum pedido encontrado</h4>
              <p className="text-xs text-[#888888] max-w-sm mx-auto">
                Você ainda não realizou compras com a conta {googleUser?.email}.
              </p>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#161616] rounded-xl border border-[#2A2A2A] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#222222]">
                  <div>
                    <span className="text-xs font-bold text-[#888888]">Pedido:</span>
                    <span className="ml-1.5 font-mono font-bold text-[#D4AF37] text-sm">{order.id}</span>
                    <span className="text-[#666666] text-xs ml-3 font-medium">{order.createdAt}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#1A2518] text-emerald-400 border border-emerald-800/40">
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#0E0E0E] p-2.5 rounded-lg border border-[#222222]">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-md object-cover border border-[#2A2A2A]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.productName}</p>
                        <p className="text-[11px] text-[#888888]">Qtd: {item.quantity} × {formatBRL(item.price)}</p>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37] font-serif-editorial">
                        {formatBRL(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-[#222222]">
                  <div className="text-[#888888]">
                    <span>Pagamento: <strong className="text-white">{order.paymentMethod}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#888888] mr-2">Total Pago:</span>
                    <span className="text-base font-bold text-[#D4AF37] font-serif-editorial">{formatBRL(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
