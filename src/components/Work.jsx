import { useEffect, useRef, useState } from "react";
import { canHover, reduceMotion } from "../lib/motion.js";
import { TLink } from "./ui.jsx";

const COVERS = new Set(["rings", "dots", "stripes", "sweep", "bars", "arcs"]);

const PREVIEW_DELAY = 180; // ms kursor harus diam di kartu sebelum video dimuat (lewat sekilas ≠ memutar)
const PREVIEW_FADE = 500; // ms; harus cocok dengan transisi .work-card__preview di style.css
const YOUTUBE_WARMUP = 900; // ms setelah iframe termuat sampai gambarnya benar-benar jalan

export const projectPath = (project) => `/projects/${project.slug}`;

/** Alamat embed YouTube. `preview` = tanpa suara, tanpa kontrol, berulang (untuk kartu). */
export function youtubeEmbed(id, { preview = false } = {}) {
  const params = new URLSearchParams(
    preview
      ? {
          autoplay: "1",
          mute: "1",
          controls: "0",
          loop: "1",
          playlist: id, // wajib supaya loop jalan
          playsinline: "1",
          rel: "0",
          modestbranding: "1",
          iv_load_policy: "3",
          disablekb: "1",
        }
      : { rel: "0", modestbranding: "1", playsinline: "1" },
  );
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

/** Gambar asli kalau `source` berupa path; kalau nama pola → placeholder CSS. */
export function Media({ source, alt = "" }) {
  if (COVERS.has(source)) return <div className={`cover cover--${source}`} data-parallax />;
  return <img src={source} alt={alt} loading="lazy" decoding="async" data-parallax />;
}

/**
 * Kartu karya. Kalau proyeknya punya `youtube` atau `video` (lihat src/data/projects.js), videonya
 * diputar tanpa suara di atas gambar selama kursor berada di kartu. Videonya baru dimuat saat
 * kursor masuk, jadi kartu yang tidak disentuh tidak mengunduh apa-apa.
 */
export function WorkCard({ project, hidden = false }) {
  const [mounted, setMounted] = useState(false); // elemen video terpasang
  const [visible, setVisible] = useState(false); // video sudah jalan & kursor masih di kartu
  const hovering = useRef(false);
  const loaded = useRef(false);
  const timer = useRef(0);
  const hasVideo = Boolean(project.youtube || project.video) && canHover && !reduceMotion;

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    loaded.current = true;
    if (hovering.current) setVisible(true);
  };
  const enter = () => {
    hovering.current = true;
    clearTimeout(timer.current);
    if (mounted) {
      if (loaded.current) setVisible(true);
      return;
    }
    timer.current = setTimeout(() => setMounted(true), PREVIEW_DELAY);
  };
  const leave = () => {
    hovering.current = false;
    clearTimeout(timer.current);
    setVisible(false);
    // dilepas setelah memudar, supaya video tidak terus berjalan di belakang
    timer.current = setTimeout(() => {
      loaded.current = false;
      setMounted(false);
    }, PREVIEW_FADE);
  };

  return (
    <TLink
      className="work-card"
      to={projectPath(project)}
      hidden={hidden}
      data-reveal
      onPointerEnter={hasVideo ? enter : undefined}
      onPointerLeave={hasVideo ? leave : undefined}
    >
      <div className="work-card__media">
        <Media source={project.image || project.cover} alt={project.title} />
        {mounted && (
          <div className={`work-card__preview ${visible ? "is-visible" : ""}`} aria-hidden="true">
            {project.video ? (
              <video src={project.video} muted loop playsInline autoPlay onPlaying={show} />
            ) : (
              <iframe
                src={youtubeEmbed(project.youtube, { preview: true })}
                title=""
                allow="autoplay; encrypted-media"
                tabIndex={-1}
                onLoad={() => setTimeout(show, YOUTUBE_WARMUP)}
              />
            )}
          </div>
        )}
      </div>
      <div className="work-card__meta">
        <h3 className="work-card__title">{project.title}</h3>
        <p className="work-card__info">
          {project.category} — {project.year}
        </p>
        <p className="work-card__tags">{project.tags.join(" • ")}</p>
      </div>
    </TLink>
  );
}
