'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export type StepStatus = 'pending' | 'loading' | 'completed';

interface Step {
  id: number;
  label: string;
  status: StepStatus;
  description: string;
}

export function VerificationStepper({ currentStep }: { currentStep: number }) {
  const steps: Step[] = [
    { id: 1, label: 'Menganalisis anomali biometrik/deepfake...', description: 'Memeriksa integritas gambar menggunakan AI model', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'loading' : 'pending' },
    { id: 2, label: 'Mengamankan data ke IPFS...', description: 'Mengunggah file ke decentralized storage', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'loading' : 'pending' },
    { id: 3, label: 'Mencatat ke Lisk Blockchain...', description: 'Menunggu konfirmasi transaksi L2 wallet', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'loading' : 'pending' },
  ];

  return (
    <div className="space-y-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex gap-4 relative">
          {idx !== steps.length - 1 && (
            <div className="absolute left-4 top-8 w-0.5 h-[calc(100%-1rem)] bg-gray-200" />
          )}
          <div className="relative z-10 bg-white">
            {step.status === 'completed' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
            {step.status === 'loading' && <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />}
            {step.status === 'pending' && <Circle className="w-8 h-8 text-gray-300" />}
          </div>
          <div className="pb-4">
            <h4 className={`font-semibold ${step.status === 'completed' ? 'text-slate-900' : step.status === 'loading' ? 'text-blue-900' : 'text-slate-400'}`}>
              {step.label}
            </h4>
            <p className="text-sm text-slate-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
