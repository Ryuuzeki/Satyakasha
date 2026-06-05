'use client';

import { UploadCloud } from 'lucide-react';
import { useState, useCallback } from 'react';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  maxSizeMb?: number;
};

export function FileUpload({ onFileSelect, maxSizeMb = 10 }: FileUploadProps) {
  const [isDrag, setIsDrag] = useState(false);
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  const selectFile = useCallback((file: File) => {
    if (file.size > maxSizeBytes) {
      alert(
        `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${maxSizeMb}MB.`,
      );
      return;
    }

    onFileSelect(file);
  }, [maxSizeBytes, maxSizeMb, onFileSelect]);

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
      selectFile(e.dataTransfer.files[0]);
    }
  }, [selectFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
      e.target.value = '';
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
        <p className="text-xs text-slate-400 mt-4">Mendukung PDF, JPG, PNG (Maks. {maxSizeMb}MB)</p>
      </label>
    </div>
  );
}
