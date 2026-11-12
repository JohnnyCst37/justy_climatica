#!/usr/bin/env node
/**
 * 🛡️ Antigravity Universal Platform Health & Zero-Trust Auditor (Sentinel v2.0 Template)
 * Custo: R$ 0,00 de tokens | Execução determinística em CI / Pre-Push / Build.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const C = { reset: '\x1b[0m', bold: '\x1b[1m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' };
const pkgPath = path.join(ROOT_DIR, 'package.json');
const rootPkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) : { name: path.basename(ROOT_DIR) };
const projectName = rootPkg.name || path.basename(ROOT_DIR);
const allDeps = { ...(rootPkg.dependencies || {}), ...(rootPkg.devDependencies || {}) };

console.log(`\n${C.bold}${C.cyan}========================================================================${C.reset}`);
console.log(`${C.bold}${C.cyan}🛡️  SENTINEL v2.0 — PORTÃO ZERO TRUST, IA & COESÃO (${projectName.toUpperCase()})  🛡️${C.reset}`);
console.log(`${C.bold}${C.cyan}========================================================================${C.reset}\n`);

const state = {
  vulns: { total: 0, critical: 0, high: 0, moderate: 0, low: 0 },
  aiAlerts: [],
  aiCritical: [],
  ratchetErrors: [],
  zeroTrustErrors: [],
  warnings: [],
};

// [1/5] CVEs (npm audit)
console.log(`${C.bold}[1/5] Auditando CVEs (npm audit)...${C.reset}`);
try {
  let raw = '';
  try {
    raw = execSync('npm audit --json', { cwd: ROOT_DIR, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    raw = e.stdout ? e.stdout.toString() : '';
  }
  if (raw) {
    const meta = JSON.parse(raw).metadata?.vulnerabilities || {};
    state.vulns = {
      total: meta.total || 0,
      critical: meta.critical || 0,
      high: meta.high || 0,
      moderate: meta.moderate || 0,
      low: meta.low || 0,
    };
    console.log(state.vulns.critical > 0
      ? `  ${C.red}❌ CVEs Críticas: ${state.vulns.critical} (Altas: ${state.vulns.high})${C.reset}`
      : `  ${C.green}✅ Zero CVEs críticas (Total: ${state.vulns.total}, Altas: ${state.vulns.high}).${C.reset}`);
  }
} catch {
  console.log(`  ${C.yellow}⚠️ npm audit indisponível neste ambiente.${C.reset}`);
}

// Coleta arquivos de código
const codeFiles = [];
const skipDirs = new Set(['node_modules', '.next', 'dist', 'build', '.git', 'cypress']);
function walkCode(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (!skipDirs.has(entry)) walkCode(full);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry) && !entry.endsWith('.d.ts')) {
      codeFiles.push(full);
    }
  }
}
['src', 'api'].forEach(d => walkCode(path.join(ROOT_DIR, d)));
walkCode(path.join(ROOT_DIR, 'functions', 'src'));
for (const rootF of ['server.ts', 'server.js', 'server.mjs']) {
  if (fs.existsSync(path.join(ROOT_DIR, rootF))) codeFiles.push(path.join(ROOT_DIR, rootF));
}

// [2/5] Governança de IA, Parâmetros e Zero-Trust Gateway
console.log(`\n${C.bold}[2/5] Verificando Governança da AI Engine...${C.reset}`);
if (allDeps['@google/generative-ai']) {
  state.aiAlerts.push('package.json: SDK legado @google/generative-ai presente');
}
const LEGACY_MODELS = [/gemini-1\.5/i, /gemini-2\.0/i, /gemini-2\.5/i, /gemini-3\.0/i, /gemini-3\.6-flash/i, /gemini-3\.7-flash/i, /gemini-3\.1-flash-lite(?!-image)/i];
const SECRETS = [/AIzaSy[0-9A-Za-z-_]{33}/, /-----BEGIN (?:RSA )?PRIVATE KEY-----/, /(?:VITE|NEXT_PUBLIC)_(?:GEMINI|OPENAI|ANTHROPIC)_API_KEY/];

for (const full of codeFiles) {
  const rel = path.relative(ROOT_DIR, full).replace(/\\/g, '/');
  if (rel.includes('audit_platform_health')) continue;
  const raw = fs.readFileSync(full, 'utf-8');
  const content = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  const isServerFile =
    rel.startsWith('api/') ||
    rel.includes('/api/') ||
    rel.includes('/actions/') ||
    rel.startsWith('server.') ||
    rel.startsWith('functions/src/');

  for (const pat of LEGACY_MODELS) {
    if (pat.test(content)) state.aiAlerts.push(`${rel}: modelo legado (${pat})`);
  }
  if (/gemini-3\.8-flash/i.test(content) && /\b(temperature|topP|top_p|topK|top_k)\s*:/.test(content) && !/delete\s+\w+\.(temperature|top_p)/i.test(content)) {
    state.aiAlerts.push(`${rel}: parâmetro de amostragem legado junto com gemini-3.8-flash`);
  }
  if (/(?:userKey\b.*req\.|const\s*\{[^}]*userKey[^}]*\})/.test(content)) {
    state.aiCritical.push(`${rel}: rota aceita userKey arbitrária vinda do cliente`);
  }
  if (/generativelanguage\.googleapis\.com[^\n]*[?&]key=/.test(content)) {
    state.aiAlerts.push(`${rel}: API key enviada na query string (?key=); prefira header x-goog-api-key`);
  }
  for (const sec of SECRETS) {
    if (rel.startsWith('src/') && !isServerFile && sec.test(content)) {
      state.zeroTrustErrors.push(`${rel}: possível segredo/variável de IA exposta no client`);
    }
  }
}

console.log(state.aiAlerts.length === 0 && state.aiCritical.length === 0
  ? `  ${C.green}✅ Engine de IA alinhada.${C.reset}`
  : `  ${C.yellow}⚠️ ${state.aiCritical.length} crítico(s), ${state.aiAlerts.length} alerta(s) de IA.${C.reset}`);

// [3/5] Regra da Catraca (Monólitos & Misturas M1..M3 contra .sentinel-baseline.json)
console.log(`\n${C.bold}[3/5] Verificando Coesão e Regra da Catraca...${C.reset}`);
const baselinePath = path.join(ROOT_DIR, '.sentinel-baseline.json');
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf-8')) : null;
const ROLE_MAX = { PAGE: 350, COMPONENT: 380, HOOK: 250, TYPES: 550, SERVICE: 420, CATALOG: 700 };

function countSloc(txt) {
  return txt.split(/\r?\n/).filter(l => {
    const t = l.trim();
    return t && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*');
  }).length;
}

if (baseline && baseline.files) {
  for (const full of codeFiles) {
    const rel = path.relative(ROOT_DIR, full).replace(/\\/g, '/');
    const content = fs.readFileSync(full, 'utf-8');
    const sloc = countSloc(content);
    const prev = baseline.files[rel];
    const limit = rel.includes('/pages/') || rel.endsWith('page.tsx') ? ROLE_MAX.PAGE
      : rel.includes('/hooks/') ? ROLE_MAX.HOOK
      : rel.includes('/types') ? ROLE_MAX.TYPES
      : (rel.includes('/templates') || rel.includes('/constants') || rel.includes('/data')) ? ROLE_MAX.CATALOG
      : rel.endsWith('.tsx') ? ROLE_MAX.COMPONENT : ROLE_MAX.SERVICE;

    if (prev) {
      if (sloc > prev.sloc + 15) {
        state.ratchetErrors.push(`${rel}: cresceu de ${prev.sloc} para ${sloc} SLOC (teto catraca: ${prev.sloc + 15})`);
      }
    } else if (sloc > limit) {
      state.ratchetErrors.push(`${rel}: novo arquivo excede teto de ${limit} SLOC (atual: ${sloc})`);
    }
  }
}
console.log(state.ratchetErrors.length === 0
  ? `  ${C.green}✅ Coesão aprovada pela Catraca (${baseline ? 'baseline ativa' : 'sem baseline configurada'}).${C.reset}`
  : `  ${C.red}❌ ${state.ratchetErrors.length} violação(ões) de crescimento/monólito.${C.reset}`);

// [4/5] Zero Trust Banco & Secrets em Disco
console.log(`\n${C.bold}[4/5] Verificando Zero Trust, Secrets & Regras...${C.reset}`);
if (fs.existsSync(path.join(ROOT_DIR, 'serviceAccountKey.json'))) {
  state.zeroTrustErrors.push('serviceAccountKey.json detectado na raiz! Use ADC.');
}
const rulesPath = path.join(ROOT_DIR, 'firestore.rules');
if (fs.existsSync(rulesPath)) {
  const rules = fs.readFileSync(rulesPath, 'utf-8');
  if (/allow\s+(?:read|write|read,\s*write)\s*:\s*if\s+true\b/i.test(rules)) {
    state.zeroTrustErrors.push('firestore.rules contém regra aberta "if true"');
  }
}
console.log(state.zeroTrustErrors.length === 0
  ? `  ${C.green}✅ Zero Trust aprovado.${C.reset}`
  : `  ${C.red}❌ ${state.zeroTrustErrors.length} falha(s) Zero Trust.${C.reset}`);

// [5/5] Relatório PLATFORM_AUDIT_REPORT.md
const mgmtDir = path.join(ROOT_DIR, 'docs', 'MANAGEMENT');
if (!fs.existsSync(mgmtDir)) fs.mkdirSync(mgmtDir, { recursive: true });
const reportPath = path.join(mgmtDir, 'PLATFORM_AUDIT_REPORT.md');
fs.writeFileSync(
  reportPath,
  `# 🛡️ Relatório Sentinel v2.0 (${projectName})\n\n` +
    `- **Data:** ${new Date().toLocaleString('pt-BR')}\n` +
    `- **CVEs:** Total ${state.vulns.total} (Críticas: ${state.vulns.critical}, Altas: ${state.vulns.high})\n` +
    `- **Alertas IA:** Críticos: ${state.aiCritical.length} | Alertas: ${state.aiAlerts.length}\n` +
    `- **Catraca Monólitos:** ${state.ratchetErrors.length} violação(ões)\n` +
    `- **Zero Trust:** ${state.zeroTrustErrors.length} erro(s)\n\n` +
    `## Detalhes\n` +
    `${[...state.aiCritical, ...state.aiAlerts, ...state.ratchetErrors, ...state.zeroTrustErrors].map(x => `- ${x}`).join('\n') || '- ✅ Nenhuma falha bloqueante.'}\n`,
  'utf-8'
);
console.log(`\n${C.cyan}📄 Relatório salvo em ${path.relative(ROOT_DIR, reportPath)}${C.reset}\n`);

if (state.vulns.critical > 0 || state.zeroTrustErrors.length > 0 || state.ratchetErrors.length > 0 || state.aiCritical.length > 0) {
  console.error(`${C.red}❌ [SENTINEL BLOQUEADO] Corrija os erros críticos acima antes de prosseguir.${C.reset}\n`);
  process.exit(1);
}
