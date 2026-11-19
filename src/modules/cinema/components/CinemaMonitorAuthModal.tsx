import React, { useState } from 'react';
import { Clapperboard, KeyRound, MailCheck, ShieldCheck, X } from 'lucide-react';

interface CinemaMonitorAuthModalProps {
  isOpen: boolean;
  authError: string | null;
  onClose: () => void;
  onEnterWithGoogle: () => Promise<unknown>;
  onEnterWithEmail: (email: string) => Promise<unknown>;
  onEnterWithPasscode: (input: {
    name: string;
    disciplineOrClasses: string;
    passcode: string;
  }) => Promise<unknown>;
}

export const CinemaMonitorAuthModal: React.FC<CinemaMonitorAuthModalProps> = ({
  isOpen,
  authError,
  onClose,
  onEnterWithGoogle,
  onEnterWithEmail,
  onEnterWithPasscode,
}) => {
  const [tab, setTab] = useState<'code' | 'email'>('code');
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handlePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const ok = await onEnterWithPasscode({
        name: name.trim(),
        disciplineOrClasses: 'Sala de Cinema · Mostra 19/11',
        passcode,
      });
      if (ok) onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const ok = await onEnterWithEmail(email);
      if (ok) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-950">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
            <Clapperboard size={20} />
          </div>
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 block">
              Monitoria da Sala de Cinema
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Identifique-se para Criar Sessões
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void onEnterWithGoogle().then((ok) => ok && onClose())}
          className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-extrabold flex items-center justify-center gap-2"
        >
          <ShieldCheck size={15} className="text-emerald-700" />
          Entrar com Conta Google Aprovada
        </button>

        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('code')}
            className={`py-1.5 rounded-lg ${tab === 'code' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
          >
            Senha de Monitor/Prof
          </button>
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`py-1.5 rounded-lg ${tab === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
          >
            E-mail Aprovado
          </button>
        </div>

        {tab === 'code' ? (
          <form onSubmit={handlePasscode} className="space-y-2.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nomes da dupla (ex: Lucas e Ana)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-xs"
            />
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Senha (ex: cinealuno01 ou 2jcjohnny10)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-400 bg-emerald-50/40 text-sm sm:text-xs font-mono"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <KeyRound size={14} /> {busy ? 'Validando...' : 'Liberar Criação de Sessões'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmail} className="space-y-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail aprovado pelo Super Admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-xs"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <MailCheck size={14} /> {busy ? 'Verificando...' : 'Entrar com E-mail'}
            </button>
          </form>
        )}

        {authError && (
          <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
            {authError}
          </p>
        )}
      </div>
    </div>
  );
};
