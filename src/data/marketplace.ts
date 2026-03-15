export type Category = "Smartphones" | "Moda" | "Casa" | "Beleza" | "Informática" | "Alimentos";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  stock: number;
  seller: string;
  location: string;
  rating: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: "M-Pesa" | "e-Mola" | "Cartão";
  notes?: string;
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: "Pendente" | "Confirmado" | "Enviado";
}

export const MARKETPLACE_STORAGE_KEYS = {
  customProducts: "marketplace_custom_products",
  orders: "marketplace_orders",
};

export const categories: Category[] = ["Smartphones", "Moda", "Casa", "Beleza", "Informática", "Alimentos"];

export const baseProducts: Product[] = [
  {
    id: "p1",
    name: "Infinix Note 40 256GB",
    category: "Smartphones",
    price: 18500,
    oldPrice: 22000,
    stock: 12,
    seller: "TecnoMaputo",
    location: "Maputo",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
    description: "Dual SIM, 8GB RAM, bateria 5000mAh e carregamento rápido.",
  },
  {
    id: "p2",
    name: "Vestido Floral Premium",
    category: "Moda",
    price: 3200,
    stock: 18,
    seller: "Moda Beira",
    location: "Beira",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
    description: "Tecido leve e corte moderno para uso casual e eventos.",
  },
  {
    id: "p3",
    name: "Liquidificador 5 Velocidades",
    category: "Casa",
    price: 2750,
    stock: 9,
    seller: "Casa Fácil",
    location: "Nampula",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1200",
    description: "Motor potente para sumos, sopas e receitas do dia a dia.",
  },
  {
    id: "p4",
    name: "Kit Skincare Natural",
    category: "Beleza",
    price: 2100,
    stock: 25,
    seller: "Glow MZ",
    location: "Matola",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200",
    description: "Limpeza, hidratação e proteção com ingredientes suaves.",
  },
  {
    id: "p5",
    name: "Notebook Lenovo i5 16GB",
    category: "Informática",
    price: 45900,
    oldPrice: 50000,
    stock: 6,
    seller: "Byte Store",
    location: "Maputo",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
    description: "SSD 512GB, ideal para trabalho, estudos e design.",
  },
  {
    id: "p6",
    name: "Cabaz Familiar Semanal",
    category: "Alimentos",
    price: 1850,
    stock: 30,
    seller: "Agro Fresh",
    location: "Chimoio",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200",
    description: "Frutas e legumes frescos selecionados semanalmente.",
  },
];
