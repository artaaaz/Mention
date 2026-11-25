// Animasi pembuka: hitungan 0 → 100 + bar progres → M pop-up → M zoom menembus layar → tirai naik.
// Tampilannya (kelas is-done / is-pop / is-zoom / is-fade) ada di src/styles/style.css.

const COUNT_MS = 2200; // lama hitungan 0 → 100 kalau halaman sudah siap
const QUICK_COUNT_MS = 900; // versi prefers-reduced-motion
const HOLD_AT = 0.9; // hitungan menahan di 90 sampai halaman benar-benar siap
const MAX_WAIT_MS = 5000; // …tapi tidak lebih lama dari ini
const EXIT_MS = 900; // harus cocok dengan transisi `.splash.is-fade`

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * @param {HTMLElement|null} el  elemen .splash
 * @param {object} [opts]
 * @param {Promise<unknown>} [opts.ready]   hitungan baru tembus 100 setelah ini selesai (maks. 5 dtk)
 * @param {() => void} [opts.onReveal]      dipanggil tepat saat splash mulai terangkat
 * @param {boolean} [opts.quick]            versi singkat (prefers-reduced-motion)
 * @returns {Promise<void>} selesai ketika splash sudah hilang dari DOM
 */
export function runSplash(el, { ready = Promise.resolve(), onReveal, quick = false } = {}) {
  return new Promise((resolve) => {
    if (!el) {
      onReveal?.();
      resolve();
      return;
    }

    const num = el.querySelector(".splash__num");
    const fill = el.querySelector(".splash__bar span");
    const timers = [];
    let raf = 0;
    let finished = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      el.classList.add("is-fade");
      onReveal?.();
      setTimeout(() => {
        el.remove();
        resolve();
      }, EXIT_MS + 50);
    };

    // setelah angka menyentuh 100
    const outro = () => {
      if (quick) {
        at(150, () => el.classList.add("is-done", "is-pop"));
        at(900, finish);
        return;
      }
      at(200, () => el.classList.add("is-done"));
      at(520, () => el.classList.add("is-pop"));
      at(1500, () => el.classList.add("is-zoom"));
      at(2260, finish);
    };

    const paint = (progress) => {
      const value = String(Math.round(progress * 100));
      if (num && num.textContent !== value) num.textContent = value;
      if (fill) fill.style.transform = `scaleX(${progress})`;
    };

    if (quick) el.classList.add("is-quick");

    let isReady = false;
    ready.catch(() => {}).then(() => (isReady = true));

    const duration = quick ? QUICK_COUNT_MS : COUNT_MS;
    // waktu mulai = frame pertama (timestamp rAF bisa lebih awal dari performance.now())
    let start = -1;
    let last = 0;
    let shown = 0;

    const tick = (now) => {
      if (start < 0) start = last = now;
      const elapsed = Math.max(0, now - start);
      const cap = isReady || elapsed > MAX_WAIT_MS ? 1 : HOLD_AT;
      const target = Math.min(easeInOut(Math.min(elapsed / duration, 1)), cap);
      // mengejar target dengan halus, tidak tergantung frame rate
      shown += (target - shown) * (1 - Math.exp(-Math.max(0, now - last) / 80));
      last = now;

      if (target === 1 && shown > 0.995) {
        paint(1);
        outro();
        return;
      }
      paint(shown);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // klik untuk lewati
    el.addEventListener("click", finish, { once: true });
  });
}
