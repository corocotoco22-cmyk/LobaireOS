// Client-side Web Cryptography & Security Utilities for LobaireOS

export async function calculateSHA256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback simple hash for edge environments
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }
}

export function calculatePasswordEntropy(password: string): {
  entropy: number;
  strength: "Muito Fraca" | "Fraca" | "Moderada" | "Forte" | "Militar (WolfGrade)";
  crackTime: string;
  score: number; // 0 to 100
} {
  if (!password) {
    return { entropy: 0, strength: "Muito Fraca", crackTime: "Instantâneo", score: 0 };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  if (poolSize === 0) poolSize = 1;

  const entropy = Math.round(password.length * Math.log2(poolSize));

  let strength: "Muito Fraca" | "Fraca" | "Moderada" | "Forte" | "Militar (WolfGrade)" = "Muito Fraca";
  let crackTime = "Instantâneo";
  let score = Math.min(100, Math.round((entropy / 90) * 100));

  if (entropy < 28) {
    strength = "Muito Fraca";
    crackTime = "< 1 segundo";
  } else if (entropy < 45) {
    strength = "Fraca";
    crackTime = "Poucas horas";
  } else if (entropy < 65) {
    strength = "Moderada";
    crackTime = "Meses ou anos";
  } else if (entropy < 85) {
    strength = "Forte";
    crackTime = "Séculos";
  } else {
    strength = "Militar (WolfGrade)";
    crackTime = "Trilhões de anos (Impenetrável)";
  }

  return { entropy, strength, crackTime, score };
}

export function generateWolfPassword(options: {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean;
}): string {
  let chars = "";
  const lower = options.avoidAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
  const upper = options.avoidAmbiguous ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = options.avoidAmbiguous ? "23456789" : "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (options.useLower) chars += lower;
  if (options.useUpper) chars += upper;
  if (options.useNumbers) chars += numbers;
  if (options.useSymbols) chars += symbols;

  if (!chars) chars = lower + numbers;

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < options.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function generateTOTPCode(secret: string = "LOBAIRE_SECRET_2026"): { code: string; secondsRemaining: number } {
  const period = 30;
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / period);
  const secondsRemaining = period - (epoch % period);

  // Deterministic seed simulation for clean client visual demonstration
  let hash = 0;
  const seed = secret + "_" + timeStep;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const codeNum = Math.abs(hash % 1000000);
  const code = codeNum.toString().padStart(6, "0");

  return { code, secondsRemaining };
}
