import React from 'react';
import { Product } from '../types';
import { formatBRL, formatInstallment } from '../utils/formatters';
import { ShoppingBag, Star, Eye, Zap, Truck, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-[#141414] rounded-xl border border-[#262626] hover:border-[#D4AF37]/60 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#1A1A1A] cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#0A0A0A]/90 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-widest backdrop-blur-xs">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-950/90 text-rose-300 border border-rose-800/40 font-extrabold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 w-fit">
              <Zap className="w-2.5 h-2.5 fill-rose-300" />
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          id={`quick-view-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="absolute bottom-3 right-3 bg-[#0A0A0A]/90 hover:bg-black text-[#E0E0E0] hover:text-[#D4AF37] border border-[#333333] p-2 rounded shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Ver detalhes do produto"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {/* Category and Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#D4AF37] bg-[#1C1C1C] border border-[#2C2C2C] px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-bold text-[#E0E0E0]">{product.rating}</span>
              <span className="text-[#666666] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-serif-luxury font-bold text-white text-base leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2 cursor-pointer tracking-wide"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Value and Pricing info */}
        <div className="pt-3 border-t border-[#222222] space-y-3">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-[#666666] line-through font-serif-editorial">
                {formatBRL(product.originalPrice)}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-serif-editorial font-bold text-white tracking-tight">
                {formatBRL(product.price)}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37]">à vista</span>
            </div>
            <p className="text-[11px] text-[#888888] mt-0.5">
              {formatInstallment(product.price, product.installments)}
            </p>
          </div>

          {/* Shipping highlight */}
          {product.freeShipping && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-1 rounded">
              <Truck className="w-3.5 h-3.5" />
              <span>Frete com Seguro Incluso</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="flex-1 py-2.5 px-3 bg-[#D4AF37] hover:bg-[#e2bd46] active:bg-[#c49f2b] text-black font-bold uppercase tracking-wider text-[11px] rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>

            <button
              id={`view-detail-btn-${product.id}`}
              onClick={() => onSelect(product)}
              className="py-2.5 px-3 bg-[#1A1A1A] hover:bg-[#252525] text-[#E0E0E0] hover:text-white border border-[#333333] font-semibold text-xs rounded transition-colors cursor-pointer"
            >
              Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
