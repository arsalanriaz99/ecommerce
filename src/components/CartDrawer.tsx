import { useState } from "react";
import { useStore } from "../store";

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, appliedPromo, promoError, applyPromo, removePromo } = useStore();
  const [promoInput, setPromoInput] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = appliedPromo
    ? appliedPromo.type === "percent"
      ? subtotal * (appliedPromo.value / 100)
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount) + shipping;
  const freeLeft = Math.max(0, 150 - subtotal);

  const handleApply = () => { if (promoInput.trim()) { applyPromo(promoInput.trim(), subtotal); } };

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-all duration-400"
        style={{ background: cartOpen ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0)", backdropFilter: cartOpen ? "blur(8px)" : "blur(0px)", pointerEvents: cartOpen ? "auto" : "none", opacity: cartOpen ? 1 : 0 }}
        onClick={() => setCartOpen(false)}
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col border-l border-white/5"
        style={{ background: "#0d0d0d", transform: cartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-display text-2xl text-white">Your Cart</h2>
            <p className="text-xs text-white/30 mt-0.5 font-mono">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/30 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center anim-fade-up">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="font-semibold text-white/40 mb-2">Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Continue shopping</button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.product.id} className="flex gap-4 rounded-2xl p-3 anim-slide-right" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", animationDelay: `${idx * 50}ms` }}>
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#181818] shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-violet-400 font-semibold">{item.product.category}</p>
                  <p className="text-sm font-semibold text-white leading-snug mt-0.5 truncate">{item.product.name}</p>
                  <p className="font-mono text-sm font-semibold text-white/80 mt-1">${item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex items-center bg-white/5 border border-white/8 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="px-2.5 py-1 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-sm">−</button>
                      <span className="px-2.5 font-mono text-sm font-semibold text-white">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="px-2.5 py-1 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-sm">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="ml-auto p-1.5 text-white/20 hover:text-rose-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-white/5 space-y-4">
            {/* Free shipping progress */}
            {freeLeft > 0 ? (
              <div>
                <p className="text-xs text-white/30 mb-2">Add <span className="text-violet-400 font-semibold">${freeLeft.toFixed(2)}</span> more for free shipping</p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold rounded-xl px-3 py-2.5" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free shipping unlocked!
              </div>
            )}

            {/* Promo code */}
            {appliedPromo ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <div>
                  <p className="text-xs font-mono font-bold text-violet-300">{appliedPromo.code}</p>
                  <p className="text-xs text-violet-400/60">{appliedPromo.type === "percent" ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`}</p>
                </div>
                <button onClick={() => { removePromo(); setPromoInput(""); }} className="text-xs text-white/30 hover:text-rose-400 transition-colors">✕ Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Promo code…"
                  className="input-dark flex-1 rounded-xl px-3 py-2.5 text-sm font-mono"
                />
                <button onClick={handleApply} className="px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all btn-violet shrink-0">Apply</button>
              </div>
            )}
            {promoError && <p className="text-xs text-rose-400">{promoError}</p>}

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/40"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-violet-400"><span>Discount ({appliedPromo?.code})</span><span className="font-mono">-${discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-white/40">
                <span>Shipping</span>
                <span className="font-mono">{shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-white/5">
                <span>Total</span><span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => { setCartOpen(false); onCheckout(); }} className="w-full py-4 rounded-2xl text-white font-semibold btn-violet">
              Checkout → ${total.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
