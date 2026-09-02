import React, { useState } from 'react';
import { Product, Order, ManagerUser } from '../types';
import { formatBRL } from '../utils/formatters';
import { ProductEditModal } from './ProductEditModal';
import { 
  isSupabaseConfigured,
  getActiveSupabaseCredentials,
  saveCustomSupabaseCredentials,
  testSupabaseConnection,
  syncAllDataToSupabase,
  SUPABASE_SQL_SCHEMA
} from '../lib/supabase';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  LogOut, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  Layers,
  Database,
  RefreshCw,
  Copy,
  Check,
  Server,
  AlertCircle,
  Save
} from 'lucide-react';

interface ManagerDashboardProps {
  managerUser: ManagerUser;
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onRefreshData?: () => Promise<void>;
  onCloseDashboard: () => void;
  onLogoutManager: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  managerUser,
  products,
  orders,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct,
  onUpdateOrderStatus,
  onRefreshData,
  onCloseDashboard,
  onLogoutManager,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'database'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Supabase State
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    productsCount?: number;
    ordersCount?: number;
  } | null>(null);

  // Custom Supabase Credentials Form
  const initialCreds = getActiveSupabaseCredentials();
  const [customUrl, setCustomUrl] = useState(initialCreds.url);
  const [customKey, setCustomKey] = useState(initialCreds.anonKey);
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleToggleFeatured = (product: Product) => {
    onUpdateProduct({
      ...product,
      isFeatured: !product.isFeatured,
      badge: !product.isFeatured ? 'DESTAQUE' : undefined,
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleRunDbTest = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setDbTestResult({
        tested: true,
        success: result.success,
        message: result.message,
        productsCount: result.productsCount,
        ordersCount: result.ordersCount,
      });
    } catch (err: any) {
      setDbTestResult({
        tested: true,
        success: false,
        message: `Falha no teste: ${err.message || String(err)}`,
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSaveCredentials = () => {
    setIsSavingCreds(true);
    saveCustomSupabaseCredentials(customUrl, customKey);
    setTimeout(() => {
      setIsSavingCreds(false);
      handleRunDbTest();
    }, 400);
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingDb(true);
    try {
      const result = await syncAllDataToSupabase(products, orders);
      if (result.success) {
        setDbTestResult({
          tested: true,
          success: true,
          message: `Sincronização concluída com sucesso! ${result.productsSaved} produtos e ${result.ordersSaved} pedidos enviados para o Supabase.`,
          productsCount: result.productsSaved,
          ordersCount: result.ordersSaved,
        });
      } else {
        setDbTestResult({
          tested: true,
          success: false,
          message: `Erro na sincronização: ${result.error || 'Verifique se as tabelas foram criadas no SQL Editor do Supabase'}`,
        });
      }
    } finally {
      setIsSyncingDb(false);
    }
  };

  return (
    <div id="manager-dashboard-view" className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#0D0D0D] text-white border-b border-[#222222] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center gap-3">
              <button
                id="back-to-store-btn"
                onClick={onCloseDashboard}
                className="flex items-center gap-1.5 bg-[#181818] hover:bg-[#222222] text-[#E0E0E0] hover:text-white px-3.5 py-2 rounded-lg border border-[#2A2A2A] text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                <span>Voltar para a Loja</span>
              </button>

              <div className="h-5 w-px bg-[#222222] hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-serif-luxury font-bold text-base tracking-wide text-white flex items-center gap-2">
                    Painel do Gestor
                    <span className="text-[10px] font-mono uppercase font-bold bg-[#1C1810] text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                      Logado: {managerUser.username}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="manager-logout-action-btn"
                onClick={onLogoutManager}
                className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white px-3.5 py-2 rounded-lg border border-rose-800/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair do Painel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Receita Total de Vendas</p>
              <p className="text-2xl font-bold font-serif-editorial text-[#D4AF37] mt-1">{formatBRL(totalRevenue)}</p>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800/30 px-1.5 py-0.5 rounded mt-1 inline-block">
                +18.4% este mês
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Total de Pedidos</p>
              <p className="text-2xl font-bold text-white mt-1">{totalOrdersCount}</p>
              <span className="text-[10px] text-[#D4AF37] font-bold bg-[#1C1810] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded mt-1 inline-block">
                {orders.filter(o => o.status === 'Em Preparação' || o.status === 'Pendente').length} em andamento
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] text-white flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Ticket Médio por Compra</p>
              <p className="text-2xl font-bold font-serif-editorial text-[#D4AF37] mt-1">{formatBRL(averageTicket)}</p>
              <span className="text-[10px] text-[#888888] font-medium mt-1 inline-block">
                Clientes Google
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#2A2A2A] text-[#D4AF37] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Produtos & Destaques</p>
              <p className="text-2xl font-bold text-white mt-1">{products.length} itens</p>
              <span className="text-[10px] text-[#D4AF37] font-bold bg-[#1C1810] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded mt-1 inline-block">
                {featuredCount} em destaque na vitrine
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222222] space-x-6">
          <button
            id="tab-manage-products-btn"
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'products'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gerenciamento de Produtos ({products.length})</span>
          </button>

          <button
            id="tab-manage-orders-btn"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos & Vendas ({orders.length})</span>
          </button>

          <button
            id="tab-manage-database-btn"
            onClick={() => setActiveTab('database')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
              activeTab === 'database'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Banco de Dados Supabase</span>
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121212] p-4 rounded-xl border border-[#2A2A2A] shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
                <input
                  id="manager-search-product-input"
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Pesquisar produto por nome ou categoria..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[#161616] border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder:text-[#666666]"
                />
              </div>

              <button
                id="add-new-product-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(true);
                }}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e2bd46] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Adicionar Novo Produto</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#E0E0E0]">
                  <thead className="bg-[#0A0A0A] border-b border-[#222222] text-[#888888] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Preço (Valor)</th>
                      <th className="p-4">Estoque</th>
                      <th className="p-4 text-center">Destaque na Vitrine</th>
                      <th className="p-4 text-right">Ações do Gestor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E1E]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover border border-[#2A2A2A] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-xs">{prod.name}</p>
                              <p className="text-[11px] text-[#888888] line-clamp-1">{prod.shortDescription || prod.description}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-[#181818] border border-[#2A2A2A] text-[#A0A0A0] font-medium px-2.5 py-1 rounded">
                            {prod.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-[#D4AF37] font-serif-editorial text-sm">{formatBRL(prod.price)}</span>
                          {prod.originalPrice && (
                            <span className="block text-[10px] text-[#666666] line-through">
                              {formatBRL(prod.originalPrice)}
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            prod.stock > 10 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30' : 'bg-amber-950/60 text-amber-400 border border-amber-800/30'
                          }`}>
                            {prod.stock} un.
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            id={`toggle-featured-btn-${prod.id}`}
                            onClick={() => handleToggleFeatured(prod)}
                            className={`px-3 py-1 rounded font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                              prod.isFeatured
                                ? 'bg-[#D4AF37] text-black shadow-xs'
                                : 'bg-[#181818] border border-[#2A2A2A] text-[#888888] hover:text-white'
                            }`}
                            title="Alternar se o produto aparece no topo em destaque"
                          >
                            {prod.isFeatured ? '★ DESTAQUE' : 'Padrão'}
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`edit-product-btn-${prod.id}`}
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsCreatingProduct(false);
                              }}
                              className="p-2 text-[#D4AF37] hover:bg-[#1C1810] rounded-lg transition-colors cursor-pointer"
                              title="Editar Valor, Descrição e Imagem"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              id={`delete-product-btn-${prod.id}`}
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="p-2 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir produto da loja"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Sales Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-[#121212] rounded-xl border border-[#2A2A2A] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#222222] bg-[#0A0A0A] flex items-center justify-between">
                <h3 className="font-serif-luxury font-bold text-white text-sm">Histórico de Pedidos de Clientes</h3>
                <span className="text-xs text-[#888888] font-medium">
                  Atualize o status dos pedidos para notificar os clientes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#E0E0E0]">
                  <thead className="bg-[#0A0A0A] border-b border-[#222222] text-[#888888] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Pedido / Data</th>
                      <th className="p-4">Cliente (Google Account)</th>
                      <th className="p-4">Itens Comprados</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Pagamento</th>
                      <th className="p-4">Status do Pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E1E]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-4">
                          <p className="font-mono font-bold text-[#D4AF37]">{ord.id}</p>
                          <p className="text-[11px] text-[#666666]">{ord.createdAt}</p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {ord.customerAvatar && (
                              <img
                                src={ord.customerAvatar}
                                alt={ord.customerName}
                                className="w-7 h-7 rounded-full object-cover border border-[#2A2A2A]"
                              />
                            )}
                            <div>
                              <p className="font-bold text-white">{ord.customerName}</p>
                              <p className="text-[11px] text-[#888888]">{ord.customerEmail}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1 max-w-xs">
                            {ord.items.map((i, idx) => (
                              <p key={idx} className="truncate text-[#B0B0B0]">
                                <span className="font-bold text-[#D4AF37]">{i.quantity}x</span> {i.productName}
                              </p>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-[#D4AF37] font-serif-editorial text-sm">
                            {formatBRL(ord.totalAmount)}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-medium text-white bg-[#181818] border border-[#2A2A2A] px-2 py-0.5 rounded">
                            {ord.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4">
                          <select
                            id={`order-status-select-${ord.id}`}
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#2A2A2A] bg-[#161616] focus:outline-none focus:border-[#D4AF37] text-white"
                          >
                            <option value="Pendente" className="bg-[#161616] text-white">Pendente</option>
                            <option value="Aprovado" className="bg-[#161616] text-white">Aprovado</option>
                            <option value="Em Preparação" className="bg-[#161616] text-white">Em Preparação</option>
                            <option value="Enviado" className="bg-[#161616] text-white">Enviado</option>
                            <option value="Entregue" className="bg-[#161616] text-white">Entregue</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Supabase Database Hub */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#2A2A2A] shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#181818] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37]">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-luxury font-bold text-white text-base">
                        Integração Supabase PostgreSQL
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isSupabaseConfigured() 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' 
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                      }`}>
                        {isSupabaseConfigured() ? 'Conectado à Nuvem' : 'Credenciais Pendentes'}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888] mt-1">
                      Armazenamento persistente na nuvem para catálogo de produtos, pedidos de clientes e sincronização em tempo real.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onRefreshData && (
                    <button
                      id="refresh-from-supabase-btn"
                      onClick={() => onRefreshData()}
                      className="px-3.5 py-2 bg-[#181818] hover:bg-[#222222] text-[#E0E0E0] border border-[#2A2A2A] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Puxar dados mais recentes do Supabase"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Recarregar Nuvem</span>
                    </button>
                  )}

                  <button
                    id="test-supabase-connection-btn"
                    onClick={handleRunDbTest}
                    disabled={isTestingDb}
                    className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#282828] text-white border border-[#333333] hover:border-[#D4AF37]/40 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isTestingDb ? 'animate-spin' : ''}`} />
                    <span>{isTestingDb ? 'Testando...' : 'Testar Conexão'}</span>
                  </button>

                  <button
                    id="sync-all-to-supabase-btn"
                    onClick={handleSyncAllToSupabase}
                    disabled={isSyncingDb || !isSupabaseConfigured()}
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e2bd46] disabled:opacity-50 text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5 text-black" />
                    <span>{isSyncingDb ? 'Sincronizando...' : 'Exportar Dados para Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* Diagnostic Test Banner if tested */}
              {dbTestResult && (
                <div className={`mt-4 p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  dbTestResult.success 
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                }`}>
                  {dbTestResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{dbTestResult.success ? 'Diagnóstico OK' : 'Aviso de Conexão'}</p>
                    <p className="mt-0.5 text-[11px] opacity-90">{dbTestResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Credential Setup & Tables Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Credentials Card */}
              <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                  <h4 className="font-serif-luxury font-bold text-white text-sm">Credenciais do Projeto Supabase</h4>
                  <span className="text-[10px] text-[#888888] font-mono">Settings &gt; API</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#C0C0C0] font-semibold uppercase tracking-wider mb-1">
                      Project URL (VITE_SUPABASE_URL)
                    </label>
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#2A2A2A] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C0C0C0] font-semibold uppercase tracking-wider mb-1">
                      Anon / Public Key (VITE_SUPABASE_ANON_KEY)
                    </label>
                    <input
                      type="password"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3 py-2 bg-[#161616] border border-[#2A2A2A] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-[#777777]">
                      As credenciais também podem ser definidas em <code className="text-[#D4AF37]">.env.example</code>.
                    </p>
                    <button
                      type="button"
                      onClick={handleSaveCredentials}
                      disabled={isSavingCreds}
                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-black" />
                      <span>{isSavingCreds ? 'Salvando...' : 'Salvar & Testar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Data Summary */}
              <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                  <h4 className="font-serif-luxury font-bold text-white text-sm">Estrutura das Tabelas</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">PostgreSQL</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#161616] border border-[#2A2A2A] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white font-mono">public.products</p>
                      <p className="text-[11px] text-[#888888]">Tabela de catálogo, valores, estoque e especificações</p>
                    </div>
                    <span className="text-xs font-bold font-serif-editorial text-[#D4AF37] bg-[#1F1C14] px-2 py-1 rounded border border-[#D4AF37]/30">
                      {products.length} itens
                    </span>
                  </div>

                  <div className="p-3 bg-[#161616] border border-[#2A2A2A] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white font-mono">public.orders</p>
                      <p className="text-[11px] text-[#888888]">Tabela de histórico de compras com login Google e PIX/Cartão</p>
                    </div>
                    <span className="text-xs font-bold font-serif-editorial text-[#D4AF37] bg-[#1F1C14] px-2 py-1 rounded border border-[#D4AF37]/30">
                      {orders.length} pedidos
                    </span>
                  </div>

                  <div className="text-[11px] text-[#888888] space-y-1 pt-1">
                    <p>✓ Row Level Security (RLS) habilitado com políticas de acesso públicas.</p>
                    <p>✓ Suporte a JSONB para listas de recursos (`features`), galeria e itens do pedido.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* SQL Script Box */}
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A2A2A] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#222222]">
                <div>
                  <h4 className="font-serif-luxury font-bold text-white text-sm">
                    Script SQL para Criação das Tabelas no Supabase
                  </h4>
                  <p className="text-xs text-[#888888]">
                    Copie e execute no menu <strong>SQL Editor</strong> do painel Supabase para criar as tabelas instantaneamente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>{copiedSql ? 'Copiado para o Clipboard!' : 'Copiar Script SQL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#080808] border border-[#222222] rounded-lg text-[11px] font-mono text-[#C0C0C0] overflow-x-auto max-h-72 leading-relaxed selection:bg-[#D4AF37] selection:text-black">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* Product Edit / Creation Modal */}
      {(editingProduct || isCreatingProduct) && (
        <ProductEditModal
          isOpen={true}
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
          onSave={(prod) => {
            if (editingProduct) {
              onUpdateProduct(prod);
            } else {
              onAddProduct(prod);
            }
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#121212] max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-[#2A2A2A] space-y-4 text-[#E0E0E0]">
            <h4 className="font-serif-luxury font-bold text-white text-base">Excluir Produto?</h4>
            <p className="text-xs text-[#888888]">
              Tem certeza que deseja remover este produto da vitrine da loja? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-2 text-xs font-semibold text-[#888888] bg-[#1A1A1A] hover:bg-[#252525] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-lg transition-colors cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
