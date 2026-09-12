# Frontend Analisis Sentimen Na Willa

Antarmuka React/Vite untuk unggah CSV, dashboard, visualisasi, hasil klasifikasi, unduh CSV, dan laporan PDF.

## Menjalankan

```bat
copy .env.example .env
npm install
npm run dev
```

Frontend tersedia di `http://127.0.0.1:5173`. Backend harus berjalan di `http://127.0.0.1:8000`.

Dataset CSV wajib menggunakan encoding UTF-8 dan memiliki kolom `review_text`.

Laporan PDF dibuat pada sisi frontend menggunakan jsPDF. Unduh CSV dikirim ke endpoint `POST /api/download-csv` dengan dataset sumber yang sama.
