const CONFIG = {
  // Nama panggilan dia (muncul di banyak tempat)
  nama: "Tiqa",

  // Nama kamu (tanda tangan di akhir surat)
  dari: "Faan",

  // Umur yang dirayakan (kosongkan "" kalau tidak mau ditampilkan)
  umur: "25",

  // Teks di halaman pembuka
  pembuka: "Ada sesuatu kecil untukmu…",

  // Isi surat — tiap baris dalam [ ] adalah satu paragraf
  surat: [
    "Selamat ulang tahun, {nama}.",
    "Hari ini satu bumi merayakan hari ketika seseorang yang paling cantik lahir. Terima kasih sudah hadir, sudah sabar, dan sudah jadi alasan tersenyum di hari-hari biasa.",
    "Semoga tahun ini kamu dikelilingi hal-hal baik: kesehatan yang selalu bahiq, hati yang tenang, mimpi-mimpi yang satu per satu terwujud, dan tawa yang lebih banyak dari air mata.",
    "Kalau suatu hari kamu lelah, ingat ya, ada aku di sini yang selalu mendukungmu,di setiap versi dirimu.",
    "Yang Penting kamu harus selalu happy terus dan sehat yaah."
  ],

  // Teks di bagian make a wish
  wishJudul: "Make a wish dulu.....",
  wishPetunjuk: "Pejamkan mata, sebut harapanmu dalam hati, lalu tahan tombol di bawah sampai penuh.",
  wishSelesai: "Harapanmu sudah terkirim ke langit. Semoga semuanya terkabul Amiiin✨",

  // Galeri foto — taruh file foto di folder assets/photos/
  // lalu sesuaikan nama file & keterangannya di sini
  foto: [
    { file: "assets/photos/foto1.jpeg", caption: "Awal cerita kita" },
    { file: "assets/photos/foto2.jpeg", caption: "Hari yang selalu aku ingat" },
    { file: "assets/photos/foto3.jpeg", caption: "Senyummu yang paling aku suka" },
    { file: "assets/photos/foto4.jpeg", caption: "Dan masih banyak lagi nanti" }
  ],

  // Musik latar — taruh file mp3 di assets/music/ dengan nama ini
  // (kalau file tidak ada, website tetap jalan tanpa musik)
  musik: "assets/music/lagu.mp3",

  // Pesan penutup
  penutup: "Terima kasih sudah jadi bagian terbaik dalam hidupku. Selamat ulang tahun, {nama}.",
};
