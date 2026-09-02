export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  gallery?: string[];
  features: string[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  badge?: string; // e.g. "Destaque da Semana", "Lançamento", "Oferta Relâmpago", "Mais Vendido"
  installments: number; // e.g. 10 or 12
  freeShipping?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  givenName: string;
}

export interface ManagerUser {
  username: string;
  role: 'gestor';
  name: string;
  loggedInAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  status: 'Pendente' | 'Aprovado' | 'Em Preparação' | 'Enviado' | 'Entregue';
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  createdAt: string;
  shippingAddress: string;
}

export type StoreCategory = 'Todos' | 'Smartphones' | 'Informática' | 'Áudio & Vídeo' | 'Smart Home' | 'Acessórios';
