import { useState } from "react";
import { useStore } from "../store";
import { Order } from "../types";

type PayMethod = "card" | "cod";
type Field = "name" | "email" | "address" | "city" | "zip" | "card" | "expiry" | "cvv";

export default function CheckoutPage({ onSuccess, onBack }: { onSuccess: (order: Order) => void; onBack: () => void }) {
  const { cart, placeOrder, appliedPromo, applyPromo, removePromo, promoError } = useStore();
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [promoInput, setPromoInput] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = appliedPromo
    ? appliedPromo.type === "percent"
      ? subtotal * (appliedPromo.value / 100)
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const codFee = payMethod === "cod" ? 3 : 0;
  const total = Math.max(0, subtotal - discount) + shipping + codFee;

  const setField = (field: Field, value: string) => { setForm((f) => ({ ...f, [field]: value })); setErrors((e) => ({ ...e, [field]: undefined })); };

  const validateShipping = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    return e;
  };

  const validateCard = () => {
    const e: Partial<Record<Field, string>> = {};
    if (form.card.replace(/\s/g, "").length < 16) e.card = "16-digit card number required";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY format";
    if (form.cvv.length < 3) e.cvv = "3+ digits";
    return e;
  };

  const handleShippingNext = () => { const errs = validateShipping(); if (Object.keys(errs).length > 0) { setErrors(errs); return; } setStep("payment"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payMethod === "card") { const errs = validateCard(); if (Object.keys(errs).length > 0) { setErrors(errs); return; } }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const order = placeOrder({ name: form.name, email: form.email, address: form.address, city: form.city, zip: form.zip }, payMethod);
    onSuccess(order);
  };

  const inputCls = "input-dark w-full rounded-xl px-4 py-3.5 text-sm";
  const errStyle = (field: Field): React.CSSProperties => errors[field] ? { borderColor: "rgba(239,68,68,0.5)", boxShadow: "0 0 0 3px rgba(239,68,68,0.1)" } : {};

  const DarkInput = ({ id, label, placeholder, value, type = "text", onChange, maxLength }: { id: Field; label: string; placeholder: string; value: string; type?: string; onChange: (v: string) => void; maxLength?: number }) => (
    <div>
      <label className="block text-xs font-semibold text-white/35 uppercase tracking-wide mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={inputCls} style={errStyle(id)} />
      {errors[id] && <p className="text-xs text-rose-400 mt-1.5">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#080808" }}>
      {/* Header */}
      <header className="border-b border-white/5 px-4 py-4 flex items-center gap-4 sticky top-0 z-20" style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(16px)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>S</div>
          <span className="font-display text-lg text-white">STRYDE</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-semibold transition-colors ${step === "shipping" ? "text-violet-400" : "text-white/30"}`}>Shipping</span>
          <span className="text-white/15">→</span>
          <span className={`font-semibold transition-colors ${step === "payment" ? "text-violet-400" : "text-white/25"}`}>Payment</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={step === "shipping" ? (e) => { e.preventDefault(); handleShippingNext(); } : handleSubmit} className="lg:col-span-3 space-y-5">

          {step === "shipping" && (
            <div className="anim-fade-up">
              <h2 className="font-display text-2xl text-white mb-5">Shipping</h2>
              <div className="rounded-2xl p-6 space-y-4 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <DarkInput id="name" label="Full Name" placeholder="Jane Smith" value={form.name} onChange={(v) => setField("name", v)} />
                <DarkInput id="email" label="Email" placeholder="jane@example.com" value={form.email} type="email" onChange={(v) => setField("email", v)} />
                <DarkInput id="address" label="Street Address" placeholder="123 Main Street" value={form.address} onChange={(v) => setField("address", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <DarkInput id="city" label="City" placeholder="New York" value={form.city} onChange={(v) => setField("city", v)} />
                  <DarkInput id="zip" label="ZIP" placeholder="10001" value={form.zip} onChange={(v) => setField("zip", v)} maxLength={10} />
                </div>
              </div>

              {/* Promo code at shipping step */}
              <div className="mt-4 rounded-2xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-semibold text-white/35 uppercase tracking-wide mb-3">Promo Code</p>
                {appliedPromo ? (
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                    <div>
                      <p className="text-xs font-mono font-bold text-violet-300">{appliedPromo.code}</p>
                      <p className="text-xs text-violet-400/60">{appliedPromo.type === "percent" ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`} · saves ${discount.toFixed(2)}</p>
                    </div>
                    <button type="button" onClick={() => { removePromo(); setPromoInput(""); }} className="text-xs text-white/30 hover:text-rose-400 transition-colors">✕ Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())} placeholder="Enter promo code…" className="input-dark flex-1 rounded-xl px-3 py-2.5 text-sm font-mono" />
                    <button type="button" onClick={() => applyPromo(promoInput.trim(), subtotal)} className="px-4 py-2.5 rounded-xl text-white text-xs font-bold btn-violet shrink-0">Apply</button>
                  </div>
                )}
                {promoError && <p className="text-xs text-rose-400 mt-2">{promoError}</p>}
              </div>

              <button type="submit" className="w-full mt-4 py-4 rounded-2xl text-white font-semibold btn-violet">Continue to Payment →</button>
            </div>
          )}

          {step === "payment" && (
            <div className="anim-fade-up">
              <div className="flex items-center gap-3 mb-5">
                <button type="button" onClick={() => setStep("shipping")} className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="font-display text-2xl text-white">Payment</h2>
              </div>

              {/* Payment method selector */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {([
                  { method: "card" as PayMethod, icon: "💳", label: "Card", sub: "Credit / Debit" },
                  { method: "cod" as PayMethod, icon: "💵", label: "Cash on Delivery", sub: "+ $3.00 COD fee" },
                ]).map(({ method, icon, label, sub }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayMethod(method)}
                    className="flex items-center gap-3 p-4 rounded-2xl border transition-all text-left"
                    style={payMethod === method
                      ? { borderColor: "rgba(139,92,246,0.5)", background: "rgba(139,92,246,0.1)" }
                      : { borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${payMethod === method ? "text-violet-300" : "text-white/60"}`}>{label}</p>
                      <p className="text-xs text-white/25">{sub}</p>
                    </div>
                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${payMethod === method ? "border-violet-400" : "border-white/20"}`}>
                      {payMethod === method && <div className="w-full h-full rounded-full scale-50" style={{ background: "#a78bfa" }} />}
                    </div>
                  </button>
                ))}
              </div>

              {payMethod === "card" && (
                <div className="rounded-2xl p-6 space-y-4 border border-white/5 anim-fade-up" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center gap-2 text-xs text-white/25 mb-1">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Demo only — no real charges
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/35 uppercase tracking-wide mb-2">Card Number</label>
                    <input
                      value={form.card}
                      onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); setField("card", v.replace(/(.{4})/g, "$1 ").trim()); }}
                      placeholder="1234 5678 9012 3456"
                      className={`${inputCls} font-mono`}
                      style={errStyle("card")}
                    />
                    {errors.card && <p className="text-xs text-rose-400 mt-1.5">{errors.card}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/35 uppercase tracking-wide mb-2">Expiry</label>
                      <input
                        value={form.expiry}
                        onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setField("expiry", v); }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`${inputCls} font-mono`}
                        style={errStyle("expiry")}
                      />
                      {errors.expiry && <p className="text-xs text-rose-400 mt-1.5">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/35 uppercase tracking-wide mb-2">CVV</label>
                      <input
                        value={form.cvv}
                        onChange={(e) => setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className={`${inputCls} font-mono`}
                        style={errStyle("cvv")}
                      />
                      {errors.cvv && <p className="text-xs text-rose-400 mt-1.5">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              {payMethod === "cod" && (
                <div className="rounded-2xl p-6 border border-white/5 anim-fade-up" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="font-semibold text-white/80 mb-1">Cash on Delivery</p>
                      <p className="text-sm text-white/40 leading-relaxed">Pay in cash when your order arrives. Our delivery agent will collect the amount at your door. A $3.00 COD processing fee applies.</p>
                      <div className="mt-4 rounded-xl p-3 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.06)" }}>
                        <p className="text-xs text-amber-400 font-semibold">Shipping to: {form.city || "your city"}, {form.zip || "ZIP"}</p>
                        <p className="text-xs text-white/30 mt-0.5">Delivery in 5–7 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full mt-4 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2.5 btn-violet disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing…</>
                ) : (
                  `Place Order · $${total.toFixed(2)}`
                )}
              </button>
            </div>
          )}
        </form>

        {/* Summary */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl text-white mb-4">Summary</h2>
          <div className="rounded-2xl p-5 sticky top-24 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="relative shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl bg-[#181818]" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/80 truncate">{item.product.name}</p>
                    <p className="text-xs text-white/30">{item.product.category}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-white/70">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/40"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-violet-400"><span>Discount</span><span className="font-mono">-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-white/40"><span>Shipping</span><span className="font-mono">{shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              {codFee > 0 && <div className="flex justify-between text-amber-400"><span>COD Fee</span><span className="font-mono">+${codFee.toFixed(2)}</span></div>}
              <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-white/5"><span>Total</span><span className="font-mono">${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
