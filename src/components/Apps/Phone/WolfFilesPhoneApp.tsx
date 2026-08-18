import React, { useState } from "react";
import {
  Folder,
  FileText,
  Lock,
  Plus,
  Shield,
  Download,
  Trash2,
  Check,
} from "lucide-react";

interface PhoneFile {
  id: string;
  name: string;
  size: string;
  type: string;
  encrypted: boolean;
}

export const WolfFilesPhoneApp: React.FC = () => {
  const [files, setFiles] = useState<PhoneFile[]>([
    { id: "1", name: "catEFI_firmware.rom", size: "2.4 MB", type: "ROM", encrypted: true },
    { id: "2", name: "chaves_privadas_ed25519.key", size: "128 KB", type: "Key", encrypted: true },
    { id: "3", name: "sovereign_identity.json", size: "64 KB", type: "JSON", encrypted: true },
    { id: "4", name: "tor_bridges_custom.txt", size: "32 KB", type: "TXT", encrypted: false },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleDownload = (name: string) => {
    setToast(`Arquivo ${name} salvo no armazenamento volátil.`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div id="wolffiles-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-3 font-sans select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Arquivos do Celular</h3>
            <p className="text-[10px] text-zinc-400 font-mono">/home/lobaite/storage</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {files.length} itens
        </span>
      </div>

      {toast && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono text-center">
          {toast}
        </div>
      )}

      {/* Files List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between shadow-sm hover:border-blue-500/30 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate max-w-[170px]">{file.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>{file.size}</span>
                  {file.encrypted && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> AES-256
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDownload(file.name)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400"
                title="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
