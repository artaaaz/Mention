import { TLink } from "./ui.jsx";

const COVERS = new Set(["rings", "dots", "stripes", "sweep", "bars", "arcs"]);

export const projectPath = (project) => `/projects/${project.slug}`;

/** Gambar asli kalau `source` berupa path; kalau nama pola → placeholder CSS. */
export function Media({ source, alt = "" }) {
  if (COVERS.has(source)) return <div className={`cover cover--${source}`} data-parallax />;
  return <img src={source} alt={alt} loading="lazy" decoding="async" data-parallax />;
}

export function WorkCard({ project, hidden = false }) {
  return (
    <TLink className="work-card" to={projectPath(project)} hidden={hidden} data-reveal>
      <div className="work-card__media">
        <Media source={project.image || project.cover} alt={project.title} />
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
