import { useEffect, useRef, useState } from "react";
import { markSceneReady, useApp } from "../lib/app-context.js";
import { reduceMotion } from "../lib/motion.js";

/**
 * Panel 3D di hero beranda. three.js dimuat terpisah (lazy) supaya halaman lain tetap ringan.
 * Logika scene ada di src/three/hero-scene.js.
 */
export default function HeroScene() {
  const { ready } = useApp();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [created, setCreated] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    let cancelled = false;
    let scene = null;
    let observer = null;

    const isOnScreen = () => {
      const rect = stage.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const onVisibility = () => scene?.setActive(!document.hidden && isOnScreen());

    import("../three/hero-scene.js")
      .then(({ createHeroScene }) => {
        if (cancelled) return;
        scene = createHeroScene(canvasRef.current, stage, { reduceMotion });
        sceneRef.current = scene;
        // berhenti me-render saat panel tidak terlihat
        observer = new IntersectionObserver(
          ([entry]) => scene.setActive(entry.isIntersecting && !document.hidden),
          { rootMargin: "80px" },
        );
        observer.observe(stage);
        document.addEventListener("visibilitychange", onVisibility);
        setCreated(true);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn("Scene 3D tidak bisa dimuat, pakai tampilan cadangan.", error);
        setFailed(true);
      })
      .finally(markSceneReady);

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // benda-benda baru beterbangan masuk setelah splash selesai
  useEffect(() => {
    if (ready && created) sceneRef.current?.intro();
  }, [ready, created]);

  return (
    <div className={`hero__stage ${failed ? "no-webgl" : ""}`} ref={stageRef} data-intro="stage">
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__fallback" aria-hidden="true">
        <span className="logo-mark" />
      </div>
      <span className="hero__tag hero__tag--tl">Mention&nbsp;Studio</span>
      <span className="hero__tag hero__tag--tr">©2026</span>
      <span className="hero__tag hero__tag--bl">Gerakkan kursor — semuanya ikut bereaksi</span>
    </div>
  );
}
