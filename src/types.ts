export type Category = "All" | "Footwear" | "Electronics" | "Accessories" | "Bags" | "Fragrance";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Exclude<Category, "All">;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  promoCode?: string;
  paymentMethod: "card" | "cod";
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

export interface Promotion {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  expiresAt: string; // ISO date string or ""
  active: boolean;
  usageCount: number;
  description: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroCTA: string;
  aboutTitle: string;
  aboutBody: string;
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
  footerTagline: string;
}
