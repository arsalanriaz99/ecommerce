import { useStore } from "../store";

type BrandPage = "about" | "returns" | "shipping" | "privacy";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h3 key={i} className="font-display text-xl text-white mt-8 mb-3 first:mt-0">{line.slice(2, -2)}</h3>;
    }
    if (line.startsWith("• ")) {
      return <li key={i} className="text-white/50 leading-relaxed ml-4">{line.slice(2)}</li>;
    }
    if (line.match(/^\d+\. /)) {
      return <li key={i} className="text-white/50 leading-relaxed ml-4 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
    }
    if (line === "") return <div key={i} className="h-3" />;
    return <p key={i} className="text-white/50 leading-relaxed">{line}</p>;
  });
}

interface Props {
  page: BrandPage;
  onBack: () => void;
}

const PAGE_CONFIG = {
  about: { title: "About STRYDE", icon: "✦" },
  returns: { title: "Return Policy", icon: "↩" },
  shipping: { title: "Shipping Policy", icon: "📦" },
  privacy: { title: "Privacy Policy", icon: "🔒" },
};

export default function BrandPage({ page, onBack }: Props) {
  const { siteContent } = useStore();

  const contentMap: Record<BrandPage, string> = {
    about: siteContent.aboutBody,
    returns: siteContent.returnPolicy,
    shipping: siteContent.shippingPolicy,
    privacy: siteContent.privacyPolicy,
  };

  const config = PAGE_CONFIG[page];
  const content = contentMap[page];

  return (
    <div className="min-h-screen" style={{ background: "#080808" }}>
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-30" style={{ background: "rgba(8,8,8,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2 mx-auto">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>S</div>
            <span className="font-display text-lg text-white">STRYDE</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden py-20 sm:py-28" style={{ background: "linear-gradient(135deg, #0d0814 0%, #080808 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(109,40,217,0.15) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center anim-fade-up">
          <span className="text-3xl mb-4 block">{config.icon}</span>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">{config.title}</h1>
          {page === "about" && (
            <p className="font-display italic text-xl text-violet-300 mt-2">{siteContent.aboutTitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 anim-fade-up" style={{ animationDelay: "200ms" }}>
        {page === "about" ? (
          <AboutContent />
        ) : (
          <div className="space-y-1">
            {renderMarkdown(content)}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="border-t border-white/5 pt-10 grid sm:grid-cols-3 gap-4">
          {(["about", "returns", "shipping", "privacy"] as BrandPage[]).filter((p) => p !== page).slice(0, 3).map((p) => (
            <button
              key={p}
              onClick={() => { window.scrollTo({ top: 0 }); onBack(); }}
              className="text-left p-5 rounded-2xl border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">{PAGE_CONFIG[p].title}</p>
              <p className="text-xs text-white/25 mt-1">Read more →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutContent() {
  const { siteContent } = useStore();
  const stats = [
    { value: "48+", label: "Countries Served" },
    { value: "2019", label: "Founded" },
    { value: "100K+", label: "Happy Customers" },
    { value: "30-Day", label: "Return Guarantee" },
  ];

  const values = [
    { icon: "◈", title: "Radical Quality", body: "Every product passes a 47-point inspection before it earns the STRYDE mark. We refuse to compromise." },
    { icon: "◉", title: "Ethical Sourcing", body: "All suppliers are audited annually for fair labor, environmental standards, and material provenance." },
    { icon: "◎", title: "Zero Waste Packaging", body: "Our packaging is 100% recyclable. We ship carbon-neutral on all domestic orders." },
    { icon: "◆", title: "Lifetime Support", body: "Buy once, own forever. Every STRYDE product comes with dedicated after-sales care and repair services." },
  ];

  return (
    <div className="space-y-16">
      {/* Body copy */}
      <div className="space-y-1">{renderMarkdown(siteContent.aboutBody)}</div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center p-5 rounded-2xl border border-white/5 anim-fade-up"
            style={{ background: "rgba(139,92,246,0.06)", animationDelay: `${i * 80}ms` }}
          >
            <p className="font-mono text-3xl font-semibold text-violet-300 mb-1">{s.value}</p>
            <p className="text-xs text-white/35 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div>
        <h2 className="font-display text-3xl text-white mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="p-6 rounded-2xl border border-white/5 anim-fade-up card-hover"
              style={{ background: "rgba(255,255,255,0.02)", animationDelay: `${i * 80}ms` }}
            >
              <span className="text-violet-400 text-xl mb-3 block">{v.icon}</span>
              <h3 className="font-display text-lg text-white mb-2">{v.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic team image */}
      <div className="rounded-3xl overflow-hidden relative aspect-video">
        <img
          src="https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=2560&q=100&fit=crop"
          alt="STRYDE team"
          className="w-full h-full object-cover"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />
        <div className="absolute bottom-6 left-8">
          <p className="font-display text-2xl text-white">The STRYDE Standard</p>
          <p className="text-white/40 text-sm mt-1">Quality without compromise. Style without apology.</p>
        </div>
        {/* Film grain */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ mixBlendMode: "overlay" }}>
          <filter id="grain2"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#grain2)" />
        </svg>
      </div>
    </div>
  );
}
