import React, { useState } from 'react';
import { ShieldCheck, Sparkles, UserCheck, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassroomLogin: (nickname: string, classCode: string) => Promise<unknown>;
  onGoogleLogin: () => Promise<unknown>;
  authError: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onClassroomLogin,
  onGoogleLogin,
  authError,
}) => {
  const [nickname, setNickname] = useState('');
  const [classCode, setClassCode] = useState('9A-JRV');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setSubmitting(true);
    try {
      await onClassroomLogin(nickname, classCode);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const ok = await onGoogleLogin();
      if (ok) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Salvar sua Jornada de Aprendizagem
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Entre para que o Guia lembre exatamente onde você parou em cada comunidade.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmitClassroom} className="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
          <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            Acesso Estudante (LGPD — sem e-mail ou CPF)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Seu apelido ou 1º nome</label>
              <input
                type="text"
                required
                maxLength={28}
                placeholder="Ex: Maria 9ºA"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Código da turma</label>
              <input
                type="text"
                required
                maxLength={16}
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !nickname.trim()}
            className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
          >
            {submitting ? 'Entrando...' : 'Entrar com Turma & Salvar Progresso'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <span className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[11px] text-slate-400 whitespace-nowrap">ou professor / visitante</span>
          <span className="border-t border-slate-200 w-full" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <UserCheck size={14} />
          <span>Entrar com Conta Google (Professor / Visitante)</span>
        </button>

        {authError && (
          <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2">
            {authError}
          </p>
        )}
      </div>
    </div>
  );
};
