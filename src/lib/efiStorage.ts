export interface EfiExecutable {
  id: string;
  name: string;
  htmlContent: string;
  createdAt: string;
  size: string;
  author: string;
}

export const DEFAULT_EFI_EXECUTABLES: EfiExecutable[] = [
  {
    id: "wolf_boot_splash",
    name: "wolf_splash.efi",
    createdAt: "2026-08-17 12:00",
    size: "1.2 KB",
    author: "catroot",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #11111b;
      color: #cdd6f4;
      font-family: monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    .wolf {
      font-size: 72px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    h1 {
      color: #cba6f7;
      font-size: 28px;
      margin: 0 0 10px 0;
      letter-spacing: 2px;
    }
    p {
      color: #a6adc8;
      font-size: 14px;
      max-width: 500px;
      line-height: 1.6;
    }
    .badge {
      background: #313244;
      color: #a6e3a1;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      margin-top: 20px;
      border: 1px solid #45475a;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  </style>
</head>
<body>
  <div class="wolf">🐺</div>
  <h1>LobaiteOS Custom .EFI Payload</h1>
  <p>Executando código compilado a partir de HTML em /dev/BIOS/CEFI/ através do subsistema <strong>catEFI</strong>.</p>
  <div class="badge">EXEC_MODE: ROOT_STANDALONE_EFI • OK</div>
</body>
</html>`,
  },
  {
    id: "cyber_dashboard",
    name: "quantum_matrix.efi",
    createdAt: "2026-08-17 14:15",
    size: "2.4 KB",
    author: "catroot",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      background: #000;
      color: #00ff66;
      font-family: 'Courier New', Courier, monospace;
      padding: 30px;
      box-sizing: border-box;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header {
      border-bottom: 2px solid #00ff66;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }
    .card {
      border: 1px solid #00ff66;
      padding: 15px;
      background: rgba(0, 255, 102, 0.05);
    }
    .title {
      font-weight: bold;
      color: #fff;
      margin-bottom: 10px;
    }
    .anim {
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>[catEFI QUANTUM MATRIX PAYLOAD]</h2>
    <div>STATUS: SOVEREIGN</div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="title">&gt; KERNEL REGISTER DUMP</div>
      <p>RAX: 0x7FFF0000A1BC<br>RBX: 0x000000000001<br>RCX: 0xDEADBEEFCAFE<br>CR0: 0x80050033 [PAGING_ON]</p>
    </div>
    <div class="card">
      <div class="title">&gt; HARDWARE FREQUENCY</div>
      <p>CPU CLOCK: 4.8 GHz (OVERCLOCKED)<br>VCORE: 1.325 V<br>TEMPERATURE: 38°C<br>ZERO-TRUST INTEGRITY: 100%</p>
    </div>
  </div>
  <div style="text-align: center; color: #888;">
    [Payload rodando isoladamente via firmware catEFI] <span class="anim">_</span>
  </div>
</body>
</html>`,
  },
];

const STORAGE_KEY = "lobaite_cefi_executables";

export function getEfiExecutables(): EfiExecutable[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_EFI_EXECUTABLES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_EFI_EXECUTABLES;
  } catch {
    return DEFAULT_EFI_EXECUTABLES;
  }
}

export function saveEfiExecutable(name: string, htmlContent: string): EfiExecutable[] {
  const current = getEfiExecutables();
  const cleanName = name.endsWith(".efi") ? name : `${name}.efi`;
  const existingIdx = current.findIndex((item) => item.name.toLowerCase() === cleanName.toLowerCase());

  const newEntry: EfiExecutable = {
    id: existingIdx >= 0 ? current[existingIdx].id : `efi_${Date.now()}`,
    name: cleanName,
    htmlContent,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    size: `${(new Blob([htmlContent]).size / 1024).toFixed(1)} KB`,
    author: "catroot",
  };

  let updated: EfiExecutable[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newEntry;
  } else {
    updated = [newEntry, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}

export function deleteEfiExecutable(name: string): EfiExecutable[] {
  const current = getEfiExecutables();
  const cleanName = name.endsWith(".efi") ? name : `${name}.efi`;
  const updated = current.filter((item) => item.name.toLowerCase() !== cleanName.toLowerCase());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}
