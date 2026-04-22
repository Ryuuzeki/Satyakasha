import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-900" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-slate-700">
              Satyakasha
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </div>
    </nav>
  );
}
