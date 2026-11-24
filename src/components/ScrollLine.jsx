import { useLayoutEffect, useRef } from "react";
import { gsap, reduceMotion, ScrollTrigger } from "../lib/motion.js";

// posisi mendatar tiap belokan (0 = kiri, 1 = kanan); polanya diulang sampai ujung
const TURNS = [0.92, 0.66, 0.1, 0.9, 0.16, 0.82, 0.08, 0.74];
const TURN_EVERY = 0.58; // jarak antar belokan, dalam tinggi layar

/** Susun ulang path berliku sesuai ukuran pembungkus saat ini. Mengembalikan panjang path. */
function layout(wrapper, svg, path) {
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  // mulai sedikit di atas pembungkus; berakhir di tengah, tepat di atas elemen [data-line-end] (kalau ada)
  const target = wrapper.querySelector("[data-line-end]");
  const top = -60;
  const bottom = target ? target.offsetTop - 56 : height - 36;
  const turns = Math.max(1, Math.round((bottom - top) / (window.innerHeight * TURN_EVERY)));
  const step = (bottom - top) / turns;
  const points = [];
  for (let i = 0; i <= turns; i++) points.push([width * TURNS[i % TURNS.length], top + i * step]);
  if (target) points[turns][0] = width / 2;

  // kurva S: garis singgung tegak di tiap belokan supaya sambungannya mulus
  const loopAt = turns >= 3 ? 2 : -1; // belokan yang diberi putaran
  const radius = Math.min(150, Math.max(48, width * 0.085));
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mid = ((y0 + y1) / 2).toFixed(1);
    d += ` C${x0.toFixed(1)} ${mid} ${x1.toFixed(1)} ${mid} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    if (i === loopAt) {
      // satu putaran penuh: dua busur setengah lingkaran, masuk & keluar dengan arah turun
      const left = x1 - 2 * radius > 40; // muat di sisi kiri? kalau tidak, putar ke kanan
      const far = (left ? x1 - 2 * radius : x1 + 2 * radius).toFixed(1);
      const arc = `A${radius.toFixed(1)} ${radius.toFixed(1)} 0 1 ${left ? 1 : 0}`;
      d += ` ${arc} ${far} ${y1.toFixed(1)} ${arc} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
  }
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  path.setAttribute("d", d);
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length} ${length}`;
  return length;
}

/**
 * Garis berliku yang tergambar mengikuti scroll, dari atas pembungkusnya sampai elemen
 * bertanda `data-line-end` di dalam pembungkus yang sama (atau sampai dasar pembungkus).
 *
 * Pakai: taruh <ScrollLine /> sebagai anak langsung pembungkus ber-`position: relative`
 * (lihat .line-flow di pages.css). Garis berada di belakang isi pembungkus.
 */
export default function ScrollLine() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;
    const svg = ref.current;
    const wrapper = svg.parentElement;
    const path = svg.querySelector("path");

    let length = layout(wrapper, svg, path);
    const relayout = () => {
      length = layout(wrapper, svg, path);
    };
    ScrollTrigger.addEventListener("refreshInit", relayout);

    // ujung garis selalu di sekitar 70% tinggi layar; selesai saat tujuannya masuk layar
    const target = wrapper.querySelector("[data-line-end]");
    const tween = gsap.fromTo(
      path,
      { strokeDashoffset: () => length },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 70%",
          endTrigger: target ?? wrapper,
          end: target ? "top 72%" : "bottom 80%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", relayout);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  if (reduceMotion) return null;
  return (
    <svg className="scroll-line" ref={ref} aria-hidden="true" preserveAspectRatio="none">
      <path />
    </svg>
  );
}
