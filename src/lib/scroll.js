// Smooth scroll (Lenis) sebagai singleton: dibuat sekali, dipakai semua halaman.

import Lenis from "lenis";
import { gsap, reduceMotion, ScrollTrigger } from "./motion.js";

let lenis = null;

export function initScroll() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (lenis || reduceMotion) return;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

export const startScroll = () => lenis?.start();
export const stopScroll = () => lenis?.stop();

/** Langsung ke paling atas tanpa animasi (dipakai saat pindah halaman). */
export function jumpToTop() {
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true, force: true });
}

/** Scroll halus ke atas (tombol "Kembali ke atas"). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0 });
}

/** Scroll halus ke dasar halaman (pil "Terus scroll" di CTA). */
export function scrollToBottom() {
  const bottom = document.documentElement.scrollHeight;
  if (lenis) lenis.scrollTo(bottom, { duration: 1.6 });
  else window.scrollTo({ top: bottom });
}
