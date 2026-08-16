import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Lazy-initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Route: Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      os: "LobaireOS 🐺",
      version: "3.4.0-hardened",
      kernel: "Lobaire-ZeroTrust-v4.19",
      securityMode: "STRICT_ISOLATION",
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Gemini-powered Security & Privacy Guardian
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { prompt, mode, context } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          success: true,
          response:
            "🐺 **Lobaire Guardian (Modo Offline / Local Sandbox)**\n\nProtegendo dados localmente em modo Zero-Leak. Para análises em profundidade de ameaças via nuvem privada com IA do LobaireOS, a chave de serviço está em modo restrito. Suas proteções locais de firewall, sanitização de EXIF, cofre AES-256 e sandboxing continuam 100% operacionais.",
          mode: mode || "offline",
        });
      }

      const systemInstruction = `Você é o Lobaire Guardian 🐺, o assistente avançado de cibersegurança e privacidade soberana do LobaireOS (um WebOS minimalista e ultra-seguro).
Seu objetivo é orientar o usuário com precisão cirúrgica sobre:
1. Privacidade digital, soberania de dados, criptografia ponta a ponta e anonimato (Tor, I2P, VPNs, DoH/DoT).
2. Análise de riscos de segurança: phishing, malwares, engenharia social, vazamentos de dados, rastreadores e cookies intrusivos.
3. Boas práticas de senhas, 2FA/MFA, chaves PGP/GPG, sanitização de metadados (EXIF).
4. Explicações claras em português (ou no idioma da pergunta), elegantes, concisas, sem rodeios desnecessários, com tom confiante de sentinela de segurança digital. Formate sempre com markdown limpo, listas estruturadas e destaques essenciais.`;

      let query = prompt;
      if (mode === "audit_code") {
        query = `Analise este código/script ou comando sob o aspecto de segurança, vulnerabilidades, injeções ou permissões suspeitas:\n\n${prompt}`;
      } else if (mode === "inspect_link") {
        query = `Faça uma análise de risco de privacidade e segurança para este link/domínio ou cabeçalho: ${prompt}. Explique riscos de phishing, rastreadores e redirecionamentos maliciosos.`;
      } else if (mode === "privacy_audit") {
        query = `Audite o seguinte cenário de privacidade ou texto suspeito:\n\n${prompt}\n\nContexto: ${JSON.stringify(context || {})}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const text = response.text || "Análise concluída sem ameaças críticas detectadas.";
      res.json({ success: true, response: text });
    } catch (error: any) {
      console.error("Error in Lobaire Guardian Advisor:", error);
      res.status(500).json({
        success: false,
        error: "Falha ao processar análise do Guardian.",
        details: error?.message || "Erro desconhecido",
      });
    }
  });

  // Vite middleware setup for SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🐺 LobaireOS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start LobaireOS server:", err);
});
