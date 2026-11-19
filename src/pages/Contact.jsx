import { useState } from "react";
import { SocialLinks } from "../components/Footer.jsx";
import { Button, Eyebrow, NextPage, Words } from "../components/ui.jsx";
import { CONTACT } from "../data/site.js";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";

const NEEDS = [
  { value: "Branding", label: "Branding" },
  { value: "Konten & sosial media", label: "Konten & sosmed" },
  { value: "Website", label: "Website" },
  { value: "Foto & video", label: "Foto & video" },
  { value: "Lainnya", label: "Lainnya" },
];

const NOTE_DEFAULT = "Tombol ini membuka aplikasi email kamu dengan brief yang sudah terisi.";

export default function Contact() {
  useMeta("Kontak", "Punya proyek? Ceritain ke Mention. Kami balas dalam 1×24 jam kerja.");
  const scope = usePageMotion();
  const [note, setNote] = useState({ text: NOTE_DEFAULT, error: false });

  // Belum ada server: form ini menyusun email di aplikasi email pengunjung (mailto).
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const invalid = [...form.querySelectorAll("[required]")].find((field) => !field.checkValidity());
    if (invalid) {
      setNote({ text: "Lengkapi dulu nama, email yang valid, dan cerita singkatnya ya.", error: true });
      invalid.focus();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const needs = data.getAll("need");
    const body = [
      `Nama: ${name}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Kebutuhan: ${needs.length ? needs.join(", ") : "-"}`,
      "",
      String(data.get("message")).trim(),
    ].join("\n");
    const subject = `Brief proyek dari ${name}`;

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote({ text: "Aplikasi email kamu terbuka dengan brief ini — tinggal tekan kirim.", error: false });
  }

  return (
    <div ref={scope}>
      <section className="page-hero">
        <Eyebrow data-intro>Kontak</Eyebrow>
        <h1 className="page-title" data-intro-title>
          <Words>Yuk,</Words>
          <span className="hl">
            <Words>ngobrol.</Words>
          </span>
        </h1>
        <p className="page-lede" data-intro>
          Ceritain proyek kamu sesingkat atau sepanjang yang kamu mau. Kami balas dalam 1×24 jam kerja.
        </p>
      </section>

      <section className="contact">
        <div className="contact__info">
          <div data-reveal>
            <p className="footer__label">Proyek baru</p>
            <a className="link contact__mail" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
          </div>
          <div data-reveal>
            <p className="footer__label">Studio</p>
            <p>
              {CONTACT.city}
              <br />
              {CONTACT.hours}
            </p>
          </div>
          <div data-reveal>
            <p className="footer__label">Sosial</p>
            <SocialLinks className="contact__social" />
          </div>
        </div>

        <form className="brief" onSubmit={handleSubmit} noValidate data-reveal>
          <div className="field">
            <label htmlFor="f-name">Nama</label>
            <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Nama kamu" required />
          </div>
          <div className="field">
            <label htmlFor="f-email">Email</label>
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
            />
          </div>
          <fieldset className="field">
            <legend>Butuh bantuan apa?</legend>
            <div className="chips">
              {NEEDS.map((need) => (
                <label className="chip" key={need.value}>
                  <input type="checkbox" name="need" value={need.value} />
                  <span>{need.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="f-message">Cerita singkat</label>
            <textarea
              id="f-message"
              name="message"
              rows={4}
              placeholder="Proyeknya apa, targetnya kapan, dan apa yang mau dicapai?"
              required
            />
          </div>
          <div className="brief__foot">
            <Button type="submit" variant="yellow">
              Kirim brief
            </Button>
            <p className={`brief__note ${note.error ? "is-error" : ""}`} role="status">
              {note.text}
            </p>
          </div>
        </form>
      </section>

      <NextPage to="/" label="Kembali ke" title="Beranda" />
    </div>
  );
}
