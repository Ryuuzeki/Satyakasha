'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  FileCheck2, 
  Cpu, 
  Award, 
  Check, 
  Building2, 
  Globe2, 
  Zap, 
  Mail, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';
import { AnimatedTransitionLink } from '@/components/ui/AnimatedTransitionLink';

export function Hero() {
  return (
    <div className="relative bg-slate-50 flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-[140px] pb-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-6"
            >
              <img 
                src="/logo-icon.png" 
                alt="Satyakasha Gunungan" 
                className="h-28 w-auto filter drop-shadow-[0_10px_30px_rgba(217,119,6,0.25)]" 
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6"
            >
              Verifikasi Dokumen <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700">Anti-Manipulasi</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 mb-10"
            >
              Satyakasha memastikan keaslian <b>Dokumen Keuangan</b> secara permanen. Pilih portal sesuai dengan peran Anda di bawah ini:
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto"
            >
              <AnimatedTransitionLink
                href="/verify-public"
                className="flex-1 flex flex-col items-center justify-center p-6 bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-slate-900 rounded-2xl transition-all shadow-sm hover:shadow-md group cursor-pointer"
              >
                <FileCheck2 className="w-8 h-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg">Cek Keaslian Dokumen</span>
                <span className="text-sm text-slate-500 mt-1">Gratis, Tanpa Login (Untuk Publik)</span>
              </AnimatedTransitionLink>

              <AnimatedTransitionLink
                href="/login"
                className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 rounded-2xl transition-all shadow-lg shadow-slate-900/20 group cursor-pointer"
              >
                <Award className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg">Portal Audit Finansial</span>
                <span className="text-sm text-slate-300 mt-1">Penerbitan via Lisk L2 (KAP / Bank)</span>
              </AnimatedTransitionLink>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Deepfake Detection</h3>
              <p className="text-slate-500 text-sm">Analisis anomali level piksel untuk memastikan tidak ada manipulasi biometrik atau dokumen buatan AI.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Immutable Storage</h3>
              <p className="text-slate-500 text-sm">Data diamankan menggunakan IPFS yang didistribusikan secara terdesentralisasi, tidak dapat diubah pihak manapun.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lisk L2 Blockchain</h3>
              <p className="text-slate-500 text-sm">Validasi akhir direkam di jaringan Lisk menghasilkan stempel waktu permanen dengan biaya rendah.</p>
            </div>
          </motion.div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Tentang Satyakasha</p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                Menghapus Keraguan Finansial Dengan Keamanan Blockchain
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Satyakasha lahir dari kebutuhan akan transparansi dan keabsahan dokumen keuangan di era digital. Pemalsuan dokumen, manipulasi data bank, dan rekayasa laporan keuangan menjadi ancaman besar bagi integritas korporasi.
                </p>
                <p>
                  Dengan menggabungkan kecerdasan buatan (AI) untuk mendeteksi manipulasi piksel, IPFS untuk penyimpanan berkas terdistribusi, serta Lisk Layer 2 Blockchain untuk stempel waktu permanen (timestamping), Satyakasha menyediakan jangkar kepercayaan digital yang tidak dapat diubah oleh siapa pun.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">100%</h4>
                  <p className="text-sm text-slate-500">Bebas Manipulasi</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">&lt; 2 Detik</h4>
                  <p className="text-sm text-slate-500">Waktu Verifikasi</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-3xl transform rotate-3 scale-105 pointer-events-none" />
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl max-w-md w-full relative z-10 border border-slate-800">
                <h3 className="font-bold text-lg text-amber-400 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Arsitektur Keamanan
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <h5 className="font-semibold text-sm">Hasing Dokumen Lokal</h5>
                      <p className="text-xs text-slate-400 mt-1">Dokumen dihitung sidik jarinya secara lokal di peramban pengguna untuk menjaga kerahasiaan isi.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <h5 className="font-semibold text-sm">Penyimpanan Terdesentralisasi</h5>
                      <p className="text-xs text-slate-400 mt-1">Laporan keuangan tersimpan di IPFS, didistribusikan ke ribuan node tanpa satu entitas pengendali tunggal.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <h5 className="font-semibold text-sm">Stempel Lisk L2 Blockchain</h5>
                      <p className="text-xs text-slate-400 mt-1">Stempel waktu permanen diukir pada Lisk L2, memberikan bukti audit hukum yang sah.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Program Kemitraan</p>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Kolaborasi Ekosistem Satyakasha
            </h2>
            <p className="text-slate-500 mt-4">
              Kami bekerja bersama institusi keuangan terkemuka dan pengembang teknologi untuk menegakkan keaslian informasi digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Integrasi KAP</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kantor Akuntan Publik dapat menerbitkan opini audit yang secara otomatis memiliki sidik jari kriptografi di blockchain.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Sektor Perbankan</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Verifikasi instan untuk Jaminan Bank (Bank Guarantee) dan SKBDN guna mencegah manipulasi dokumen pembiayaan dagang.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Web3 Dev Grants</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Dukungan teknis dan pendanaan bagi pengembang yang mengintegrasikan SDK Satyakasha ke dalam sistem ERP perusahaan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Aliansi Kepatuhan</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kerjasama regulasi untuk memastikan implementasi stempel waktu blockchain diakui secara sah oleh otoritas hukum keuangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Harga Layanan</p>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Paket Fleksibel Sesuai Kebutuhan Anda
            </h2>
            <p className="text-slate-500 mt-4">
              Mulai secara gratis atau tingkatkan layanan untuk kuota lebih besar dan dukungan teknis khusus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal untuk simulasi dan audit skala kecil</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">Rp 0</span>
                  <span className="text-sm text-slate-500 ml-1">/ selamanya</span>
                </div>
                <ul className="mt-6 space-y-3.5">
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    10 Kuota Dokumen / bulan
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Penyimpanan IPFS Standar
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Validasi Lisk Sepolia L2
                  </li>
                </ul>
              </div>
              <AnimatedTransitionLink
                href="/login"
                className="mt-8 block w-full text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all text-sm cursor-pointer"
              >
                Mulai Gratis
              </AnimatedTransitionLink>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl border-2 border-amber-500 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2">
              <span className="absolute top-0 right-8 -translate-y-1/2 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Paling Populer
              </span>
              <div>
                <h3 className="text-lg font-bold text-amber-400">Pro</h3>
                <p className="text-xs text-slate-400 mt-1">Dirancang untuk Kantor Akuntan & Lembaga Keuangan</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">Rp 0</span>
                  <span className="text-sm text-slate-400 ml-1">/ selama beta</span>
                </div>
                <ul className="mt-6 space-y-3.5">
                  <li className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    150 Kuota Dokumen / bulan
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Penyimpanan IPFS Terprioritas
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Deteksi AI Piksel Deepfake
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Notifikasi Pembayaran Midtrans
                  </li>
                </ul>
              </div>
              <AnimatedTransitionLink
                href="/login"
                className="mt-8 block w-full text-center py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all text-sm cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Langganan Pro
              </AnimatedTransitionLink>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">Untuk integrasi sistem terpusat berskala besar</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">Hubungi</span>
                  <span className="text-sm text-slate-500 ml-1"> sales</span>
                </div>
                <ul className="mt-6 space-y-3.5">
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Kuota Dokumen Tanpa Batas
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Dukungan Node Relayer Dedicated
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Akses Penuh API Integration
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    SLA Ketersediaan 99.9%
                  </li>
                </ul>
              </div>
              <a 
                href="#contact"
                className="mt-8 block w-full text-center py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Business Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Kerjasama Bisnis</p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                Siap Melindungi Integritas Dokumen Anda?
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Kami siap membantu Anda mengintegrasikan teknologi verifikasi terdesentralisasi ke dalam alur kerja perusahaan Anda. Hubungi kami untuk penawaran kustom, demo langsung, atau pertanyaan kemitraan strategis.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600 border border-slate-100 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Kirim Surel</p>
                    <a href="mailto:partnership@satyakasha.id" className="text-slate-900 font-semibold hover:text-amber-600 transition-colors">
                      partnership@satyakasha.id
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600 border border-slate-100 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Hubungi Telpon</p>
                    <span className="text-slate-900 font-semibold">+62 21-555-8932</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600 border border-slate-100 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Kantor Pusat</p>
                    <span className="text-slate-900 font-semibold">-</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-900/5">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Kirim Pesan Kemitraan</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda telah dikirim! Tim sales kami akan segera menghubungi Anda.'); }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nama Perusahaan / Lembaga</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: PT Bank Central Asia Tbk" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Bisnis</label>
                  <input 
                    type="email" 
                    placeholder="Contoh: perkasa@perusahaan.com" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pesan Kerjasama</label>
                  <textarea 
                    rows={4}
                    placeholder="Jelaskan kebutuhan integrasi Anda..." 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-600/10 active:scale-[0.98] text-sm cursor-pointer"
                >
                  Kirim Pengajuan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 border-t border-slate-800 text-center text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>@Satyakasha</p>
        </div>
      </footer>
    </div>
  );
}
