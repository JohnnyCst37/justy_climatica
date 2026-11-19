import React, { useEffect, useState } from 'react';
import { Check, Copy, KeyRound, PlusCircle, Share2, X } from 'lucide-react';
import {
  MASTER_ADMIN_PASSCODE,
  ROLE_PASSCODE_GROUPS,
  generateNextProfessorPasscodeBatch,
  loadExtraProfessorPasscodes,
  syncExtraProfessorPasscodesFromFirestore,
} from '../services/rolePasscodesService';

interface RolePasscodesModalProps {
  isOpen: boolean;
  actorEmail?: string;
  onClose: () => void;
}

export const RolePasscodesModal: React.FC<RolePasscodesModalProps> = ({
  isOpen,
  actorEmail = 'fernandesjohnnys@gmail.com',
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState<string>('');
  const [extraCodes, setExtraCodes] = useState<string[]>(() => loadExtraProfessorPasscodes());
  const [generatingBatch, setGeneratingBatch] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    void syncExtraProfessorPasscodesFromFirestore().then(setExtraCodes);
  }, [isOpen]);

  if (!isOpen) return null;

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2500);
  };

  const handleCopyGroup = (roleKey: string, label: string, formatted: string[]) => {
    const origin = window.location.origin;
    const msg = [
      `*Senhas Nominais — ${label}*`,
      `EE CM João Ribeiro Vilela · 2ª Mostra Cultural (19/11)`,
      formatted.join('\n'),
      `Acesse com Google ou Senha Nominal em: ${origin}/enviar`,
    ].join('\n');
    void copyText(`grp-${roleKey}`, msg);
  };

  const handleCopyAllForWhatsApp = () => {
    const origin = window.location.origin;
    const extraSection =
      extraCodes.length > 0
        ? [`*Lotes Extras de Professores (${extraCodes.length}):*\n${extraCodes.join(', ')}`]
        : [];
    const lines = [
      '*Senhas Oficiais · 2ª Mostra Cultural — EE CM João Ribeiro Vilela (19/11)*',
      `Jornada (Google 1 Clique): ${origin}`,
      `Portal de Envios: ${origin}/enviar`,
      `Estúdio Repórter: ${origin}/cobertura`,
      `Sala de Cinema: ${origin}/cinema`,
      '',
      ...ROLE_PASSCODE_GROUPS.map(
        (g) => `*${g.label}:*\n${g.items.map((i) => `${i.code} (${i.ownerLabel})`).join(' | ')}`
      ),
      ...extraSection,
    ].join('\n\n');
    void copyText('all-whatsapp', lines);
  };

  const handleGenerateBatch = async () => {
    setGeneratingBatch(true);
    try {
      const updated = await generateNextProfessorPasscodeBatch(actorEmail);
      setExtraCodes(updated);
    } finally {
      setGeneratingBatch(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative my-2 sm:my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
          <div className="flex items-center gap-2.5 text-emerald-950">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900">
              <KeyRound size={20} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Cartaz Oficial · 2ª Mostra Cultural 19/11
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Senhas Nominais (Direção, Secretaria, Profs, Repórter & Cinema)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAllForWhatsApp}
            className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            {copiedId === 'all-whatsapp' ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copiedId === 'all-whatsapp' ? 'Lista Copiada!' : 'Copiar Todas p/ WhatsApp'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
          Padrão nominal: <strong>Diretora (`samanthajrv26`)</strong>, <strong>Secretária (`denisejrv26`)</strong> e docentes por trabalho/sala (ex: <strong>`2jcjohnny10`</strong>). Para abrir a Jornada na capa, visitantes e gestores usam Google em 1 clique sem senha.
        </p>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {ROLE_PASSCODE_GROUPS.map((group) => (
            <div key={group.roleKey} className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{group.label}</h4>
                  <p className="text-[11px] text-slate-500">{group.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyGroup(
                      group.roleKey,
                      group.label,
                      group.items.map((i) => `• ${i.ownerLabel}: ${i.code}`)
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-1"
                >
                  {copiedId === `grp-${group.roleKey}` ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === `grp-${group.roleKey}` ? 'Copiado!' : 'Copiar grupo'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => void copyText(item.code, item.code)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-[11.5px] flex items-center gap-1.5 transition"
                    title="Clique para copiar esta senha"
                  >
                    <span className="font-mono font-extrabold text-emerald-900">{item.code}</span>
                    <span className="text-slate-600 font-semibold">· {item.ownerLabel}</span>
                    {copiedId === item.code ? (
                      <Check size={11} className="text-emerald-700 shrink-0" />
                    ) : (
                      <Copy size={11} className="text-emerald-700/70 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="border border-sky-200 bg-sky-50/60 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-sky-950">
                  Lotes Extras de 10 Senhas para Outros Professores ({extraCodes.length} geradas)
                </h4>
                <p className="text-[11px] text-sky-800">
                  Precisa cadastrar mais professores de última hora? Gere blocos de 10 senhas sob demanda.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {extraCodes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleCopyGroup('extras', 'Professores Extras', extraCodes)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-sky-300 text-sky-900 text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedId === 'grp-extras' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === 'grp-extras' ? 'Copiado!' : 'Copiar extras'}</span>
                  </button>
                )}
                <button
                  type="button"
                  disabled={generatingBatch}
                  onClick={() => void handleGenerateBatch()}
                  className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5"
                >
                  <PlusCircle size={13} />
                  <span>{generatingBatch ? 'Gerando...' : '+ Gerar 10 Senhas'}</span>
                </button>
              </div>
            </div>

            {extraCodes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {extraCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => void copyText(code, code)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-100 border border-sky-200 text-sky-950 font-mono text-xs font-bold flex items-center gap-1"
                  >
                    <span>{code}</span>
                    {copiedId === code ? <Check size={11} /> : <Copy size={11} className="opacity-70" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
            <div>
              <strong className="text-amber-950">Senhas Master Admin:</strong>{' '}
              <span className="font-mono font-bold text-amber-900">2jcjohnny10</span>{' '}
              <span className="text-slate-500">ou</span>{' '}
              <span className="font-mono font-bold text-amber-900">{MASTER_ADMIN_PASSCODE}</span>
            </div>
            <button
              type="button"
              onClick={() => void copyText('master', '2jcjohnny10')}
              className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] flex items-center gap-1"
            >
              {copiedId === 'master' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedId === 'master' ? 'Copiado' : 'Copiar 2jcjohnny10'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
