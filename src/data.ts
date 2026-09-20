import { Product, Order, Promotion, SiteContent } from "./types";

export const seedProducts: Product[] = [
  {
    id: "p1", name: "Cloudfoam Sprint", price: 89, originalPrice: 120,
    description: "Lightweight and responsive running shoe with energy-return foam midsole. Engineered mesh upper keeps your feet cool on long runs.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=95",
    category: "Footwear", stock: 24, rating: 4.6, reviewCount: 312, featured: true, active: true,
    tags: ["running", "lightweight", "breathable"],
  },
  {
    id: "p2", name: "Air Force One Hi", price: 120,
    description: "Iconic high-top silhouette reimagined with premium leather and a cushioned collar for all-day comfort on the street.",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1200&q=95",
    category: "Footwear", stock: 15, rating: 4.8, reviewCount: 548, featured: false, active: true,
    tags: ["lifestyle", "leather", "classic"],
  },
  {
    id: "p3", name: "Trail Craft Low", price: 99, originalPrice: 135,
    description: "Rugged trail shoe with sticky rubber outsole and reinforced toe cap. Built for technical terrain.",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=95",
    category: "Footwear", stock: 8, rating: 4.4, reviewCount: 187, featured: false, active: true,
    tags: ["trail", "outdoor", "durable"],
  },
  {
    id: "p4", name: "Studio Pro Headphones", price: 249,
    description: "40-hour battery, active noise cancellation, and premium 40mm drivers deliver studio-quality sound wherever you go.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=95",
    category: "Electronics", stock: 42, rating: 4.9, reviewCount: 1024, featured: true, active: true,
    tags: ["wireless", "ANC", "premium"],
  },
  {
    id: "p5", name: "Noir Wireless", price: 179, originalPrice: 220,
    description: "Sleek matte-black over-ear headphones with spatial audio, multipoint Bluetooth 5.3, and foldable design.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=95",
    category: "Electronics", stock: 30, rating: 4.5, reviewCount: 763, featured: false, active: true,
    tags: ["wireless", "travel", "foldable"],
  },
  {
    id: "p6", name: "Minimal GMT Watch", price: 320,
    description: "Swiss-inspired quartz movement in a slim 38mm stainless steel case. Sapphire crystal glass, 5ATM water resistance.",
    image: "https://images.unsplash.com/photo-1689287428096-7e1dcc705a5c?w=1200&q=95",
    category: "Accessories", stock: 12, rating: 4.7, reviewCount: 214, featured: true, active: true,
    tags: ["watch", "minimalist", "steel"],
  },
  {
    id: "p7", name: "Heritage Timepiece", price: 450, originalPrice: 520,
    description: "Automatic self-winding movement with exhibition caseback. Genuine leather strap reveals the movement.",
    image: "https://images.unsplash.com/photo-1621341103818-01dada8c6ef8?w=1200&q=95",
    category: "Accessories", stock: 6, rating: 4.8, reviewCount: 98, featured: false, active: true,
    tags: ["automatic", "luxury", "leather"],
  },
  {
    id: "p8", name: "Canvas Tote Backpack", price: 95,
    description: "Heavy-duty waxed canvas with leather trim. Fits a 15\" laptop with magnetic buckle closure.",
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=1200&q=95",
    category: "Bags", stock: 19, rating: 4.5, reviewCount: 441, featured: false, active: true,
    tags: ["canvas", "laptop", "everyday"],
  },
  {
    id: "p9", name: "Leather Commuter", price: 145, originalPrice: 185,
    description: "Full-grain leather briefcase/backpack hybrid. Tuck-away straps and padded laptop compartment.",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=95",
    category: "Bags", stock: 11, rating: 4.6, reviewCount: 276, featured: false, active: true,
    tags: ["leather", "professional", "hybrid"],
  },
  {
    id: "p10", name: "Bloom Eau de Parfum", price: 85,
    description: "A luminous floral bouquet of peony, jasmine, and white musk. Long-lasting 12-hour wear. 50 ml.",
    image: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=1200&q=95",
    category: "Fragrance", stock: 35, rating: 4.4, reviewCount: 589, featured: false, active: true,
    tags: ["floral", "feminine", "long-lasting"],
  },
  {
    id: "p11", name: "Noir Essence", price: 110, originalPrice: 130,
    description: "An intense woody oriental with oud, sandalwood, and smoky vetiver. Bold and unforgettable. 75 ml.",
    image: "https://images.unsplash.com/photo-1543422655-ac1c6ca993ed?w=1200&q=95",
    category: "Fragrance", stock: 28, rating: 4.7, reviewCount: 322, featured: false, active: true,
    tags: ["woody", "oud", "intense"],
  },
  {
    id: "p12", name: "Aviator Shades", price: 65,
    description: "Classic teardrop aviator with polarized lenses, UV400 protection, and lightweight stainless steel frame.",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&q=95",
    category: "Accessories", stock: 50, rating: 4.3, reviewCount: 834, featured: false, active: true,
    tags: ["polarized", "UV400", "classic"],
  },
];

const d = (daysAgo: number) => { const x = new Date(); x.setDate(x.getDate() - daysAgo); return x; };

