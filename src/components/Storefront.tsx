import { useState } from "react";
import { useStore } from "../store";
import { Category, Product } from "../types";
import CartDrawer from "./CartDrawer";
import AnimatedHero from "./AnimatedHero";

const CATEGORIES: Category[] = ["All", "Footwear", "Electronics", "Accessories", "Bags", "Fragrance"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, onSelect, index }: { product: Product; onSelect: () => void; index: number }) {
  const { addToCart } = useStore();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    const r = btn.getBoundingClientRect();
    dot.style.left = `${e.clientX - r.left}px`;
    dot.style.top = `${e.clientY - r.top}px`;
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
    addToCart(product);
  };

  return (
    <div className="card-hover group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col anim-fade-up" style={{ animationDelay: `${index * 55}ms` }}>
      <div className="relative overflow-hidden bg-[#181818] aspect-square cursor-pointer" onClick={onSelect}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" style={{ imageRendering: "auto" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>}
          {product.featured && <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(109,40,217,0.7)", color: "#e9d5ff" }}>Featured</span>}
        </div>
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">Low</span>
        )}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button onClick={onSelect} className="w-full py-2 rounded-xl text-white text-xs font-semibold transition-colors" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Quick View
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-white/85 cursor-pointer hover:text-violet-300 transition-colors leading-snug mb-2 line-clamp-2" onClick={onSelect}>{product.name}</h3>
        <div className="flex items-center gap-2 mb-3"><StarRating rating={product.rating} /><span className="text-xs text-white/30 font-mono">({product.reviewCount})</span></div>
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="font-mono text-lg font-semibold text-white">${product.price}</span>
          {product.originalPrice && <span className="text-sm text-white/30 line-through font-mono">${product.originalPrice}</span>}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="ripple-host w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: product.stock === 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", boxShadow: product.stock === 0 ? "none" : "0 4px 16px rgba(109,40,217,0.3)" }}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 anim-fade-in" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-white/8 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar anim-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-[#161616] rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" style={{ imageRendering: "auto" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {discount > 0 && <span className="absolute top-4 left-4 bg-rose-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">-{discount}%</span>}
          </div>
          <div className="p-7 sm:p-8 flex flex-col">
            <button onClick={onClose} className="self-end p-2 rounded-xl hover:bg-white/5 transition-colors mb-3 text-white/40 hover:text-white/80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-1">{product.category}</p>
            <h2 className="font-display text-3xl text-white mb-3 leading-tight">{product.name}</h2>
            <div className="flex items-center gap-3 mb-5"><StarRating rating={product.rating} /><span className="text-sm text-white/40">{product.rating} · {product.reviewCount} reviews</span></div>
            <p className="text-sm text-white/50 leading-relaxed mb-6">{product.description}</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-4xl font-semibold text-white">${product.price}</span>
              {product.originalPrice && <span className="font-mono text-xl text-white/30 line-through">${product.originalPrice}</span>}
            </div>
            <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-6 ${product.stock > 10 ? "bg-emerald-500/15 text-emerald-400" : product.stock > 0 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
            <div className="flex items-center bg-white/5 border border-white/8 rounded-xl overflow-hidden w-fit mb-6">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-lg font-light">−</button>
              <span className="px-4 py-3 font-mono font-semibold text-white min-w-[44px] text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-lg font-light">+</button>
            </div>
            <button
              disabled={product.stock === 0}
              onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); onClose(); }}
              className="w-full py-4 rounded-2xl text-white font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed mb-4 btn-violet"
            >
              {product.stock === 0 ? "Out of Stock" : `Add ${qty > 1 ? `${qty}× ` : ""}to Cart · $${(product.price * qty).toFixed(0)}`}
            </button>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t) => <span key={t} className="text-xs bg-white/5 text-white/30 px-2.5 py-1 rounded-full">#{t}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  onGoToCheckout: () => void;
  onNavigate: (page: string) => void;
}

export default function Storefront({ onGoToCheckout, onNavigate }: Props) {
  const { products, cart, setCartOpen } = useStore();
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const featured = products.find((p) => p.active && p.featured);

  const filtered = products
    .filter((p) => p.active)
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div className="min-h-screen" style={{ background: "#080808" }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-white/5" style={{ background: "rgba(8,8,8,0.88)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <div className="flex items-center gap-2.5 shrink-0 anim-slide-left">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>S</div>
            <span className="font-display text-xl text-white tracking-wide hidden sm:block">STRYDE</span>
          </div>

          {/* Desktop search */}
          <div className="flex-1 max-w-md mx-auto relative hidden sm:block anim-fade-in" style={{ animationDelay: "100ms" }}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="input-dark w-full rounded-xl pl-9 pr-4 py-2.5 text-sm" />
          </div>

          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            {/* Mobile search toggle */}
            <button className="sm:hidden p-2.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors" onClick={() => setMobileMenuOpen((v) => !v)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="badge-pop absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pb-3 anim-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" autoFocus className="input-dark w-full rounded-xl pl-9 pr-4 py-3 text-sm" />
            </div>
          </div>
        )}
      </header>

      {/* ── Animated Hero ── */}
      {!search && category === "All" && (
        <AnimatedHero
          onViewProduct={() => featured && setSelectedProduct(featured)}
          onShopNow={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
        />
      )}

      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-20 border-b border-white/5" style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
              style={category === cat
                ? { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", boxShadow: "0 4px 12px rgba(109,40,217,0.35)" }
                : { color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-xs border border-white/8 rounded-xl px-3 py-2 text-white/50 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-transparent cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 anim-fade-up">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="font-semibold text-white/40">No products found</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-white/25 font-mono mb-6 anim-fade-in">{filtered.length} products</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onSelect={() => setSelectedProduct(product)} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 mt-16" style={{ background: "#060606" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>S</div>
              <span className="font-display text-xl text-white">STRYDE</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs">Quality without compromise. Style without apology.</p>
          </div>
          <div>
            <p className="text-xs font-mono font-semibold text-white/25 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {[["About Us", "about"], ["Return Policy", "returns"], ["Shipping Policy", "shipping"], ["Privacy Policy", "privacy"]].map(([label, page]) => (
                <li key={page}>
                  <button onClick={() => onNavigate(page)} className="text-sm text-white/40 hover:text-violet-400 transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-mono font-semibold text-white/25 uppercase tracking-widest mb-4">Customer Care</p>
            <ul className="space-y-2.5">
              {["support@stryde.com", "returns@stryde.com", "press@stryde.com"].map((email) => (
                <li key={email}><span className="text-sm text-white/40 font-mono">{email}</span></li>
              ))}
            </ul>
            <p className="text-xs text-white/20 mt-6 font-mono">© 2026 STRYDE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/5" style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)" }}>
        {[
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: "Home", action: () => { setCategory("All"); setSearch(""); window.scrollTo({ top: 0 }); } },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>, label: "Browse", action: () => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }) },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, label: "Cart", action: () => setCartOpen(true), badge: cartCount },
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: "About", action: () => onNavigate("about") },
        ].map(({ icon, label, action, badge }) => (
          <button key={label} onClick={action} className="flex-1 flex flex-col items-center gap-1 py-3 text-white/40 hover:text-violet-400 transition-colors relative">
            {icon}
            <span className="text-xs">{label}</span>
            {badge && badge > 0 && (
              <span className="absolute top-2 right-1/4 w-4 h-4 flex items-center justify-center text-xs font-bold text-white rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", fontSize: "0.6rem" }}>{badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Cart + Modals */}
      <CartDrawer onCheckout={onGoToCheckout} />
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
