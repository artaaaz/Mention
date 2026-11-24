import { scrollToTop } from "../lib/scroll.js";
import { CONTACT } from "../data/site.js";
import { ArrowRight, ArrowUp, TLink } from "./ui.jsx";

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
    // data-header: lihat Header.jsx — footer terang (logo header jadi hitam), blok "halaman berikutnya" gelap
    <footer className="footer" data-header="ink">
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
          <p className="footer__label">Sosial</p>
          <SocialLinks />
          <p className="footer__label">Jelajah</p>
          <ul>
            <li><TLink className="link" to="/">Beranda</TLink></li>
            <li><TLink className="link" to="/about">Tentang</TLink></li>
            <li><TLink className="link" to="/projects">Karya</TLink></li>
            <li><TLink className="link" to="/contact">Kontak</TLink></li>
          </ul>
        </div>

        <div className="footer__col footer__col--wide">
          <h2 className="footer__title">Punya proyek? Ceritain ke kami.</h2>
          <a className="footer__mail" href={`mailto:${CONTACT.email}`}>
            <span>{CONTACT.email}</span>
            <ArrowRight />
          </a>
        </div>
      </div>

      <div className="footer__base">
        <span>©2026 Mention. Semua hak dilindungi.</span>
        <button className="footer__top" type="button" aria-label="Kembali ke atas" onClick={scrollToTop}>
          <ArrowUp />
        </button>
      </div>

      {/* diisi oleh <NextPage> milik halaman yang sedang tampil */}
      <div id="next-slot" data-header="light" />
    </footer>
  );
}
