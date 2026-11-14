import React, { useEffect, useState } from 'react';
import { Lock, Maximize, ShieldAlert, Unlock, X } from 'lucide-react';
import {
  findAuthorizedEmail,
  isStaffRole,
} from '../../auth/services/accessControlService';

interface KioskLockModalProps {
  kioskActive: boolean;
  unlockedByProfessor: boolean;
  openAdminPrompt: boolean;
  onCloseAdminPrompt: () => void;
  onUnlockKiosk: () => void;
  onOpenSubmitRoute: () => void;
}

export const KioskLockModal: React.FC<KioskLockModalProps> = ({
  kioskActive,
  unlockedByProfessor,
  openAdminPrompt,
  onCloseAdminPrompt,
  onUnlockKiosk,
  onOpenSubmitRoute,
}) => {
  const [exitedFullscreen, setExitedFullscreen] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onFsChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      if (kioskActive && !unlockedByProfessor && !isFs) {
        setExitedFullscreen(true);
      } else {
        setExitedFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [kioskActive, unlockedByProfessor]);

  const handleRestoreFullscreen = async () => {
    if (document.fullscreenEnabled) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
    }
    setExitedFullscreen(false);
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError('');
    try {
      const entry = await findAuthorizedEmail(staffEmail);
      if (entry && isStaffRole(entry.role)) {
        setStaffEmail('');
        setExitedFullscreen(false);
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => undefined);
        }
        onUnlockKiosk();
      } else {
        setError(
          'E-mail não autorizado para destravar o quiosque. Apenas Super Admin, Direção, Coordenação ou Professores pré-cadastrados têm acesso.'
        );
      }
    } finally {
      setChecking(false);
    }
  };

  if (!exitedFullscreen && !openAdminPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
        {openAdminPrompt && !exitedFullscreen && (
          <button
            onClick={onCloseAdminPrompt}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-center gap-2.5 text-amber-800">
          <div className="p-2.5 rounded-2xl bg-amber-100">
            {exitedFullscreen ? <ShieldAlert size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
              EE CM João Ribeiro Vilela
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              {exitedFullscreen ? 'Modo Exposição em Tela Cheia' : 'Controle do Professor (Quiosque)'}
            </h3>
          </div>
        </div>

        {exitedFullscreen && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Este Chromebook está em <strong>Modo Mostra Travada</strong> para garantir que todos os visitantes aproveitem a jornada sem sair da tela.
            </p>
            <button
              onClick={() => void handleRestoreFullscreen()}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <Maximize size={16} /> Voltar para a Tela Cheia
            </button>
          </div>
        )}

        <form onSubmit={handleUnlockSubmit} className="pt-3 border-t border-slate-200 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Destravar Chromebook (E-mail Pré-Cadastrado da Equipe)
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="professor@escola.mt.gov.br"
              required
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={checking}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1"
            >
              <Unlock size={13} /> {checking ? '...' : 'Destravar'}
            </button>
          </div>
          {error && <p className="text-[11px] text-rose-700 font-semibold leading-snug">{error}</p>}

          {unlockedByProfessor && (
            <button
              type="button"
              onClick={onOpenSubmitRoute}
              className="w-full py-2 rounded-xl border border-emerald-700 text-emerald-800 text-xs font-bold hover:bg-emerald-50"
            >
              Abrir Painel Restrito de Envio (/enviar)
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
