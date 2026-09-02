import React, { useState, useEffect } from 'react';
import { Product, StoreCategory } from '../types';
import { X, Check, Image as ImageIcon, Sparkles, DollarSign, Package } from 'lucide-react';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

const CATEGORIES: StoreCategory[] = [
  'Smartphones',
  'Informática',
  'Áudio & Vídeo',
  'Smart Home',
  'Acessórios'
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Smartphones');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [stock, setStock] = useState<number>(10);
  const [installments, setInstallments] = useState<number>(10);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || 0);
      setShortDescription(product.shortDescription || '');
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setBadge(product.badge || '');
      setStock(product.stock);
      setInstallments(product.installments || 10);
      setIsFeatured(product.isFeatured);
      setFeaturesText((product.features || []).join('\n'));
    } else {
      setName('');
      setCategory('Smartphones');
      setPrice(999.00);
      setOriginalPrice(1299.00);
      setShortDescription('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80');
      setBadge('NOVIDADE');
      setStock(20);
      setInstallments(10);
      setIsFeatured(true);
      setFeaturesText('Alta durabilidade e acabamento premium\nBateria de longa duração\nGarantia de 1 ano');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedProduct: Product = {
      id: product ? product.id : `prod-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice > 0 ? Number(originalPrice) : undefined,
      shortDescription: shortDescription.trim() || description.slice(0, 90) + '...',
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      gallery: [imageUrl.trim()],
      features: featuresArray.length > 0 ? featuresArray : ['Produto de alta qualidade'],
      specs: product?.specs || { 'Garantia': '12 meses', 'Origem': 'Nacional' },
      rating: product ? product.rating : 4.9,
      reviewCount: product ? product.reviewCount : 1,
      stock: Number(stock),
      isFeatured,
      badge: badge.trim() || (isFeatured ? 'DESTAQUE' : undefined),
      installments: Number(installments),
      freeShipping: true,
      createdAt: product ? product.createdAt : new Date().toISOString(),
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div id="product-edit-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#E0E0E0]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between bg-[#0A0A0A] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#D4AF37] border border-[#D4AF37]/40">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-white text-base tracking-wide">
                {product ? 'Editar Produto / Valor / Destaque' : 'Adicionar Novo Produto à Loja'}
              </h3>
              <p className="text-xs text-[#888888]">Controle direto pelo Gestor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-white rounded-full hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Nome do Produto</label>
              <input
                id="edit-product-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Smart UltraBook Pro 16"
                className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-medium placeholder:text-[#666666]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Categoria</label>
              <select
                id="edit-product-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#161616] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Badge / Selo Promocional</label>
              <input
                id="edit-product-badge-input"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ex: SUPER DESTAQUE, MAIS VENDIDO"
                className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder:text-[#666666]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">
                Preço de Venda (R$) <span className="text-[#D4AF37] font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[#666666]">R$</span>
                <input
                  id="edit-product-price-input"
                  type="number"
                  step="0.01"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-serif-editorial font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Preço Original / De (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-[#666666]">R$</span>
                <input
                  id="edit-product-original-price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-serif-editorial"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Estoque Disponível</label>
              <input
                id="edit-product-stock-input"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Max Parcelas Sem Juros</label>
              <input
                id="edit-product-installments-input"
                type="number"
                min="1"
                max="24"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value, 10) || 12)}
                className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">URL da Imagem do Produto</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
                  <input
                    id="edit-product-image-url-input"
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-mono placeholder:text-[#666666]"
                  />
                </div>
                {imageUrl && (
                  <div className="w-10 h-10 rounded-lg border border-[#2A2A2A] overflow-hidden shrink-0">
                    <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">Descrição Completa do Produto</label>
              <textarea
                id="edit-product-description-textarea"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhes, benefícios, especificações do produto para os clientes..."
                className="w-full p-3 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white leading-relaxed placeholder:text-[#666666]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#C0C0C0] uppercase tracking-wider mb-1">
                Lista de Recursos em Destaque (um por linha)
              </label>
              <textarea
                id="edit-product-features-textarea"
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Acabamento Premium em Ouro e Titânio&#10;Bateria de longa duração&#10;Garantia Internacional de 1 ano"
                className="w-full p-3 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder:text-[#666666]"
              />
            </div>

            {/* Featured toggle */}
            <div className="sm:col-span-2 bg-[#1A1812] border border-[#D4AF37]/30 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="font-bold text-white">Exibir em Destaque Principal</p>
                  <p className="text-[11px] text-[#888888]">
                    Coloca o produto em evidência na vitrine principal e no topo da loja
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="edit-product-featured-toggle"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:border-[#2A2A2A] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-[#222222] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-[#888888] bg-[#1A1A1A] hover:bg-[#252525] hover:text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="save-product-btn"
              type="submit"
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black rounded-lg font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Salvar Produto</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
