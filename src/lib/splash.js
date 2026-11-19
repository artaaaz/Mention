// Animasi pembuka: M masuk → "ention" terbuka → loader → fade out.
// Urutan & timing mengikuti splash Mention yang asli.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {HTMLElement|null} el  elemen .splash
 * @param {object} [opts]
 * @param {Promise<unknown>} [opts.ready]   ditunggu (maks. 2,5 dtk) sebelum splash ditutup
 * @param {() => void} [opts.onReveal]      dipanggil tepat saat splash mulai memudar
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

    const timers = [];
    let finished = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      el.classList.add("is-fade");
      onReveal?.();
      setTimeout(() => {
        el.remove();
        resolve();
      }, 800);
    };

    const whenReady = () => Promise.race([ready.catch(() => {}), wait(2500)]).then(finish);

    if (quick) {
      el.classList.add("is-enter", "is-expand");
      at(1200, whenReady);
    } else {
      at(100, () => el.classList.add("is-enter"));
      at(1400, () => el.classList.add("is-expand"));
      at(2400, () => el.classList.add("is-loader"));
      at(3800, whenReady);
    }

    // klik untuk lewati
    el.addEventListener("click", finish, { once: true });
  });
}
