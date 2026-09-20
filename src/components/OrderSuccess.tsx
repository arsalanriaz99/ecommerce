import { Order } from "../types";

export default function OrderSuccess({ order, onContinue }: { order: Order; onContinue: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#080808" }}>
      <div className="max-w-lg w-full">
        {/* Checkmark burst */}
        <div className="flex flex-col items-center text-center mb-10 anim-scale-in">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))", border: "1px solid rgba(16,185,129,0.25)" }}>
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full anim-glow" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", filter: "blur(12px)" }} />
          </div>

          <h1 className="font-display text-4xl text-white mb-3 anim-fade-up" style={{ animationDelay: "150ms" }}>Order Confirmed!</h1>
          <p className="text-white/40 text-sm anim-fade-up" style={{ animationDelay: "250ms" }}>
            Thanks <span className="text-white/70 font-semibold">{order.customer.name.split(" ")[0]}</span>! We have received your order.
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white/3 border border-white/7 rounded-3xl overflow-hidden mb-6 anim-fade-up" style={{ animationDelay: "350ms" }}>
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest font-mono mb-0.5">Order ID</p>
              <p className="font-mono text-xl font-semibold text-white">{order.id}</p>
            </div>
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
              {order.status}
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs text-white/25 font-mono uppercase tracking-wide mb-3">Items</p>
              <div className="space-y-2.5">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover bg-[#181818]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 truncate">{item.product.name}</p>
                      <p className="text-xs text-white/30">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm text-white/60">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between text-white font-semibold">
              <span>Total</span>
              <span className="font-mono">${order.total.toFixed(2)}</span>
            </div>

            <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-white/25 font-mono uppercase tracking-wide mb-1.5">Ship To</p>
                <p className="text-white/70 font-semibold">{order.customer.name}</p>
                <p className="text-white/35 mt-0.5">{order.customer.address}</p>
                <p className="text-white/35">{order.customer.city}, {order.customer.zip}</p>
              </div>
              <div>
                <p className="text-white/25 font-mono uppercase tracking-wide mb-1.5">Confirmation</p>
                <p className="text-white/50">{order.customer.email}</p>
                <p className="text-white/30 mt-0.5">{order.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-white font-semibold btn-violet anim-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
