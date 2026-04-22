"use client";

import { motion } from "framer-motion";
import { XCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            ease: "easeInOut"
          }}
          className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <XCircle className="w-12 h-12 text-red-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Pembayaran Gagal
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Maaf, terjadi kesalahan saat memproses pembayaran Anda. Transaksi telah 
          dibatalkan atau ditolak oleh pihak bank.
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/25 transition-all"
          >
            <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
            Coba Lagi
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
