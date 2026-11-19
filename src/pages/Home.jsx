import HeroScene from "../components/HeroScene.jsx";
import { Cta, Services } from "../components/sections.jsx";
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
          <h1 className="hero__title" data-intro-title>
            <Words>Kami bikin brand kamu</Words>
            <span className="hl">
              <Words>layak di-mention.</Words>
            </span>
          </h1>
          <p className="hero__lede" data-intro>
            Agensi kreatif untuk brand yang nggak mau cuma lewat di timeline — strategi, desain, konten, dan web
            dalam satu tim.
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

      {/* ───────────── Tentang (ringkas) ───────────── */}
      <section className="about">
        <Eyebrow data-reveal>Tentang Mention</Eyebrow>
        <h2 className="about__lead" data-scrub>
          <Words>
            Ide berani nggak cukup cuma keren di presentasi. Kami bawa sampai jadi — dirancang rapi, dieksekusi
            detail, dan dibicarakan orang.
          </Words>
        </h2>
        <div className="about__cols">
          <p data-reveal>
            Mention menggabungkan strategi, desain, motion, dan development dalam satu meja. Hasilnya pengalaman
            brand yang konsisten dari feed Instagram sampai halaman checkout.
          </p>
          <p data-reveal>
            Kami nggak ngejar tren, dan nggak bikin karya yang mirip semua orang. Tiap proyek dimulai dari satu
            pertanyaan: kenapa orang harus peduli?
          </p>
          <div className="about__actions" data-reveal>
            <Button to="/about">Cara kerja kami</Button>
            <Button to="/projects" variant="ghost">
              Lihat karya
            </Button>
          </div>
        </div>
      </section>

      <Services />

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

      <Cta />
      <NextPage to="/about" title="Tentang" />
    </div>
  );
}
