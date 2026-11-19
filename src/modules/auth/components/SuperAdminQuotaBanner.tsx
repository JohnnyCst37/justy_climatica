import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  clearAiQuotaAlert,
  probeGeminiKeyLive,
  subscribeAiQuotaAlerts,
  type AiQuotaAlertRecord,
} from '../services/aiQuotaAlertService';

interface SuperAdminQuotaBannerProps {
  isSuperAdmin: boolean;
  sessionToken?: string;
}

export const SuperAdminQuotaBanner: React.FC<SuperAdminQuotaBannerProps> = ({
  isSuperAdmin,
  sessionToken,
}) => {
  const [alert, setAlert] = useState<AiQuotaAlertRecord | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => subscribeAiQuotaAlerts(setAlert), []);

  const hasWarning = Boolean(alert && alert.status !== 'healthy');
  if (!isSuperAdmin && !hasWarning) return null;

  const isCritical = alert?.status === 'quota_exhausted' || alert?.status === 'key_error';
  const isRateLimited = alert?.status === 'rate_limited';

  const handleProbe = async () => {
    setProbing(true);
    try {
      setAlert(await probeGeminiKeyLive(sessionToken));
    } finally {
      setProbing(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-2xs ${
        isCritical
          ? 'bg-rose-50 border-rose-400 text-rose-950'
          : isRateLimited
          ? 'bg-amber-50 border-amber-400 text-amber-950'
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isCritical
              ? 'bg-rose-200 text-rose-900'
              : isRateLimited
              ? 'bg-amber-200 text-amber-900'
              : 'bg-emerald-200/80 text-emerald-900'
          }`}
        >
          {hasWarning ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider">
              {isCritical
                ? 'URGENTE · Cota / Chave Gemini Esgotada'
                : isRateLimited
                ? `Aviso · Muitas chamadas simultâneas (${alert?.incidentCount || 1}x 429)`
                : 'Monitor de Cota IA · Super Admin'}
            </span>
            {alert?.keyPrefix && (
              <span className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 font-mono text-[10px] font-bold text-slate-700">
                Key: {alert.keyPrefix}***
              </span>
            )}
            {typeof alert?.poolSpentBrl === 'number' && (
              <span className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 font-mono text-[10px] font-bold text-slate-700">
                Pool: R$ {alert.poolSpentBrl.toFixed(2)} / R$ {(alert.poolLimitBrl || 25).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold leading-snug">
            {isCritical
              ? `${alert?.lastMessage || 'Cota/faturamento atingido.'} Troque a variável GEMINI_API_KEY na Vercel (e conta de pagamento no Google AI Studio).`
              : isRateLimited
              ? `${alert?.lastMessage || 'Rate-limit 429 recente.'} Se persistir durante a Mostra, clique em Testar Cota ou troque a API Key.`
              : alert?.lastMessage || 'Motor Gemini pronto. Qualquer falta de cota (429/503) nos aparelhos da Mostra aparecerá aqui imediatamente.'}
          </p>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={probing}
            onClick={() => void handleProbe()}
            className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            {probing ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} className="text-amber-300" />}
            <span>{probing ? 'Testando API...' : 'Testar Cota Agora'}</span>
          </button>

          {hasWarning && (
            <>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 min-h-[36px] rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1"
              >
                <ExternalLink size={12} /> Trocar API Key
              </a>
              <button
                type="button"
                onClick={() => void clearAiQuotaAlert()}
                className="px-2.5 py-1.5 min-h-[36px] rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <RotateCcw size={12} /> Limpar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
