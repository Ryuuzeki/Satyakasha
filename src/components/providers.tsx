'use client';

import * as React from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [hasStorageAccess, setHasStorageAccess] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    // Kita melakukan pre-flight check apakah browser mengizinkan akses localStorage.
    // Jika tidak, kita tangkap errornya tanpa memanggil RainbowKit sama sekali.
    try {
      window.localStorage.getItem('test-access');
    } catch (e) {
      setHasStorageAccess(false);
    }
  }, []);

  if (!mounted) {
    return null; 
  }

  if (!hasStorageAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="bg-white border border-red-200 text-slate-800 shadow-xl p-8 rounded-2xl max-w-md">
          <div className="text-red-500 text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-4">Akses Penyimpanan Web3 Diblokir</h2>
          <p className="text-sm text-slate-600 mb-6">
            Browser Anda memblokir Akses Memori (<i>localStorage</i>), sehingga komponen Dompet Kripto (RainbowKit) akan mengalami <i>Crash</i> jika dilanjutkan. Ini sangat umum terjadi saat mengakses alamat IP mentah (192.168.x.x) secara Cross-Origin tanpa enkripsi HTTPS di browser modern.
          </p>
          <div className="bg-slate-100 p-4 rounded-xl text-left text-sm space-y-2">
            <p className="font-semibold text-slate-700">Tindakan untuk MVP Anda:</p>
            <ul className="list-disc list-inside text-slate-600">
              <li>Akses via <b>http://localhost:3000</b> langsung di mesin pengembangan Anda.</li>
              <li>Gunakan layanan seperti <b>Ngrok</b> (contoh: <code>ngrok http 3000</code>) untuk memperoleh tautan simulasi HTTPS agar browser mengizinkan memori saat Anda menggunakan HP eksternal.</li>
              <li>Turunkan pengaturan privasi agresif <i>(Turn off Shield / Allow Cross-Site Cookies)</i> sementara pada peramban Anda.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
           accentColor: '#1e3a8a', // Navy Blue
           accentColorForeground: 'white',
           borderRadius: 'medium',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
