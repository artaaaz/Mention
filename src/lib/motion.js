// Satu pintu untuk GSAP + konstanta animasi yang dipakai di seluruh situs.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// halaman yang tidak punya elemen tertentu (mis. tanpa .hero__tag) bukan error
gsap.config({ nullTargetWarn: false });

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Efek "slide blur": elemen meluncur naik sambil berubah dari buram ke tajam.
export const BLUR_IN = { opacity: 0, filter: "blur(14px)" };
export const BLUR_OUT = { opacity: 1, filter: "blur(0px)" };

/** Lama animasi keluar halaman (harus cocok dengan transisi CSS `body.is-leaving`). */
export const LEAVE_MS = reduceMotion ? 0 : 520;

export const clearBlur = (targets) => gsap.set(targets, { clearProps: "filter,willChange" });

/** Animasi masuk standar untuk sekumpulan elemen (dipakai reveal saat scroll & filter karya). */
export function animateIn(targets) {
  gsap.to(targets, {
    ...BLUR_OUT,
    y: 0,
    duration: 1.1,
    ease: "expo.out",
    stagger: 0.09,
    overwrite: true,
    onComplete: () => gsap.set(targets, { clearProps: "transform,filter,willChange" }),
  });
}

export { gsap, ScrollTrigger };
