// Section yang dipakai di lebih dari satu halaman.

import { SERVICES } from "../data/site.js";
import { useMagnetic } from "../hooks/useMagnetic.js";
import { ArrowUpRight, Eyebrow, TLink, Words } from "./ui.jsx";

export function Services() {
  return (
    <section className="services panel panel--white" id="services" data-header="ink">
      <div className="section-head">
        <Eyebrow data-reveal>Layanan</Eyebrow>
        <h2 className="section-title" data-split>
          <Words>Satu tim, dari ide sampai tayang.</Words>
        </h2>
      </div>

      <ul className="services__list">
        {SERVICES.map((service, i) => (
          <li className="service" key={service.name} data-reveal>
            <span className="service__no">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="service__name">{service.name}</h3>
            <p className="service__desc">{service.desc}</p>
            <span className="service__arrow" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const MARQUEE = Array.from({ length: 4 });

export function Cta() {
  const button = useMagnetic();
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {MARQUEE.map((_, i) => (
            <span className="marquee__group" key={i}>
              <span>Tinggal mention</span>
              <i />
              <span className="is-outline">Kami yang eksekusi</span>
              <i />
            </span>
          ))}
        </div>
      </div>

      <section className="cta panel panel--yellow" data-header="ink">
        <Eyebrow data-reveal>Mulai proyek</Eyebrow>
        <h2 className="cta__title" data-split>
          <Words>Punya ide besar? Saatnya di-mention.</Words>
        </h2>
        <div className="cta__row">
          <p className="cta__text" data-reveal>
            Ceritain proyek kamu — brand baru, campaign, atau website. Kami balas dalam 1×24 jam kerja.
          </p>
          <TLink className="cta__button" to="/contact" ref={button}>
            <span>
              Mulai
              <br />
              proyek
            </span>
            <ArrowUpRight />
          </TLink>
        </div>
      </section>
    </>
  );
}
