-- ===================================================================
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
-- Políticas de Produtos (Leitura e Gerenciamento)
drop policy if exists "Permitir leitura pública de produtos" on public.products;
create policy "Permitir leitura pública de produtos" 
  on public.products for select using (true);

drop policy if exists "Permitir gerenciamento de produtos" on public.products;
create policy "Permitir gerenciamento de produtos" 
  on public.products for all using (true);

-- Políticas de Pedidos (Leitura e Gerenciamento)
drop policy if exists "Permitir leitura pública de pedidos" on public.orders;
create policy "Permitir leitura pública de pedidos" 
  on public.orders for select using (true);

drop policy if exists "Permitir criação e atualização de pedidos" on public.orders;
create policy "Permitir criação e atualização de pedidos" 
  on public.orders for all using (true);

-- ===================================================================
-- 5. CONFIGURAÇÃO DO BUCKET DE ARMAZENAMENTO (SUPABASE STORAGE)
-- ===================================================================

-- Criar bucket público 'product-images' se não existir
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

-- Permitir visualização/download público das imagens
drop policy if exists "Permitir visualização pública de imagens" on storage.objects;
create policy "Permitir visualização pública de imagens"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Permitir upload de imagens no bucket
drop policy if exists "Permitir upload de imagens no bucket" on storage.objects;
create policy "Permitir upload de imagens no bucket"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- Permitir atualização de arquivos no bucket
drop policy if exists "Permitir atualização de imagens no bucket" on storage.objects;
create policy "Permitir atualização de imagens no bucket"
  on storage.objects for update
  using (bucket_id = 'product-images');

-- Permitir exclusão de imagens no bucket
drop policy if exists "Permitir exclusão de imagens no bucket" on storage.objects;
create policy "Permitir exclusão de imagens no bucket"
  on storage.objects for delete
  using (bucket_id = 'product-images');
