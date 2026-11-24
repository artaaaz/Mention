// Section yang dipakai di lebih dari satu halaman.

import { useEffect, useRef } from "react";
import { scrollToBottom } from "../lib/scroll.js";
import GlowOrbs from "./GlowOrbs.jsx";
import { ArrowDown, Words } from "./ui.jsx";

const PLUS = [1, 2, 3, 4];

/**
 * Penutup halaman: layar penuh warna brand dengan bola-bola cahaya di latarnya.
 *
 * Panelnya "ditahan": menempel di layar selama pembungkusnya (.cta-hold) di-scroll. Selama
 * ditahan, bola cahayanya membesar; setelah itu footer naik menutupi panel (lihat .cta-hold & .footer di style.css).
 */
export function Cta() {
  const hold = useRef(null);
  const progress = useRef(0); // 0…1 selama panel ditahan; dibaca GlowOrbs tiap frame

  useEffect(() => {
    const footer = document.querySelector(".footer");
    let cover = 0;

    // Footer menimpa bagian akhir pembungkus setinggi dirinya (maks. 1 layar). Kalau lebih dari
    // itu, pembungkus menjulur melewati dasar footer dan panel terlihat lagi di bawahnya.
    // (ref bisa sudah kosong: saat pindah halaman, scroll/resize masih sempat terpicu sebelum efek dibersihkan)
    const measure = () => {
      if (!hold.current) return;
      cover = Math.min(footer?.offsetHeight ?? 0, window.innerHeight);
      hold.current.style.setProperty("--cover", `${cover}px`);
      update();
    };
    const update = () => {
      if (!hold.current) return;
      const rect = hold.current.getBoundingClientRect();
      // jarak tahan = tinggi pembungkus − 1 layar (panel) − bagian yang ditimpa footer
      const distance = Math.max(1, rect.height - window.innerHeight - cover);
      progress.current = Math.min(1, Math.max(0, -rect.top / distance));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (footer) observer.observe(footer);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    // data-line-end: tujuan akhir <ScrollLine> di halaman yang memakainya
    <div className="cta-hold" ref={hold} data-line-end>
      <section className="cta" data-header="ink">
        <GlowOrbs className="cta__orbs" rise={progress} />
        {PLUS.map((n) => (
          <span className={`plus cta__plus cta__plus--${n}`} aria-hidden="true" key={n} />
        ))}
        <p className="cta__kicker" data-reveal>
          Got a big idea?
        </p>
        <h2 className="cta__title" data-split>
          <Words>Let&apos;s work together!</Words>
        </h2>
        <button className="cta__scroll" type="button" onClick={scrollToBottom}>
          <ArrowDown />
          Continue to scroll
          <ArrowDown />
        </button>
      </section>
    </div>
  );
}
