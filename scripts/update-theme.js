import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.resolve(__dirname, '../style.css');

let css = fs.readFileSync(cssPath, 'utf8');

// Replace Root Variable Tokens from Cyberpunk Theme
css = css.replace(/--color-primary:\s*#1E1B4B;/g, '--color-primary: #111827;');
css = css.replace(/--color-primary-light:\s*#312E81;/g, '--color-primary-light: #1F2937;');
css = css.replace(/--color-accent:\s*#06B6D4;/g, '--color-accent: #EF4444;');
css = css.replace(/--color-accent-hover:\s*#0891B2;/g, '--color-accent-hover: #DC2626;');
css = css.replace(/--color-accent-glow:\s*rgba\(6,\s*182,\s*212,\s*0\.15\);/g, '--color-accent-glow: rgba(239, 68, 68, 0.15);');
css = css.replace(/--color-bg-light:\s*#ECFEFF;/g, '--color-bg-light: #F9FAFB;');
css = css.replace(/--color-bg-dark:\s*#08071A;/g, '--color-bg-dark: #030712;');
css = css.replace(/--color-text-dark:\s*#1E1B4B;/g, '--color-text-dark: #111827;');
css = css.replace(/--color-text-muted:\s*#475569;/g, '--color-text-muted: #4B5563;');
css = css.replace(/--color-border:\s*#CFFAFE;/g, '--color-border: #E5E7EB;');

// Replace Hardcoded Cyberpunk Glow/RGBA Colors
css = css.replace(/rgba\(6,\s*182,\s*212,/g, 'rgba(239, 68, 68,');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated style.css with Palette 2 (Stealth Obsidian & Crimson Red).');
