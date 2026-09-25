<img width="1553" height="791" alt="WhatsApp Image 2026-09-25 at 09 46 11" src="https://github.com/user-attachments/assets/6954c562-2e5c-4917-8b0a-b70a109aeaa4" />
<img width="1600" height="749" alt="WhatsApp Image 2026-09-25 at 09 46 34" src="https://github.com/user-attachments/assets/0d97bd56-0855-41ae-9d53-3687c514c50e" />
<img width="1600" height="730" alt="WhatsApp Image 2026-09-25 at 09 47 59" src="https://github.com/user-attachments/assets/20bab217-aacc-4fe0-b3ae-a9953faaad40" />
<img width="1600" height="736" alt="WhatsApp Image 2026-09-25 at 09 47 59 (1)" src="https://github.com/user-attachments/assets/809829a1-094c-4547-a027-bbf8e3c628c7" />
<img width="1600" height="816" alt="WhatsApp Image 2026-09-25 at 09 48 35" src="https://github.com/user-attachments/assets/8d9f82b6-026a-493a-af8f-1db16a7904ea" />
<img width="1600" height="1000" alt="WhatsApp Image 2026-09-25 at 09 45 11" src="https://github.com/user-attachments/assets/f7d98b3c-3de7-4428-84ac-7215f83c026c" />

# KeuanganKu

Aplikasi web Expense Tracker yang memungkinkan mahasiswa mengelola keuangan pribadinya secara sederhana. Pengguna dapat membuat akun, masuk ke aplikasi, mencatat pemasukan dan pengeluaran, melihat riwayat transaksi, serta mengetahui kondisi keuangannya melalui informasi saldo, total pemasukan, dan total pengeluaran. Setiap pengguna hanya dapat mengakses dan mengelola data transaksi miliknya sendiri.

## User Story

Sebagai mahasiswa, saya ingin mencatat dan mengelola keuangan pribadi saya melalui aplikasi web yang sederhana, sehingga saya dapat mengetahui kondisi keuangan saya (saldo, pemasukan, dan pengeluaran) kapan saja tanpa perlu mencatat manual.

## Daftar SRS

| Kode   | Deskripsi | Acceptance Criteria | PIC |
|--------|-----------|----------------------|-----|
| SRS-01 | Autentikasi & Session Management, register, login, session, dan cookie preferensi. | - Pengguna dapat mendaftar menggunakan nama, email, dan password<br>- Password disimpan dalam bentuk hash, bukan plaintext<br>- Pengguna dapat masuk menggunakan email & password yang terdaftar<br>- Session tetap aktif selama masih berlaku, tanpa perlu login ulang<br>- Halaman yang membutuhkan autentikasi tidak bisa diakses tanpa login (redirect ke halaman login)<br>- Logout mengakhiri session dan memutus akses ke halaman yang butuh autentikasi<br>- Minimal satu preferensi pengguna disimpan menggunakan cookie | Syifa Aeni Mudrikah |
| SRS-02 | Dashboard & Financial Overview, ringkasan keuangan pengguna. | - Dashboard menampilkan nama pengguna yang sedang login<br>- Dashboard menampilkan saldo (total pemasukan − total pengeluaran)<br>- Dashboard menampilkan total pemasukan dan total pengeluaran<br>- Dashboard menampilkan daftar transaksi terbaru<br>- Seluruh data yang ditampilkan hanya dihitung dari transaksi milik pengguna yang sedang login | Elza Khoirisma Carrynda |
| SRS-03 | Transaction Management, CRUD transaksi, filter, dan otorisasi kepemilikan data. | - Pengguna dapat menambahkan transaksi pemasukan atau pengeluaran<br>- Pengguna dapat mengubah dan menghapus transaksi miliknya sendiri<br>- Permintaan ubah/hapus terhadap transaksi milik pengguna lain ditolak oleh server<br>- Pengguna dapat melihat riwayat seluruh transaksinya<br>- Riwayat transaksi dapat difilter berdasarkan jenis (pemasukan/pengeluaran)<br>- Hanya menampilkan transaksi milik pengguna yang sedang login | Revalina Salwa Aliya Wicaksono Prabowo |

## Rincian User Story

| Kode  | User Story | SRS |
|-------|------------|-----|
| US-01 | Sebagai pengguna, saya ingin mendaftar menggunakan nama, email & password, serta masuk menggunakan email & password, sehingga saya bisa mengakses aplikasi. | SRS-01 |
| US-02 | Sebagai pengguna, saya ingin session saya bertahan selama masih berlaku dan halaman tertentu terproteksi, sehingga saya tidak perlu login ulang tapi data saya tetap aman. | SRS-01 |
| US-03 | Sebagai pengguna, saya ingin logout dan aplikasi mengingat satu preferensi saya lewat cookie, sehingga sesi saya berakhir dengan aman dan pengalaman saya tetap personal. | SRS-01 |
| US-04 | Sebagai pengguna, saya ingin melihat ringkasan keuangan saya di dashboard (nama, saldo, total pemasukan, total pengeluaran, transaksi terbaru), sehingga saya bisa langsung tahu kondisi keuangan saya begitu masuk aplikasi. | SRS-02 |
| US-05 | Sebagai pengguna, saya ingin menambahkan transaksi pemasukan atau pengeluaran, sehingga saya bisa mencatat aktivitas keuangan saya. | SRS-03 |
| US-06 | Sebagai pengguna, saya ingin mengubah dan menghapus transaksi milik saya, sehingga saya bisa memperbaiki atau membuang catatan yang salah. | SRS-03 |
| US-07 | Sebagai pengguna, saya ingin melihat riwayat transaksi saya dan memfilternya berdasarkan jenis, sehingga saya bisa menelusuri histori keuangan sesuai kebutuhan. | SRS-03 |

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS

## Menjalankan Proyek

```bash
# Clone repository
git clone https://github.com/dndxray/keuanganku.git
cd keuanganku

# Install dependencies
npm install

# Konfigurasi environment
# Buat file .env di root project, isi dengan:
# DATABASE_URL="postgresql://user:password@localhost:5432/nama_database"

# Jalankan migration database
npx prisma migrate dev

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Anggota Kelompok

| Nama | SRS | User Story |
|------|-----|------------|
| Syifa Aeni Mudrikah | SRS-01 | US-01, US-02, US-03 |
| Elza Khoirisma Carrynda| SRS-02 | US-04 |
| Revalina Salwa Aliya Wicaksono Prabowo | SRS-03 | US-05, US-06, US-07 |
