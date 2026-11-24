import { useParams } from "react-router";
import { ArrowLeft, Eyebrow, NextPage, TLink, Words } from "../components/ui.jsx";
import { Media, projectPath, youtubeEmbed } from "../components/Work.jsx";
import { projects } from "../data/projects.js";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";
import NotFound from "./NotFound.jsx";

export default function Project() {
  const { slug } = useParams();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return (
      <NotFound
        eyebrow="Karya"
        title="Proyek tidak ditemukan."
        text="Mungkin link-nya sudah berubah. Lihat daftar karya kami yang lain."
        to="/projects"
        label="Semua karya"
      />
    );
  }
  return <ProjectDetail project={projects[index]} next={projects[(index + 1) % projects.length]} />;
}

function ProjectDetail({ project, next }) {
  useMeta(project.title, project.summary);
  const scope = usePageMotion();

  return (
    <div ref={scope}>
      <section className="page-hero page-hero--project">
        <TLink className="back" to="/projects" data-intro>
          <ArrowLeft />
          Semua karya
        </TLink>
        <Eyebrow data-intro>{project.category}</Eyebrow>
        <h1 className="page-title" data-intro-title>
          <Words>{project.title}</Words>
        </h1>
        <p className="page-lede" data-intro>
          {project.summary}
        </p>
      </section>

      {project.youtube ? (
        // proyek video: pemutarnya langsung di tempat cover
        <div className="project-cover project-cover--video" data-intro>
          <iframe
            src={youtubeEmbed(project.youtube)}
            title={project.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <div className="project-cover" data-intro>
          <Media source={project.image || project.cover} alt={project.title} />
        </div>
      )}

      <section className="project-body">
        <dl className="project-meta" data-reveal>
          <div>
            <dt>Klien</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>Tahun</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Layanan</dt>
            <dd>{project.tags.join(", ")}</dd>
          </div>
        </dl>
        {(project.challenge || project.solution) && (
          <div className="project-text">
            {project.challenge && (
              <div data-reveal>
                <h2>Tantangan</h2>
                <p>{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div data-reveal>
                <h2>Solusi</h2>
                <p>{project.solution}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {project.gallery?.length > 0 && (
        <section className="project-gallery">
          {project.gallery.map((item, i) => (
            <div className="project-shot" key={i} data-reveal>
              <Media source={item} alt={`${project.title} — gambar ${i + 1}`} />
            </div>
          ))}
        </section>
      )}

      <NextPage to={projectPath(next)} label="Proyek berikutnya" title={next.title} />
    </div>
  );
}
