'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => {
        if (data.institutionName) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/logo-icon.png" alt="Satyakasha Icon" className="h-9 w-auto" />
            <img src="/logo-text.png" alt="Satyakasha" className="h-[18px] w-auto hidden sm:block" />
          </Link>

          {/* Desktop Menu Bar */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#about" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
              About
            </Link>
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
              Profile
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
              Pricing
            </Link>
            <Link href="/#program" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
              Program
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
              Contact & Business
            </Link>
          </div>

          {/* Desktop Actions / Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/';
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl transition-all shadow-md shadow-amber-600/10 active:scale-[0.98]"
                >
                  Register & Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md py-4 px-6 space-y-4 shadow-inner">
          <div className="flex flex-col gap-3">
            <Link 
              href="/#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors py-1"
            >
              About
            </Link>
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors py-1"
            >
              Profile
            </Link>
            <Link 
              href="/#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors py-1"
            >
              Pricing
            </Link>
            <Link 
              href="/#program" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors py-1"
            >
              Program
            </Link>
            <Link 
              href="/#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors py-1"
            >
              Contact & Business
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl transition-all shadow-md shadow-amber-600/10 active:scale-[0.98]"
              >
                Register & Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
