import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order } from '../types';

// Read configuration from Vite environment variables or localStorage override if provided
const envSupabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envSupabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Local storage keys for testing or dynamic config if needed
const STORAGE_SUPABASE_URL_KEY = 'nexus_custom_supabase_url';
const STORAGE_SUPABASE_KEY_KEY = 'nexus_custom_supabase_key';

export function getActiveSupabaseCredentials(): { url: string; anonKey: string; isCustom: boolean } {
  const customUrl = localStorage.getItem(STORAGE_SUPABASE_URL_KEY);
  const customKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY);

  if (customUrl && customKey) {
    return { url: customUrl.trim(), anonKey: customKey.trim(), isCustom: true };
  }

  return {
    url: (envSupabaseUrl || '').trim(),
    anonKey: (envSupabaseAnonKey || '').trim(),
    isCustom: false,
  };
}

export function saveCustomSupabaseCredentials(url: string, key: string) {
  if (!url || !key) {
    localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
    localStorage.removeItem(STORAGE_SUPABASE_KEY_KEY);
  } else {
    localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, key.trim());
  }
  // Re-initialize client
  _supabaseInstance = null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getActiveSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http') && !url.includes('your-project'));
}

let _supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!_supabaseInstance) {
    const { url, anonKey } = getActiveSupabaseCredentials();
    try {
      _supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.error('Falha ao inicializar cliente Supabase:', err);
      return null;
    }
  }

  return _supabaseInstance;
}

// SQL Schema for table creation
export const SUPABASE_SQL_SCHEMA = `-- ===================================================================
-- SCHEMA COMPLETO SUPABASE (POSTGRESQL + STORAGE) - NEXUS LUXURY STORE
-- ===================================================================
-- Instruções:
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com/dashboard)
-- 2. Vá até a seção "SQL Editor"
-- 3. Cole este script e clique no botão "RUN" (Executar)
-- 4. Suas tabelas, bucket de armazenamento e políticas estarão 100% configuradas!
-- ===================================================================

-- 1. TABELA DE PRODUTOS
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  description text,
  short_description text,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  rating numeric default 5.0,
  review_count integer default 0,
  stock integer default 10,
  is_featured boolean default false,
  badge text,
  installments integer default 12,
  free_shipping boolean default true,
  created_at timestamp with time zone default now()
);

-- 2. TABELA DE PEDIDOS
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_avatar text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null,
  discount numeric default 0,
  status text not null default 'Pendente',
  payment_method text not null,
  shipping_address text not null,
  created_at text not null,
  synced_at timestamp with time zone default now()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS) NAS TABELAS
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- 4. POLÍTICAS DE ACESSO DAS TABELAS
drop policy if exists "Permitir leitura pública de produtos" on public.products;
create policy "Permitir leitura pública de produtos" 
  on public.products for select using (true);

drop policy if exists "Permitir gerenciamento de produtos" on public.products;
create policy "Permitir gerenciamento de produtos" 
  on public.products for all using (true);

drop policy if exists "Permitir leitura pública de pedidos" on public.orders;
create policy "Permitir leitura pública de pedidos" 
  on public.orders for select using (true);

drop policy if exists "Permitir criação e atualização de pedidos" on public.orders;
create policy "Permitir criação e atualização de pedidos" 
  on public.orders for all using (true);

-- ===================================================================
-- 5. CONFIGURAÇÃO DO BUCKET DE ARMAZENAMENTO (SUPABASE STORAGE)
-- ===================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limite por arquivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- ===================================================================
-- 6. POLÍTICAS DE ARMAZENAMENTO (STORAGE RLS POLICIES)
-- ===================================================================
drop policy if exists "Permitir visualização pública de imagens" on storage.objects;
create policy "Permitir visualização pública de imagens"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Permitir upload de imagens no bucket" on storage.objects;
create policy "Permitir upload de imagens no bucket"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

drop policy if exists "Permitir atualização de imagens no bucket" on storage.objects;
create policy "Permitir atualização de imagens no bucket"
  on storage.objects for update
  using (bucket_id = 'product-images');

drop policy if exists "Permitir exclusão de imagens no bucket" on storage.objects;
create policy "Permitir exclusão de imagens no bucket"
  on storage.objects for delete
  using (bucket_id = 'product-images');
`;

// Helper: Product transform
export function mapSupabaseToProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    description: data.description || '',
    shortDescription: data.short_description || '',
    imageUrl: data.image_url || '',
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    features: Array.isArray(data.features) ? data.features : [],
    specs: typeof data.specs === 'object' && data.specs !== null ? data.specs : {},
    rating: Number(data.rating || 5),
    reviewCount: Number(data.review_count || 0),
    stock: Number(data.stock ?? 10),
    isFeatured: Boolean(data.is_featured),
    badge: data.badge || undefined,
    installments: Number(data.installments || 12),
    freeShipping: data.free_shipping !== false,
    createdAt: data.created_at || new Date().toISOString(),
  };
}

