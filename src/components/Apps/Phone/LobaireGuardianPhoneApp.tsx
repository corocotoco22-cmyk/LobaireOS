import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Trash2,
  Lock,
  Flame,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "guardian";
  text: string;
  time: string;
}

export const LobaireGuardianPhoneApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "guardian",
      text: "🐺 Olá! Sou o Lobaire Guardian Mobile. Estou monitorando seu modem 5G e as permissões de sensores do seu telefone. Como posso ajudar com sua privacidade agora?",
      time: "14:00",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim().toLowerCase();
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Todas as camadas móveis estão criptografadas e blindadas com isolamento estrito de memória.";
      if (currentInput.includes("tor") || currentInput.includes("onion")) {
        reply = "O circuito Tor móvel está roteando através de 3 nós na Europa, ocultando qualquer identificador de torre de celular e operadora.";
      } else if (currentInput.includes("bios") || currentInput.includes("catefi")) {
        reply = "A BIOS catEFI com paleta Catppuccin Mocha e o vault de hardware estão operando no nível mais baixo do hardware soberano.";
      } else if (currentInput.includes("root") || currentInput.includes("catroot")) {
        reply = "O subsistema de privilégios 'catroot' pode ser invocado pelo terminal WolfShell a qualquer momento.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "guardian",
          text: reply,
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div id="lobaireguardian-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* Mobile Chat Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Lobaire Guardian AI
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">IA Local Mobile Sandbox</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 text-zinc-500 hover:text-rose-400"
          title="Limpar Conversa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white rounded-br-none shadow-md"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-md"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono p-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Mobile Chat Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte ao Guardian..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-zinc-950 font-bold active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
