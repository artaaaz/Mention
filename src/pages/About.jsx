import { Cta } from "../components/sections.jsx";
import { Eyebrow, NextPage, Words } from "../components/ui.jsx";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";

const VALUES = [
  {
    title: "Jujur dari awal",
    text: "Kalau sebuah ide nggak akan berhasil, kami bilang — sebelum anggaran kamu terpakai.",
  },
  {
    title: "Ide di atas tren",
    text: "Tren datang dan pergi. Kami cari gagasan yang masih relevan setahun dari sekarang.",
  },
  {
    title: "Detail itu serius",
    text: "Jarak antarhuruf, jeda animasi, kalimat tombol — hal kecil yang bikin karya terasa mahal.",
  },
  {
    title: "Hasil bisa diukur",
    text: "Tiap proyek punya target yang disepakati di depan, dan kami laporkan hasilnya apa adanya.",
  },
];

const STEPS = [
  {
    title: "Dengar",
    text: "Kami mulai dari bisnis kamu: tujuan, audiens, dan masalah yang sebenarnya perlu dipecahkan.",
  },
  {
    title: "Rancang",
    text: "Strategi dan arah kreatif disepakati dulu, supaya eksekusi nggak bolak-balik revisi.",
  },
  {
    title: "Eksekusi",
    text: "Desain, konten, dan development jalan bareng dalam satu tim — detail dijaga sampai akhir.",
  },
  {
    title: "Ukur",
    text: "Setelah tayang, kami pantau hasilnya dan terus perbaiki berdasarkan data, bukan tebakan.",
  },
];

const no = (i) => String(i + 1).padStart(2, "0");

export default function About() {
  useMeta(
    "Tentang",
    "Kenalan dengan Mention: cara kami berpikir, nilai yang kami pegang, dan proses kerja dari ide sampai tayang.",
  );
  const scope = usePageMotion();

  return (
    <div ref={scope}>
      <section className="page-hero">
        <Eyebrow data-intro>Tentang</Eyebrow>
        <h1 className="page-title" data-intro-title>
          <Words>Brand bagus itu yang</Words>
          <span className="hl">
            <Words>dibicarakan orang.</Words>
          </span>
        </h1>
        <p className="page-lede" data-intro>
          Mention lahir dari satu keyakinan sederhana: karya kreatif baru berhasil kalau orang mau menyebutnya ke
          orang lain.
        </p>
      </section>

      <div className="visual" data-intro>
        <div className="visual__glow" aria-hidden="true" />
        <span className="logo-mark visual__mark" aria-hidden="true" data-float />
        <span className="hero__tag hero__tag--tl">Mention&nbsp;Studio</span>
        <span className="hero__tag hero__tag--tr">Jakarta, ID</span>
      </div>

      {/* ───────────── Cerita ───────────── */}
      <section className="about about--page">
        <Eyebrow data-reveal>Cerita kami</Eyebrow>
        <h2 className="about__lead" data-scrub>
          <Words>
            Kami tim kecil berisi strategist, desainer, penulis, dan developer yang duduk di meja yang sama —
            supaya ide nggak hilang di tengah jalan antara rapat dan eksekusi.
          </Words>
        </h2>
        <div className="about__cols">
          <p data-reveal>
            Banyak proyek kreatif gagal bukan karena idenya jelek, tapi karena terlalu banyak tangan yang nggak
            saling ngobrol. Di Mention, orang yang merancang adalah orang yang juga ikut mengeksekusi.
          </p>
          <p data-reveal>
            Kami bekerja dengan brand baru yang butuh fondasi, dan brand lama yang butuh napas segar. Skalanya
            boleh beda, standarnya tetap sama.
          </p>
        </div>
      </section>

      {/* ───────────── Nilai ───────────── */}
      <section className="values panel panel--white" data-header="ink">
        <div className="section-head">
          <Eyebrow data-reveal>Yang kami pegang</Eyebrow>
          <h2 className="section-title" data-split>
            <Words>Empat hal yang nggak bisa ditawar.</Words>
          </h2>
        </div>
        <ul className="values__list">
          {VALUES.map((value, i) => (
            <li className="value" key={value.title} data-reveal>
              <span className="value__no">{no(i)}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Proses ───────────── */}
      <section className="process">
        <div className="section-head">
          <Eyebrow data-reveal>Cara Kerja</Eyebrow>
          <h2 className="section-title" data-split>
            <Words>Tempat ide kreatif jadi hasil nyata.</Words>
          </h2>
        </div>
        <ol className="process__grid">
          {STEPS.map((step, i) => (
            <li className="step" key={step.title} data-reveal>
              <span className="step__no">{no(i)}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <Cta />
      <NextPage to="/projects" title="Karya" />
    </div>
  );
}
