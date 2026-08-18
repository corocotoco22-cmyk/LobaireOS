import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Lock,
  Search,
  Check,
  Share2,
} from "lucide-react";

interface StealthNote {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}

export const StealthNotesPhoneApp: React.FC = () => {
  const [notes, setNotes] = useState<StealthNote[]>([
    {
      id: "1",
      title: "Protocolo de Emergência Soberano",
      body: "Em caso de apreensão do hardware, digite 'panic' no WolfShell ou use o atalho SOS Mobile para queimar as chaves efêmeras em RAM.",
      updatedAt: "Hoje, 14:02",
    },
    {
      id: "2",
      title: "Configuração do catEFI BIOS",
      body: "Overclock VCore estável em 1.15V com perfil de CPU em 4.4GHz no firmware Catppuccin Mocha.",
      updatedAt: "Ontem, 19:30",
    },
  ]);

  const [activeNote, setActiveNote] = useState<StealthNote | null>(notes[0]);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateNote = () => {
    const newN: StealthNote = {
      id: Date.now().toString(),
      title: "Nova Nota Criptografada",
      body: "",
      updatedAt: "Agora",
    };
    setNotes([newN, ...notes]);
    setActiveNote(newN);
    setIsEditing(true);
  };

  const handleUpdateActiveBody = (val: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, body: val, updatedAt: "Agora" };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleUpdateActiveTitle = (val: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, title: val, updatedAt: "Agora" };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDelete = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setActiveNote(remaining[0] || null);
  };

  return (
    <div id="stealthnotes-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-3 font-sans select-none">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center border border-yellow-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Notas Criptografadas</h3>
            <p className="text-[10px] text-zinc-400 font-mono">Zero-Trace Volatile</p>
          </div>
        </div>
        <button
          onClick={handleCreateNote}
          className="p-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Editor or List View */}
      {activeNote ? (
        <div className="flex-1 flex flex-col space-y-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateActiveTitle(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none flex-1 pr-2"
              placeholder="Título da nota"
            />
            <button
              onClick={() => handleDelete(activeNote.id)}
              className="text-zinc-500 hover:text-rose-400 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={activeNote.body}
            onChange={(e) => handleUpdateActiveBody(e.target.value)}
            placeholder="Escreva sua nota secreta aqui..."
            className="flex-1 w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none leading-relaxed font-sans"
          />
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/80">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" /> Criptografado em RAM
            </span>
            <span>{activeNote.updatedAt}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <FileText className="w-12 h-12 text-zinc-600" />
          <p className="text-xs text-zinc-400">Nenhuma nota selecionada</p>
          <button
            onClick={handleCreateNote}
            className="px-4 py-2 rounded-xl bg-yellow-500 text-zinc-950 text-xs font-bold"
          >
            Criar Primeira Nota
          </button>
        </div>
      )}
    </div>
  );
};
