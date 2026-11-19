// Komponen kecil yang dipakai di banyak tempat.

import { Fragment } from "react";
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

/** Blok besar di akhir halaman yang mengarah ke halaman berikutnya. */
export function NextPage({ to, label = "Halaman berikutnya", title }) {
  return (
    <TLink className="next" to={to}>
      <span className="next__label">{label}</span>
      <span className="next__title">
        {title}
        <ArrowRight />
      </span>
    </TLink>
  );
}
