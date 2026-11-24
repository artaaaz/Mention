import { useEffect, useRef } from "react";
import Deck from "../components/Deck.jsx";
import ScrollLine from "../components/ScrollLine.jsx";
import { Cta } from "../components/sections.jsx";
import { Eyebrow, NextPage, Words } from "../components/ui.jsx";
import { CLIENTS } from "../data/about.js";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";
import { gsap, reduceMotion } from "../lib/motion.js";

const LOOP = Array.from({ length: 4 });

const BRAND_SPEED = 46; // px per detik saat halaman diam
const BRAND_BOOST = 0.32; // seberapa kuat kecepatan scroll ikut mendorong

/** Satu baris logo klien yang berjalan terus; scroll mempercepat / membalik arahnya. */
function BrandRow() {
  const track = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = track.current;
    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      if (dt <= 0) return;
      const y = window.scrollY;
      velocity += ((y - lastY) / dt - velocity) * 0.12;
      lastY = y;
      const half = el.scrollWidth / 2; // isi diulang genap → geser setengahnya = mulus
      if (!half) return;
      x -= (BRAND_SPEED + velocity * BRAND_BOOST) * dt;
      x = ((x % half) - half) % half; // selalu di antara -half … 0
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div className="brands__row" data-reveal aria-hidden="true">
      <div className="brands__track" ref={track}>
        {LOOP.map((_, g) => (
          <span className="marquee__group" key={g}>
            {CLIENTS.map((client) => (
              <span
                className="brand"
                key={client.name}
                style={{
                  "--logo": `url("${client.logo}")`,
                  "--ratio": client.ratio,
                  // logo lebar dibuat sedikit lebih pendek supaya semuanya terasa sama besar
                  "--scale": client.ratio ** -0.35,
                }}
              />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  useMeta(
    "Tentang",
    "Kenalan dengan Mention: siapa kami, brand yang kami tangani, dan bidang keahlian kami.",
  );
  const scope = usePageMotion();

  return (
    <div ref={scope}>
      {/* ───────────── Hero ───────────── */}
      <section className="page-hero about-hero">
        <Eyebrow data-intro>Tentang</Eyebrow>
        <h1 className="about-hero__title" data-intro-title>
          <span className="about-hero__line" data-drift="-12">
            <Words>Kami agensi kreatif</Words>
          </span>
          <span className="about-hero__line about-hero__line--end hl" data-drift="12">
            <Words>yang bikin brand layak di-mention.</Words>
          </span>
        </h1>
        <div className="about-hero__foot" data-intro>
          <span className="about-hero__scroll">
            <span className="plus" aria-hidden="true" />
            Scroll untuk jelajah
          </span>
          <p className="page-lede">
            Mention lahir dari satu keyakinan sederhana: karya kreatif baru berhasil kalau orang mau menyebutnya ke
            orang lain.
          </p>
        </div>
      </section>

      {/* ───────────── Cerita ───────────── */}
      <section className="about about--page">
        <Eyebrow data-reveal>Cerita kami</Eyebrow>
        <h2 className="about__lead" data-scrub>
          <Words>
            Kami tim kecil berisi strategist, desainer, penulis, dan developer yang duduk di meja yang sama —
            supaya ide nggak hilang di tengah jalan antara rapat dan eksekusi.
          </Words>
        </h2>
        <div className="about__cols">
          <p data-reveal>
            Banyak proyek kreatif gagal bukan karena idenya jelek, tapi karena terlalu banyak tangan yang nggak
            saling ngobrol. Di Mention, orang yang merancang adalah orang yang juga ikut mengeksekusi.
          </p>
          <p data-reveal>
            Kami bekerja dengan brand baru yang butuh fondasi, dan brand lama yang butuh napas segar. Skalanya
            boleh beda, standarnya tetap sama.
          </p>
        </div>
      </section>

      {/* ───────────── Klien ───────────── */}
      <section className="brands">
        <div className="section-head section-head--split">
          <div>
            <Eyebrow data-reveal>Klien</Eyebrow>
            <h2 className="section-title" data-split>
              <Words>Brand yang kami tangani.</Words>
            </h2>
          </div>
          <p className="section-sub" data-reveal>
            Mereka yang sudah jalan bareng Mention.
          </p>
        </div>
        <BrandRow />
        <ul className="sr-only">
          {CLIENTS.map((client) => (
            <li key={client.name}>{client.name}</li>
          ))}
        </ul>
      </section>

      {/* Dari kartu sampai CTA: satu garis tergambar mengikuti scroll di belakang isinya */}
      <div className="line-flow">
        <ScrollLine />

        {/* ───────────── Keahlian (kartu yang terbalik saat di-scroll) ───────────── */}
        <Deck />

        <Cta />
      </div>
      <NextPage to="/projects" title="Karya" />
    </div>
  );
}
