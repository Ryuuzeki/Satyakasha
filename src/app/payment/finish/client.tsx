"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinishPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-emerald-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-teal-600/20 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="mx-auto w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Pembayaran Berhasil!
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Terima kasih. Pembayaran Anda telah kami terima. Dokumen Anda sedang
          diproses dan dicatat ke dalam jaringan Lisk Sepolia.
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Kembali ke Beranda
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
