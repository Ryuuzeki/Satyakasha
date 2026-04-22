import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { liskSepolia } from 'wagmi/chains';
import { createStorage } from 'wagmi';

// Storage wrapper untuk mencegah aplikasi crash saat diakses melalui HP/IP lokal
// di mana browser memblokir secara agresif akses `localStorage`.
const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
};

export const config = getDefaultConfig({
  appName: 'Satyakasha',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '8e4045f8f8ed36b69038d10787a93549', // Placeholder public key for demo
  chains: [liskSepolia],
  ssr: true,
  storage: createStorage({ storage: safeStorage }),
});
