import { Button, Eyebrow, Words } from "../components/ui.jsx";
import { useMeta } from "../hooks/useMeta.js";
import { usePageMotion } from "../hooks/usePageMotion.js";

export default function NotFound({
  eyebrow = "404",
  title = "Halaman tidak ditemukan.",
  text = "Alamatnya mungkin salah ketik, atau halamannya sudah dipindah.",
  to = "/",
  label = "Kembali ke beranda",
}) {
  useMeta(title.replace(/\.$/, ""));
  const scope = usePageMotion();

  return (
    <div ref={scope}>
      <section className="page-hero page-hero--center">
        <Eyebrow data-intro>{eyebrow}</Eyebrow>
        <h1 className="page-title" data-intro-title>
          <Words>{title}</Words>
        </h1>
        <p className="page-lede" data-intro>
          {text}
        </p>
        <div className="page-hero__actions" data-intro>
          <Button to={to}>{label}</Button>
        </div>
      </section>
    </div>
  );
}
