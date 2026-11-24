// ─────────────────────────────────────────────────────────────
// DATA REEL (Beranda) — satu entri = satu slide di bingkai video.
// Slide berganti otomatis tiap REEL_INTERVAL; jumlah entri bebas.
//
//  kicker  : keterangan kecil di atas judul
//  title   : judul slide
//
//  Isi slide — pilih salah satu:
//  youtube : ID video YouTube (bagian setelah youtu.be/ …). `start` = mulai dari detik ke berapa.
//  video   : file video mendatar, mis. "/reel/showreel.mp4" (taruh di public/reel/)
//  reels   : beberapa video tegak yang tampil berjajar dalam SATU bingkai. Tiap isinya boleh:
//              • { instagram: "KODE", poster: "/reel/KODE.jpg" }
//                KODE = bagian setelah instagram.com/reel/ …  Instagram tidak mengizinkan putar
//                otomatis, jadi yang tampil dulu poster-nya; videonya muncul setelah tombol putar.
//              • "/reel/nama.mp4" — file video sendiri (ini bisa putar otomatis tanpa suara)
//
//  poster  : gambar diam sebelum video termuat (untuk YouTube otomatis dari thumbnail-nya)
//  cover   : pola pengganti kalau belum ada video/poster → rings | dots | stripes | sweep | bars | arcs
// ─────────────────────────────────────────────────────────────

export const REEL_INTERVAL = 5000; // ms tiap slide

export const REEL = [
  {
    kicker: "SMK TI BAZMA — Video profil 2026",
    title: "Energi Masa Depan Indonesia",
    youtube: "m8Q1XqifQfw",
  },
  {
    kicker: "SMK TI BAZMA — Film pendek",
    title: "Esok: untuk mereka yang tak menyerah",
    youtube: "7ffGMNfZWVY",
  },
  {
    kicker: "Instagram — Reels",
    title: "Reels pilihan",
    reels: [
      { instagram: "DRMXFmCgspx", poster: "/reel/DRMXFmCgspx.jpg" },
      { instagram: "DMw68LIy14j", poster: "/reel/DMw68LIy14j.jpg" },
      { instagram: "DVOBoGWkoSI", poster: "/reel/DVOBoGWkoSI.jpg" },
    ],
  },
  {
    kicker: "SMK TI BAZMA — Lepas Juang Angkatan 1",
    title: "Alam Bercerita",
    youtube: "tAiDMQziZuI",
  },
  {
    kicker: "SMK TI BAZMA — Dokumenter",
    title: "Kilas Balik Perjalanan SMK TI BAZMA",
    youtube: "tM8rFu3mwCY",
  },
];
