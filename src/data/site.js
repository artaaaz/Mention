// ─────────────────────────────────────────────────────────────
// DATA KONTAK — dipakai di footer, halaman Kontak, dan form brief.
// Ganti semua nilai placeholder di bawah dengan data asli Mention.
// ─────────────────────────────────────────────────────────────

import { CLIENTS, EXPERTISE } from "./about.js";
import { REEL } from "./reel.js";

export const CONTACT = {
  email: "halo@mention.example", // ← ganti dengan email asli
  city: "Jakarta, Indonesia",
  hours: "Senin – Jumat, 09.00 – 18.00 WIB",
  socials: [
    { label: "Instagram", url: "" }, // ← isi URL profil; kalau kosong link-nya tidak ke mana-mana
    { label: "TikTok", url: "" },
    { label: "LinkedIn", url: "" },
  ],
};

// ─────────────────────────────────────────────────────────────
// ANGKA (Beranda) — deretan angka besar yang menghitung naik saat di-scroll.
//
//  value  : angkanya (bilangan bulat)
//  suffix : tambahan setelah angka, mis. "+" atau "K" (opsional)
//  label  : keterangan di bawah angka
//
// Sementara ini angkanya dihitung dari isi situs sendiri, supaya tidak ada klaim yang belum
// tentu benar. Ganti dengan angka asli Mention (jumlah proyek, total penonton, tahun berdiri, …):
// cukup tulis { value: 120, suffix: "+", label: "Proyek selesai" }.
// ─────────────────────────────────────────────────────────────

const reelVideos = REEL.reduce((total, slide) => total + (slide.reels ? slide.reels.length : 1), 0);

export const STATS = [
  { value: CLIENTS.length, label: "Klien yang sudah bekerja bareng kami" },
  { value: reelVideos, label: "Video & Reels di showreel kami" },
  { value: EXPERTISE.length, label: "Bidang keahlian dalam satu tim" },
];
