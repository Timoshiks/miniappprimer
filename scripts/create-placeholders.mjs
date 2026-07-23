import sharp from "sharp";
import fs from "fs";
import path from "path";

const products = [
  { name: "velvet-oud.webp", color1: "#2b1055", color2: "#7597de", label: "Velvet Oud" },
  { name: "poudre-de-riz.webp", color1: "#fbe4e8", color2: "#e1b3c3", label: "Poudre de Riz" },
  { name: "neroli-dore.webp", color1: "#fef3c7", color2: "#f59e0b", label: "Néroli Doré" },
  { name: "ambre-nuit.webp", color1: "#451a03", color2: "#d97706", label: "Ambre Nuit" },
  { name: "retinol-serum.webp", color1: "#e0f2fe", color2: "#0284c7", label: "Retinol 0.3%" },
  { name: "hyaluronic-cream.webp", color1: "#f0fdf4", color2: "#16a34a", label: "Hyaluronic" },
  { name: "rose-oil.webp", color1: "#ffe4e6", color2: "#e11d48", label: "Rose Oil" },
  { name: "lipstick-grenat.webp", color1: "#881337", color2: "#e11d48", label: "Grenat" },
  { name: "skin-tint.webp", color1: "#fdf6e3", color2: "#d97706", label: "Skin Tint" },
  { name: "mascara-volume.webp", color1: "#18181b", color2: "#52525b", label: "Volume+" },
  { name: "placeholder.webp", color1: "#ede4fb", color2: "#8b5cf6", label: "Maison" },
];

async function generate() {
  const dir = path.join(process.cwd(), "public", "products");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const p of products) {
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${p.color1}" />
            <stop offset="100%" stop-color="${p.color2}" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g)" />
        <circle cx="200" cy="180" r="80" fill="white" opacity="0.25" />
        <text x="50%" y="48%" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${p.label}</text>
        <text x="50%" y="58%" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#ffffff" opacity="0.8" text-anchor="middle" dominant-baseline="middle">Maison de Parfum</text>
      </svg>
    `;

    const outputPath = path.join(dir, p.name);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }
}

generate().catch(console.error);
