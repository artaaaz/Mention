import { useEffect, useRef } from "react";
import { STATS } from "../data/site.js";
import { gsap, reduceMotion } from "../lib/motion.js";

const pad = (value) => String(Math.round(value)).padStart(2, "0");

/**
 * Deretan angka besar (Beranda). Tiap angka menghitung naik dari 0 sekali, saat pertama kali
 * terlihat. Isinya diatur di src/data/site.js (STATS).
 */
export default function Stats() {
  const root = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined; // angka akhirnya sudah dirender, tidak perlu dihitung naik
    const ctx = gsap.context(() => {
      for (const el of root.current.querySelectorAll("[data-count]")) {
        const state = { value: 0 };
        el.textContent = pad(0);
        gsap.to(state, {
          value: Number(el.dataset.count),
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = pad(state.value);
          },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="stats" ref={root} aria-label="Mention dalam angka">
      <ul className="stats__list">
        {STATS.map((stat) => (
          <li className="stat" key={stat.label} data-reveal>
            <p className="stat__value">
              <span data-count={stat.value}>{pad(stat.value)}</span>
              {stat.suffix}
            </p>
            <p className="stat__label">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
