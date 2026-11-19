import { useEffect, useRef } from "react";
import { canHover, gsap, reduceMotion } from "../lib/motion.js";

/** Lencana "Lihat" yang mengikuti kursor saat berada di atas kartu karya. */
export default function CursorBadge() {
  const ref = useRef(null);

  useEffect(() => {
    const badge = ref.current;
    if (!badge || !canHover || reduceMotion) return undefined;

    const xTo = gsap.quickTo(badge, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(badge, "y", { duration: 0.45, ease: "power3.out" });
    const hide = () => badge.classList.remove("is-visible");
    const onMove = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      const overCard = Boolean(event.target.closest?.(".work-card__media"));
      const leaving = document.body.classList.contains("is-leaving");
      badge.classList.toggle("is-visible", overCard && !leaving);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", hide, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("click", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", hide);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("click", hide);
    };
  }, []);

  return (
    <div className="cursor-badge" ref={ref} aria-hidden="true">
      <span>Lihat</span>
    </div>
  );
}
