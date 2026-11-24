// ─────────────────────────────────────────────────────────────
// DATA PROYEK — satu-satunya tempat untuk menambah / mengubah karya.
// Dipakai oleh: Beranda (karya pilihan), halaman Karya, dan detail proyek.
//
//  slug     : dipakai di URL → /projects/<slug>
//  image    : path gambar cover (mis. "/karya/kopi-senja.jpg" di folder public/).
//             Kalau kosong, dipakai pola placeholder dari `cover`.
//  cover    : pola placeholder → rings | dots | stripes | sweep | bars | arcs
//  youtube  : ID video YouTube (bagian setelah youtu.be/ …). Videonya diputar tanpa suara saat
//             kursor di kartu, dan jadi pemutar di halaman detail proyek.
//  video    : sama seperti `youtube`, tapi file sendiri, mis. "/karya/nama.mp4"
//  challenge, solution : boleh dikosongkan — bagian itu tidak ditampilkan kalau kosong
//  gallery  : daftar gambar (path) atau nama pola placeholder
// ─────────────────────────────────────────────────────────────

export const projects = [
  // ── Karya asli (video untuk SMK TI BAZMA). Ringkasannya masih satu kalimat — lengkapi, dan
  //    tambahkan `challenge` / `solution` kalau mau halaman detailnya bercerita lebih banyak.
  {
    slug: "energi-masa-depan-indonesia",
    title: "Energi Masa Depan Indonesia",
    client: "SMK TI BAZMA",
    year: "2026",
    category: "Video",
    tags: ["video profil"],
    image: "/galeri/m8Q1XqifQfw.jpg",
    youtube: "m8Q1XqifQfw",
    summary: "Video profil SMK TI BAZMA tahun 2026.",
  },
  {
    slug: "esok",
    title: "Esok: untuk mereka yang tak menyerah",
    client: "SMK TI BAZMA",
    year: "2025",
    category: "Video",
    tags: ["film pendek"],
    image: "/galeri/7ffGMNfZWVY.jpg",
    youtube: "7ffGMNfZWVY",
    summary: "Film pendek untuk SMK TI BAZMA.",
  },
  {
    slug: "alam-bercerita",
    title: "Alam Bercerita",
    client: "SMK TI BAZMA",
    year: "2025",
    category: "Video",
    tags: ["video acara"],
    image: "/galeri/tAiDMQziZuI.jpg",
    youtube: "tAiDMQziZuI",
    summary: "Video Lepas Juang Angkatan 1 SMK TI BAZMA.",
  },
  {
    slug: "kilas-balik-smk-ti-bazma",
    title: "Kilas Balik Perjalanan SMK TI BAZMA",
    client: "SMK TI BAZMA",
    year: "2025",
    category: "Video",
    tags: ["dokumenter"],
    image: "/galeri/tM8rFu3mwCY.jpg",
    youtube: "tM8rFu3mwCY",
    summary: "Dokumenter perjalanan SMK TI BAZMA.",
  },

  // ── Contoh (placeholder) — ganti dengan karya asli atau hapus
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
