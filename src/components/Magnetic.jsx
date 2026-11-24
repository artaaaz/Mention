import { useEffect } from "react";
import { canHover, gsap, reduceMotion } from "../lib/motion.js";

// Tombol yang "magnetik". Posisi gesernya lewat variabel CSS --mx / --my (lihat style.css),
// jadi tidak bentrok dengan transform yang dipakai animasi lain.
const TARGETS = ".pill, .btn, .cta__scroll, .footer__top";
const PULL = 0.32; // seberapa jauh tombol mengikuti kursor (bagian dari jarak kursor ke tengah tombol)
const MAX = 16; // geser maksimum, px

const clamp = (value) => Math.max(-MAX, Math.min(MAX, value));
const offset = (el, name) => parseFloat(el.style.getPropertyValue(name)) || 0;

/** Tombol sedikit tertarik ke arah kursor saat kursor di atasnya, lalu memantul balik saat ditinggal. */
export default function Magnetic() {
  useEffect(() => {
    if (!canHover || reduceMotion) return undefined;
    let current = null;

    const release = () => {
      if (!current) return;
      gsap.to(current, { "--mx": "0px", "--my": "0px", duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true });
      current = null;
    };

    const onMove = (event) => {
      const el = event.target.closest?.(TARGETS) ?? null;
      if (el !== current) {
        release();
        current = el;
      }
      if (!el) return;
      // tengah tombol di posisi diamnya = posisi sekarang dikurangi geseran yang sedang berlaku
      const rect = el.getBoundingClientRect();
      const restX = rect.left + rect.width / 2 - offset(el, "--mx");
      const restY = rect.top + rect.height / 2 - offset(el, "--my");
      gsap.to(el, {
        "--mx": `${clamp((event.clientX - restX) * PULL)}px`,
        "--my": `${clamp((event.clientY - restY) * PULL)}px`,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      release();
    };
  }, []);

  return null;
}
