# fbirthday 💙

Website kejutan ulang tahun (pastel biru) yang dibuka lewat QR berbentuk hati.

Alurnya: **amplop dibuka → surat → make a wish (tahan tombol) → tiup lilin → galeri foto → penutup**, dengan musik latar.

## 1. Personalisasi (sebelum upload)

| Yang diganti | Caranya |
|---|---|
| Nama, isi surat, teks wish, penutup | Edit `config.js` (cukup ubah teks di dalam tanda kutip) |
| Foto | Ganti `assets/photos/foto1.jpeg` … `foto4.jpeg` dengan foto kalian (nama file sama). Mau lebih/kurang? Tambah/hapus baris di bagian `foto` pada `config.js` |
| Ilustrasi latar | Ganti gambar di `assets/background/sticker-1.png` … `sticker-5.png` (PNG transparan disarankan). Ilustrasi tampil dengan transparansi 50%; love biru tetap muncul. |
| Musik | Taruh lagu dengan nama `assets/music/lagu.mp3`. Kalau tidak ada, website tetap jalan tanpa musik |

Tips: kecilkan ukuran foto (lebar ±1000px, < 400 KB) dan lagu (< 5 MB) supaya cepat dibuka di HP.

## 2. Publish gratis ke GitHub Pages

1. Login ke github.com → klik **+** (kanan atas) → **New repository**.
2. Repository name: **`tiq`**, pilih **Public**, klik **Create repository**.
3. Di halaman repo, klik **uploading an existing file**.
4. Seret **semua isi** folder ini (`index.html`, `style.css`, `script.js`, `config.js`, `qr-love.html`, folder `assets`) ke kotak upload → **Commit changes**.
   - Pastikan `index.html` ada di paling atas repo (bukan di dalam subfolder).
5. Buka **Settings → Pages**. Di *Build and deployment*: Source = **Deploy from a branch**, Branch = **main** / **(root)** → **Save**.
6. Tunggu 1–2 menit, refresh. Link-nya akan muncul:
   `https://USERNAME-KAMU.github.io/tiq/`

## 3. Buat QR love

1. Buka `https://USERNAME-KAMU.github.io/tiq/qr-love.html` (link otomatis terisi).
2. Ubah teks bawah kalau mau (default: "scan me").
3. Klik **Unduh PNG** → dapat `qr-love.png`.
4. **Tes scan pakai kamera HP sendiri** sebelum dikirim.

## Catatan

- Repo publik = isi surat & foto bisa dilihat siapa saja yang tahu link repo/website. Jangan taruh info pribadi sensitif.
- Fitur tiup lewat mikrofon butuh izin mic dari browser; kalau ditolak, lilin tetap bisa diketuk.
- Mau ubah setelah publish? Edit file langsung di GitHub (ikon pensil) → Commit; website update dalam 1–2 menit. QR tidak perlu dibuat ulang karena link-nya sama.
