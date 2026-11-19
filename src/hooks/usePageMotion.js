import { useEffect, useLayoutEffect, useRef } from "react";
import { useApp } from "../lib/app-context.js";
import { animateIn, BLUR_IN, BLUR_OUT, clearBlur, gsap, reduceMotion, ScrollTrigger } from "../lib/motion.js";

/**
 * Pasang semua animasi sebuah halaman berdasarkan atribut di markup:
 *
 *   data-intro-title  judul utama, muncul kata demi kata saat halaman masuk
 *   data-intro        elemen lain di hero ("stage" = panel 3D)
 *   data-split        judul section, muncul kata demi kata saat ter-scroll
 *   data-scrub        paragraf besar, kata menajam mengikuti scroll
 *   data-reveal       elemen biasa: slide + blur saat ter-scroll
 *   data-parallax     cover karya
 *   data-float        elemen melayang
 *
 * Kata-kata dibungkus oleh komponen <Words> (span.w).
 * Pakai: const scope = usePageMotion();  →  <div ref={scope}>…</div>
 */
export function usePageMotion() {
  const scope = useRef(null);
  const intro = useRef(null);
  const { ready } = useApp();

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);

      /* ── masuk halaman ── */
      const words = q("[data-intro-title] .w");
      const items = q("[data-intro]");
      const tags = q(".hero__tag");

      gsap.set(words, { ...BLUR_IN, yPercent: 70 });
      for (const el of items) {
        if (el.dataset.intro === "stage") gsap.set(el, { ...BLUR_IN, filter: "blur(24px)", scale: 0.94, y: 48 });
        else gsap.set(el, { ...BLUR_IN, y: 32 });
      }
      gsap.set(tags, { autoAlpha: 0 });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "expo.out" }, delay: 0.1 });
      timeline.to(words, {
        ...BLUR_OUT,
        yPercent: 0,
        duration: 1.3,
        stagger: 0.06,
        onComplete: () => clearBlur(words),
      });
      items.forEach((el, i) => {
        const isStage = el.dataset.intro === "stage";
        timeline.to(
          el,
          { ...BLUR_OUT, y: 0, scale: 1, duration: isStage ? 1.6 : 1.2, onComplete: () => clearBlur(el) },
          isStage ? 0.1 : 0.25 + i * 0.09,
        );
      });
      timeline.to(tags, { autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 0.9);
      intro.current = timeline;

      /* ── saat scroll ── */
      for (const el of q("[data-split]")) {
        const splitWords = el.querySelectorAll(".w");
        gsap.set(splitWords, { ...BLUR_IN, yPercent: 70 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () =>
            gsap.to(splitWords, {
              ...BLUR_OUT,
              yPercent: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.05,
              onComplete: () => clearBlur(splitWords),
            }),
        });
      }

      for (const el of q("[data-scrub]")) {
        gsap.fromTo(
          el.querySelectorAll(".w"),
          { opacity: 0.12, filter: "blur(5px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: true },
          },
        );
      }

      const reveals = q("[data-reveal]");
      if (reveals.length) {
        gsap.set(reveals, { ...BLUR_IN, y: 48 });
        ScrollTrigger.batch(reveals, { start: "top 92%", once: true, onEnter: animateIn });
      }

      for (const el of q("[data-parallax]")) {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      for (const panel of q(".panel")) {
        gsap.from(panel, {
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "top 35%", scrub: true },
        });
      }

      for (const el of q("[data-float]")) {
        gsap.to(el, { y: -18, rotation: 3, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, scope);

    return () => {
      intro.current = null;
      ctx.revert();
    };
  }, []);

  // animasi masuk baru diputar setelah splash selesai
  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return scope;
}
