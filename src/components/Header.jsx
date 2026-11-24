import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { ArrowRight, TLink } from "./ui.jsx";

const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang" },
  { to: "/projects", label: "Karya" },
  { to: "/contact", label: "Kontak" },
];

const isActive = (to, pathname) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ink, setInk] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // tutup menu tiap pindah halaman
  useEffect(() => setOpen(false), [pathname]);

  // sembunyi saat scroll turun, muncul saat naik; jadi hitam di atas panel terang
  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      if (y > lastY + 4 && y > 240) setHidden(true);
      else if (y < lastY - 4 || y <= 240) setHidden(false);
      lastY = y;

      const probe = (headerRef.current?.getBoundingClientRect().height ?? 80) / 2;
      // Blok bertanda data-header yang sedang berada di bawah header. "ink" = latar terang (header
      // hitam), "light" = latar gelap. Yang terakhir dalam urutan dokumen menang: blok gelap di dalam
      // halaman terang, atau footer yang naik menutupi panel yang masih menempel.
      const under = [...document.querySelectorAll("[data-header]")].filter((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= probe && rect.bottom >= probe;
      });
      setInk(under.at(-1)?.dataset.header === "ink");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Escape / klik di luar menutup menu
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event) => {
      if (!menuRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const headerClass = ["header", hidden && !open && "is-hidden", ink && "is-ink", open && "is-menu-open"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass} ref={headerRef}>
        <TLink className="header__logo" to="/" aria-label="Mention — beranda">
          <span className="logo" aria-hidden="true" />
        </TLink>
        <div className="header__actions">
          <TLink className="pill pill--yellow" to="/contact">
            <span className="pill__label">Ngobrol yuk</span>
            <span className="pill__dot" aria-hidden="true" />
          </TLink>
          <button
            className="pill pill--light"
            type="button"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="pill__label">{open ? "Tutup" : "Menu"}</span>
            <span className="pill__dots" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <nav
        className={`menu ${open ? "is-open" : ""}`}
        id="menu"
        ref={menuRef}
        aria-label="Navigasi utama"
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="menu__list">
          {NAV.map((item, i) => (
            <li key={item.to} style={{ "--i": i }}>
              <TLink
                to={item.to}
                aria-current={isActive(item.to, pathname) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label} <span aria-hidden="true" />
              </TLink>
            </li>
          ))}
        </ul>
        <TLink className="menu__cta" to="/contact" onClick={() => setOpen(false)}>
          <span>Mulai proyek</span>
          <ArrowRight />
        </TLink>
      </nav>
    </>
  );
}
