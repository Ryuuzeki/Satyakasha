"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnfinishPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-amber-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mx-auto w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <Clock className="w-12 h-12 text-amber-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Pembayaran Tertunda
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Anda belum menyelesaikan pembayaran atau membatalkan prosesnya. 
          Silakan coba lagi jika Anda ingin melanjutkan pendaftaran dokumen.
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
