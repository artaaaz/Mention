import { scrollToTop } from "../lib/scroll.js";
import { CONTACT } from "../data/site.js";
import { TLink } from "./ui.jsx";

export function SocialLinks({ className }) {
  return (
    <ul className={className}>
      {CONTACT.socials.map((social) => (
        <li key={social.label}>
          {social.url ? (
            <a className="link" href={social.url} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ) : (
            // URL belum diisi di src/data/site.js
            <a className="link" href="#" onClick={(event) => event.preventDefault()}>
              {social.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col">
          <p className="footer__label">Studio</p>
          <p>
            {CONTACT.city}
            <br />
            {CONTACT.hours}
          </p>
        </div>
        <div className="footer__col">
          <p className="footer__label">Jelajah</p>
          <ul>
            <li><TLink className="link" to="/">Beranda</TLink></li>
            <li><TLink className="link" to="/about">Tentang</TLink></li>
            <li><TLink className="link" to="/projects">Karya</TLink></li>
            <li><TLink className="link" to="/contact">Kontak</TLink></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__label">Sosial</p>
          <SocialLinks />
        </div>
        <div className="footer__col">
          <p className="footer__label">Proyek baru</p>
          <a className="link link--big" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        <span className="logo logo--full" />
      </div>

      <div className="footer__base">
        <span>©2026 Mention. Semua hak dilindungi.</span>
        <a
          className="link"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            scrollToTop();
          }}
        >
          Kembali ke atas ↑
        </a>
      </div>
    </footer>
  );
}
