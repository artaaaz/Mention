import { useLayoutEffect, useRef } from "react";
import { EXPERTISE } from "../data/about.js";
import { gsap, reduceMotion, ScrollTrigger } from "../lib/motion.js";
import { Eyebrow, Words } from "./ui.jsx";

/* ───────────── Punggung kartu: ornamen garis + logo di tengah ───────────── */

const SLOPE = 122 / 104; // arah sudut bingkai dalam → tengah kartu

/** Seperempat ornamen (kiri-atas); tiga sisanya hasil cermin. */
function Quarter() {
  const lines = [];
  for (let k = 1; k <= 6; k++) {
    const x = 46 + k * 15;
    lines.push(`M${x} 88 L150 ${(88 + (150 - x) * SLOPE).toFixed(1)}`);
    const y = 88 + k * 17.5;
    lines.push(`M46 ${y} L${(46 + (210 - y) / SLOPE).toFixed(1)} 210`);
  }
  return (
    <>
      {/* kipas di sudut */}
      {[16, 28, 40].map((r) => (
        <path key={r} d={`M${24 + r} 24 A${r} ${r} 0 0 1 24 ${24 + r}`} />
      ))}
      {/* zig-zag di pita atas */}
      <path d="M70 24 L86 70 L102 24 L118 70 L134 24 L150 70" />
      <path d="M24 70 H150" />
      {/* bingkai dalam + arsiran menuju tengah */}
      <path d="M150 88 H46 V210" />
      <path d={lines.join(" ")} />
      {/* manik-manik di sisi */}
      {[104, 124, 144, 164, 184, 204].map((y) => (
        <circle key={y} cx="35" cy={y} r="2.4" />
      ))}
      <path d="M35 82 V210" strokeWidth="0.8" />
    </>
  );
}

function CardBack() {
  return (
    <>
      <svg viewBox="0 0 300 420" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="10" y="10" width="280" height="400" rx="12" strokeWidth="2.4" />
        <rect x="24" y="24" width="252" height="372" rx="3" />
        <Quarter />
        <g transform="translate(300 0) scale(-1 1)">
          <Quarter />
        </g>
        <g transform="translate(0 420) scale(1 -1)">
          <Quarter />
        </g>
        <g transform="translate(300 420) scale(-1 -1)">
          <Quarter />
        </g>

        {/* hiasan tengah atas & bawah */}
        {[1, -1].map((flip) => (
          <g key={flip} transform={flip === 1 ? undefined : "translate(0 420) scale(1 -1)"}>
            <circle cx="150" cy="40" r="9" fill="var(--card-back)" />
            <circle cx="150" cy="58" r="6" fill="var(--card-back)" />
            <path d="M139 88 L150 101 L161 88 Z" fill="currentColor" />
            <path d="M150 101 A20 20 0 0 1 130 121 M150 101 A20 20 0 0 0 170 121" />
          </g>
        ))}

        {/* medali */}
        <path d="M150 116 L238 210 L150 304 L62 210 Z" fill="var(--card-back)" />
        <path d="M150 130 L225 210 L150 290 L75 210 Z" />
        <path d="M62 180 L48 210 L62 240 Z M238 180 L252 210 L238 240 Z" fill="currentColor" />
        <circle cx="150" cy="210" r="50" fill="var(--card-back)" strokeWidth="2.2" />
        <circle cx="150" cy="210" r="42" />
        {[0, 90, 180, 270].map((angle) => (
          <circle key={angle} cx="150" cy="156" r="2.6" fill="currentColor" transform={`rotate(${angle} 150 210)`} />
        ))}
      </svg>
      <span className="logo-mark card__mark" />
    </>
  );
}

/* ───────────── Section ───────────── */

/**
 * Bidang keahlian sebagai kartu remi.
 *
 * Desktop: kartu datang sebagai satu tumpukan, menyebar jadi kipas, lalu section "menempel"
 * dan kartu terbalik satu per satu mengikuti scroll. Layar kecil: tiap kartu terbalik saat
 * masuk layar. Selama section ini tampil, latar halaman berganti warna (body.is-deck).
 */
