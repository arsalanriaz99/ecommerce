import { useState } from "react";
import React from "react";
import { useStore } from "../store";
import { Product, Order, Category, Promotion, SiteContent } from "../types";

type AdminView = "dashboard" | "products" | "orders" | "promotions" | "content";

const CATEGORIES: Exclude<Category, "All">[] = ["Footwear", "Electronics", "Accessories", "Bags", "Fragrance"];

const STATUS_CFG: Record<Order["status"], { label: string; style: React.CSSProperties }> = {
  pending:    { label: "Pending",    style: { background: "rgba(245,158,11,0.12)", color: "#f59e0b",  border: "1px solid rgba(245,158,11,0.2)" } },
  processing: { label: "Processing", style: { background: "rgba(59,130,246,0.12)",  color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" } },
  shipped:    { label: "Shipped",    style: { background: "rgba(139,92,246,0.12)",  color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" } },
  delivered:  { label: "Delivered",  style: { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" } },
  cancelled:  { label: "Cancelled",  style: { background: "rgba(239,68,68,0.12)",  color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" } },
};

const inputCls = "input-dark w-full rounded-xl px-4 py-3 text-sm";
const textareaCls = "input-dark w-full rounded-xl px-4 py-3 text-sm resize-none";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-white/35 uppercase tracking-wide mb-2">{children}</label>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delay, color }: { label: string; value: string | number; icon: string; delay: number; color: string }) {
  return (
    <div className="rounded-2xl p-5 border border-white/5 anim-fade-up" style={{ background: "#111111", animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
      <p className="font-mono text-3xl font-semibold text-white mb-1 anim-count" style={{ animationDelay: `${delay + 100}ms` }}>{value}</p>
      <p className="text-xs text-white/30 uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const { products, orders, promotions } = useStore();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const totalDiscount = orders.reduce((s, o) => s + (o.discount || 0), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const activePromos = promotions.filter((p) => p.active).length;

  return (
    <div className="space-y-8">
      <div className="anim-fade-up">
        <h1 className="font-display text-3xl text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">Welcome back. Here is what is happening today.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} icon="💰" delay={0} color="#34d399" />
        <StatCard label="Orders" value={orders.length} icon="📦" delay={60} color="#a78bfa" />
        <StatCard label="Savings Given" value={`$${totalDiscount.toFixed(0)}`} icon="🏷" delay={120} color="#60a5fa" />
        <StatCard label="Active Promos" value={activePromos} icon="🎟" delay={180} color="#f59e0b" />
      </div>
      {pending > 0 && (
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3 anim-fade-up" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", animationDelay: "200ms" }}>
          <span className="text-xl">🔔</span>
          <p className="text-sm font-semibold text-amber-400">{pending} order{pending !== 1 ? "s" : ""} pending processing</p>
        </div>
      )}
      <div className="rounded-2xl border border-white/5 overflow-hidden anim-fade-up" style={{ background: "#111111", animationDelay: "240ms" }}>
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <span className="text-xs text-white/25 font-mono">{orders.length} total</span>
        </div>
        <div className="divide-y divide-white/3">
          {orders.slice(0, 6).map((order, i) => (
            <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/2 transition-colors anim-slide-left" style={{ animationDelay: `${300 + i * 50}ms` }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-semibold text-white">{order.id}</p>
                <p className="text-xs text-white/30 mt-0.5">{order.customer.name} · {order.paymentMethod === "cod" ? "COD" : "Card"}</p>
              </div>
              <span className="font-mono font-semibold text-white/80">${order.total.toFixed(2)}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={STATUS_CFG[order.status].style}>{STATUS_CFG[order.status].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }: { product?: Product; onSave: (p: Product | Omit<Product, "id">) => void; onClose: () => void }) {
  const blank: Omit<Product, "id"> = { name: "", description: "", price: 0, image: "", category: "Footwear", stock: 0, rating: 4.0, reviewCount: 0, featured: false, active: true, tags: [] };
  const [form, setForm] = useState<Omit<Product, "id">>(product ? { ...product } : blank);
  const [tagInput, setTagInput] = useState(product?.tags.join(", ") ?? "");
  const set = (f: keyof Omit<Product, "id">, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.image.trim() || form.price <= 0) return;
    const data = { ...form, tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean) };
    if (product) onSave({ ...data, id: product.id } as Product);
    else onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" style={{ background: "rgba(0,0,0,0.8)" }} onClick={onClose}>
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border border-white/8 anim-scale-in" style={{ background: "#111111" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display text-xl text-white">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[{ label: "Product Name", field: "name" as const, ph: "e.g. Air Force One" }, { label: "Image URL", field: "image" as const, ph: "https://..." }].map(({ label, field, ph }) => (
            <div key={field}><Label>{label}</Label><input value={form[field] as string} onChange={(e) => set(field, e.target.value)} placeholder={ph} className={inputCls} /></div>
          ))}
          {form.image && <div className="h-40 rounded-xl overflow-hidden bg-[#181818]"><img src={form.image} alt="preview" className="w-full h-full object-cover" /></div>}
          <div><Label>Description</Label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description…" className={textareaCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price ($)</Label><input type="number" min={0} value={form.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} className={inputCls} /></div>
            <div><Label>Original Price ($)</Label><input type="number" min={0} value={form.originalPrice ?? ""} onChange={(e) => set("originalPrice", parseFloat(e.target.value) || undefined)} placeholder="Optional" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Category</Label><select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputCls} cursor-pointer`} style={{ background: "rgba(255,255,255,0.04)", color: "#f8f8f8" }}>{CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}</select></div>
            <div><Label>Stock</Label><input type="number" min={0} value={form.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} className={inputCls} /></div>
          </div>
          <div><Label>Tags (comma-separated)</Label><input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="leather, classic, premium" className={inputCls} /></div>
          <div className="flex items-center gap-6 pt-1">
            {(["featured", "active"] as const).map((field) => (
              <label key={field} className="flex items-center gap-2.5 cursor-pointer select-none">
                <button type="button" onClick={() => set(field, !form[field])} className="relative w-10 h-6 rounded-full transition-all duration-200" style={{ background: form[field] ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,0.1)" }}>
                  <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200" style={{ transform: form[field] ? "translateX(20px)" : "translateX(4px)" }} />
                </button>
                <span className="text-sm text-white/60 capitalize">{field}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="px-6 py-5 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-white/8 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={!form.name.trim() || !form.image.trim() || form.price <= 0} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed btn-violet">{product ? "Save Changes" : "Add Product"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Products Admin ────────────────────────────────────────────────────────────
function ProductsAdmin() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 anim-fade-up">
        <div><h1 className="font-display text-3xl text-white">Products</h1><p className="text-white/25 text-sm mt-1 font-mono">{products.length} total</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold btn-violet">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Add Product
        </button>
      </div>
      <div className="relative anim-fade-up" style={{ animationDelay: "60ms" }}>
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="input-dark w-full rounded-xl pl-10 pr-4 py-3 text-sm" />
      </div>
      <div className="rounded-2xl border border-white/5 overflow-hidden anim-fade-up" style={{ background: "#111111", animationDelay: "120ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">
              {["Product", "Category", "Price", "Stock", "Status", ""].map((h, i) => (
                <th key={i} className={`text-left px-5 py-4 text-xs font-mono font-semibold text-white/25 uppercase tracking-widest ${[1].includes(i) ? "hidden sm:table-cell" : ""} ${[3].includes(i) ? "hidden md:table-cell" : ""} ${[4].includes(i) ? "hidden lg:table-cell" : ""}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/3">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors anim-slide-left" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1a1a1a] shrink-0"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div><div className="min-w-0"><p className="font-semibold text-white/80 truncate max-w-[180px]">{p.name}</p>{p.featured && <span className="text-xs text-violet-400 font-mono">Featured</span>}</div></div></td>
                  <td className="px-5 py-3.5 text-white/40 hidden sm:table-cell text-xs">{p.category}</td>
                  <td className="px-5 py-3.5"><span className="font-mono font-semibold text-white/80">${p.price}</span>{p.originalPrice && <span className="ml-1.5 font-mono text-xs text-white/25 line-through">${p.originalPrice}</span>}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full" style={p.stock === 0 ? { background: "rgba(239,68,68,0.12)", color: "#f87171" } : p.stock <= 10 ? { background: "rgba(245,158,11,0.12)", color: "#f59e0b" } : { background: "rgba(16,185,129,0.12)", color: "#34d399" }}>{p.stock === 0 ? "Out" : `${p.stock}`}</span></td>
                  <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={p.active ? { background: "rgba(16,185,129,0.12)", color: "#34d399" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>{p.active ? "Active" : "Inactive"}</span></td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => setEditProduct(p)} className="p-2 rounded-lg text-white/25 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-white/25"><p className="font-semibold">No products found</p></div>}
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/8 p-7 anim-scale-in" style={{ background: "#111111" }}>
            <h3 className="font-display text-xl text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-white/35 mb-7">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-white/8 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => { deleteProduct(deleteId); setDeleteId(null); }} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {showAdd && <ProductModal onSave={(p) => addProduct(p as Omit<Product, "id">)} onClose={() => setShowAdd(false)} />}
      {editProduct && <ProductModal product={editProduct} onSave={(p) => updateProduct(p as Product)} onClose={() => setEditProduct(undefined)} />}
    </div>
  );
}

// ── Orders Admin ──────────────────────────────────────────────────────────────
function OrdersAdmin() {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState("");
  const filtered = orders.filter((o) => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="anim-fade-up"><h1 className="font-display text-3xl text-white">Orders</h1><p className="text-white/25 text-sm mt-1 font-mono">{orders.length} total</p></div>
      <div className="relative anim-fade-up" style={{ animationDelay: "60ms" }}>
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID or customer…" className="input-dark w-full rounded-xl pl-10 pr-4 py-3 text-sm" />
      </div>
      <div className="rounded-2xl border border-white/5 overflow-hidden anim-fade-up" style={{ background: "#111111", animationDelay: "120ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{["Order", "Customer", "Items", "Total", "Payment", "Status", "Date"].map((h, i) => (
              <th key={h} className={`text-left px-5 py-4 text-xs font-mono font-semibold text-white/25 uppercase tracking-widest ${[1].includes(i) ? "hidden sm:table-cell" : ""} ${[2, 6].includes(i) ? "hidden md:table-cell" : ""}`}>{h}</th>
            ))}</tr></thead>
            <tbody className="divide-y divide-white/3">
              {filtered.map((order, i) => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors anim-slide-left" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-4"><p className="font-mono font-semibold text-white/80">{order.id}</p></td>
                  <td className="px-5 py-4 hidden sm:table-cell"><p className="font-semibold text-white/70">{order.customer.name}</p><p className="text-xs text-white/30 truncate max-w-[140px]">{order.customer.email}</p></td>
                  <td className="px-5 py-4 hidden md:table-cell"><div className="flex -space-x-2">{order.items.slice(0, 3).map((item) => <img key={item.product.id} src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-[#111111] bg-[#1a1a1a]" />)}{order.items.length > 3 && <div className="w-8 h-8 rounded-lg bg-white/8 border-2 border-[#111111] flex items-center justify-center text-xs font-mono font-bold text-white/40">+{order.items.length - 3}</div>}</div></td>
                  <td className="px-5 py-4"><span className="font-mono font-semibold text-white/80">${order.total.toFixed(2)}</span>{order.discount > 0 && <p className="text-xs text-violet-400 font-mono">-${order.discount.toFixed(2)}</p>}</td>
                  <td className="px-5 py-4"><span className={`text-xs font-mono font-semibold px-2 py-1 rounded-full ${order.paymentMethod === "cod" ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>{order.paymentMethod === "cod" ? "COD" : "Card"}</span></td>
                  <td className="px-5 py-4"><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])} className="text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer capitalize" style={STATUS_CFG[order.status].style}>{(Object.keys(STATUS_CFG) as Order["status"][]).map((s) => <option key={s} value={s} style={{ background: "#1a1a1a", color: "#f8f8f8" }}>{s}</option>)}</select></td>
                  <td className="px-5 py-4 text-white/25 text-xs font-mono hidden md:table-cell">{order.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-white/25"><p className="font-semibold">No orders found</p></div>}
      </div>
    </div>
  );
}

// ── Promotions Admin ──────────────────────────────────────────────────────────
function PromoModal({ promo, onSave, onClose }: { promo?: Promotion; onSave: (p: Omit<Promotion, "id" | "usageCount"> | Promotion) => void; onClose: () => void }) {
  const blank: Omit<Promotion, "id" | "usageCount"> = { code: "", type: "percent", value: 10, minOrder: 0, expiresAt: "", active: true, description: "" };
  const [form, setForm] = useState(promo ? { ...promo } : blank);
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" style={{ background: "rgba(0,0,0,0.8)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-white/8 anim-scale-in" style={{ background: "#111111" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display text-xl text-white">{promo ? "Edit Promo" : "New Promo Code"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 space-y-4">
          <div><Label>Promo Code</Label><input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="e.g. SAVE20" className={`${inputCls} font-mono`} /></div>
          <div><Label>Description</Label><input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description for admin" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Discount Type</Label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={`${inputCls} cursor-pointer`} style={{ background: "rgba(255,255,255,0.04)", color: "#f8f8f8" }}>
                <option value="percent" style={{ background: "#1a1a1a" }}>Percentage (%)</option>
                <option value="fixed" style={{ background: "#1a1a1a" }}>Fixed Amount ($)</option>
              </select>
            </div>
            <div><Label>{form.type === "percent" ? "Percent Off" : "Dollar Off"}</Label><input type="number" min={0} max={form.type === "percent" ? 100 : undefined} value={form.value} onChange={(e) => set("value", parseFloat(e.target.value) || 0)} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Min Order ($)</Label><input type="number" min={0} value={form.minOrder} onChange={(e) => set("minOrder", parseFloat(e.target.value) || 0)} placeholder="0 = no minimum" className={inputCls} /></div>
            <div><Label>Expires (leave blank = no expiry)</Label><input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className={`${inputCls} cursor-pointer`} /></div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button type="button" onClick={() => set("active", !form.active)} className="relative w-10 h-6 rounded-full transition-all duration-200" style={{ background: form.active ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,0.1)" }}>
              <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200" style={{ transform: form.active ? "translateX(20px)" : "translateX(4px)" }} />
            </button>
            <span className="text-sm text-white/60">Active</span>
          </label>
        </div>
        <div className="px-6 py-5 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-white/8 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={() => { if (!form.code.trim()) return; if (promo) onSave({ ...form, id: promo.id, usageCount: promo.usageCount }); else onSave(form); onClose(); }} disabled={!form.code.trim()} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 btn-violet">{promo ? "Save Changes" : "Create Promo"}</button>
        </div>
      </div>
    </div>
  );
}

function PromotionsAdmin() {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 anim-fade-up">
        <div><h1 className="font-display text-3xl text-white">Promotions</h1><p className="text-white/25 text-sm mt-1 font-mono">{promotions.length} codes · {promotions.filter((p) => p.active).length} active</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold btn-violet">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>New Code
        </button>
      </div>

      <div className="space-y-3 anim-fade-up" style={{ animationDelay: "60ms" }}>
        {promotions.map((promo, i) => (
          <div key={promo.id} className="rounded-2xl border border-white/5 p-5 flex flex-wrap items-start gap-4 hover:bg-white/2 transition-colors anim-slide-left" style={{ background: "#111111", animationDelay: `${i * 40}ms` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-mono text-lg font-bold text-violet-300">{promo.code}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={promo.active ? { background: "rgba(16,185,129,0.12)", color: "#34d399" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>{promo.active ? "Active" : "Inactive"}</span>
              </div>
              <p className="text-sm text-white/50 mb-2">{promo.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-white/30 font-mono">
                <span>{promo.type === "percent" ? `${promo.value}% off` : `$${promo.value} off`}</span>
                {promo.minOrder > 0 && <span>Min: ${promo.minOrder}</span>}
                {promo.expiresAt && <span>Expires: {new Date(promo.expiresAt).toLocaleDateString()}</span>}
                <span>{promo.usageCount} uses</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditPromo(promo)} className="p-2 rounded-lg text-white/25 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              <button onClick={() => setDeleteId(promo.id)} className="p-2 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
        ))}
        {promotions.length === 0 && <div className="text-center py-12 text-white/25 rounded-2xl border border-white/5" style={{ background: "#111111" }}><p className="font-semibold">No promo codes yet</p></div>}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/8 p-7 anim-scale-in" style={{ background: "#111111" }}>
            <h3 className="font-display text-xl text-white mb-2">Delete Promo?</h3>
            <p className="text-sm text-white/35 mb-7">This code will no longer work for customers.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-white/8 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => { deletePromotion(deleteId); setDeleteId(null); }} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {showAdd && <PromoModal onSave={(p) => addPromotion(p as Omit<Promotion, "id" | "usageCount">)} onClose={() => setShowAdd(false)} />}
      {editPromo && <PromoModal promo={editPromo} onSave={(p) => updatePromotion(p as Promotion)} onClose={() => setEditPromo(undefined)} />}
    </div>
  );
}

// ── Content Editor ────────────────────────────────────────────────────────────
function ContentEditor() {
  const { siteContent, updateSiteContent } = useStore();
  const [form, setForm] = useState<SiteContent>({ ...siteContent });
  const [saved, setSaved] = useState(false);
  const set = (f: keyof SiteContent, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    updateSiteContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections: { title: string; fields: { label: string; key: keyof SiteContent; rows?: number; mono?: boolean }[] }[] = [
    {
      title: "Hero Section",
      fields: [
        { label: "Headline (use \\n for line breaks)", key: "heroHeadline" },
        { label: "Subheadline", key: "heroSubheadline", rows: 2 },
        { label: "CTA Button Text", key: "heroCTA" },
      ],
    },
    {
      title: "About Page",
      fields: [
        { label: "Page Title", key: "aboutTitle" },
        { label: "Body Content", key: "aboutBody", rows: 8 },
      ],
    },
    {
      title: "Return Policy",
      fields: [{ label: "Content (use **text** for headings, • for bullets)", key: "returnPolicy", rows: 10 }],
    },
    {
      title: "Shipping Policy",
      fields: [{ label: "Content", key: "shippingPolicy", rows: 10 }],
    },
    {
      title: "Privacy Policy",
      fields: [{ label: "Content", key: "privacyPolicy", rows: 10 }],
    },
    {
      title: "Footer",
      fields: [{ label: "Tagline", key: "footerTagline" }],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between anim-fade-up">
        <div><h1 className="font-display text-3xl text-white">Content Editor</h1><p className="text-white/25 text-sm mt-1">Edit storefront text and page content</p></div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all btn-violet"
        >
          {saved ? (
            <><svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Changes</>
          )}
        </button>
      </div>

      {sections.map((section, si) => (
        <div key={section.title} className="rounded-2xl border border-white/5 overflow-hidden anim-fade-up" style={{ background: "#111111", animationDelay: `${si * 80}ms` }}>
          <div className="px-6 py-4 border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold text-white">{section.title}</h2>
          </div>
          <div className="p-6 space-y-4">
            {section.fields.map(({ label, key, rows }) => (
              <div key={key}>
                <Label>{label}</Label>
                {rows ? (
                  <textarea
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    rows={rows}
                    className={textareaCls}
                  />
                ) : (
                  <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputCls} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Admin Shell ───────────────────────────────────────────────────────────────
export default function AdminPanel({ onGoToStore }: { onGoToStore: () => void }) {
  const [view, setView] = useState<AdminView>("dashboard");

  const navItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "products", label: "Products", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: "orders", label: "Orders", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { id: "promotions", label: "Promotions", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { id: "content", label: "Content", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#080808" }}>
      <aside className="w-60 shrink-0 flex flex-col border-r border-white/5 min-h-screen" style={{ background: "#0d0d0d" }}>
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>S</div>
            <div><p className="font-display text-base text-white tracking-wide">STRYDE</p><p className="text-xs text-white/25 -mt-0.5 font-mono">Admin</p></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200" style={view === item.id ? { background: "rgba(139,92,246,0.15)", color: "#a78bfa", borderLeft: "2px solid #a78bfa" } : { color: "rgba(255,255,255,0.35)" }}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={onGoToStore} className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-white/70 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            View Store
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
          {view === "dashboard" && <Dashboard />}
          {view === "products" && <ProductsAdmin />}
          {view === "orders" && <OrdersAdmin />}
          {view === "promotions" && <PromotionsAdmin />}
          {view === "content" && <ContentEditor />}
        </div>
      </main>
    </div>
  );
}
