import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import CursorBadge from "./components/CursorBadge.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { AppContext, markSceneReady, sceneReady } from "./lib/app-context.js";
import { LEAVE_MS, reduceMotion, ScrollTrigger } from "./lib/motion.js";
import { initScroll, jumpToTop, scrollToTop, startScroll, stopScroll } from "./lib/scroll.js";
import { runSplash } from "./lib/splash.js";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Project from "./pages/Project.jsx";
import Projects from "./pages/Projects.jsx";

const normalize = (path) => path.replace(/\/+$/, "") || "/";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const booted = useRef(false);
  const transitioning = useRef(false);
  const firstRender = useRef(true);

  /* ── Pertama kali dibuka: splash (sekali per sesi), lalu halaman ditampilkan ── */
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    initScroll();
    jumpToTop();
    if (normalize(window.location.pathname) !== "/") markSceneReady(); // tidak ada scene 3D yang perlu ditunggu

    const reveal = () => {
      document.body.classList.remove("is-loading");
      startScroll();
      setReady(true);
      setTimeout(() => ScrollTrigger.refresh(), 950);
    };

    const splash = document.getElementById("splash");
    if (document.documentElement.classList.contains("is-return")) {
      splash?.remove();
      requestAnimationFrame(reveal);
    } else {
      runSplash(splash, { ready: sceneReady, onReveal: reveal, quick: reduceMotion });
    }
    try {
      sessionStorage.setItem("mention:seen", "1");
    } catch {
      /* mode privat: splash tampil lagi saat reload, tidak masalah */
    }

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  /* ── Pindah halaman: konten lama meluncur naik + buram, baru kemudian rute diganti ── */
  const go = useCallback(
    (to) => {
      if (transitioning.current) return;
      const target = normalize(String(to).split(/[?#]/)[0]);
      if (target === normalize(window.location.pathname)) {
        scrollToTop();
        return;
      }
      transitioning.current = true;
      stopScroll();
      document.body.classList.add("is-leaving");
      setTimeout(() => navigate(to), LEAVE_MS);
    },
    [navigate],
  );

  /* ── Setelah rute berganti: mulai dari atas, konten baru masuk dari bawah ── */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    jumpToTop();
    if (!transitioning.current) {
      // tombol Back/Forward browser: tanpa animasi keluar
      ScrollTrigger.refresh();
      return undefined;
    }

    // Posisi awal (di bawah + buram) dipasang tanpa transisi, lalu dilepas supaya CSS
    // menganimasikannya ke posisi normal. Membaca style di tengah memaksa browser
    // "mengunci" posisi awal itu — tanpa bergantung pada requestAnimationFrame,
    // yang tidak jalan saat tab ada di latar belakang.
    const body = document.body;
    body.classList.remove("is-leaving");
    body.classList.add("is-entering");
    void getComputedStyle(document.querySelector("main")).opacity;
    body.classList.remove("is-entering");
    startScroll();
    transitioning.current = false;

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 950);
    return () => clearTimeout(refresh);
  }, [location.pathname]);

  const context = useMemo(() => ({ ready, go }), [ready, go]);

  return (
    <AppContext.Provider value={context}>
      <Header />
      <CursorBadge />

      <main id="top">
        {/* key = path → tiap halaman di-mount ulang, animasinya ikut diputar ulang */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Project />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </AppContext.Provider>
  );
}
