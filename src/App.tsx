import React, { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, GoogleUser, ManagerUser, Order, StoreCategory } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialProducts';
import { 
  isSupabaseConfigured,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { FeaturedHero } from './components/FeaturedHero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ManagerLoginModal } from './components/ManagerLoginModal';
import { ManagerDashboard } from './components/ManagerDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Lock, 
  Layers, 
  HelpCircle, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Products state (persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexus_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state (persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexus_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexus_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Auth states
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    const saved = localStorage.getItem('nexus_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [managerUser, setManagerUser] = useState<ManagerUser | null>(() => {
    const saved = localStorage.getItem('nexus_manager_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // View state: 'store' | 'manager'
  const [currentView, setCurrentView] = useState<'store' | 'manager'>('store');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('Todos');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isManagerLoginOpen, setIsManagerLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial load from Supabase if available
  const loadDataFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [remoteProducts, remoteOrders] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchOrdersFromSupabase(),
      ]);

      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      }
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do Supabase:', err);
    }
  }, []);

  useEffect(() => {
    loadDataFromSupabase();
  }, [loadDataFromSupabase]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (googleUser) {
      localStorage.setItem('nexus_google_user', JSON.stringify(googleUser));
    } else {
      localStorage.removeItem('nexus_google_user');
    }
  }, [googleUser]);

  useEffect(() => {
    if (managerUser) {
      localStorage.setItem('nexus_manager_user', JSON.stringify(managerUser));
    } else {
      localStorage.removeItem('nexus_manager_user');
    }
  }, [managerUser]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast(
      'success',
      'Produto adicionado ao carrinho!',
      `${product.name} foi adicionado com sucesso.`
    );
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('info', 'Item removido do carrinho');
  };

  // Google Login handling
  const handleGoogleLogin = (user: GoogleUser) => {
    setGoogleUser(user);
    addToast(
      'success',
      `Bem-vindo(a), ${user.givenName}!`,
      `Conectado com sucesso via ${user.email}`
    );
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    addToast('info', 'Conta Google desconectada.');
  };

  // Manager Login handling
  const handleManagerLoginSuccess = (mgr: ManagerUser) => {
    setManagerUser(mgr);
    setCurrentView('manager');
    addToast(
      'success',
      'Acesso do Gestor autorizado!',
      'Você entrou no painel administrativo da loja.'
    );
  };

  const handleManagerLogout = () => {
    setManagerUser(null);
    setCurrentView('store');
    addToast('info', 'Sessão do gestor encerrada.');
  };

  // Checkout handling
  const handleProceedToCheckout = (discount: number) => {
    setAppliedDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    addToast(
      'success',
      `Pedido ${newOrder.id} confirmado!`,
      `Valor: R$ ${newOrder.totalAmount.toFixed(2)} - Acompanhe em Meus Pedidos.`
    );

    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        await insertOrderToSupabase(newOrder);
      } catch (e) {
        console.warn('Erro ao persistir pedido no Supabase:', e);
      }
    }
  };

  // Manager Product CRUD
  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('success', 'Produto atualizado no catálogo!');

    if (isSupabaseConfigured()) {
      try {
        await upsertProductToSupabase(updated);
      } catch (e) {
        console.warn('Erro ao salvar no Supabase:', e);
      }
    }
  };

  const handleAddProduct = async (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    addToast('success', 'Novo produto cadastrado na vitrine!');

    if (isSupabaseConfigured()) {
      try {
        await upsertProductToSupabase(newProd);
      } catch (e) {
        console.warn('Erro ao salvar no Supabase:', e);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('info', 'Produto removido da loja.');

    if (isSupabaseConfigured()) {
      try {
        await deleteProductFromSupabase(productId);
      } catch (e) {
        console.warn('Erro ao deletar no Supabase:', e);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast('success', `Status do pedido ${orderId} alterado para ${newStatus}!`);

    if (isSupabaseConfigured()) {
      try {
        await updateOrderStatusInSupabase(orderId, newStatus);
      } catch (e) {
        console.warn('Erro ao atualizar status no Supabase:', e);
      }
    }
  };

  // Filtered products list for showcase
  const featuredProducts = products.filter((p) => p.isFeatured);

  const displayProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // If viewing the Manager Dashboard
  if (currentView === 'manager' && managerUser) {
    return (
      <>
        <ManagerDashboard
          managerUser={managerUser}
          products={products}
          orders={orders}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={handleAddProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onRefreshData={loadDataFromSupabase}
          onCloseDashboard={() => setCurrentView('store')}
          onLogoutManager={handleManagerLogout}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        googleUser={googleUser}
        managerUser={managerUser}
        cartItems={cartItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onGoogleLogout={handleGoogleLogout}
        onOpenManagerLogin={() => setIsManagerLoginOpen(true)}
        onOpenManagerDashboard={() => setCurrentView('manager')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => {
          if (!googleUser) {
            setIsGoogleAuthOpen(true);
          } else {
            setIsOrdersOpen(true);
          }
        }}
      />

      {/* Hero Showcase (Destaques de Compras) */}
      {!searchQuery && selectedCategory === 'Todos' && featuredProducts.length > 0 && (
        <FeaturedHero
          featuredProducts={featuredProducts}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />
      )}

      {/* Main Catalog & Highlighted Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-10">
        
        {/* Section Header with Category & Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <h2 className="text-xl sm:text-2xl font-serif-luxury tracking-wider text-white uppercase">
                {searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory === 'Todos'
                  ? 'Vitrine & Produtos em Destaque'
                  : `Coleção: ${selectedCategory}`}
              </h2>
            </div>
            <p className="text-xs text-[#888888] mt-1 font-sans">
              Seleção exclusiva com especificações completas, garantia e entrega segura
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#A0A0A0] bg-[#141414] px-3.5 py-1.5 rounded-lg border border-[#2A2A2A]">
              {displayProducts.length} {displayProducts.length === 1 ? 'produto encontrado' : 'produtos disponíveis'}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="bg-[#121212] rounded-2xl border border-[#2A2A2A] p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37] mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-white text-lg tracking-wide">Nenhum produto encontrado</h3>
            <p className="text-xs text-[#888888] max-w-sm mx-auto">
              Não encontramos nenhum produto correspondente ao termo "{searchQuery}". Tente pesquisar por outra palavra ou limpe os filtros.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
              }}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest text-xs rounded transition-colors cursor-pointer"
            >
              Limpar Filtros de Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        )}

        {/* Informative Assurance Banner */}
        <section className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] text-white rounded-2xl p-8 sm:p-10 border border-[#2A2A2A] relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
            <div className="flex items-start gap-4 p-2">
              <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-xl text-[#D4AF37] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm tracking-wider text-white uppercase">Frete Seguro Especial</h4>
                <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                  Entrega prioritária com rastreio em tempo real para compras acima de R$ 299.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2 md:pl-8">
              <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-xl text-[#D4AF37] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm tracking-wider text-white uppercase">Garantia & Autenticidade</h4>
                <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                  12 meses de garantia direta de fábrica e suporte especializado pós-venda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2 md:pl-8">
              <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-xl text-[#D4AF37] shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-sm tracking-wider text-white uppercase">Pagamento Flexível</h4>
                <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                  5% de desconto exclusivo via PIX ou em até 12x sem juros no cartão de crédito.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer with Gestor Login Button and Info */}
      <footer className="bg-[#0D0D0D] text-[#888888] text-xs border-t border-[#2A2A2A] mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury text-white text-lg tracking-widest uppercase block">
                  Nexus<span className="text-[#D4AF37]">Store</span>
                </span>
                <p className="text-[11px] text-[#666666]">Plataforma de Compras com Login Google e Portal do Gestor</p>
              </div>
            </div>

            {/* Manager quick access button in footer */}
            <div className="flex items-center gap-3">
              {managerUser ? (
                <button
                  id="footer-open-manager-dashboard-btn"
                  onClick={() => setCurrentView('manager')}
                  className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Acessar Painel do Gestor</span>
                </button>
              ) : (
                <button
                  id="footer-open-manager-login-btn"
                  onClick={() => setIsManagerLoginOpen(true)}
                  className="flex items-center gap-2 bg-[#161616] hover:bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] font-semibold text-xs px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Área do Gestor (Login: gestor123)</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-[#666666]">
            <p>© 2026 NexusStore. Todos os direitos reservados. Experiência de Compras e Gestão.</p>
            <div className="flex items-center gap-4 text-[#888888]">
              <span>Login Cliente: Google OAuth</span>
              <span className="text-[#333333]">•</span>
              <span>Gestor: gestor123 / gestão123</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          isLoggedInGoogle={!!googleUser}
        />
      )}

      {isGoogleAuthOpen && (
        <GoogleAuthModal
          isOpen={isGoogleAuthOpen}
          onClose={() => setIsGoogleAuthOpen(false)}
          onLogin={handleGoogleLogin}
        />
      )}

      {isManagerLoginOpen && (
        <ManagerLoginModal
          isOpen={isManagerLoginOpen}
          onClose={() => setIsManagerLoginOpen(false)}
          onSuccessLogin={handleManagerLoginSuccess}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        googleUser={googleUser}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenGoogleAuth={() => {
          setIsCartOpen(false);
          setIsGoogleAuthOpen(true);
        }}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {isCheckoutOpen && googleUser && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          googleUser={googleUser}
          discountAmount={appliedDiscount}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {isOrdersOpen && (
        <OrdersModal
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
          orders={orders}
          googleUser={googleUser}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
