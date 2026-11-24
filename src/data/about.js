// ─────────────────────────────────────────────────────────────
// DATA HALAMAN TENTANG — logo klien dan keahlian (kartu).
// ─────────────────────────────────────────────────────────────

// Logo klien. File-nya PNG transparan satu warna di public/klien/ — dipakai sebagai mask,
// jadi warnanya mengikuti warna teks. `ratio` = lebar ÷ tinggi gambar.
export const CLIENTS = [
  { name: "HIMPANA", logo: "/klien/himpana.png", ratio: 1.185 },
  { name: "UPZ Pertamina & BAZMA", logo: "/klien/upz-bazma.png", ratio: 4.891 },
  { name: "BAZMA", logo: "/klien/bazma.png", ratio: 3 },
  { name: "SMK TI BAZMA", logo: "/klien/smk-ti-bazma.png", ratio: 1.705 },
];

// Satu entri = satu kartu. `letter` tampil di pojok kartu.
export const EXPERTISE = [
  {
    letter: "S",
    title: "Strategi",
    items: ["Riset & insight", "Positioning brand", "Pesan utama", "Arah kreatif", "Perencanaan campaign"],
  },
  {
    letter: "D",
    title: "Desain",
    items: ["Logo & identitas", "Sistem visual", "Guideline brand", "Kemasan", "UI/UX"],
  },
  {
    letter: "K",
    title: "Konten",
    items: ["Perencanaan konten", "Copywriting", "Pengelolaan sosial media", "Foto & video", "Motion graphic"],
  },
  {
    letter: "W",
    title: "Web",
    items: ["Website", "Landing page", "Pengalaman interaktif", "Front-end development", "Optimasi & analitik"],
  },
];
