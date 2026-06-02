'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Hardcoded MVP Access Codes (Financial Context)
const VALID_INSTITUTIONS: Record<string, string> = {
  'BANK-2026': 'Bank Central Asia',
  'AUDIT-2026': 'KAP PricewaterhouseCoopers',
  'CORP-2026': 'PT Telkom Indonesia'
};

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
      });

      if (res.ok) {
        // Login berhasil, cookie terset otomatis oleh server (HttpOnly)
        // Kita juga bisa menghapus sisa-sisa localStorage MVP sebelumnya demi keamanan
        localStorage.removeItem('institutionName');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Kode Akses tidak valid.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server saat login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-full.png" alt="Satyakasha Logo" className="h-24 w-auto mb-2" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Portal Audit Finansial</h1>
        <p className="text-slate-500 text-center mb-8">
          Masukkan kode akses Otoritas Anda untuk mulai memverifikasi dokumen keuangan.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kode Akses Rahasia
            </label>
            <input 
              type="password" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Contoh: BANK-2026"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center tracking-widest uppercase"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            Masuk ke Brankas Audit
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Demo Kode Rahasia: <b>BANK-2026</b></p>
        </div>
      </motion.div>
    </div>
  );
}
