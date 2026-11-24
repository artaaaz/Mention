import { lazy, Suspense } from "react";
import { GALLERY } from "../data/gallery.js";
import { Eyebrow, Words } from "./ui.jsx";

// Carousel WebGL dari React Bits (reactbits.dev → FlexCarousel), dimuat terpisah bersama `ogl`.
const FlexCarousel = lazy(() => import("./FlexCarousel/FlexCarousel.jsx"));

/**
 * Galeri (Beranda): deretan gambar tanpa ujung yang melengkung di tepi layar. Digeser dengan
 * drag / geser jari / scroll menyamping (tidak maju sendiri); klik gambar untuk memperbesarnya. Isinya diatur di
 * src/data/gallery.js.
 */
export default function Gallery() {
  return (
    <section className="gallery">
      <div className="section-head gallery__head">
        <Eyebrow data-reveal>Galeri</Eyebrow>
        <h2 className="section-title" data-split>
          <Words>Sekilas dari layar kami.</Words>
        </h2>
      </div>

      <div className="gallery__stage" data-reveal>
        <Suspense fallback={null}>
          {/* captureWheel mati: scroll ke bawah tetap menggulir halaman, bukan carousel-nya.
              Tanpa autoplay: dengan autoplay komponen ini menggambar ulang tiap frame walau diam;
              tanpa itu ia hanya menggambar saat digeser. */}
          <FlexCarousel items={GALLERY} captureWheel={false} radius={14} gap={16} />
        </Suspense>
      </div>
    </section>
  );
}
