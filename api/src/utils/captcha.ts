import crypto from "crypto";

// In-memory captcha store: id -> { code, expires }
const captchaStore = new Map<string, { code: string; expires: number }>();
const CAPTCHA_TTL = 5 * 60 * 1000; // 5 minutes

// Clean expired captchas periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of captchaStore) {
    if (entry.expires < now) captchaStore.delete(id);
  }
}, 60 * 1000);

/** Generate a random 4-digit numeric captcha */
function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/** Generate an SVG captcha image with noise and distortion */
function generateSVG(code: string): string {
  const width = 120;
  const height = 44;
  const colors = ["#4f46e5", "#7c3aed", "#db2777", "#059669", "#d97706", "#dc2626"];

  // Build digit elements with random rotation, color, and y-offset
  let digits = "";
  for (let i = 0; i < code.length; i++) {
    const x = 15 + i * 26;
    const y = 28 + (Math.random() - 0.5) * 8;
    const rotate = (Math.random() - 0.5) * 30;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fontSize = 24 + Math.floor(Math.random() * 6);
    digits += `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="Arial, sans-serif" font-weight="bold" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${code[i]}</text>`;
  }

  // Noise lines
  let noise = "";
  for (let i = 0; i < 4; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.4"/>`;
  }

  // Noise dots
  let dots = "";
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    dots += `<circle cx="${x}" cy="${y}" r="1" fill="${color}" opacity="0.5"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#f3f4f6" rx="8"/>
    ${noise}
    ${dots}
    ${digits}
  </svg>`;
}

/** Create a new captcha, return id + base64 SVG image */
export function createCaptcha(): { id: string; image: string } {
  const code = generateCode();
  const id = crypto.randomUUID();
  const svg = generateSVG(code);
  const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  captchaStore.set(id, { code, expires: Date.now() + CAPTCHA_TTL });
  return { id, image };
}

/** Verify a captcha code, returns true if valid. One-time use (deleted after verification). */
export function verifyCaptcha(id: string, code: string): boolean {
  const entry = captchaStore.get(id);
  if (!entry) return false;
  // Delete after verification attempt (one-time use)
  captchaStore.delete(id);
  // Check expiry
  if (entry.expires < Date.now()) return false;
  // Case-insensitive comparison
  return entry.code.toLowerCase() === code.toLowerCase().trim();
}
