import React, { useState, useEffect } from "react";
import {
  Folder,
  FileCode,
  Lock,
  ShieldAlert,
  Play,
  Plus,
  Trash2,
  AlertTriangle,
  Code2,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  EfiExecutable,
  getEfiExecutables,
  saveEfiExecutable,
  deleteEfiExecutable,
} from "../../lib/efiStorage";

interface CatrootCefiExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunEfi: (executable: EfiExecutable) => void;
}

export const CatrootCefiExplorer: React.FC<CatrootCefiExplorerProps> = ({
  isOpen,
  onClose,
  onRunEfi,
}) => {
  const [executables, setExecutables] = useState<EfiExecutable[]>([]);
  const [selectedItem, setSelectedItem] = useState<EfiExecutable | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newHtmlCode, setNewHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background: #0f172a;
      color: #38bdf8;
      font-family: monospace;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      box-sizing: border-box;
    }
    h1 { color: #f472b6; font-size: 26px; }
    .box {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 24px;
      border-radius: 12px;
      max-width: 550px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .tag {
      background: #0284c7;
      color: white;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>🐺 LobaiteOS .EFI Executable</h1>
    <p>Compilado e executado através de <strong>/dev/BIOS/CEFI/</strong> pelo subsistema catEFI.</p>
    <div style="margin-top: 15px;">
      <span class="tag">CATROOT HARDWARE VAULT</span>
    </div>
  </div>
</body>
</html>`);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const items = getEfiExecutables();
      setExecutables(items);
      if (items.length > 0) {
        setSelectedItem(items[0]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveFile = () => {
    if (!newFileName.trim()) {
      showToast("Erro: Digite o nome do arquivo .efi");
      return;
    }
    const cleanName = newFileName.trim().endsWith(".efi")
      ? newFileName.trim()
      : `${newFileName.trim()}.efi`;

    const updated = saveEfiExecutable(cleanName, newHtmlCode);
    setExecutables(updated);
    setIsCreating(false);
    setNewFileName("");
    showToast(`Arquivo ${cleanName} criado com sucesso em /dev/BIOS/CEFI/`);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteEfiExecutable(name);
    setExecutables(updated);
    if (selectedItem?.name === name) {
      setSelectedItem(updated[0] || null);
    }
    showToast(`Arquivo ${name} removido de /dev/BIOS/CEFI/`);
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#11111b] border border-[#cba6f7]/50 rounded-2xl max-w-4xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#181825] border-b border-[#313244] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#cba6f7]/20 border border-[#cba6f7]/40 flex items-center justify-center text-[#cba6f7] text-base">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  /dev/BIOS/CEFI/ • Explorador Exclusivo catroot
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#f38ba8]/20 text-[#f38ba8] border border-[#f38ba8]/40 font-bold">
                  CATROOT ONLY
                </span>
              </div>
              <p className="text-[11px] text-[#a6adc8]">
                Diretório de Hardware da BIOS catEFI (Inacessível para root comum)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(true)}
              className="px-3 py-1.5 rounded-lg bg-[#cba6f7] text-[#11111b] hover:bg-[#b4befe] font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar .EFI (HTML)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a6adc8] hover:text-white hover:bg-[#313244] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="bg-[#cba6f7]/20 border-b border-[#cba6f7]/40 text-[#cba6f7] px-4 py-1.5 text-xs text-center">
            {notification}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Files List */}
          <div className="w-1/2 border-r border-[#313244] p-4 overflow-y-auto space-y-2.5 bg-[#181825]/40">
            <div className="flex items-center justify-between text-[11px] text-[#6c7086] px-1 pb-1">
              <span>ARQUIVOS EXECUTÁVEIS (.EFI)</span>
              <span>{executables.length} itens</span>
            </div>

            {executables.length === 0 ? (
              <div className="text-center py-12 text-[#6c7086] text-xs">
                Nenhum binário .efi em /dev/BIOS/CEFI/
              </div>
            ) : (
              executables.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#cba6f7]/15 border-[#cba6f7] text-white shadow-md shadow-[#cba6f7]/10"
                        : "bg-[#1e1e2e] border-[#313244] text-[#a6adc8] hover:border-[#45475a]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-[#cba6f7]" />
                        <span className="font-bold text-xs text-white">{item.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#313244] text-[#a6adc8]">
                        {item.size}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#6c7086] mt-1">
                      Path: /dev/BIOS/CEFI/{item.name} • Criado: {item.createdAt}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#313244]/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunEfi(item);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#a6e3a1] text-[#11111b] font-bold hover:bg-[#94e2d5] text-[11px] flex items-center gap-1.5 transition shadow"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Carregar & Executar</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.name, e)}
                        className="p-1 rounded text-[#f38ba8] hover:bg-[#313244] transition"
                        title="Deletar binário .efi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Code Preview & Instructions */}
          <div className="w-1/2 p-4 flex flex-col justify-between bg-[#11111b]">
            {selectedItem ? (
              <div className="flex-1 flex flex-col overflow-hidden space-y-3">
                <div className="flex items-center justify-between border-b border-[#313244] pb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#89b4fa]" />
                    <span className="text-white font-bold text-xs">{selectedItem.name}</span>
                  </div>
                  <span className="text-[10px] text-[#89b4fa] font-mono">HTML to .EFI</span>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                  <span className="text-[11px] text-[#6c7086] mb-1">Código-fonte HTML Compilado:</span>
                  <div className="flex-1 bg-[#181825] border border-[#313244] rounded-xl p-3 overflow-y-auto text-[#a6e3a1] text-[11px] font-mono">
                    <pre className="whitespace-pre-wrap">{selectedItem.htmlContent}</pre>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f38ba8]/10 border border-[#f38ba8]/30 text-[#f38ba8] text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Instrução catEFI:</strong> Para sair do binário durante a execução, pressione{" "}
                    <strong>Control + Alt + F4</strong>.
                  </span>
                </div>

                <button
                  onClick={() => onRunEfi(selectedItem)}
                  className="w-full py-2.5 rounded-xl bg-[#cba6f7] text-[#11111b] font-bold hover:bg-[#b4befe] transition flex items-center justify-center gap-2 shadow-lg shadow-[#cba6f7]/25 text-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Executar "{selectedItem.name}" via catEFI</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#6c7086] text-xs space-y-2">
                <Lock className="w-8 h-8 text-[#45475a]" />
                <p>Selecione um arquivo .efi para inspecionar ou executar.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Inside: Create New EFI */}
        {isCreating && (
          <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1e1e2e] border border-[#cba6f7]/50 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs text-[#cdd6f4]">
              <div className="flex items-center justify-between border-b border-[#313244] pb-2">
                <div className="flex items-center gap-2 text-[#cba6f7] font-bold text-sm">
                  <Code2 className="w-4 h-4" />
                  <span>Novo Executável .EFI em /dev/BIOS/CEFI/</span>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-[#a6adc8] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[#a6adc8] text-[11px]">Nome do Arquivo (Ex: app_grafico.efi):</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="meu_programa.efi"
                  className="w-full p-2.5 rounded-lg bg-[#181825] border border-[#313244] text-white outline-none focus:border-[#cba6f7]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#a6adc8] text-[11px]">
                  Código HTML / CSS / JavaScript (Será executado como binário pelo catEFI):
                </label>
                <textarea
                  value={newHtmlCode}
                  onChange={(e) => setNewHtmlCode(e.target.value)}
                  rows={10}
                  className="w-full p-3 rounded-lg bg-[#181825] border border-[#313244] text-[#a6e3a1] font-mono text-xs outline-none focus:border-[#cba6f7]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#313244]">
                <span className="text-[10px] text-[#a6adc8]">
                  O arquivo será gravado diretamente no cofre de hardware da BIOS.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#313244] hover:bg-[#45475a] text-[#a6adc8] font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveFile}
                    className="px-4 py-1.5 rounded-lg bg-[#cba6f7] text-[#11111b] font-bold hover:bg-[#b4befe] shadow"
                  >
                    Salvar .EFI em /dev/BIOS/CEFI/
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#181825] border-t border-[#313244] flex items-center justify-between text-[11px] text-[#a6adc8]">
          <span className="text-[#cba6f7]">
            🔒 Proteção de Hardware: Root Padrão NÃO tem acesso a /dev/BIOS/CEFI/
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-white font-bold transition"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
