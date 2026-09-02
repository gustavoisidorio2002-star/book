import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatBRL, formatInstallment } from '../utils/formatters';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  Star, 
  Zap, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  ShoppingBag
} from 'lucide-react';

interface FeaturedHeroProps {
  featuredProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  featuredProducts,
  onSelectProduct,
  onAddToCart,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no products are featured, fallback to first product
  const currentProduct = featuredProducts[currentIndex] || featuredProducts[0];

  // Auto-advance featured spotlight every 6 seconds
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (!currentProduct) return null;

  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#050505] text-white rounded-2xl my-6 border border-[#2A2A2A] shadow-2xl mx-4 sm:mx-6 lg:mx-8">
      {/* Subtle luxury ambient backlight */}
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Product Information & Value Callout */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-black font-extrabold text-[10px] px-3 py-1 rounded uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                {currentProduct.badge || 'DESTAQUE DA TEMPORADA'}
              </span>

              <span className="bg-[#181818] text-[#D4AF37] font-semibold text-xs px-3 py-1 rounded border border-[#2A2A2A] uppercase tracking-wider">
                {currentProduct.category}
              </span>

              {discountPercent && (
                <span className="bg-emerald-950/60 text-emerald-400 font-bold text-xs px-3 py-1 rounded border border-emerald-800/40 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400" />
                  Economize {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <span className="text-[#D4AF37] font-serif-editorial italic text-base sm:text-lg block mb-1">
                Coleção Exclusiva
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury tracking-wide text-white leading-tight">
                {currentProduct.name}
              </h1>
              <p className="mt-3 text-[#A0A0A0] text-sm sm:text-base leading-relaxed line-clamp-3">
                {currentProduct.description}
              </p>
            </div>

            {/* Price Highlight Area */}
            <div className="bg-[#161616]/80 backdrop-blur-md rounded-xl p-5 border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-[#888888] font-medium uppercase tracking-wider">Valor com Condições Exclusivas:</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-serif-editorial font-bold text-[#FFFFFF] tracking-tight">
                    {formatBRL(currentProduct.price)}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-sm sm:text-base text-[#666666] line-through font-serif-editorial">
                      {formatBRL(currentProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#D4AF37] font-medium mt-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ou {formatInstallment(currentProduct.price, currentProduct.installments)}
                </p>
              </div>

              {/* Countdown badge simulation */}
              <div className="bg-[#0D0D0D] px-4 py-2.5 rounded-lg border border-[#2A2A2A] text-center">
                <div className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider justify-center">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Disponibilidade</span>
                </div>
                <p className="text-xs text-[#E0E0E0] font-mono mt-0.5 font-bold">
                  {currentProduct.stock} unidades
                </p>
              </div>
            </div>

            {/* Highlights bullet list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentProduct.features.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#C0C0C0]">
                  <div className="w-4 h-4 rounded bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 text-[10px]">
                    ✓
                  </div>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-buy-now-btn"
                onClick={() => onAddToCart(currentProduct)}
                className="flex-1 sm:flex-initial px-8 py-3.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-details-btn"
                onClick={() => onSelectProduct(currentProduct)}
                className="px-6 py-3.5 bg-[#181818] hover:bg-[#222222] text-[#E0E0E0] hover:text-white font-bold uppercase tracking-widest text-xs rounded border border-[#333333] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>Detalhes</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#2A2A2A] text-[11px] text-[#888888]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                Envio com Seguro Total
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Garantia de 12 Meses
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                {currentProduct.rating} / 5.0 ({currentProduct.reviewCount} avaliações)
              </span>
            </div>

          </div>

          {/* Right Column: High Quality Product Image & Carousel Controls */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-square bg-[#161616] rounded-2xl p-4 border border-[#2A2A2A] flex items-center justify-center group overflow-hidden shadow-2xl">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating review card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md p-3 rounded-xl border border-[#2A2A2A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="font-bold text-white">{currentProduct.rating}</span>
                </div>
                <span className="text-[#888888] text-[11px] font-medium">
                  {currentProduct.reviewCount} clientes verificados
                </span>
              </div>
            </div>

            {/* Spotlight switcher pagination */}
            {featuredProducts.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  id="prev-featured-product-btn"
                  onClick={() => setCurrentIndex((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}
                  className="p-1.5 rounded-full bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#D4AF37] transition-colors"
                  aria-label="Destaque anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {featuredProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#2A2A2A] hover:bg-[#444444]'
                      }`}
                      aria-label={`Ver destaque ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  id="next-featured-product-btn"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)}
                  className="p-1.5 rounded-full bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#D4AF37] transition-colors"
                  aria-label="Próximo destaque"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
