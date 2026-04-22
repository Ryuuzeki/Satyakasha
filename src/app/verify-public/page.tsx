'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FileUpload } from '@/components/ui/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Search, Calendar, Landmark, UserCheck } from 'lucide-react';
import { createPublicClient, http } from 'viem';
import { liskSepolia } from 'viem/chains';
import { registryABI } from '@/lib/abi';

export default function VerifyPublicPage() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0=Upload, 1=Checking, 2=Result
  const [result, setResult] = useState<any>(null); // null = not found, object = document record
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStep(1); // Mulai Pengecekan
    setResult(null);
    setError('');
    
    try {
      // 1. Dapatkan Hash dari Server
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/public/hash', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghitung hash');
      
      const docHash = data.documentHash;

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
      const isZeroAddress = !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000';

      let onchainData: any;

      if (isZeroAddress) {
        console.warn("Using Mock Verification Mode (Zero Address detected)");
        const mockRes = await fetch(`/api/public/verify?hash=${docHash}`);
        if (mockRes.ok) {
          const mockData = await mockRes.json();
          onchainData = [
            mockData.documentHash,
            mockData.ipfsCID,
            mockData.institutionName,
            mockData.recipientName,
            mockData.registeredBy,
            BigInt(Math.floor(mockData.timestamp / 1000))
          ];
        } else {
          onchainData = ["", "", "", "", "", BigInt(0)];
        }
      } else {
        // Tanya Blockchain (Lisk Sepolia)
        const publicClient = createPublicClient({
          chain: liskSepolia,
          transport: http(),
        });

        onchainData = await publicClient.readContract({
          address: contractAddress,
          abi: registryABI,
          functionName: 'documents',
          args: [docHash],
        });
      }
      
      const [returnedHash, ipfsCID, institutionName, recipientName, registeredBy, timestamp] = onchainData;

      if (returnedHash && returnedHash !== "") {
        setResult({
          documentHash: returnedHash,
          ipfsCID,
          institutionName,
          recipientName,
          registeredBy,
          timestamp: Number(timestamp) * 1000 // Convert sec to ms
        });
      } else {
        setResult(null); // Tidak terdaftar
      }

      setStep(2);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan jaringan.');
      setStep(2);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStep(0);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cek Keaslian Dokumen</h1>
          <p className="text-slate-500">Unggah dokumen finansial/piagam untuk memverifikasi keasliannya di Blockchain Lisk.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <FileUpload onFileSelect={handleFileSelect} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="checking"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Mencari di Blockchain Lisk L2...</h3>
                <p className="text-slate-500">Mohon tunggu, kami sedang mencocokkan sidik jari dokumen Anda.</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                {error ? (
                  <div className="text-center w-full">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-slate-600 mb-8">{error}</p>
                    <button onClick={handleReset} className="text-blue-600 font-medium hover:underline">Coba Lagi</button>
                  </div>
                ) : result ? (
                  <div className="w-full">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-700 mb-2">Dokumen Valid & Asli!</h2>
                      <p className="text-slate-500">Sidik jari dokumen ini terekam secara permanen di Blockchain Lisk.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 mb-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <Landmark className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Entitas Penerbit (Auditor / Institusi)</p>
                          <p className="font-semibold text-slate-900">{result.institutionName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <UserCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Nama Penerima / Perusahaan</p>
                          <p className="font-semibold text-slate-900">{result.recipientName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Waktu Pencatatan (Timestamp)</p>
                          <p className="font-medium text-slate-900">{new Date(result.timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <Search className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-slate-500">Blockchain Hash</p>
                          <p className="font-mono text-xs text-slate-700 truncate">{result.documentHash}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button onClick={handleReset} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
                        Verifikasi Dokumen Lain
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Dokumen Tidak Ditemukan!</h2>
                    <p className="text-slate-600 mb-2">Peringatan: Dokumen ini kemungkinan besar palsu atau belum diterbitkan oleh otoritas yang sah.</p>
                    <p className="text-sm text-slate-400 mb-8">Tidak ada sidik jari yang cocok di jaringan Lisk L2.</p>
                    <button onClick={handleReset} className="px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                      Coba Dokumen Lain
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
