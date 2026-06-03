'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { FileUpload } from '@/components/ui/FileUpload';
import { VerificationStepper } from '@/components/ui/VerificationStepper';
import { ReceiptCard } from '@/components/ui/ReceiptCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [institutionName, setInstitutionName] = useState<string | null>(null);
  const [plan, setPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Starter');
  const [credits, setCredits] = useState<number>(0);
  const [step, setStep] = useState(0); // 0=Upload, 1=Analyzing, 2=IPFS, 3=Processing, 4=Done
  const [receiptData, setReceiptData] = useState<{ hash: string; cid: string; txHash: string } | null>(null);

  useEffect(() => {
    // Validasi session token lewat backend (aman dari XSS krn Cookie HttpOnly)
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error('Server returned non-JSON response for auth');
        }
        return res.json();
      })
      .then(data => {
        if (data.institutionName) {
          setInstitutionName(data.institutionName);
          setPlan(data.plan);
          setCredits(data.credits);
          setMounted(true);
        } else {
          router.push('/login');
        }
      })
      .catch((err) => {
        console.error('Session validation failed', err);
        router.push('/login');
      });
  }, [router]);

  const handleFileSelect = async (selectedFile: File) => {
    if (!recipientName.trim()) {
      alert("Mohon isi Nama Penerima Dokumen terlebih dahulu.");
      return;
    }

    setFile(selectedFile);
    setStep(1); // Start AI analysis
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Panggil API route untuk hashing, AI mockup, dan IPFS
      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textData = await res.text();
        console.error("Server returned non-JSON response:", textData);
        throw new Error(`Server Error (${res.status}): Terjadi kesalahan atau ukuran file terlalu besar.`);
      }

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Verifikasi Gagal');
      
      setStep(3); // Menunggu pembayaran
      
      // Minta Snap Token ke API Checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentHash: data.documentHash,
          ipfsCID: data.ipfsCID,
          institutionName: institutionName,
          recipientName: recipientName
        })
      });

      const checkoutContentType = checkoutRes.headers.get("content-type");
      if (!checkoutContentType || !checkoutContentType.includes("application/json")) {
        const checkoutTextError = await checkoutRes.text();
        console.error("Non-JSON response from /api/checkout:", checkoutTextError);
        throw new Error(`Checkout Error (${checkoutRes.status}): Terjadi kesalahan tak terduga pada server pembayaran.`);
      }

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Gagal memulai checkout');

      // Handle Mock Mode for testing without real Midtrans account
      if (checkoutData.isMock) {
        console.warn("Mock Payment Success triggered");
        setTimeout(() => {
          setReceiptData({
            hash: data.documentHash,
            cid: data.ipfsCID,
            txHash: checkoutData.order_id + "-mock-paid",
          });
          setStep(4);
        }, 1500);
        return;
      }

      // Tampilkan Midtrans Snap Popup
      (window as any).snap.pay(checkoutData.token, {
        onSuccess: function(result: any){
          // Pembayaran berhasil, trigger polling atau tampilkan sukses sementara relayer bekerja
          console.log("Pembayaran Sukses", result);
          setReceiptData({
            hash: data.documentHash,
            cid: data.ipfsCID,
            txHash: result.order_id + "-paid", // TX sebenarnya akan di-generate oleh relayer backend
          });
          setStep(4);
        },
        onPending: function(result: any){
          console.log("Menunggu pembayaran", result);
          alert("Pembayaran Anda sedang diproses.");
        },
        onError: function(result: any){
          console.log("Pembayaran Gagal", result);
          alert("Pembayaran gagal. Silakan coba lagi.");
          setStep(0);
        },
        onClose: function(){
          console.log("Pelanggan menutup popup tanpa menyelesaikan pembayaran");
          setStep(0);
        }
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Terjadi kesalahan saat memproses dokumen.');
      setStep(0);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Portal Audit Finansial</h1>
              <p className="text-slate-500">Anda login sebagai: <span className="font-semibold text-blue-600">{institutionName}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Paket Langganan</p>
                <p className="font-bold text-slate-900">{plan} Plan</p>
              </div>
              <div className="bg-blue-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20">
                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Sisa Kuota</p>
                <p className="font-bold text-xl leading-tight">{credits} <span className="text-xs font-normal text-blue-300">Dokumen</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Upload or Stepper */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                      <p className="text-sm text-slate-500 mb-1">Entitas Keuangan (Penerbit)</p>
                      <p className="font-medium text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {institutionName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Klien / Perusahaan
                      </label>
                      <input 
                        type="text" 
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Contoh: PT Bank Central Asia Tbk"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                      />
                    </div>
                    <FileUpload onFileSelect={handleFileSelect} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                      <span>Proses Verifikasi</span>
                    </h3>
                    <VerificationStepper currentStep={step} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Receipt */}
            <div>
              <AnimatePresence>
                {step === 4 && receiptData && file && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <ReceiptCard 
                      fileName={file.name}
                      hash={receiptData.hash}
                      cid={receiptData.cid}
                      txHash={receiptData.txHash}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {step > 0 && step < 4 && (
                <div className="h-full flex items-center justify-center p-8 bg-blue-50/50 rounded-2xl border border-blue-100/50 border-dashed">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-blue-900 font-medium">
                      {step === 3 ? "Menunggu Pembayaran Midtrans..." : "Memproses Dokumen..."}
                    </p>
                    <p className="text-sm text-blue-600/70 mt-1">Mohon jangan tinggalkan halaman ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
