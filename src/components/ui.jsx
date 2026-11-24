// Komponen kecil yang dipakai di banyak tempat.

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { useApp } from "../lib/app-context.js";

/** Link internal dengan transisi slide-blur antar-halaman. */
export function TLink({ to, onClick, ...props }) {
  const { go } = useApp();
  return (
    <Link
      to={to}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        // biarkan browser yang menangani: tab baru, klik tengah, dsb.
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        go(to);
      }}
    />
  );
}

/** Pecah teks jadi kata (span.w) supaya bisa dianimasikan satu per satu. */
export function Words({ children }) {
  return String(children)
    .trim()
    .split(/\s+/)
    .map((word, i) => (
      <Fragment key={i}>
        <span className="w">{word}</span>{" "}
      </Fragment>
    ));
}

export function Eyebrow({ children, ...props }) {
  return (
    <p className="eyebrow" {...props}>
      <i />
      {children}
    </p>
  );
}

export const ArrowRight = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowDown = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const ArrowUp = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const ArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/** Tombol pill besar dengan ikon panah. `to` → link internal; tanpa `to` → <button>. */
export function Button({ to, variant = "", children, ...props }) {
  const className = `btn ${variant ? `btn--${variant}` : ""}`.trim();
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__icon" aria-hidden="true">
        <ArrowRight />
      </span>
    </>
  );
  return to ? (
    <TLink className={className} to={to} {...props}>
      {inner}
    </TLink>
  ) : (
    <button className={className} {...props}>
      {inner}
    </button>
  );
}

const NEXT_WHEEL = 650; // total "dorongan" roda mouse (px) sampai pindah halaman
const NEXT_TOUCH = 170; // jarak usap ke atas (px) di layar sentuh
const NEXT_DWELL = 350; // jeda setelah sampai dasar, supaya sisa scroll tidak ikut terhitung

/**
 * Blok di ujung footer menuju halaman berikutnya. Sampai di dasar halaman lalu terus
 * scroll → garis progresnya terisi → begitu penuh, pindah halaman. Berhenti di tengah
 * jalan → garisnya surut lagi. Bisa juga diklik.
 * Dirender ke #next-slot (lihat Footer.jsx) supaya posisinya paling bawah.
 */
export function NextPage({ to, label = "Halaman berikutnya", title }) {
  const { go } = useApp();
  const [slot, setSlot] = useState(null);
  const ref = useRef(null);

  useEffect(() => setSlot(document.getElementById("next-slot")), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let progress = 0; // 0…1, dari input
    let shown = 0; // yang tampil (dihaluskan)
    let lastInput = 0;
    let arrivedAt = 0;
    let touch = null;
    let done = false;
    let raf = 0;
    let last = 0;

    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const busy = () => document.body.classList.contains("is-loading") || document.body.classList.contains("is-leaving");
    const armed = () => arrivedAt > 0 && performance.now() - arrivedAt > NEXT_DWELL && !busy();

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // surut kalau didiamkan — kecuali sudah penuh: sekali penuh, perpindahan pasti jalan
      if (progress < 1 && !touch && now - lastInput > 220) progress = Math.max(0, progress - dt * 1.6);
      shown += (progress - shown) * (1 - Math.exp(-14 * dt));
      el.style.setProperty("--p", shown.toFixed(4));
      if (!done && progress >= 1 && shown > 0.985) {
        done = true;
        el.style.setProperty("--p", "1");
        go(to);
        return;
      }
      raf = progress > 0 || shown > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const push = (value) => {
      if (done) return;
      progress = Math.min(1, Math.max(0, value));
      lastInput = performance.now();
      if (!raf) {
        last = lastInput;
        raf = requestAnimationFrame(loop);
      }
    };

    const onScroll = () => {
      if (atBottom()) arrivedAt ||= performance.now();
      else {
        arrivedAt = 0;
        if (!done) progress = 0;
      }
    };
    const onWheel = (event) => {
      if (!armed() || !atBottom()) return;
      const delta = event.deltaMode === 1 ? event.deltaY * 32 : event.deltaY;
      push(progress + delta / NEXT_WHEEL);
    };
    const onTouchStart = (event) => {
      touch = armed() && atBottom() ? { y: event.touches[0].clientY } : null;
    };
    const onTouchMove = (event) => {
      if (touch) push((touch.y - event.touches[0].clientY) / NEXT_TOUCH);
    };
    const onTouchEnd = () => {
      touch = null;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [slot, to, go]);

  if (!slot) return null;
  return createPortal(
    <TLink className="next" to={to} ref={ref}>
      <span className="next__hint">
        <ArrowDown />
        Terus scroll untuk lanjut
      </span>
      <span className="next__title">{title}</span>
      <span className="next__go">
        {label}
        <span className="next__bar" aria-hidden="true">
          <i />
        </span>
        <ArrowRight />
      </span>
    </TLink>,
    slot,
  );
}
