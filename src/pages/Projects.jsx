import { useLayoutEffect, useRef, useState } from "react";
import { Cta } from "../components/sections.jsx";
import { Eyebrow, NextPage, Words } from "../components/ui.jsx";
import { WorkCard } from "../components/Work.jsx";
import { projects } from "../data/projects.js";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";
import { animateIn, BLUR_IN, gsap, reduceMotion, ScrollTrigger } from "../lib/motion.js";

const ALL = "Semua";
const CATEGORIES = [ALL, ...new Set(projects.map((project) => project.category))];
const countIn = (category) =>
  category === ALL ? projects.length : projects.filter((project) => project.category === category).length;

export default function Projects() {
  useMeta(
    "Karya",
    "Kumpulan karya Mention: branding, website, campaign, dan konten untuk brand yang berani tampil beda.",
  );
  const scope = usePageMotion();
  const gridRef = useRef(null);
  const [filter, setFilter] = useState(ALL);
  const lastFilter = useRef(filter);

  const matches = (project) => filter === ALL || project.category === filter;

  // ganti filter → kartu yang tersisa masuk lagi dengan slide-blur
  useLayoutEffect(() => {
    if (lastFilter.current === filter) return;
    lastFilter.current = filter;
    const shown = gridRef.current.querySelectorAll(".work-card:not([hidden])");
    if (!reduceMotion && shown.length) {
      gsap.killTweensOf(shown);
      gsap.set(shown, { ...BLUR_IN, y: 32 });
      animateIn(shown);
    }
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <div ref={scope}>
      <section className="page-hero">
        <Eyebrow data-intro>Karya</Eyebrow>
        <h1 className="page-title" data-intro-title>
          <Words>Semua yang</Words>
          <span className="hl">
            <Words>kami bikin.</Words>
          </span>
        </h1>
        <p className="page-lede" data-intro>
          Dari identitas brand sampai website dan campaign. Pilih kategori, atau lihat semuanya.
        </p>
      </section>

      <section className="work work--page">
        <div className="filters" role="group" aria-label="Filter kategori" data-intro>
          {CATEGORIES.map((category) => (
            <button
              className="filter"
              type="button"
              key={category}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
              <sup>{countIn(category)}</sup>
            </button>
          ))}
        </div>

        {/* semua kartu tetap ter-mount; yang tidak cocok disembunyikan */}
        <div className="work__grid" ref={gridRef}>
          {projects.map((project) => (
            <WorkCard key={project.slug} project={project} hidden={!matches(project)} />
          ))}
        </div>
      </section>

      <Cta />
      <NextPage to="/contact" title="Kontak" />
    </div>
  );
}
