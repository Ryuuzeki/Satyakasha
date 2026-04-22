'use client';

import { UploadCloud } from 'lucide-react';
import { useState, useCallback } from 'react';

export function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [isDrag, setIsDrag] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDrag(true);
    else if (e.type === 'dragleave') setIsDrag(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${
        isDrag ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'
      }`}
    >
      <input type="file" className="hidden" id="file-upload" accept="image/*,application/pdf" onChange={handleChange} />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloud className={`w-12 h-12 mb-4 ${isDrag ? 'text-blue-600' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-slate-800">
          Tarik & Lepas Dokumen di Sini
        </p>
        <p className="text-sm text-slate-500 mt-2">atau klik untuk menelusuri folder Anda</p>
        <p className="text-xs text-slate-400 mt-4">Mendukung PDF, JPG, PNG (Maks. 10MB)</p>
      </label>
    </div>
  );
}
