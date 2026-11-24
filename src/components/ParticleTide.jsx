import { useEffect, useRef } from "react";
import { reduceMotion } from "../lib/motion.js";

// Partikel bentuk kecil (lingkaran, kotak, segitiga, plus, silang) yang mengisi dasar
// panel seperti cairan yang terus diaduk: partikelnya mengalir cepat, permukaannya bergolak,
// naik saat panel masuk layar (dan makin tinggi lewat prop `rise`), terangkat
// ke arah kursor, dan partikel di dekat kursor tersibak. Warnanya mengikuti `color` CSS.

const SPACING = 14; // jarak antar partikel (px)
const SIZE = 3.5; // setengah ukuran satu bentuk (px)
const EDGE = 26; // lebar tepi permukaan tempat partikel mengecil (px)
const FRAME_MS = 1000 / 62; // praktis tiap frame

/**
 * `rise` : ref berisi 0…1 — makin besar, makin tinggi cairannya (dipakai saat panel ditahan).
 * `cover`: ref berisi posisi y (px dari atas kanvas) tempat sesuatu mulai menutupi kanvas;
 *          partikel di bawahnya tidak digambar, dan kalau semuanya tertutup kanvas berhenti.
 */
export default function ParticleTide({ className = "", rise, cover }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 1;
    let height = 1;
    let ratio = 1;
    let particles = [];
    let surface = new Float32Array(1); // tinggi cairan (dari dasar) per kolom piksel kasar
    let fill = reduceMotion ? 1 : 0; // 0…1, naik saat panel masuk layar
    let lift = 0; // 0…1, mengikuti `rise` (dihaluskan)
    let raf = 0;
    let last = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, inside: false, power: 0 };

    const build = () => {
      particles = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          particles.push({
            x: x + (Math.random() - 0.5) * SPACING * 0.8,
            y: y + (Math.random() - 0.5) * SPACING * 0.8,
            type: Math.floor(Math.random() * 5),
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 3.2,
            // px per detik; lapisan yang berdekatan mengalir ke arah berbeda
            flow: 85 * Math.sin(y * 0.011 + 1.3) + (Math.random() - 0.5) * 50,
            phase: Math.random() * Math.PI * 2,
            scale: 0.75 + Math.random() * 0.5,
          });
        }
      }
      surface = new Float32Array(Math.ceil(width / 8) + 2);
    };

    /** Tinggi permukaan cairan di posisi x (px dari dasar). */
    const level = (x, t) => {
      const u = x / width;
      // gelombang yang berjalan cepat ke dua arah → permukaannya terus bergolak
      let h = 0.3 + 0.08 * Math.sin(x * 0.004 + t * 1.7) + 0.055 * Math.sin(x * 0.011 - t * 2.9);
      h += 0.035 * Math.sin(x * 0.023 + t * 4.4) + 0.02 * Math.sin(x * 0.041 - t * 6.1);
      // gundukan tinggi di sisi kiri + bukit landai di kanan
      const left = (u - (0.03 + 0.03 * Math.sin(t * 1.1))) / Math.max(0.075, 64 / width); // tidak terlalu tipis di HP
      h += 0.66 * Math.exp(-left * left);
      const right = (u - 0.74) / 0.2;
      h += 0.15 * (0.75 + 0.25 * Math.sin(t * 1.5)) * Math.exp(-right * right);
      // cairan terangkat ke arah kursor
      if (pointer.power > 0.01) {
        const near = (x - pointer.x) / (width * 0.11);
        h += 0.14 * pointer.power * Math.exp(-near * near);
      }
      return h * height * fill * (0.62 + 0.6 * lift);
    };

    const draw = (t) => {
      for (let i = 0; i < surface.length; i++) surface[i] = level(i * 8, t);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      const reach = 110;
      const limit = (cover?.current ?? Infinity) + 12;

      for (const p of particles) {
        if (p.y > limit) continue; // tertutup (mis. oleh footer)
        // arus: tiap lapisan mengalir ke samping dengan kecepatannya sendiri (keluar kanan → masuk kiri),
        // ditambah goyangan cepat supaya terasa seperti butiran yang diaduk
        let x = (((p.x + p.flow * t) % width) + width) % width;
        x += Math.sin(t * 2.6 + p.phase) * 4;
        let y = p.y + Math.cos(t * 2.2 + p.phase * 1.3) * 4 + Math.sin(x * 0.018 + t * 3.4) * 5;

        const depth = surface[Math.max(0, Math.min(surface.length - 1, Math.round(x / 8)))] - (height - y);
        if (depth <= 1) continue;

        // tersibak oleh kursor
        if (pointer.power > 0.01) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < reach && distance > 0.001) {
            const push = ((1 - distance / reach) ** 2 * 38 * pointer.power) / distance;
            x += dx * push;
            y += dy * push;
          }
        }

        const k = ratio * p.scale * Math.min(1, depth / EDGE);
        const angle = p.rotation + t * p.spin;
        const cos = Math.cos(angle) * k;
        const sin = Math.sin(angle) * k;
        ctx.setTransform(cos, sin, -sin, cos, x * ratio, y * ratio);

        switch (p.type) {
          case 0: // lingkaran
            ctx.beginPath();
            ctx.arc(0, 0, SIZE, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1: // kotak
            ctx.fillRect(-SIZE * 0.85, -SIZE * 0.85, SIZE * 1.7, SIZE * 1.7);
            break;
          case 2: // segitiga
            ctx.beginPath();
            ctx.moveTo(0, -SIZE * 1.15);
            ctx.lineTo(SIZE, SIZE * 0.8);
            ctx.lineTo(-SIZE, SIZE * 0.8);
            ctx.fill();
            break;
          default: // plus & silang (silang = plus yang diputar; rotasinya sudah acak)
            ctx.fillRect(-SIZE * 1.25, -SIZE * 0.26, SIZE * 2.5, SIZE * 0.52);
            ctx.fillRect(-SIZE * 0.26, -SIZE * 1.25, SIZE * 0.52, SIZE * 2.5);
        }
      }
    };

    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last >= FRAME_MS && (cover?.current ?? Infinity) > 0) {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        // makin banyak panel terlihat, makin tinggi cairannya
        const rect = canvas.getBoundingClientRect();
        const seen = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.9)));
        fill += (seen - fill) * (1 - Math.exp(-3 * dt));
        lift += ((rise?.current ?? 0) - lift) * (1 - Math.exp(-7 * dt));
        pointer.power += ((pointer.inside ? 1 : 0) - pointer.power) * (1 - Math.exp(-5 * dt));
        draw(now / 1000);
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && !reduceMotion && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      build();
      draw(reduceMotion ? 0 : performance.now() / 1000);
      wake();
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
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
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersection.observe(canvas);
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
  }, [rise, cover]);

  return <canvas className={`particle-tide ${className}`.trim()} ref={ref} aria-hidden="true" />;
}
