import React, { useState } from 'react';
import { Check, Copy, KeyRound, Share2, X } from 'lucide-react';
import {
  MASTER_ADMIN_PASSCODE,
  ROLE_PASSCODE_GROUPS,
} from '../services/rolePasscodesService';

interface RolePasscodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolePasscodesModal: React.FC<RolePasscodesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState<string>('');

  if (!isOpen) return null;

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2500);
  };

  const handleCopyGroup = (roleKey: string, label: string, codes: string[]) => {
    const portalUrl = `${window.location.origin}/enviar`;
    const msg = [
      `*Senhas de Acesso — ${label}*`,
      `EE CM João Ribeiro Vilela · Jornada da Justiça Climática`,
      `Códigos: ${codes.join(' | ')}`,
      `Entre direto (sem precisar de Google) em: ${portalUrl}`,
    ].join('\n');
    void copyText(`grp-${roleKey}`, msg);
  };

  const handleCopyAllForWhatsApp = () => {
    const origin = window.location.origin;
    const lines = [
      '*Senhas Oficiais de Acesso · EE CM João Ribeiro Vilela (19/11)*',
      `Site da Jornada: ${origin}`,
      `Portal de Envios: ${origin}/enviar`,
      '',
      ...ROLE_PASSCODE_GROUPS.map((g) => `*${g.label}:*\n${g.codes.join(', ')}`),
    ].join('\n\n');
    void copyText('all-whatsapp', lines);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl border border-slate-200 relative my-2 sm:my-8">
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
                Controle Antifraude · Perfis Protegidos
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Senhas para Diretor, Coordenadores, Professores & DRE
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAllForWhatsApp}
            className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            {copiedId === 'all-whatsapp' ? <Check size={14} /> : <Share2 size={14} />}
            <span>
              {copiedId === 'all-whatsapp' ? 'Lista Copiada!' : 'Copiar Todas p/ WhatsApp'}
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
          Nenhum aluno consegue entrar como Professor, Coordenador, Diretor ou DRE sem um destes códigos. Basta enviar o código por WhatsApp e o docente entra informando apenas <strong>Nome</strong>, <strong>Disciplina</strong> e a <strong>Senha</strong> (sem precisar de login Google).
        </p>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {ROLE_PASSCODE_GROUPS.map((group) => (
            <div
              key={group.roleKey}
              className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{group.label}</h4>
                  <p className="text-[11px] text-slate-500">{group.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyGroup(group.roleKey, group.label, group.codes)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-1"
                >
                  {copiedId === `grp-${group.roleKey}` ? <Check size={12} /> : <Copy size={12} />}
                  <span>
                    {copiedId === `grp-${group.roleKey}` ? 'Copiado!' : 'Copiar grupo'}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.codes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => void copyText(code, code)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-mono text-xs font-bold flex items-center gap-1.5 transition"
                    title="Clique para copiar esta senha"
                  >
                    <span>{code}</span>
                    {copiedId === code ? (
                      <Check size={11} className="text-emerald-700" />
                    ) : (
                      <Copy size={11} className="text-emerald-700/70" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
            <div>
              <strong className="text-amber-950">Senha Mestre Super Admin:</strong>{' '}
              <span className="font-mono font-bold text-amber-900">{MASTER_ADMIN_PASSCODE}</span>
            </div>
            <button
              type="button"
              onClick={() => void copyText('master', MASTER_ADMIN_PASSCODE)}
              className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] flex items-center gap-1"
            >
              {copiedId === 'master' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedId === 'master' ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
