import React, { useState } from 'react';
import { Product } from '../types';
import { formatBRL, formatInstallment } from '../utils/formatters';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Zap, 
  ShoppingBag, 
  Check, 
  Share2, 
  Heart,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenGoogleAuth?: () => void;
  isLoggedInGoogle?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  const currentImage = selectedImage || product.imageUrl;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBuy = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#E0E0E0]">
        
        {/* Top bar */}
        <div className="p-4 sm:px-6 border-b border-[#222222] flex items-center justify-between bg-[#0E0E0E]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#1A1A1A] border border-[#2C2C2C] px-2.5 py-1 rounded">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="text-[10px] font-bold text-black bg-[#D4AF37] px-2.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-black fill-black" />
                {product.badge || 'Destaque'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFavorite ? 'text-rose-400 bg-rose-950/40 border-rose-800/40' : 'text-[#888888] hover:text-white border-[#2A2A2A] bg-[#161616]'
              }`}
              title="Salvar como favorito"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-[#2A2A2A] bg-[#161616] text-[#888888] hover:text-white transition-colors relative cursor-pointer"
              title="Copiar link"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[#D4AF37] border border-[#333333] text-[10px] py-1 px-2 rounded whitespace-nowrap">
                  Link copiado!
                </span>
              )}
            </button>

            <button
              id="close-product-detail-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#222222] text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Section */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square bg-[#181818] rounded-xl overflow-hidden border border-[#2A2A2A] shadow-inner flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        currentImage === imgUrl ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#2A2A2A] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#E0E0E0]">{product.rating}</span>
                  <span className="text-xs text-[#888888]">({product.reviewCount} avaliações verificadas)</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price card */}
              <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-4 space-y-1.5">
                {product.originalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#666666] line-through font-serif-editorial">
                      {formatBRL(product.originalPrice)}
                    </span>
                    {discountPercent && (
                      <span className="bg-rose-950/60 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-rose-800/40 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-rose-300" />
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif-editorial font-bold text-white tracking-tight">
                    {formatBRL(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-[#D4AF37] bg-[#222222] px-2 py-0.5 rounded">
                    5% OFF extra no PIX
                  </span>
                </div>

                <p className="text-xs text-[#888888] font-medium flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  ou {formatInstallment(product.price, product.installments)}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5">Descrição do Produto</h4>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features List */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Destaques Principais</h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#C0C0C0]">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity selector & Add to cart */}
              <div className="pt-3 border-t border-[#222222] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A0A0A0]">Quantidade:</span>
                  <div className="flex items-center border border-[#2A2A2A] rounded-lg overflow-hidden bg-[#161616]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-[#252525] text-[#E0E0E0] font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-white bg-[#0A0A0A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 hover:bg-[#252525] text-[#E0E0E0] font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleBuy}
                    className="flex-1 py-3.5 px-6 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar ao Carrinho ({formatBRL(product.price * quantity)})</span>
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222222] text-[11px] text-[#888888]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Envio com seguro total</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Garantia de 12 meses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#888888]" />
                  <span>Devolução em 7 dias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Original e Autêntico</span>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="pt-6 border-t border-[#222222]">
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#161616] p-4 rounded-xl border border-[#2A2A2A]">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-[#222222] pb-2 text-xs">
                    <span className="text-[#888888] font-medium">{key}:</span>
                    <span className="text-white font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
