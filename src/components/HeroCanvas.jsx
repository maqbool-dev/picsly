import { useEffect, useRef } from "react";

// Ambient hero backdrop: a drifting particle constellation that nudges away
// from the cursor, a soft amber glow that parallaxes on scroll/pointer, and a
// masked grid. Entirely decorative.
//
// Skipped wholesale under prefers-reduced-motion — the section then renders as
// a calm static gradient with no canvas and no listeners.
export default function HeroCanvas({ density = 86 }) {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const N = Math.max(20, Math.round(density));
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let mouseX = 0;
    const pts = [];
    const m = { x: -9999, y: -9999, on: false };

    const seed = () => {
      pts.length = 0;
      for (let i = 0; i < N; i++) {
        const sq = Math.random() < 0.22;
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          sq,
          s: sq ? Math.random() * 4 + 3 : Math.random() * 1.5 + 0.9,
          a: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.006,
        });
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (pts.length !== N) seed();
    };
    resize();

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    }

    const placeGlow = () => {
      const g = glowRef.current;
      if (!g) return;
      const y = Math.min(window.scrollY, 1000);
      g.style.transform = `translate3d(calc(-50% + ${mouseX}px),${y * 0.22}px,0)`;
      g.style.opacity = String(Math.max(0.15, 1 - y / 1000));
    };

    const onScroll = () => placeGlow();
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      m.x = e.clientX - r.left;
      m.y = e.clientY - r.top;
      m.on = true;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 44;
      placeGlow();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    let io;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
      });
      io.observe(canvas);
    }

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!visible || !w) return;

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.spin;
        if (p.x < -24) p.x = w + 24;
        else if (p.x > w + 24) p.x = -24;
        if (p.y < -24) p.y = h + 24;
        else if (p.y > h + 24) p.y = -24;
        if (m.on) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160 && d > 0.5) {
            const f = ((160 - d) / 160) * 1.7;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      }

      // Constellation links
      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const t = 1 - Math.sqrt(d2) / 120;
            ctx.strokeStyle = `rgba(253,176,34,${(t * 0.17).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes — squares read as "pixels", circles as embers
      for (const p of pts) {
        const near = m.on
          ? Math.max(
              0,
              1 -
                Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y)) /
                  240
            )
          : 0;
        if (p.sq) {
          ctx.fillStyle = `rgba(254,200,75,${(0.26 + near * 0.6).toFixed(3)})`;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.a);
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(253,176,34,${(0.4 + near * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s, 0, 6.2832);
          ctx.fill();
        }
      }
    };
    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [density]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 h-[760px] w-[1100px] -translate-x-1/2"
        style={{
          top: -320,
          background:
            "radial-gradient(closest-side,rgba(253,176,34,.20),rgba(247,144,9,.07) 45%,transparent 72%)",
          filter: "blur(12px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%,#000,transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%,#000,transparent)",
        }}
      />
    </>
  );
}
