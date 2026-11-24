import Gallery from "../components/Gallery.jsx";
import HeroScene from "../components/HeroScene.jsx";
import Reel from "../components/Reel.jsx";
import ScrollLine from "../components/ScrollLine.jsx";
import { Cta } from "../components/sections.jsx";
import Stats from "../components/Stats.jsx";
import TechText from "../components/TechText/TechText.jsx";
import { Button, Eyebrow, NextPage, Words } from "../components/ui.jsx";
import { WorkCard } from "../components/Work.jsx";
import { projects } from "../data/projects.js";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";

export default function Home() {
  useMeta();
  const scope = usePageMotion();

  return (
    <div ref={scope}>
      {/* ───────────── Hero ───────────── */}
      <section className="hero">
        <div className="hero__top">
          {/* Nama studio sebagai wordmark interaktif (React Bits → TechText): hurufnya berubah jadi
              garis putus-putus di bawah kursor. Ukurannya menyesuaikan kotak .hero__mark. */}
          <h1 className="hero__mark" data-intro>
            <TechText
              text="Mention"
              fontSize={420}
              fontWeight={600}
              align="left"
              accentColor="#ffee00"
              sweep={false} // tanpa animasi sendiri: hurufnya utuh sampai kursor menyentuhnya
            />
          </h1>
          <p className="hero__tagline" data-intro-title>
            <span className="hero__tagline-line">
              <Words>We Are Mention</Words>
            </span>
            <span className="hero__tagline-line hl">
              <Words>We Come To Win</Words>
            </span>
          </p>
        </div>

        <HeroScene />

        <div className="hero__foot" data-intro>
          <span className="plus" aria-hidden="true" />
          <span className="plus" aria-hidden="true" />
          <span className="hero__scroll">Scroll untuk jelajah</span>
          <span className="plus" aria-hidden="true" />
          <span className="plus" aria-hidden="true" />
        </div>
      </section>

      {/* Dari reel sampai CTA: satu garis tergambar mengikuti scroll di belakang isinya */}
      <div className="line-flow">
        <ScrollLine />

        {/* ───────────── Reel ───────────── */}
        <Reel />

        {/* ───────────── Angka ───────────── */}
        <Stats />

        {/* ───────────── Karya pilihan ───────────── */}
        <section className="work">
          <div className="section-head section-head--split">
            <div>
              <Eyebrow data-reveal>Karya Pilihan</Eyebrow>
              <h2 className="section-title" data-split>
                <Words>Yang sudah kami kerjakan.</Words>
              </h2>
            </div>
            <p className="section-sub" data-reveal>
              Sebagian proyek untuk brand yang berani tampil beda dan tim yang mau melangkah lebih jauh.
            </p>
          </div>

          <div className="work__grid">
            {projects.slice(0, 4).map((project) => (
              <WorkCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="work__more" data-reveal>
            <Button to="/projects">Lihat semua karya</Button>
          </div>
        </section>

        {/* ───────────── Galeri ───────────── */}
        <Gallery />

        <Cta />
      </div>

      <NextPage to="/about" title="Tentang" />
    </div>
  );
}
