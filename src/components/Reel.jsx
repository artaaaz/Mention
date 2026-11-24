import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { REEL, REEL_INTERVAL } from "../data/reel.js";
import { gsap, reduceMotion } from "../lib/motion.js";
import { Eyebrow, Words } from "./ui.jsx";

const STRIP = Array.from({ length: 20 });
const COVERS = ["rings", "dots", "stripes", "sweep", "bars", "arcs"];
const pad = (n) => String(n).padStart(2, "0");

/** Pita teks berjalan "▸▸▸ Play reel" di atas & bawah bingkai. */
function Strip({ reverse = false }) {
  return (
    <div className={`reel__strip ${reverse ? "reel__strip--rev" : ""}`} aria-hidden="true">
      <div className="reel__strip-track">
        {STRIP.map((_, i) => (
          <span key={i}>
            <i />
            <i />
            <i />
            Play reel
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Video YouTube sebagai isi slide. Pratinjau: otomatis, tanpa suara, tanpa kontrol, berulang.
 * Mode putar: pemutar YouTube biasa dengan suara. Thumbnail-nya jadi poster sampai video siap.
 */
function YouTube({ id, start = 0, title, active, playing }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(false), [active, playing]);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: playing ? "0" : "1",
    controls: playing ? "1" : "0",
    loop: "1",
    playlist: id, // wajib supaya loop jalan
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: playing ? "0" : "1",
    start: String(start),
  });

  return (
    <div className="reel__clip">
      <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" decoding="async" />
      {active && (
        <iframe
          key={playing ? "play" : "preview"}
          className={ready ? "is-ready" : ""}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          tabIndex={playing ? 0 : -1}
          // pemutar butuh sesaat setelah termuat sebelum gambarnya benar-benar jalan
          onLoad={() => setTimeout(() => setReady(true), 900)}
        />
      )}
    </div>
  );
}

/**
 * Satu file video. Poster / pola placeholder selalu ada; elemen <video> hanya dipasang untuk slide
 * yang sedang tampil supaya video lain tidak ikut diunduh. Pratinjau: tanpa suara & berulang.
 * Mode putar: dengan kontrol (video tegak tetap tanpa suara sampai dinyalakan sendiri).
 */
function Clip({ src, poster, cover, active, playing, vertical = false }) {
  return (
    <div className={`reel__clip ${vertical ? "reel__clip--vertical" : ""}`}>
      {poster ? <img src={poster} alt="" loading="lazy" decoding="async" /> : <div className={`cover cover--${cover}`} />}
      {src && active && (
        <video
          key={playing ? "play" : "preview"}
          src={src}
          poster={poster || undefined}
          autoPlay
          playsInline
          loop={!playing}
          muted={!playing || vertical}
          controls={playing}
        />
      )}
    </div>
  );
}

/**
 * Satu Reel Instagram. Instagram tidak punya putar otomatis untuk embed, jadi pratinjaunya
 * poster saja; di mode putar kartu embed-nya dipasang (dipotong lewat CSS supaya hanya videonya
 * yang terlihat) dan diputar dengan mengetuknya.
 */
function Insta({ code, poster, playing }) {
  return (
    <div className="reel__clip reel__clip--vertical reel__clip--insta">
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" />}
      {playing && (
        <iframe
          src={`https://www.instagram.com/reel/${code}/embed/`}
          title="Reel Instagram"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          scrolling="no"
        />
      )}
    </div>
  );
}

/** Isi satu slide mendatar: YouTube, atau file video / placeholder. */
function Media({ entry, active, playing }) {
  if (entry.youtube) {
    return <YouTube id={entry.youtube} start={entry.start} title={entry.title} active={active} playing={playing} />;
  }
  return <Clip src={entry.video} poster={entry.poster} cover={entry.cover} active={active} playing={playing} />;
}

/**
 * Bingkai reel: slide berganti sendiri tiap REEL_INTERVAL (berhenti saat di luar layar atau
 * sedang diputar); tombol di tengah memutar video slide itu dengan suara. Isinya diatur di
 * src/data/reel.js.
 *
 * Saat di-scroll: bingkai menempel kecil di kiri dulu, baru melebar ke tengah, lalu ditahan penuh
 * (tata letaknya .reel--live di pages.css; tanpa animasi kalau pengguna meminta gerak dikurangi).
 */
export default function Reel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef(null);
  const track = useRef(null);
  const frame = useRef(null);

  const item = REEL[index];
  const hasVideo = Boolean(item.youtube || item.video || item.reels?.some(Boolean));
  const paused = playing || !inView || reduceMotion || REEL.length < 2;

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;
    const el = root.current;
    const ctx = gsap.context(() => {
      const small = () => (window.innerWidth < 700 ? 0.62 : 0.5);
      // Satu timeline sepanjang bingkai menempel (tinggi .reel--live − 1 layar):
      // 0 – 0.2 ditahan kecil di kiri · 0.2 – 0.72 melebar ke tengah · sisanya ditahan penuh
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        })
        // transform-origin kiri (CSS) → tepi kirinya diam, bingkai melebar ke kanan sampai penuh
        .fromTo(frame.current, { scale: small }, { scale: 1, duration: 0.52, ease: "power2.inOut" }, 0.2)
        // teks pengantar di kanan memudar begitu bingkai mulai melebar ke arahnya
        .to(el.querySelector(".reel__intro"), { autoAlpha: 0, x: 40, duration: 0.14 }, 0.2)
        .fromTo(el.querySelectorAll(".reel__strip"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.64)
        .set({}, {}, 1);
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setIndex((value) => (value + 1) % REEL.length), REEL_INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused]);

  return (
    <section
      // reel--live = tata letak untuk animasi scroll (harus lewat React: kelas yang ditambah manual
      // akan hilang saat komponen dirender ulang)
      className={`reel ${reduceMotion ? "" : "reel--live"} ${playing ? "is-playing" : ""}`}
      ref={root}
    >
      {/* penanda section, sebelum bingkai video */}
      <div className="section-head reel__head">
        <Eyebrow data-reveal>Reel</Eyebrow>
        <h2 className="section-title" data-split>
          <Words>Cerita yang bergerak.</Words>
        </h2>
      </div>

      <div className="reel__track" ref={track}>
        <div className="reel__sticky">
          <Strip />

          <div className="reel__frame" ref={frame}>
            {REEL.map((entry, i) => (
              <div className={`reel__slide ${i === index ? "is-active" : ""}`} key={entry.title} aria-hidden={i !== index}>
                {entry.reels ? (
                  <div className="reel__stack">
                    {entry.reels.map((clip, n) =>
                      clip?.instagram ? (
                        <Insta key={n} code={clip.instagram} poster={clip.poster} playing={playing && i === index} />
                      ) : (
                        <Clip
                          key={n}
                          vertical
                          src={clip}
                          cover={COVERS[(i + n) % COVERS.length]}
                          active={i === index}
                          playing={playing}
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <Media entry={entry} active={i === index} playing={playing} />
                )}
              </div>
            ))}

            <div className="reel__shade" aria-hidden="true" />

            <div className="reel__play">
              <span aria-hidden="true">Play</span>
              <button
                type="button"
                disabled={!hasVideo}
                aria-label={hasVideo ? `Putar: ${item.title}` : "Video belum ditambahkan"}
                onClick={() => setPlaying(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </button>
              <span aria-hidden="true">Reel</span>
            </div>

            <div className="reel__caption" aria-live="polite">
              <p>{item.kicker}</p>
              <h3>{item.title}</h3>
            </div>

            {playing && (
              <button className="reel__close" type="button" onClick={() => setPlaying(false)}>
                Tutup ✕
              </button>
            )}
          </div>

          <Strip reverse />

          <div className="reel__intro">
            <p className="reel__intro-lead">
              Cerita brand paling enak ditonton, bukan dibaca. Ini sebagian video yang kami kerjakan dari konsep
              sampai final cut.
            </p>
            <p className="reel__intro-note">
              ({pad(REEL.length)} video — scroll untuk memutar)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
