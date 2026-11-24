// Section yang dipakai di lebih dari satu halaman.

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { scrollToBottom } from "../lib/scroll.js";
import { ArrowDown, Words } from "./ui.jsx";

// Kolam bola dari React Bits (reactbits.dev → Ballpit), dimuat terpisah.
const Ballpit = lazy(() => import("./Ballpit/Ballpit.jsx"));

const PLUS = [1, 2, 3, 4];

// Bola: hitam, putih, dan abu di atas panel kuning. Jumlahnya bertambah selama panel ditahan.
const BALL_COLORS = ["#070708", "#f5f4ef", "#19191c", "#ffffff", "#c9c8c0", "#f5f4ef"];
const BALLS_START = 36;
const BALLS_MORE = 84; // tambahan sampai panel selesai ditahan
const BALLS_STEP = 6; // ditambah per kelompok supaya tidak merender ulang tiap piksel scroll
const SMALL_SCREEN = 0.5; // di layar sempit jumlahnya dikali ini

/**
 * Penutup halaman: layar penuh warna brand dengan kolam bola 3D di atasnya.
 *
 * Panelnya "ditahan": menempel di layar selama pembungkusnya (.cta-hold) di-scroll. Selama
 * ditahan, bola baru terus berjatuhan; setelah itu footer naik menutupi panel
 * (lihat .cta-hold & .footer di style.css).
 */
export function Cta() {
  const hold = useRef(null);
  const [balls, setBalls] = useState(BALLS_START);
  const [covered, setCovered] = useState(false); // panel tertutup penuh oleh footer → bola berhenti

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
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const scale = window.innerWidth < 700 ? SMALL_SCREEN : 1;
      const extra = Math.round((progress * BALLS_MORE) / BALLS_STEP) * BALLS_STEP;
      setBalls(Math.round((BALLS_START + extra) * scale));
      setCovered(Boolean(footer) && footer.getBoundingClientRect().top <= 0);
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
        {PLUS.map((n) => (
          <span className={`plus cta__plus cta__plus--${n}`} aria-hidden="true" key={n} />
        ))}
        <p className="cta__kicker" data-reveal>
          Got a big idea?
        </p>
        <h2 className="cta__title" data-split>
          <Words>Let&apos;s work together!</Words>
        </h2>

        {/* di atas teks tapi tidak menangkap klik: Ballpit membaca kursor dari window */}
        <div className="cta__balls" hidden={covered} aria-hidden="true">
          <Suspense fallback={null}>
            <Ballpit
              count={balls}
              colors={BALL_COLORS}
              material="satin"
              minSize={0.55}
              maxSize={1.25}
              gravity={0.55}
              dpr={Math.min(window.devicePixelRatio || 1, 1.5)}
            />
          </Suspense>
        </div>

        <button className="cta__scroll" type="button" onClick={scrollToBottom}>
          <ArrowDown />
          Continue to scroll
          <ArrowDown />
        </button>
      </section>
    </div>
  );
}
