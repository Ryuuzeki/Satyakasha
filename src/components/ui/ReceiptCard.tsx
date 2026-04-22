import { ExternalLink, CheckCircle } from 'lucide-react';

interface ReceiptProps {
  fileName: string;
  hash: string;
  cid: string;
  txHash: string;
}

export function ReceiptCard({ fileName, hash, cid, txHash }: ReceiptProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100 mt-8">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center gap-4">
        <CheckCircle className="w-10 h-10 text-white/90" />
        <div>
          <h2 className="text-xl font-bold">Verifikasi Berhasil</h2>
          <p className="text-white/80 text-sm">Valid (Verified by AI & Blockchain)</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Nama Dokumen</p>
          <p className="text-slate-900 font-medium truncate">{fileName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">SHA-256 Hash</p>
          <p className="text-slate-900 font-mono text-sm break-all">{hash}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">IPFS CID</p>
          <p className="text-slate-900 font-mono text-sm break-all">{cid}</p>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <a
            href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
          >
            Lihat Transaksi di Lisk Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