export function mapProductToSupabase(product: Product): any {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice ?? null,
    description: product.description,
    short_description: product.shortDescription,
    image_url: product.imageUrl,
    gallery: product.gallery || [],
    features: product.features || [],
    specs: product.specs || {},
    rating: product.rating,
    review_count: product.reviewCount,
    stock: product.stock,
    is_featured: product.isFeatured,
    badge: product.badge ?? null,
    installments: product.installments,
    free_shipping: product.freeShipping ?? true,
  };
}

// Helper: Order transform
export function mapSupabaseToOrder(data: any): Order {
  return {
    id: data.id,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerAvatar: data.customer_avatar,
    items: Array.isArray(data.items) ? data.items : [],
    totalAmount: Number(data.total_amount),
    discount: Number(data.discount || 0),
    status: data.status,
    paymentMethod: data.payment_method,
    shippingAddress: data.shipping_address,
    createdAt: data.created_at,
  };
}

export function mapOrderToSupabase(order: Order): any {
  return {
    id: order.id,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_avatar: order.customerAvatar || null,
    items: order.items,
    total_amount: order.totalAmount,
    discount: order.discount,
    status: order.status,
    payment_method: order.paymentMethod,
    shipping_address: order.shippingAddress,
    created_at: order.createdAt,
  };
}

// Service Functions
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tables: { products: boolean; orders: boolean };
  productsCount?: number;
  ordersCount?: number;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase não está configurado. Insira a URL e a Anon Key no painel ou no arquivo .env.',
      tables: { products: false, orders: false },
    };
  }

  let productsFound = false;
  let ordersFound = false;
  let productsCount = 0;
  let ordersCount = 0;

  try {
    // Check products table
    const { data: prodData, error: prodError, count: pCount } = await client
      .from('products')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (!prodError) {
      productsFound = true;
      productsCount = pCount ?? (prodData ? prodData.length : 0);
    } else {
      console.warn('Tabela products retornou erro:', prodError.message);
    }

    // Check orders table
    const { data: ordData, error: ordError, count: oCount } = await client
      .from('orders')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (!ordError) {
      ordersFound = true;
      ordersCount = oCount ?? (ordData ? ordData.length : 0);
    } else {
      console.warn('Tabela orders retornou erro:', ordError.message);
    }

    if (productsFound || ordersFound) {
      return {
        success: true,
        message: 'Conectado com sucesso ao Supabase!',
        tables: { products: productsFound, orders: ordersFound },
        productsCount,
        ordersCount,
      };
    } else {
      return {
        success: false,
        message: 'Conectado ao servidor, mas as tabelas "products" e "orders" ainda não foram criadas no banco de dados. Execute o script SQL no SQL Editor do Supabase.',
        tables: { products: false, orders: false },
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na comunicação com Supabase: ${err.message || String(err)}`,
      tables: { products: false, orders: false },
    };
  }
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar produtos no Supabase:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapSupabaseToProduct);
  } catch (err) {
    console.error('Falha de rede ao buscar produtos do Supabase:', err);
    return null;
  }
}

export async function upsertProductToSupabase(product: Product): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapProductToSupabase(product);
    const { error } = await client.from('products').upsert(row);
    if (error) {
      console.error('Erro ao salvar produto no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha de rede ao salvar produto no Supabase:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Erro ao deletar produto no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha de rede ao deletar produto no Supabase:', err);
    return false;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar pedidos no Supabase:', error.message);
      return null;
    }

    if (!data) return [];
    return data.map(mapSupabaseToOrder);
  } catch (err) {
    console.error('Falha ao buscar pedidos do Supabase:', err);
    return null;
  }
}

export async function insertOrderToSupabase(order: Order): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapOrderToSupabase(order);
    const { error } = await client.from('orders').insert(row);
    if (error) {
      console.error('Erro ao inserir pedido no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao inserir pedido no Supabase:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(orderId: string, status: Order['status']): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Erro ao atualizar status do pedido no Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao atualizar status no Supabase:', err);
    return false;
  }
}

export async function syncAllDataToSupabase(
  products: Product[],
  orders: Order[]
): Promise<{ success: boolean; productsSaved: number; ordersSaved: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, productsSaved: 0, ordersSaved: 0, error: 'Supabase não configurado' };
  }

  try {
    let pSaved = 0;
    let oSaved = 0;

    if (products.length > 0) {
      const prodRows = products.map(mapProductToSupabase);
      const { error: pErr } = await client.from('products').upsert(prodRows);
      if (pErr) throw pErr;
      pSaved = products.length;
    }

    if (orders.length > 0) {
      const orderRows = orders.map(mapOrderToSupabase);
      const { error: oErr } = await client.from('orders').upsert(orderRows);
      if (oErr) throw oErr;
      oSaved = orders.length;
    }

    return { success: true, productsSaved: pSaved, ordersSaved: oSaved };
  } catch (err: any) {
    console.error('Erro durante sincronização em massa com Supabase:', err);
    return { success: false, productsSaved: 0, ordersSaved: 0, error: err.message || String(err) };
  }
}
