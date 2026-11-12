#!/usr/bin/env node
/**
 * ⚡ Sentinel HTTP Concurrent Load & Backpressure Runner (Zero Dependências)
 * Mede RPS, p50 / p95 / p99 e distribuição 2xx / 429 / 5xx contra endpoints reais.
 * Trava FinOps: exige --allow-live-ai caso aponte para rota de LLM sem --dry-run-header.
 *
 * Uso:
 *   node scripts/load_benchmark.mjs --url=http://localhost:3000/api/health --concurrency=62 --requests=248
 */

import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k, rest.length ? rest.join('=') : 'true'];
  })
);

const url = args.url || 'http://localhost:3000/api/health';
const concurrency = Math.max(1, Number(args.concurrency || 62));
const totalRequests = Math.max(concurrency, Number(args.requests || 186));
const method = (args.method || 'GET').toUpperCase();
const bodyPayload = args.body || undefined;
const dryRunHeader = args['dry-run-header'];
const allowLiveAi = args['allow-live-ai'] === 'true';

const isAiRoute = /\/api\/(gemini|johnnyai|ai|chat|copilot)/i.test(url);
if (isAiRoute && !dryRunHeader && !allowLiveAi) {
  console.error('❌ [TRAVA FINOPS] Rota de IA detectada. Use --dry-run-header="x-sentinel-dry-run:1" ou confirme --allow-live-ai=true.');
  process.exit(1);
}

const headers = { 'Content-Type': 'application/json' };
if (dryRunHeader && dryRunHeader.includes(':')) {
  const [hk, ...hv] = dryRunHeader.split(':');
  headers[hk.trim()] = hv.join(':').trim();
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

export async function runLoadBenchmark(opts = {}) {
  const targetUrl = opts.url || url;
  const workersCount = opts.concurrency || concurrency;
  const requestsTarget = opts.totalRequests || totalRequests;
  const latencies = [];
  const statuses = {};
  let networkErrors = 0;
  let nextIndex = 0;
  const startedAt = performance.now();

  async function worker() {
    while (true) {
      const idx = nextIndex++;
      if (idx >= requestsTarget) break;
      const t0 = performance.now();
      try {
        const res = await fetch(targetUrl, {
          method: opts.method || method,
          headers: opts.headers || headers,
          body: (opts.method || method) !== 'GET' ? (opts.body || bodyPayload || '{}') : undefined,
        });
        statuses[res.status] = (statuses[res.status] || 0) + 1;
        await res.arrayBuffer();
      } catch {
        networkErrors++;
      } finally {
        latencies.push(performance.now() - t0);
      }
    }
  }

  await Promise.all(Array.from({ length: workersCount }, () => worker()));
  const durationSec = Math.max(0.001, (performance.now() - startedAt) / 1000);
  latencies.sort((a, b) => a - b);

  const summary = {
    url: targetUrl,
    concurrency: workersCount,
    totalRequests: requestsTarget,
    durationSec: Number(durationSec.toFixed(2)),
    rps: Number((requestsTarget / durationSec).toFixed(1)),
    p50Ms: Number(percentile(latencies, 50).toFixed(1)),
    p95Ms: Number(percentile(latencies, 95).toFixed(1)),
    p99Ms: Number(percentile(latencies, 99).toFixed(1)),
    statuses,
    networkErrors,
  };
  return summary;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  runLoadBenchmark().then(res => {
    console.log('\n⚡ Resultado do Benchmark HTTP Concorrente:', JSON.stringify(res, null, 2));
    const has5xx = Object.entries(res.statuses).some(([code, n]) => Number(code) >= 500 && n > 0);
    if (res.networkErrors > 0 || has5xx) {
      console.error('❌ Falha: erros de rede ou HTTP 5xx detectados sob carga!');
      process.exit(1);
    }
  });
}
