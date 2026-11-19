// ─────────────────────────────────────────────────────────────
// DATA PROYEK — satu-satunya tempat untuk menambah / mengubah karya.
// Dipakai oleh: Beranda (karya pilihan), halaman Karya, dan detail proyek.
//
//  slug     : dipakai di URL → /projects/<slug>
//  image    : path gambar cover (mis. "/karya/kopi-senja.jpg" di folder public/).
//             Kalau kosong, dipakai pola placeholder dari `cover`.
//  cover    : pola placeholder → rings | dots | stripes | sweep | bars | arcs
//  gallery  : daftar gambar (path) atau nama pola placeholder
// ─────────────────────────────────────────────────────────────

export const projects = [
  {
    slug: "kopi-senja",
    title: "Kopi Senja",
    client: "Kopi Senja",
    year: "2026",
    category: "Branding",
    tags: ["branding", "kemasan", "sosial media"],
    image: "",
    cover: "rings",
    summary: "Identitas baru untuk kedai kopi lokal yang mau naik kelas tanpa kehilangan rasa rumahnya.",
    challenge:
      "Kopi Senja sudah punya pelanggan setia, tapi tampilannya tertinggal dari kedai-kedai baru di sekitarnya. Mereka butuh wajah baru yang tetap terasa akrab.",
    solution:
      "Kami merancang ulang logo, kemasan, dan gaya konten dengan satu benang merah: hangatnya sore hari. Semua materi dibuat dalam satu sistem supaya gampang dipakai tim internal.",
    gallery: ["bars", "arcs"],
  },
  {
    slug: "ruang-tumbuh",
    title: "Ruang Tumbuh",
    client: "Ruang Tumbuh",
    year: "2026",
    category: "Web",
    tags: ["web", "desain", "development"],
    image: "",
    cover: "dots",
    summary: "Website untuk platform belajar yang bikin pendaftaran kelas selesai dalam tiga langkah.",
    challenge:
      "Calon peserta sering berhenti di tengah pendaftaran karena alurnya panjang dan informasinya tersebar di banyak halaman.",
    solution:
      "Struktur situs kami sederhanakan, alur daftar dipangkas, dan tiap kelas dapat halaman yang menjawab pertanyaan paling sering muncul.",
    gallery: ["stripes", "rings"],
  },
  {
    slug: "langkah-fest-2026",
    title: "Langkah Fest 2026",
    client: "Langkah Fest",
    year: "2026",
    category: "Event",
    tags: ["event", "identitas", "motion"],
    image: "",
    cover: "stripes",
    summary: "Identitas visual dan motion untuk festival lari yang penuh energi dari garis start sampai finis.",
    challenge:
      "Festival butuh tampilan yang konsisten di banyak media sekaligus: panggung, jersey, sosial media, sampai layar LED.",
    solution:
      "Kami membuat sistem grafis berbasis garis gerak yang fleksibel, lengkap dengan paket motion siap pakai untuk tim acara.",
    gallery: ["sweep", "dots"],
  },
  {
    slug: "nusa-wear",
    title: "Nusa Wear",
    client: "Nusa Wear",
    year: "2025",
    category: "Campaign",
    tags: ["campaign", "foto", "video"],
    image: "",
    cover: "sweep",
    summary: "Campaign peluncuran koleksi baru lewat seri foto dan video pendek.",
    challenge:
      "Koleksi baru perlu tampil beda di tengah feed yang padat, dengan produksi yang efisien untuk banyak format.",
    solution:
      "Satu hari produksi dirancang untuk menghasilkan foto utama, video vertikal, dan potongan konten untuk empat minggu tayang.",
    gallery: ["arcs", "bars"],
  },
  {
    slug: "pijar-studio",
    title: "Pijar Studio",
    client: "Pijar Studio",
    year: "2025",
    category: "Branding",
    tags: ["identitas", "web", "konten"],
    image: "",
    cover: "bars",
    summary: "Identitas dan website untuk studio arsitektur muda yang ingin tampil lebih percaya diri.",
    challenge:
      "Portofolio mereka kuat, tapi cara menampilkannya belum mencerminkan kualitas pekerjaannya.",
    solution:
      "Kami menyusun identitas yang tenang dan tegas, lalu membangun website yang memberi ruang lapang untuk tiap proyek.",
    gallery: ["dots", "stripes"],
  },
  {
    slug: "halo-tani",
    title: "Halo Tani",
    client: "Halo Tani",
    year: "2025",
    category: "Web",
    tags: ["aplikasi", "ui/ux", "strategi"],
    image: "",
    cover: "arcs",
    summary: "Desain aplikasi yang membantu petani menjual hasil panen langsung ke pembeli.",
    challenge:
      "Pengguna utamanya belum terbiasa dengan aplikasi, jadi tiap layar harus bisa dipahami tanpa penjelasan panjang.",
    solution:
      "Antarmuka dibuat dengan teks besar, langkah pendek, dan ikon yang jelas — diuji langsung bersama calon pengguna.",
    gallery: ["rings", "sweep"],
  },
];
