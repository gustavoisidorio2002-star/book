import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Smart UltraBook Pro 16" OLED M3 Max',
    category: 'Informática',
    price: 8499.90,
    originalPrice: 10299.00,
    shortDescription: 'Potência máxima com tela Liquid Retina XDR de 16 polegadas, 32GB RAM e 1TB SSD NVMe ultrarrápido.',
    description: 'Projetado para criadores de conteúdo, engenheiros e entusiastas de alta performance. Equipado com arquitetura de última geração, resfriamento térmico com câmara de vapor e acabamento em alumínio aeronáutico aeroespacial.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Tela OLED 3.2K 120Hz com 100% DCI-P3',
      'Processador Ultra 16-Core com NPU AI dedicada',
      'Bateria com duração de até 20 horas de uso contínuo',
      'Teclado retroiluminado com leitor biométrico integrado'
    ],
    specs: {
      'Processador': 'Ultra AI 16-Core 4.5GHz',
      'Memória': '32 GB LPDDR5X 7500MHz',
      'Armazenamento': '1 TB SSD PCIe Gen 4.0',
      'Tela': '16.0" OLED 3200x2000 120Hz',
      'Peso': '1.58 kg'
    },
    rating: 4.9,
    reviewCount: 142,
    stock: 15,
    isFeatured: true,
    badge: 'SUPER DESTAQUE',
    installments: 12,
    freeShipping: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'prod-2',
    name: 'Smartphone Nova X Titanium 512GB 5G',
    category: 'Smartphones',
    price: 4999.00,
    originalPrice: 5899.00,
    shortDescription: 'Câmera cinematográfica de 200MP com zoom óptico 10x, corpo em titânio e tela AMOLED 144Hz.',
    description: 'Experimente a revolução móvel com o Nova X Titanium. Processamento de ponta, inteligência artificial em tempo real para edição de fotos e vídeos, além de bateria de 5400mAh com carregamento ultra rápido de 100W.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02597?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Sensor principal de 200MP com estabilização gimbal OIS',
      'Estrutura em Titânio Grau 5 ultra leve e resistente',
      'Carregamento 0 a 100% em apenas 22 minutos',
      'Proteção contra água e poeira IP68'
    ],
    specs: {
      'Tela': '6.8" LTPO AMOLED 144Hz HDR10+',
      'Armazenamento': '512 GB UFS 4.0',
      'RAM': '16 GB',
      'Bateria': '5400 mAh (100W TurboCharge)'
    },
    rating: 4.8,
    reviewCount: 318,
    stock: 28,
    isFeatured: true,
    badge: 'OFERTA RELÂMPAGO',
    installments: 10,
    freeShipping: true,
    createdAt: '2026-08-10'
  },
  {
    id: 'prod-3',
    name: 'Headphone Studio Wireless ANC Master',
    category: 'Áudio & Vídeo',
    price: 1399.00,
    originalPrice: 1799.00,
    shortDescription: 'Cancelamento Ativo de Ruído Híbrido, Áudio Hi-Res Lossless e até 60 horas de bateria.',
    description: 'Som estúdio autêntico com drivers de berílio de 40mm. Conectividade Bluetooth 5.4 multiponto, almofadas em couro proteico com isolamento acústico passivo e microfones com redução de ruído por IA.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Áudio Espacial 3D com rastreamento dinâmico de cabeça',
      'Cancelamento de Ruído Adaptativo até 45dB',
      'Modo Transparência Inteligente com foco em voz',
      'Carga rápida de 10 min que rende 5 horas de reprodução'
    ],
    specs: {
      'Drivers': '40mm Neodímio Dinâmico',
      'Conexão': 'Bluetooth 5.4 + Cabo P3 3.5mm banhado a ouro',
      'Autonomia': 'Até 60 horas (ANC desligado) / 45h (ANC ligado)',
      'Peso': '248g'
    },
    rating: 4.9,
    reviewCount: 89,
    stock: 40,
    isFeatured: true,
    badge: 'MAIS VENDIDO',
    installments: 10,
    freeShipping: true,
    createdAt: '2026-08-15'
  },
  {
    id: 'prod-4',
    name: 'Smartwatch Titanium Sport GPS Ultra',
    category: 'Acessórios',
    price: 1899.90,
    originalPrice: 2299.00,
    shortDescription: 'Caixa de safira e titânio, GPS de dupla frequência, ECG e autonomia de até 14 dias.',
    description: 'O parceiro ideal para atletas de alta performance e uso diário com elegância. Monitoramento avançado de saúde, VO2 Max, métricas de sono, medição de pressão e resistência à água de até 100 metros.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Vidro em Cristal de Safira ultrarresistente a arranhões',
      'GPS Dual-Band L1+L5 de precisão milimétrica',
      'Sensor de ECG aprovado e SpO2 contínuo',
      'Resistente à água até 10 ATM (100 metros)'
    ],
    specs: {
      'Material': 'Caixa em Titânio + Cristal de Safira',
      'Tela': '1.43" AMOLED Always-On 1000 nits',
      'Bateria': 'Até 14 dias em modo econômico / 5 dias intenso',
      'Sensores': 'Cardíaco, ECG, Temperatura, Altímetro Barométrico'
    },
    rating: 4.7,
    reviewCount: 94,
    stock: 22,
    isFeatured: false,
    badge: 'PREMIUM',
    installments: 8,
    freeShipping: true,
    createdAt: '2026-08-18'
  },
  {
    id: 'prod-5',
    name: 'Monitor Gamer Curvo 34" Mini-LED 175Hz',
    category: 'Informática',
    price: 3699.00,
    originalPrice: 4299.00,
    shortDescription: 'Ultrawide WQHD 3440x1440 com tecnologia Quantum Dot Mini-LED e tempo de resposta de 0.1ms.',
    description: 'Imersão absoluta para jogos e produtividade extrema. Com 1152 zonas de escurecimento local (Local Dimming), HDR1000 e curvatura 1800R que envolve seu campo de visão natural.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Painel Mini-LED com 1152 zonas de iluminação individual',
      'Certificação VESA DisplayHDR 1000',
      'Hub USB-C com Power Delivery de 90W integrado',
      'Suporte a FreeSync Premium Pro e G-Sync Compatible'
    ],
    specs: {
      'Resolução': '3440 x 1440 (21:9 WQHD)',
      'Taxa de Atualização': '175Hz',
      'Tempo de Resposta': '0.1ms (GtG)',
      'Conexões': '2x HDMI 2.1, 1x DP 1.4, 1x USB-C 90W'
    },
    rating: 4.9,
    reviewCount: 63,
    stock: 12,
    isFeatured: false,
    badge: 'TOP DESEMPENHO',
    installments: 12,
    freeShipping: true,
    createdAt: '2026-08-20'
  },
  {
    id: 'prod-6',
    name: 'Smart Caixa de Som AI Home Studio 360°',
    category: 'Smart Home',
    price: 899.00,
    originalPrice: 1199.00,
    shortDescription: 'Assistente por IA integrada, áudio espacial omnidirecional e integração total com automação residencial.',
    description: 'Preencha sua casa com som cristalino de alta fidelidade e comande seus dispositivos inteligentes por voz. Compatível com os principais ecossistemas e integração direta ao Google Cast.',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Áudio 360° com Woofer dedicado e radiadores passivos duplos',
      'Microfones de campo distante com cancelamento de eco acústico',
      'Compatível com Google Cast e AirPlay 2',
      'Luz ambiente RGB reativa à música'
    ],
    specs: {
      'Potência': '65W RMS',
      'Conectividade': 'Wi-Fi 6E Dual Band, Bluetooth 5.3',
      'Alimentação': 'Bivolt Automático',
      'Dimensões': '18 x 14 x 14 cm'
    },
    rating: 4.6,
    reviewCount: 45,
    stock: 35,
    isFeatured: false,
    badge: 'CASA INTELIGENTE',
    installments: 6,
    freeShipping: false,
    createdAt: '2026-08-22'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-9821',
    customerName: 'Gustavo Isidório',
    customerEmail: 'gustavo.isidorio.2002@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    items: [
      {
        productId: 'prod-1',
        productName: 'Smart UltraBook Pro 16" OLED M3 Max',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
        quantity: 1,
        price: 8499.90
      }
    ],
    totalAmount: 8499.90,
    discount: 0,
    status: 'Em Preparação',
    paymentMethod: 'PIX',
    createdAt: '2026-08-28 14:30',
    shippingAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
  },
  {
    id: 'PED-9820',
    customerName: 'Mariana Silva',
    customerEmail: 'mariana.silva@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    items: [
      {
        productId: 'prod-2',
        productName: 'Smartphone Nova X Titanium 512GB 5G',
        productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80',
        quantity: 1,
        price: 4999.00
      },
      {
        productId: 'prod-3',
        productName: 'Headphone Studio Wireless ANC Master',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        quantity: 1,
        price: 1399.00
      }
    ],
    totalAmount: 6398.00,
    discount: 100.00,
    status: 'Enviado',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '2026-08-27 18:15',
    shippingAddress: 'Rua das Flores, 420 - Centro, Curitiba - PR'
  }
];
