'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, FileCheck2, Cpu } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-50 pt-[120px] pb-[100px] flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6"
          >
            Verifikasi Dokumen <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">Anti-Manipulasi</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 mb-10"
          >
            Satyakasha memastikan keaslian **Dokumen Keuangan** secara permanen. Pilih portal sesuai dengan peran Anda di bawah ini:
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto"
          >
            <Link 
              href="/verify-public"
              className="flex-1 flex flex-col items-center justify-center p-6 bg-white border-2 border-green-500 hover:bg-green-50 text-slate-900 rounded-2xl transition-all shadow-sm hover:shadow-md group"
            >
              <FileCheck2 className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Cek Keaslian Dokumen</span>
              <span className="text-sm text-slate-500 mt-1">Gratis, Tanpa Login (Untuk Publik)</span>
            </Link>

            <Link 
              href="/login"
              className="flex-1 flex flex-col items-center justify-center p-6 bg-blue-900 hover:bg-blue-800 text-white border-2 border-blue-900 rounded-2xl transition-all shadow-lg shadow-blue-900/20 group"
            >
              <Shield className="w-8 h-8 text-blue-200 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Portal Audit Finansial</span>
              <span className="text-sm text-blue-200 mt-1">Penerbitan via Lisk L2 (KAP / Bank)</span>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Deepfake Detection</h3>
            <p className="text-slate-500 text-sm">Analisis anomali level piksel untuk memastikan tidak ada manipulasi biometrik atau dokumen buatan AI.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Immutable Storage</h3>
            <p className="text-slate-500 text-sm">Data diamankan menggunakan IPFS yang didistribusikan secara terdesentralisasi, tidak dapat diubah pihak manapun.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Lisk L2 Blockchain</h3>
            <p className="text-slate-500 text-sm">Validasi akhir direkam di jaringan Lisk menghasilkan stempel waktu permanen dengan biaya rendah.</p>
          </div>
        </motion.div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