export const seedOrders: Order[] = [
  {
    id: "ORD-001", items: [{ product: seedProducts[3], quantity: 1 }, { product: seedProducts[11], quantity: 2 }],
    total: 379, discount: 0, paymentMethod: "card",
    customer: { name: "Alex Johnson", email: "alex@example.com", address: "123 Oak Street", city: "Portland", zip: "97201" },
    status: "delivered", createdAt: d(12),
  },
  {
    id: "ORD-002", items: [{ product: seedProducts[0], quantity: 1 }],
    total: 89, discount: 0, paymentMethod: "cod",
    customer: { name: "Maria Garcia", email: "maria@example.com", address: "456 Elm Ave", city: "Austin", zip: "78701" },
    status: "shipped", createdAt: d(5),
  },
  {
    id: "ORD-003", items: [{ product: seedProducts[5], quantity: 1 }, { product: seedProducts[8], quantity: 1 }],
    total: 443.5, discount: 21.5, promoCode: "SAVE5", paymentMethod: "card",
    customer: { name: "Sam Lee", email: "sam@example.com", address: "789 Maple Dr", city: "Seattle", zip: "98101" },
    status: "processing", createdAt: d(2),
  },
  {
    id: "ORD-004", items: [{ product: seedProducts[9], quantity: 2 }],
    total: 170, discount: 0, paymentMethod: "cod",
    customer: { name: "Priya Patel", email: "priya@example.com", address: "321 Pine Rd", city: "Chicago", zip: "60601" },
    status: "pending", createdAt: d(1),
  },
  {
    id: "ORD-005", items: [{ product: seedProducts[1], quantity: 1 }, { product: seedProducts[4], quantity: 1 }],
    total: 269.1, discount: 29.9, promoCode: "WELCOME10", paymentMethod: "card",
    customer: { name: "Jordan Kim", email: "jordan@example.com", address: "654 Cedar Ln", city: "Denver", zip: "80201" },
    status: "cancelled", createdAt: d(8),
  },
];

export const seedPromotions: Promotion[] = [
  { id: "promo-1", code: "WELCOME10", type: "percent", value: 10, minOrder: 0, expiresAt: "", active: true, usageCount: 47, description: "10% off for new customers" },
  { id: "promo-2", code: "SAVE5", type: "percent", value: 5, minOrder: 200, expiresAt: "", active: true, usageCount: 23, description: "5% off orders over $200" },
  { id: "promo-3", code: "FLAT20", type: "fixed", value: 20, minOrder: 100, expiresAt: "2026-12-31", active: true, usageCount: 8, description: "$20 off orders over $100" },
  { id: "promo-4", code: "SUMMER25", type: "percent", value: 25, minOrder: 300, expiresAt: "2026-09-30", active: false, usageCount: 61, description: "Summer sale — 25% off" },
];

export const defaultSiteContent: SiteContent = {
  heroHeadline: "Wear the\nFuture",
  heroSubheadline: "Premium footwear, electronics & lifestyle accessories — curated for those who move with intention.",
  heroCTA: "Shop the Collection",
  aboutTitle: "Born from the streets. Built for everywhere.",
  aboutBody: `STRYDE was founded in 2019 by a collective of designers, athletes, and technologists who believed that premium quality shouldn't be a luxury — it should be the standard.\n\nWe source the finest materials from certified suppliers, partner with ethical manufacturers, and refuse to compromise on craftsmanship. Every product on STRYDE carries our quality guarantee: if it is not exceptional, it should not exist.\n\nToday, STRYDE ships to 48 countries and has become the destination for discerning customers who refuse to choose between style and substance.`,
  returnPolicy: `**30-Day Returns**\n\nWe stand behind every product we sell. If you are not completely satisfied, return it within 30 days of delivery for a full refund or exchange — no questions asked.\n\n**Conditions:**\n• Items must be unused and in original packaging\n• Include original receipt or order confirmation\n• Footwear must be unworn with original box\n• Sale items are eligible for exchange only\n\n**Process:**\n1. Email returns@stryde.com with your order ID\n2. We will send you a prepaid return label within 24 hours\n3. Drop off at any carrier location\n4. Refund processed within 3–5 business days of receipt`,
  shippingPolicy: `**Free Shipping on Orders Over $150**\n\nStandard shipping is $9.99 for orders under $150. Orders over $150 ship free.\n\n**Delivery Times:**\n• Standard (5–7 business days): Free on orders $150+, else $9.99\n• Express (2–3 business days): $14.99\n• Overnight (next business day): $29.99\n• International (7–14 business days): $24.99\n\n**Cash on Delivery** is available for domestic orders. A $3 COD processing fee applies.\n\nAll orders are processed within 1–2 business days. Tracking information is emailed upon shipment.`,
  privacyPolicy: `**Privacy Policy**\n\nYour privacy is fundamental to how we operate.\n\n**Data We Collect:** Name, email, shipping address, and order history — only what is needed to fulfill your order.\n\n**How We Use It:** Order fulfillment, shipping notifications, and optional marketing emails (opt-in only). We never sell your data.\n\n**Security:** All transactions use TLS 1.3 encryption. Payment data is processed by certified PCI-DSS Level 1 providers and never stored on our servers.\n\n**Your Rights:** You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@stryde.com.`,
  footerTagline: "Quality without compromise. Style without apology.",
};
