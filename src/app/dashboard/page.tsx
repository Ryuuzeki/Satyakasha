'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { FileUpload } from '@/components/ui/FileUpload';
import { VerificationStepper } from '@/components/ui/VerificationStepper';
import { ReceiptCard } from '@/components/ui/ReceiptCard';
import { motion, AnimatePresence } from 'framer-motion';

type ApiErrorPayload = {
  error?: string;
  details?: string;
};

type VerifyResponse = ApiErrorPayload & {
  status: 'success';
  documentHash: string;
  ipfsCID: string;
};

type RegisterResponse = ApiErrorPayload & {
  status: 'registered';
  hash: string;
  cid: string;
  txHash: string;
  remainingCredits: number;
};

const DASHBOARD_UPLOAD_LIMIT_MB = 4;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function readJsonResponse<T extends ApiErrorPayload>(
  response: Response,
  label: string,
): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`${label} returned non-JSON response:`, text);

    if (response.status === 413 || text.includes('FUNCTION_PAYLOAD_TOO_LARGE')) {
      throw new Error(
        `${label}: ukuran file melebihi batas server. Maksimal ${DASHBOARD_UPLOAD_LIMIT_MB}MB untuk upload dashboard.`,
      );
    }

    throw new Error(
      `${label}: server mengembalikan respons tidak valid (${response.status}). Coba deploy ulang atau cek log Vercel.`,
    );
  }

  let data: T;
  try {
    data = await response.json();
  } catch (error) {
    console.error(`${label} returned invalid JSON:`, error);
    throw new Error(`${label}: respons server tidak bisa dibaca.`);
  }

  if (!response.ok) {
    throw new Error(data.error || `${label} gagal (${response.status}).`);
  }

  return data;
}

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [institutionName, setInstitutionName] = useState<string | null>(null);
  const [plan, setPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Starter');
  const [credits, setCredits] = useState<number>(0);
  const [step, setStep] = useState(0); // 0=Upload, 1=Analyzing, 2=IPFS, 3=Registering, 4=Done
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

    // Cek kuota di sisi client sebelum upload
    if (credits <= 0) {
      alert("Kuota dokumen Anda telah habis. Silakan upgrade paket untuk melanjutkan.");
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

      const data = await readJsonResponse<VerifyResponse>(res, 'Verifikasi dokumen');
      
      setStep(3); // Mendaftarkan ke blockchain
      
      // Langsung daftarkan dokumen & kurangi kuota (tanpa pembayaran)
      const registerRes = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentHash: data.documentHash,
          ipfsCID: data.ipfsCID,
          recipientName: recipientName,
        })
      });

      const registerData = await readJsonResponse<RegisterResponse>(registerRes, 'Registrasi dokumen');

      // Update sisa kuota di UI
      setCredits(registerData.remainingCredits);

      setReceiptData({
        hash: registerData.hash,
        cid: registerData.cid,
        txHash: registerData.txHash,
      });
      setStep(4);

    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error) || 'Terjadi kesalahan saat memproses dokumen.');
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
                    <FileUpload onFileSelect={handleFileSelect} maxSizeMb={DASHBOARD_UPLOAD_LIMIT_MB} />
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
                      {step === 3 ? "Mendaftarkan ke Blockchain..." : "Memproses Dokumen..."}
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
