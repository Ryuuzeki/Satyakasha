# Satyakasha - Financial Document Verification Platform

Satyakasha adalah platform Web2.5 (B2B2C) ber-arsitektur **Dual Portals** untuk mengamankan keaslian **Dokumen Keuangan** (seperti *Invoice*, Laporan Audit, Rekening Koran, atau Bukti Potong Pajak) agar terhindar dari pemalsuan finansial (*fraud*). 

Platform ini memadukan **AI Deepfake/Fraud Detection** untuk otentikasi gambar dan **Lisk L2 Blockchain** untuk mencatat jejak audit abadi (*Immutable Audit Trail*). Semua dibungkus dengan postur **Bank-Level Security**.

---

## 🏗️ Arsitektur & Tech Stack

Sistem Satyakasha dibangun menggunakan arsitektur *Microservices* yang modular, menggabungkan kelincahan Web2 dengan keamanan finansial tingkat institusi dari Web3.

### 1. Dual Portals Frontend: **Next.js 15 (App Router) + React 19**
* **Fungsi**: Bertindak sebagai *User Interface* ganda: Portal Pengecekan Publik (`/verify-public`) dan Brankas Audit Institusi (`/dashboard`). Next.js juga bertindak sebagai orkestrator Orkestrator API (API Routes).
* **Alasan Pemakaian**: Mampu memproses *upload* dokumen keuangan dengan aman, mensimulasikan *Edge Middleware* untuk proteksi rute, dan mengeksekusi *Server Actions*.

### 2. Styling & Animasi: **Tailwind CSS + Framer Motion**
* **Fungsi**: Membentuk antarmuka *dashboard* keuangan yang modern, bersih, profesional, dan responsif.
* **Alasan Pemakaian**: Mempercepat standar pengembangan UI FinTech. *Framer-motion* memberikan transisi visual yang meningkatkan *trust* (kepercayaan) saat proses *loading* validasi dokumen.

### 3. Payment Gateway: **Midtrans (Snap API)**
* **Fungsi**: Menerima ongkos pencatatan dokumen (Pembayaran Fiat/Rupiah) dari batas institusi (via Virtual Account, GoPay) untuk mendanai pelunasan *Gas Fee* Lisk Blockchain.
* **Alasan Pemakaian**: Kunci utama infrastruktur **Web2.5**. KAP atau Bank tidak perlu dibekali *MetaMask* atau diwajibkan beli saldo Kripto, cukup bayar menggunakan mata uang nasional.

### 4. Blockchain SDK & Relayer: **Viem + Lisk Sepolia (L2)**
* **Fungsi**: Mencatat sidik jari (Hash) dokumen ke rantai blok (*ledger*) Lisk.
* **Alasan Pemakaian**: `Viem` sangat ringan. Jaringan Lisk L2 (Ethereum Rollup) menjamin finalitas audit kelas militer (*Ethereum Security*) namun dengan tarif *gas* nyaris nol. *Relayer Wallet Server* menyembunyikan interaksi kripto ini sepenuhnya dari pengguna bisnis.

### 5. AI Microservice: **FastAPI (Python) + EasyOCR + ImageHash**
* **Fungsi**: Layanan inspektur forensik dokumen. Mengekstraksi angka (Nominal *Invoice*) dan mendeteksi apakah mutasi rekening koran telah dimanipulasi (*Photoshop*) atau duplikat dari laporan terdahulu.
* **Alasan Pemakaian**: C/Python adalah "Raja" dalam algoritma *Data Science*. Terpisah dari Node.js untuk menghindari *bottleneck* server.

### 6. Decentralized Storage (E2EE): **IPFS (Pinata) + AES-256**
* **Fungsi**: Arsip dokumen keuangan tahan sensor.
* **Bank-Level Security**: File Klien tidak pernah diunggah mentah-mentah (*plaintext*) ke jaringan publik IPFS. File disandikan dengan **Kriptografi Militer AES-256** di server Next.js sebelum dilempar ke Pinata. Jika bocor, *hacker* hanya melihat berkas rusak (Binary tak terbaca).

### 7. Auth & Enterprise Security Headers
* **HttpOnly JWT Cookies**: Sesi pengguna ("Bank BCA") dijamin oleh token keamanan tinggi (*HttpOnly, Secure, SameSite=Strict*) dan diblokir menggunakan Next.js `middleware.ts`, menjamin **0% celah pertahanan Cross-Site Scripting (XSS)**.
* **Advanced Headers**: `next.config.ts` menolak keras kerentanan *Clickjacking* via `X-Frame-Options` dan memaksakan *HSTS* / *Content-Security-Policy (CSP)*.

---

## 🔄 Workflow Sistem: Dual Portals

Satyakasha membagi pergerakan penggunanya ke dalam dua gerbang berbeda.

### A. Portal Pengecekan Keaslian Publik (`/verify-public`)
Berfungsi untuk Publik, Pelamar Kerja, Investor, atau HRD yang hanya ingin mengecek apakah sebuah dokumen Valid tanpa mengubah sistem.
1. **Anonim & Transparan**: Pengguna cukup *Drag & Drop* file.
2. **Server-Side Hashing**: Aplikasi akan menghitung sidik jari `SHA-256` di server lokal *Memory*.
3. **Direct On-Chain Verification**: Modul *Viem* menembak fungsi `documents(hash)` pada *Smart Contract* Lisk. Jika data ditemukan, sistem mengeluarkan Tanda Valid (Hijau) beserta rincian Entitas Penerbit dan Cap Waktu.

### B. Portal Institusi Finansial (`/dashboard`)
Hanya KAP atau Bank terdaftar yang diizinkan merilis klaim ke *Blockchain*, bukan sembarang orang.
1. **Gatekeeping Berlapis**: Teller bank wajib masuk via `/login` dengan kode rahasia yang segera dikunci kuat oleh *HttpOnly Cookie*.
2. **AI Verification**: Dokumen nasabah diinspeksi oleh radar *FastAPI* untuk menjegal *Deepfake* finansial.
3. **AES-256 Injection**: Dokumen sah akan dihancurkan visibilitasnya (*Encrypted*) lalu dilempar permanen ke IPFS.
4. **Fiat Settlement**: Teller membayar tagihan Rupiah lewat *Popup Midtrans Snap*.
5. **Relayer Execution**: Mesin *Webhook* bangkit dan memerintahkan dompet bot (Relayer) untuk memahat nama Bank, Nama Klien, dan *Hash* Dokumen ke dalam monumen abadi **Lisk Sepolia Testnet**.

---

*Terus di-Update secara konsisten sesuai filosofi Agile Documentation.*
