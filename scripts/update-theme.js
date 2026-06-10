import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.resolve(__dirname, '../style.css');

let css = fs.readFileSync(cssPath, 'utf8');

// Replace Root Variable Tokens from Stealth Obsidian & Crimson Red Theme back to Orange & Navy Blue
css = css.replace(/--color-primary:\s*#111827;/g, '--color-primary: #0F172A;');
css = css.replace(/--color-primary-light:\s*#1F2937;/g, '--color-primary-light: #1E293B;');
css = css.replace(/--color-accent:\s*#EF4444;/g, '--color-accent: #FF7A00;');
css = css.replace(/--color-accent-hover:\s*#DC2626;/g, '--color-accent-hover: #E06B00;');
css = css.replace(/--color-accent-glow:\s*rgba\(239,\s*68,\s*68,\s*0\.15\);/g, '--color-accent-glow: rgba(255, 122, 0, 0.15);');
css = css.replace(/--color-bg-light:\s*#F9FAFB;/g, '--color-bg-light: #F8FAFC;');
css = css.replace(/--color-bg-dark:\s*#030712;/g, '--color-bg-dark: #0B0F19;');
css = css.replace(/--color-text-dark:\s*#111827;/g, '--color-text-dark: #0F172A;');
css = css.replace(/--color-text-muted:\s*#4B5563;/g, '--color-text-muted: #64748B;');
css = css.replace(/--color-border:\s*#E5E7EB;/g, '--color-border: #E2E8F0;');

// Replace Hardcoded Crimson Glow/RGBA Colors back to Orange
css = css.replace(/rgba\(239,\s*68,\s*68,/g, 'rgba(255, 122, 0,');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully reverted style.css to Orange & Navy Blue Theme.');
