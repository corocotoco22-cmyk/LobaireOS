import React, { useState } from "react";
import {
  Folder,
  File,
  FileText,
  Lock,
  Trash2,
  Upload,
  Eye,
  ShieldCheck,
  Flame,
  CheckCircle2,
  RefreshCw,
  FolderPlus,
  FileCode,
  Sparkles,
  Search,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { FileItem } from "../../types";
import { INITIAL_FILES } from "../../utils/systemData";
import { calculateSHA256 } from "../../utils/crypto";

export const WolfFilesApp: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Shredder State
  const [isShredding, setIsShredding] = useState(false);
  const [shredProgress, setShredProgress] = useState(0);
  const [shredStatusText, setShredStatusText] = useState("");

  // EXIF scrubber state
  const [isCleaningExif, setIsCleaningExif] = useState(false);

  // Checksum Tool State
  const [checksumInput, setChecksumInput] = useState("");
  const [calculatedHash, setCalculatedHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);

  const currentFiles = files.filter((f) => {
    const inFolder = currentFolderId ? f.parentId === currentFolderId : f.parentId === null;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return inFolder && matchesSearch;
  });

  const currentFolder = files.find((f) => f.id === currentFolderId);

  const handleCreateFile = () => {
    const name = prompt("Nome do novo arquivo criptografado:", "anotacao_secreta.txt");
    if (!name) return;

    const newFile: FileItem = {
      id: "f-" + Date.now(),
      name,
      type: "file",
      parentId: currentFolderId,
      size: "1.2 KB",
      mimeType: "text/plain",
      isEncrypted: true,
      updatedAt: "Hoje, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: "[CONTEÚDO CRIPTOGRAFADO COM CHAVE ZERO-KNOWLEDGE DO LOBAIREOS]",
      checksum: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedFile(newFile);
  };

  const handleShredFile = (fileToShred: FileItem) => {
    if (!confirm(`Destruir militarmente o arquivo "${fileToShred.name}" com o protocolo DoD 5220.22-M (7 passadas)? Esta ação é IRREVERSÍVEL.`)) {
      return;
    }

    setIsShredding(true);
    setShredProgress(0);
    setShredStatusText("Passo 1/4: Sobrescrevendo com zeros binários...");

    setTimeout(() => {
      setShredProgress(30);
      setShredStatusText("Passo 2/4: Sobrescrevendo com uns complementares (0xFF)...");
    }, 600);

    setTimeout(() => {
      setShredProgress(65);
      setShredStatusText("Passo 3/4: Sobrescrevendo com ruído pseudoaleatório criptográfico...");
    }, 1200);

    setTimeout(() => {
      setShredProgress(95);
      setShredStatusText("Passo 4/4: Desalocando ponteiros de nó de índice e purgando cache RAM...");
    }, 1800);

    setTimeout(() => {
      setFiles((prev) => prev.filter((f) => f.id !== fileToShred.id));
      if (selectedFile?.id === fileToShred.id) setSelectedFile(null);
      setIsShredding(false);
      setShredProgress(100);
      setShredStatusText("Arquivo triturado com sucesso!");
    }, 2400);
  };

  const handleCleanExif = (fileToClean: FileItem) => {
    setIsCleaningExif(true);
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileToClean.id
            ? {
                ...f,
                hasExif: false,
                content: "Metadados sanitizados com sucesso: Coordenadas GPS, modelo da câmera, data e tags de rastreamento removidas.",
              }
            : f
        )
      );
      if (selectedFile?.id === fileToClean.id) {
        setSelectedFile((prev) =>
          prev
            ? {
                ...prev,
                hasExif: false,
                content: "Metadados sanitizados com sucesso: Coordenadas GPS, modelo da câmera, data e tags de rastreamento removidas.",
              }
            : null
        );
      }
      setIsCleaningExif(false);
    }, 1200);
  };

  const handleCalculateChecksum = async () => {
    if (!checksumInput.trim()) return;
    setIsHashing(true);
    const hash = await calculateSHA256(checksumInput);
    setCalculatedHash(hash);
    setIsHashing(false);
  };

  return (
    <div id="wolffiles-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              WolfFiles & Triturador DoD
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIMPAGEM 7-PASS
              </span>
            </h2>
            <p className="text-xs text-slate-400">Armazenamento Criptografado • Higienizador de Metadados EXIF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateFile}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Novo Arquivo Seguro</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation & Search */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900/40 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentFolderId(null);
              setSelectedFile(null);
            }}
            className={`font-mono text-xs transition ${!currentFolderId ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-white"}`}
          >
            /root
          </button>
          {currentFolder && (
            <>
              <span className="text-slate-400">/</span>
              <span className="text-cyan-400 font-mono font-bold">{currentFolder.name}</span>
            </>
          )}
        </div>

        <div className="relative w-48">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Files Grid / List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentFiles.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === "folder") {
                    setCurrentFolderId(item.id);
                    setSelectedFile(null);
                  } else {
                    setSelectedFile(item);
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center group ${
                  selectedFile?.id === item.id
                    ? "bg-slate-800/90 border-cyan-500/50 text-white shadow-lg"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="mb-2 relative">
                  {item.type === "folder" ? (
                    <Folder className="w-10 h-10 text-cyan-400 group-hover:scale-105 transition-transform" />
                  ) : (
                    <FileText className="w-10 h-10 text-indigo-400 group-hover:scale-105 transition-transform" />
                  )}
                  {item.isEncrypted && (
                    <Lock className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1" />
                  )}
                  {item.hasExif && (
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" title="Contém Metadados EXIF" />
                  )}
                </div>

                <span className="text-xs font-medium max-w-full truncate">{item.name}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  {item.type === "folder" ? "Diretório" : item.size || "1 KB"}
                </span>
              </div>
            ))}
          </div>

          {currentFiles.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Folder className="w-8 h-8 text-slate-700 mb-2" />
              <p>Esta pasta criptografada está vazia.</p>
            </div>
          )}
        </div>

        {/* File Inspector Sidebar */}
        {selectedFile && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/90 p-5 overflow-y-auto space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-bold text-white truncate max-w-[180px]">{selectedFile.name}</h4>
                  <p className="text-[10px] font-mono text-slate-400">{selectedFile.size}</p>
                </div>
              </div>
              <button
                onClick={() => handleShredFile(selectedFile)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                title="Triturar Arquivo Militarmente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Status indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                <span className="text-slate-400">Criptografia:</span>
                <span className="text-emerald-400 font-mono">AES-256-GCM</span>
              </div>

              {selectedFile.checksum && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Hash SHA-256:</span>
                  <p className="font-mono text-[9px] text-cyan-300 break-all select-text">{selectedFile.checksum}</p>
                </div>
              )}
            </div>

            {/* EXIF Scrubber Action if present */}
            {selectedFile.hasExif && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Risco de Metadados EXIF</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Este arquivo contém coordenadas GPS e identificadores do dispositivo que podem expor sua localização real.
                </p>
                <button
                  onClick={() => handleCleanExif(selectedFile)}
                  disabled={isCleaningExif}
                  className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isCleaningExif ? "Sanitizando..." : "Sanitizar e Remover EXIF"}</span>
                </button>
              </div>
            )}

            {/* Content Preview */}
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] font-medium">Pré-visualização Segura:</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto select-text">
                {selectedFile.content || "Nenhum conteúdo decodificado."}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => handleShredFile(selectedFile)}
                className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Flame className="w-4 h-4" />
                <span>Triturar com DoD 5220.22-M</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shredding Progress Overlay Modal */}
      {isShredding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trituração Militar em Andamento</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">{shredStatusText}</p>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${shredProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
