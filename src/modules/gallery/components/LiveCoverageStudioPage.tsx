import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Download,
  LogIn,
  LogOut,
  Radio,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { LiveCoverageItem } from '../../../shared/types/domain';
import { BioPatrimonioLogo } from '../../../shared/components/Icons';
import { ResolvedVideoPlayer } from '../../../shared/components/ResolvedVideoPlayer';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import {
  ROLE_LABELS,
  canAccessCoverageStudio,
} from '../../auth/services/accessControlService';
import {
  endPresenceSession,
  heartbeatPresenceSession,
  startPresenceSession,
} from '../../presence/services/presenceService';
import {
  deleteLiveCoverageItem,
  publishLiveCoveragePhoto,
  publishLiveCoverageVideo,
  subscribeLiveCoverage,
} from '../services/liveCoverageService';
import {
  downloadCoverageVideo,
  downloadWatermarkedPhoto,
} from '../utils/mediaWatermarkEngine';
import { LiveCameraRecorderCard } from './LiveCameraRecorderCard';

export const LiveCoverageStudioPage: React.FC = () => {
  const { user, authError, enterWithAuthorizedEmail, enterWithGoogle, enterWithRolePasscode, logout } =
    useAuthSession();
  const [items, setItems] = useState<LiveCoverageItem[]>([]);
  const [loginMode, setLoginMode] = useState<'email' | 'code'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState({ name: '', code: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const authorized = canAccessCoverageStudio(user);

  useEffect(() => subscribeLiveCoverage(setItems), []);

  useEffect(() => {
    if (!authorized || !user) return;
    let sid = '';
    void startPresenceSession({
      name: user.nickname,
      category: user.role === 'super_admin' ? 'professor' : 'outro',
      classGroup: 'Cobertura Live · Galeria',
      area: 'estudio_cobertura',
    }).then((id) => {
      sid = id;
    });
    const timer = window.setInterval(() => {
      if (sid) void heartbeatPresenceSession(sid);
    }, 20000);
    return () => {
      window.clearInterval(timer);
      if (sid) void endPresenceSession(sid);
    };
  }, [authorized, user?.uid, user?.nickname, user?.role]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await enterWithAuthorizedEmail(emailInput);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'E-mail não autorizado para /cobertura.');
    }
  };

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await enterWithRolePasscode({
        name: passInput.name || 'Repórter da Mostra',
        disciplineOrClasses: 'Cobertura Live',
        passcode: passInput.code,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Senha inválida.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-900">
      <header className="bg-white border-b border-slate-200 px-3 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <a href="/galeria" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 shrink-0" title="Abrir Galeria Live">
            <ArrowLeft size={16} />
          </a>
          <BioPatrimonioLogo className="w-8 h-8" />
          <div className="min-w-0">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" /> Estúdio Separado · Cobertura Ao Vivo
            </span>
            <h1 className="text-xs sm:text-base font-extrabold text-slate-900 truncate">
              Galeria & Transmissão em Tempo Real · EE CM João Ribeiro Vilela
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a href="/galeria" className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-extrabold flex items-center gap-1.5">
            <Radio size={13} /> Ver Feed Ao Vivo (/galeria)
          </a>
          {user && (
            <button onClick={() => void logout()} className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-xs font-bold text-slate-700 flex items-center gap-1">
              <LogOut size={13} /> Sair
            </button>
          )}
        </div>
      </header>

      {!authorized ? (
        <div className="max-w-md mx-auto mt-8 px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
                <Camera size={20} />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-700 block">
                  Acesso Exclusivo · /cobertura
                </span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Entrar como Repórter da Galeria Live
                </h2>
              </div>
            </div>

            {user && !authorized && (
              <div className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Sua conta atual ({user.email || user.nickname} · {user.role in ROLE_LABELS ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] : user.role}) não possui permissão específica de <strong>Cobertura da Galeria</strong>. Peça ao Super Admin para cadastrar seu e-mail com o cargo <strong>Cobertura da Galeria (Live)</strong> ou entre com a senha LIVE.
              </div>
            )}

            <button
              type="button"
              onClick={() => void enterWithGoogle()}
              className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-2"
            >
              <ShieldCheck size={15} className="text-emerald-700" /> Entrar com Google Autorizado
            </button>

            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button type="button" onClick={() => setLoginMode('email')} className={`py-1.5 rounded-lg ${loginMode === 'email' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'}`}>
                E-mail Cadastrado
              </button>
              <button type="button" onClick={() => setLoginMode('code')} className={`py-1.5 rounded-lg ${loginMode === 'code' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'}`}>
                Senha LIVE
              </button>
            </div>

            {loginMode === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-2.5">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="E-mail autorizado p/ cobertura..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-xs"
                />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5">
                  <LogIn size={14} /> Entrar no Estúdio
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasscodeLogin} className="space-y-2.5">
                <input
                  type="text"
                  required
                  value={passInput.name}
                  onChange={(e) => setPassInput((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nome do(a) repórter..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-xs"
                />
                <input
                  type="password"
                  required
                  value={passInput.code}
                  onChange={(e) => setPassInput((p) => ({ ...p, code: e.target.value }))}
                  placeholder="Senha nominal (ex: reporterjrv01, live-01-jrv)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-xs font-mono"
                />
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5">
                  <LogIn size={14} /> Liberar Câmera Live
                </button>
              </form>
            )}

            {(errorMsg || authError) && (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                {errorMsg || authError}
              </p>
            )}
          </div>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto p-3.5 sm:p-8 space-y-6">
          <LiveCameraRecorderCard
            onPublishPhoto={(input) =>
              publishLiveCoveragePhoto({
                ...input,
                reporterName: user?.nickname || 'Repórter',
                reporterEmail: user?.email || '',
              })
            }
            onPublishVideo={(input) =>
              publishLiveCoverageVideo({
                ...input,
                reporterName: user?.nickname || 'Repórter',
                reporterEmail: user?.email || '',
              })
            }
          />

          <section className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Registros Publicados na Galeria Live ({items.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
                  <div className="aspect-video bg-slate-950">
                    {item.mediaType === 'video' ? (
                      <ResolvedVideoPlayer src={item.mediaUrl} className="w-full h-full object-contain" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10.5px] font-mono font-bold text-emerald-800">
                        {item.eventDateLabel} · {item.eventTimeLabel} · {item.classOrGuest}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.caption}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() =>
                          void (item.mediaType === 'photo'
                            ? downloadWatermarkedPhoto(item.mediaUrl, {
                                title: item.title,
                                classOrGuest: item.classOrGuest,
                                dateLabel: item.eventDateLabel,
                                timeLabel: item.eventTimeLabel,
                                timestamp: item.createdAt,
                              })
                            : downloadCoverageVideo(item.mediaUrl, {
                                title: item.title,
                                classOrGuest: item.classOrGuest,
                                dateLabel: item.eventDateLabel,
                                timeLabel: item.eventTimeLabel,
                                timestamp: item.createdAt,
                              }))
                        }
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
                      >
                        <Download size={13} /> Baixar p/ PC (Carimbado)
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteLiveCoverageItem(item.id)}
                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                        title="Excluir registro"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};
