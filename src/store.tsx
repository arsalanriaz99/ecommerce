import { createContext, useContext, useState, ReactNode } from "react";
import { Product, CartItem, Order, Promotion, SiteContent } from "./types";
import { seedProducts, seedOrders, seedPromotions, defaultSiteContent } from "./data";

interface StoreCtx {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  cartOpen: boolean;
  promotions: Promotion[];
  siteContent: SiteContent;
  appliedPromo: Promotion | null;
  promoError: string;
  setCartOpen: (v: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  applyPromo: (code: string, subtotal: number) => void;
  removePromo: () => void;
  placeOrder: (customer: Order["customer"], paymentMethod: Order["paymentMethod"]) => Order;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addPromotion: (p: Omit<Promotion, "id" | "usageCount">) => void;
  updatePromotion: (p: Promotion) => void;
  deletePromotion: (id: string) => void;
  updateSiteContent: (c: SiteContent) => void;
}

const Ctx = createContext<StoreCtx>(null!);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [cartOpen, setCartOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>(seedPromotions);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [promoError, setPromoError] = useState("");

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart((p) => p.filter((i) => i.product.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((p) => p.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => { setCart([]); setAppliedPromo(null); setPromoError(""); };

  const applyPromo = (code: string, subtotal: number) => {
    const promo = promotions.find((p) => p.code.toLowerCase() === code.toLowerCase() && p.active);
    if (!promo) { setPromoError("Invalid or expired promo code."); return; }
    if (promo.minOrder && subtotal < promo.minOrder) {
      setPromoError(`Minimum order $${promo.minOrder} required for this code.`); return;
    }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      setPromoError("This promo code has expired."); return;
    }
    setAppliedPromo(promo);
    setPromoError("");
  };

  const removePromo = () => { setAppliedPromo(null); setPromoError(""); };

  const placeOrder = (customer: Order["customer"], paymentMethod: Order["paymentMethod"]): Order => {
    const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    let discount = 0;
    if (appliedPromo) {
      discount = appliedPromo.type === "percent"
        ? subtotal * (appliedPromo.value / 100)
        : Math.min(appliedPromo.value, subtotal);
      setPromotions((prev) => prev.map((p) => p.id === appliedPromo.id ? { ...p, usageCount: p.usageCount + 1 } : p));
    }
    const shipping = subtotal >= 150 ? 0 : 9.99;
    const total = Math.max(0, subtotal - discount) + shipping;
    const order: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      items: [...cart],
      total,
      discount,
      promoCode: appliedPromo?.code,
      paymentMethod,
      customer,
      status: "pending",
      createdAt: new Date(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const addProduct = (p: Omit<Product, "id">) =>
    setProducts((prev) => [{ ...p, id: `p${Date.now()}` }, ...prev]);
  const updateProduct = (p: Product) => setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const updateOrderStatus = (id: string, status: Order["status"]) =>
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  const addPromotion = (p: Omit<Promotion, "id" | "usageCount">) =>
    setPromotions((prev) => [{ ...p, id: `promo-${Date.now()}`, usageCount: 0 }, ...prev]);
  const updatePromotion = (p: Promotion) => setPromotions((prev) => prev.map((x) => x.id === p.id ? p : x));
  const deletePromotion = (id: string) => setPromotions((prev) => prev.filter((p) => p.id !== id));
  const updateSiteContent = (c: SiteContent) => setSiteContent(c);

  return (
    <Ctx.Provider value={{
      products, cart, orders, cartOpen, promotions, siteContent, appliedPromo, promoError,
      setCartOpen, addToCart, removeFromCart, updateQty, clearCart, applyPromo, removePromo,
      placeOrder, addProduct, updateProduct, deleteProduct, updateOrderStatus,
      addPromotion, updatePromotion, deletePromotion, updateSiteContent,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
