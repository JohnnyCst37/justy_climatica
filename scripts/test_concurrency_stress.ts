/**
 * Suíte de Estresse & Concorrência Atômica Anti-TOCTOU (62 Usuários Simultâneos)
 * Testa diretamente o controlador FinOps real em server/services/quotaGuard.ts.
 */
import assert from 'node:assert/strict';
import { createInMemoryAtomicQuotaEngine } from '../server/services/quotaGuard.js';

async function runStressTests(): Promise<void> {
  console.log('⚡ Executando Suíte Anti-TOCTOU Real (62 Usuários Simultâneos)...');

  // 1. Rajada de 62 cliques simultâneos na mesma conta
  const engineBurst = createInMemoryAtomicQuotaEngine(100, 0.025, 10);
  const burst = await Promise.all(
    Array.from({ length: 62 }, () => engineBurst.acquire('same-user', 0.025))
  );
  assert.equal(burst.filter((r) => r.allowed).length, 1, 'Apenas 1 requisição por UID em voo');
  assert.equal(
    burst.filter((r) => r.code === 'BOT_BURST_DETECTED').length,
    61,
    '61 bloqueadas como burst'
  );

  // 2. 62 usuários distintos disputando teto global exato de 10 reservas (R$ 0,25)
  const enginePeak = createInMemoryAtomicQuotaEngine(0.25, 0.025, 1.5);
  const peak = await Promise.all(
    Array.from({ length: 62 }, (_, i) => enginePeak.acquire(`u-${i}`, 0.025))
  );
  assert.equal(peak.filter((r) => r.allowed).length, 10, 'Exatamente 10 aprovadas antes do teto');
  assert.equal(peak.filter((r) => r.code === 'POOL_CAP').length, 52, '52 barradas sem estourar 1 centavo');

  // 3. Liquidação e estorno sob falha parcial (5 OK, 5 falham)
  for (let i = 0; i < 10; i += 1) {
    if (i < 5) {
      await enginePeak.commit(`u-${i}`, `res-${i}`, 0.015, 0.025);
    } else {
      await enginePeak.release(`u-${i}`, `res-${i}`, 0.025);
    }
  }
  const snap = enginePeak.snapshot();
  assert.equal(snap.reservedInFlightBrl, 0, 'Reservas zeradas ao fim das chamadas');
  assert.equal(snap.committedBrl, 0.075, 'Estorno integral das chamadas com erro');

  console.log('✅ Teste de Concorrência Anti-TOCTOU (62 simultâneos) aprovado!');
}

runStressTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
