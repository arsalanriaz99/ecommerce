import { useState } from "react";
import { StoreProvider } from "./store";
import { Order } from "./types";
import Storefront from "./components/Storefront";
import CheckoutPage from "./components/CheckoutPage";
import OrderSuccess from "./components/OrderSuccess";
import AdminPanel from "./components/AdminPanel";
import BrandPage from "./components/BrandPages";

type AppView = "store" | "checkout" | "success" | "admin" | "about" | "returns" | "shipping" | "privacy";

function Inner() {
  const [view, setView] = useState<AppView>("store");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const go = (v: AppView) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "admin") return <AdminPanel onGoToStore={() => go("store")} />;

  if (view === "checkout") {
    return (
      <CheckoutPage
        onSuccess={(order) => { setCompletedOrder(order); go("success"); }}
        onBack={() => go("store")}
      />
    );
  }

  if (view === "success" && completedOrder) {
    return <OrderSuccess order={completedOrder} onContinue={() => go("store")} />;
  }

  if (view === "about" || view === "returns" || view === "shipping" || view === "privacy") {
    return <BrandPage page={view} onBack={() => go("store")} />;
  }

  return (
    <>
      <Storefront onGoToCheckout={() => go("checkout")} onNavigate={(page) => go(page as AppView)} />
      {/* Admin shortcut FAB */}
      <button
        onClick={() => go("admin")}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 text-white text-xs font-semibold rounded-full shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: "rgba(13,13,13,0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Admin
      </button>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Inner />
    </StoreProvider>
  );
}
