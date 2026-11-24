import { useEffect, useRef } from "react";
import { reduceMotion } from "../lib/motion.js";

// Bola-bola cahaya lembut di latar panel: satu bola besar yang mengejar kursor (tanpa kursor
// ia berkeliling sendiri), satu bola sedang yang mengekor di belakangnya, dan satu bola kecil
// yang mengorbit di sisi lain. Tampilannya (.orb) ada di style.css.

const ORBS = ["a", "b", "c"];

/** `rise`: ref berisi 0…1 — makin besar, bola utama makin besar (dipakai saat panel ditahan). */
export default function GlowOrbs({ className = "", rise }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const [main, tail, small] = root.children;
    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let lift = 0;
    const pointer = { x: 0, y: 0, inside: false };
    const a = { x: 0, y: 0 };
    const b = { x: 0, y: 0 };

    const place = (el, x, y, scale = 1) => {
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    };

    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      const t = now / 1000;

      const targetX = pointer.inside ? pointer.x : width * (0.72 + 0.1 * Math.sin(t * 0.55));
      const targetY = pointer.inside ? pointer.y : height * (0.5 + 0.16 * Math.cos(t * 0.43));
      const k = 1 - Math.exp(-3.2 * dt);
      a.x += (targetX - a.x) * k;
      a.y += (targetY - a.y) * k;
      const k2 = 1 - Math.exp(-1.4 * dt);
      b.x += (a.x - width * 0.16 - b.x) * k2;
      b.y += (a.y + height * 0.2 - b.y) * k2;
      lift += ((rise?.current ?? 0) - lift) * (1 - Math.exp(-6 * dt));

      place(main, a.x, a.y, 1 + 0.4 * lift + 0.03 * Math.sin(t * 1.3));
      place(tail, b.x, b.y, 1 + 0.2 * lift);
      place(
        small,
        width * (0.16 + 0.07 * Math.cos(t * 0.7)),
        height * (0.7 + 0.12 * Math.sin(t * 0.9)) - height * 0.18 * lift,
      );
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      width = Math.max(1, root.clientWidth);
      height = Math.max(1, root.clientHeight);
      a.x = width * 0.72;
      a.y = height * 0.5;
      b.x = width * 0.56;
      b.y = height * 0.7;
      wake();
    };
    const onPointerMove = (event) => {
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside =
        event.pointerType === "mouse" &&
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersection.observe(root);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", wake);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [rise]);

  return (
    <div className={`orbs ${className}`.trim()} ref={ref} aria-hidden="true">
      {ORBS.map((name) => (
        <span className={`orb orb--${name}`} key={name} />
      ))}
    </div>
  );
}