export default function Deck() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion) return undefined; // tanpa animasi: kartu langsung terbuka, latar tetap

    const el = root.current;
    el.classList.add("deck--live");
    const cards = [...el.querySelectorAll(".card")];
    const inners = cards.map((card) => card.querySelector(".card__inner"));
    const list = el.querySelector(".deck__cards");
    const track = el.querySelector(".deck__track");
    const media = gsap.matchMedia();

    /* latar halaman berganti warna selama section ini di layar */
    const theme = ScrollTrigger.create({
      trigger: el,
      start: "top 35%",
      end: "bottom top", // sampai section berikutnya (CTA, juga terang) memenuhi layar
      onToggle: (self) => document.body.classList.toggle("is-deck", self.isActive),
    });

    media.add("(min-width: 901px)", () => {
      const last = Math.max(1, cards.length - 1);
      const spread = (i) => i / last - 0.5; // -0.5 … 0.5 dari kiri ke kanan
      // tumpukan: semua kartu di tengah; kipas: sedikit merapat & miring
      const stackX = (i) => list.offsetWidth / 2 - (cards[i].offsetLeft - list.offsetLeft + cards[i].offsetWidth / 2);
      const fanX = (i) => -spread(i) * 0.3 * cards[i].offsetWidth;
      const fanY = (i) => Math.abs(spread(i)) * 0.16 * cards[i].offsetHeight;
      const fanRotation = (i) => spread(i) * 26 + (i % 2 ? 2 : -2);

      gsap.set(inners, { rotationY: 180 });

      // Satu timeline untuk seluruh perjalanan section. Satuan waktu = 1 tinggi layar:
      // 0 → 1 section naik ke posisi menempel, sisanya (tinggi .deck__track) saat menempel.
      const total = track.offsetHeight / window.innerHeight;
      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: track,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        // tumpukan → kipas
        timeline.fromTo(
          card,
          { x: () => stackX(i), y: -i * 5, rotation: (i - last / 2) * 2.5 },
          { x: () => fanX(i), y: () => fanY(i), rotation: fanRotation(i), duration: 0.6 },
          0.36 + i * 0.02,
        );
        // dibalik satu per satu dari kiri
        const at = 1.14 + i * 0.42;
        timeline
          .to(inners[i], { rotationY: 0, duration: 0.5 }, at)
          .to(card, { rotation: 0, x: 0, y: [0, -10, -3, 7][i % 4], duration: 0.5 }, at)
          .to(card, { scale: 1.08, duration: 0.25, ease: "power2.out" }, at)
          .to(card, { scale: 1, duration: 0.25, ease: "power2.in" }, at + 0.25);
      });
      timeline.set({}, {}, Math.max(total, timeline.duration())); // sisanya jeda sebelum section lepas
    });

    media.add("(max-width: 900px)", () => {
      cards.forEach((card, i) => {
        gsap.set(card, { rotation: i % 2 ? 4 : -4 });
        gsap.set(inners[i], { rotationY: 180 });
        gsap
          .timeline({
            defaults: { ease: "power1.inOut" },
            scrollTrigger: { trigger: card, start: `top ${88 - (i % 2) * 8}%`, end: "top 32%", scrub: 0.5 },
          })
          .to(inners[i], { rotationY: 0 })
          .to(card, { rotation: 0 }, 0);
      });
    });

    return () => {
      media.revert();
      theme.kill();
      document.body.classList.remove("is-deck");
      el.classList.remove("deck--live");
    };
  }, []);

  return (
    <section className="deck" ref={root}>
      <div className="section-head section-head--split">
        <div>
          <Eyebrow data-reveal>Bidang keahlian</Eyebrow>
          <h2 className="section-title" data-split>
            <Words>Empat disiplin, satu meja.</Words>
          </h2>
        </div>
        <p className="section-sub" data-reveal>
          Strategi, desain, konten, dan web dikerjakan tim yang sama — bukan dilempar dari vendor ke vendor.
        </p>
      </div>

      <div className="deck__track">
        <div className="deck__sticky">
          <ul className="deck__cards">
            {EXPERTISE.map((area) => (
              <li className="card" key={area.title}>
                <div className="card__inner">
                  <div className="card__face card__back" aria-hidden="true">
                    <CardBack />
                  </div>
                  <div className="card__face card__front">
                    <div className="card__row">
                      <h3>{area.title}</h3>
                      <span className="card__glyph" aria-hidden="true">
                        {area.letter}
                      </span>
                    </div>
                    <ul className="card__list">
                      {area.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {/* seperti kartu remi: judul terbalik di sisi bawah */}
                    <div className="card__row card__row--flip" aria-hidden="true">
                      <span className="card__title">{area.title}</span>
                      <span className="card__glyph">{area.letter}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
