import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";

const FILM_BG = "https://images.unsplash.com/photo-1619213117400-cd7f8e40381f?w=2560&q=100&fit=crop";
const NEON_BG  = "https://images.unsplash.com/photo-1614471131724-d57b15e45173?w=2560&q=100&fit=crop";

interface Props {
  onViewProduct: () => void;
  onShopNow: () => void;
}

function useTypewriter(text: string, speed = 38, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return displayed;
}

/* Floating particle */
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />;
}

export default function AnimatedHero({ onViewProduct, onShopNow }: Props) {
  const { siteContent, products } = useStore();
  const featured = products.find((p) => p.active && p.featured);
  const [scene, setScene] = useState<0 | 1>(0);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<number>(0);
  const [progressPct, setProgressPct] = useState(0);
  const headline = useTypewriter(siteContent.heroHeadline.replace(/\n/g, " "), 55, 600);

  useEffect(() => { setMounted(true); }, []);

  /* Auto-advance scene every 7 seconds */
  useEffect(() => {
    setProgressPct(0);
    progressRef.current = 0;
    const step = 100 / (7000 / 50);
    const iv = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + step);
      setProgressPct(progressRef.current);
      if (progressRef.current >= 100) {
        setScene((s) => (s === 0 ? 1 : 0));
      }
    }, 50);
    return () => clearInterval(iv);
  }, [scene]);

  const particles = [
    { width: 4, height: 4, left: "12%", top: "20%", background: "rgba(139,92,246,0.8)", animation: "float 4s ease-in-out infinite", animationDelay: "0s", boxShadow: "0 0 8px rgba(139,92,246,0.9)" },
    { width: 6, height: 6, left: "82%", top: "35%", background: "rgba(167,139,250,0.6)", animation: "float 6s ease-in-out infinite", animationDelay: "-2s", boxShadow: "0 0 12px rgba(167,139,250,0.8)" },
    { width: 3, height: 3, left: "65%", top: "75%", background: "rgba(109,40,217,0.9)", animation: "float 5s ease-in-out infinite", animationDelay: "-1s", boxShadow: "0 0 6px rgba(109,40,217,1)" },
    { width: 8, height: 8, left: "28%", top: "85%", background: "rgba(124,58,237,0.4)", animation: "float 7s ease-in-out infinite", animationDelay: "-3s", boxShadow: "0 0 16px rgba(124,58,237,0.6)" },
    { width: 5, height: 5, left: "90%", top: "65%", background: "rgba(196,181,253,0.5)", animation: "float 5.5s ease-in-out infinite", animationDelay: "-0.5s", boxShadow: "0 0 10px rgba(196,181,253,0.7)" },
    { width: 3, height: 3, left: "45%", top: "15%", background: "rgba(167,139,250,0.7)", animation: "float 4.5s ease-in-out infinite", animationDelay: "-2.5s", boxShadow: "0 0 6px rgba(167,139,250,0.9)" },
  ];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh" }}>
      {/* ── Background imagery ── */}
      <div className="absolute inset-0">
        {[FILM_BG, NEON_BG].map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: scene === i ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" style={{ imageRendering: "auto" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(8,4,20,0.75) 50%, rgba(0,0,0,0.6) 100%)" }} />
          </div>
        ))}
      </div>

      {/* ── Film grain overlay ── */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Cinematic letterbox bars ── */}
      <div
        className="absolute top-0 left-0 right-0 transition-all duration-700"
        style={{ height: mounted ? "5vh" : "0", background: "#000", zIndex: 2 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-700"
        style={{ height: mounted ? "5vh" : "0", background: "#000", zIndex: 2 }}
      />

      {/* ── Ambient glow orbs ── */}
      <div className="absolute pointer-events-none" style={{ top: "20%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "15%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* ── Floating particles ── */}
      {particles.map((p, i) => <Particle key={i} style={{ ...p, position: "absolute" }} />)}

      {/* ── Animated geometric lines ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
        <line x1="0" y1="33%" x2="100%" y2="33%" stroke="rgba(139,92,246,0.6)" strokeWidth="0.5" strokeDasharray="6 14" style={{ animation: "shimmer 4s linear infinite" }} />
        <line x1="0" y1="67%" x2="100%" y2="67%" stroke="rgba(139,92,246,0.4)" strokeWidth="0.5" strokeDasharray="4 20" style={{ animation: "shimmer 6s linear infinite reverse" }} />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" strokeDasharray="4 16" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(139,92,246,0.25)" strokeWidth="0.5" strokeDasharray="6 20" />
      </svg>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center" style={{ minHeight: "100svh", paddingTop: "8vh", paddingBottom: "10vh" }}>
        {/* Left: Text */}
        <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Now playing indicator */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex gap-1 items-end">
              {[1, 2, 3, 4].map((b) => (
                <div key={b} className="w-0.5 rounded-full"
                  style={{ height: `${8 + b * 4}px`, background: "#a78bfa", animation: `float ${1 + b * 0.3}s ease-in-out infinite`, animationDelay: `${b * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-semibold text-violet-400 uppercase tracking-widest">Now Playing · Scene {scene + 1}/2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" style={{ animation: "glowPulse 1.5s ease-in-out infinite" }} />
          </div>

          {/* Headline */}
          <h1 className="font-display text-white leading-none mb-6" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}>
            {headline}
            <span className="inline-block w-0.5 h-[0.85em] bg-violet-400 ml-1 align-middle" style={{ animation: "glowPulse 1s ease-in-out infinite" }} />
          </h1>

          <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-8 max-w-lg anim-fade-up" style={{ animationDelay: "1.2s" }}>
            {siteContent.heroSubheadline}
          </p>

          {/* Quality badge */}
          <div className="flex items-center gap-2 mb-8 anim-fade-up" style={{ animationDelay: "1.4s" }}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-xs font-mono font-bold text-violet-300">8K</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-xs text-white/40 font-mono">Ultra HD</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-xs text-white/40 font-mono">Premium Quality</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 anim-fade-up" style={{ animationDelay: "1.6s" }}>
            <button
              onClick={onShopNow}
              className="px-7 py-4 rounded-2xl text-white font-semibold text-sm btn-violet"
            >
              {siteContent.heroCTA}
            </button>
            {featured && (
              <button
                onClick={onViewProduct}
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl text-white/70 hover:text-white text-sm font-semibold transition-all border border-white/10 hover:border-white/25 hover:bg-white/5"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 ml-0.5" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Feature
              </button>
            )}
          </div>
        </div>

        {/* Right: Featured product cinema card */}
        {featured && (
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`} style={{ transitionDelay: "400ms" }}>
            <div className="relative w-72 sm:w-80" onClick={onViewProduct}>
              {/* Product cinema frame */}
              <div
                className="relative cursor-pointer rounded-3xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
              >
                {/* Rotating corner accent */}
                <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none" style={{ borderTop: "2px solid rgba(139,92,246,0.6)", borderLeft: "2px solid rgba(139,92,246,0.6)", borderTopLeftRadius: "1.5rem" }} />
                <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" style={{ borderBottom: "2px solid rgba(139,92,246,0.6)", borderRight: "2px solid rgba(139,92,246,0.6)", borderBottomRightRadius: "1.5rem" }} />

                <div className="relative overflow-hidden aspect-square">
                  <img src={featured.image} alt={featured.name} className="w-full h-full object-cover anim-float" style={{ imageRendering: "auto" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 text-xs font-mono font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd" }}>
                    FEATURED
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-1">{featured.category}</p>
                  <h3 className="font-display text-xl text-white mb-2">{featured.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-semibold text-white">${featured.price}</span>
                    <span className="text-xs text-white/30 font-mono">{featured.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              {/* Floating accent shape */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none anim-float" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", filter: "blur(16px)", animationDelay: "-3s" }} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none anim-float" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)", filter: "blur(20px)", animationDelay: "-1s" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom HUD ── */}
      <div className="absolute bottom-[5vh] left-0 right-0 z-10 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Scene progress bar */}
          <div className="flex-1 h-px bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-none"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }}
            />
          </div>
          {/* Scene dots */}
          <div className="flex gap-1.5 shrink-0">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setScene(i as 0 | 1)}
                className="rounded-full transition-all duration-300"
                style={{ width: scene === i ? 20 : 6, height: 6, background: scene === i ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-white/25 shrink-0">8K · HDR</span>
        </div>
      </div>
    </section>
  );
}
