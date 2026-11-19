import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Clock,
  GraduationCap,
  Radio,
  ShieldCheck,
  UploadCloud,
  Users,
} from 'lucide-react';
import type { PresenceSessionRecord, VisitorCategory } from '../../../shared/types/domain';
import { BioPatrimonioLogo } from '../../../shared/components/Icons';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';
import { useAuthSession } from '../../auth/hooks/useAuthSession';
import { SuperAdminQuotaBanner } from '../../auth/components/SuperAdminQuotaBanner';
import {
  VISITOR_CATEGORY_LABELS,
  formatLoggedDuration,
  isSessionActiveOnline,
  subscribePresenceSessions,
} from '../services/presenceService';
import { GestoraRadarBanner } from './GestoraRadarBanner';

const CATEGORY_FILTER_OPTIONS: Array<{ key: 'todos' | 'online' | VisitorCategory; label: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'online', label: 'Online Agora' },
  { key: 'estudante', label: 'Estudantes' },
  { key: 'professor', label: 'Professores' },
  { key: 'coordenador', label: 'Coordenação' },
  { key: 'diretor', label: 'Direção' },
  { key: 'dre', label: 'Representante DRE' },
  { key: 'outro', label: 'Outro' },
];

export const LiveAccessDashboardPage: React.FC = () => {
  const { user } = useAuthSession();
  const [sessions, setSessions] = useState<PresenceSessionRecord[]>([]);
  const [now, setNow] = useState<number>(() => Date.now());
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'online' | VisitorCategory>('todos');
  const [classFilter, setClassFilter] = useState<string>('todas');

  useEffect(() => {
    const unsub = subscribePresenceSessions(setSessions);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, []);

  const stats = useMemo(() => {
    const online = sessions.filter((s) => isSessionActiveOnline(s, now));
    const students = sessions.filter((s) => s.category === 'estudante');
    const studentsOnline = online.filter((s) => s.category === 'estudante');
    const staff = sessions.filter((s) =>
      ['professor', 'coordenador', 'diretor'].includes(s.category)
    );
    const dreAndOthers = sessions.filter((s) => s.category === 'dre' || s.category === 'outro');
    return {
      onlineCount: online.length,
      totalCount: sessions.length,
      studentsCount: students.length,
      studentsOnline: studentsOnline.length,
      staffCount: staff.length,
      dreAndOthersCount: dreAndOthers.length,
    };
  }, [sessions, now]);

  const classOptions = useMemo(() => {
    const found = new Set<string>(SCHOOL_CLASS_OPTIONS);
    for (const s of sessions) {
      if (s.classGroup) found.add(s.classGroup);
    }
    return Array.from(found);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (categoryFilter === 'online' && !isSessionActiveOnline(s, now)) return false;
      if (
        categoryFilter !== 'todos' &&
        categoryFilter !== 'online' &&
        s.category !== categoryFilter
      ) {
        return false;
      }
      if (classFilter !== 'todas' && s.classGroup !== classFilter) return false;
      return true;
    });
  }, [sessions, categoryFilter, classFilter, now]);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-900">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-20 flex-wrap">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
            title="Voltar para a Mostra"
          >
            <ArrowLeft size={16} />
          </a>
          <BioPatrimonioLogo className="w-8 h-8 hidden sm:block" />
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              <Radio size={12} className="text-rose-600 animate-pulse" /> AO VIVO · Tempo Real
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
              Monitoramento de Acessos em Tempo Real · EE CM João Ribeiro Vilela
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/enviar"
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            <UploadCloud size={14} /> Portal /enviar
          </a>
          <a
            href="/"
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold"
          >
            Abrir Mostra
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-5">
        <SuperAdminQuotaBanner
          isSuperAdmin={user?.role === 'super_admin'}
          sessionToken={user?.sessionToken}
        />
        <GestoraRadarBanner sessions={sessions} now={now} />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <Activity size={14} className="text-rose-600" /> Online Agora (Ativos)
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats.onlineCount}
              <span className="text-xs font-semibold text-slate-500 ml-2">
                / {stats.totalCount} registros
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1.5">
              <GraduationCap size={14} /> Estudantes
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats.studentsCount}
              <span className="text-xs font-semibold text-emerald-700 ml-2">
                ({stats.studentsOnline} online)
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Profs, Coordenação & Diretora
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.staffCount}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Users size={14} /> Representantes DRE & Outros
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.dreAndOthersCount}</div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
              {CATEGORY_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setCategoryFilter(opt.key)}
                  className={`px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold border transition shrink-0 ${
                    categoryFilter === opt.key
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Filtrar por Turma ou Setor"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800"
            >
              <option value="todas">Todas as Turmas / Setores</option>
              {classOptions.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              Nenhum acesso registrado com este filtro ainda. Assim que alguém entrar na Mostra ou em /enviar, aparecerá aqui ao vivo.
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-2.5">
                {filteredSessions.map((s) => {
                  const online = isSessionActiveOnline(s, now);
                  return (
                    <div key={s.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-900 truncate">
                            {s.name}
                            {s.age ? <span className="text-[11px] font-normal text-slate-500 ml-1">({s.age} anos)</span> : null}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-950 font-bold text-[10.5px]">
                              {VISITOR_CATEGORY_LABELS[s.category]}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700">{s.classGroup}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 ${online ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200/70 text-slate-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                          {online ? 'Online' : 'Concluído'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-200/70">
                        <span className="text-slate-600 truncate">
                          {s.area === 'portal_envio'
                            ? 'Portal /enviar'
                            : s.area === 'galeria_live'
                            ? 'Galeria Live (/galeria)'
                            : s.area === 'estudio_cobertura'
                            ? 'Estúdio Cobertura (/cobertura)'
                            : s.area === 'sala_cinema'
                            ? 'Sala de Cinema (/cinema)'
                            : `Mostra · ${s.activeCommunityTitle || 'Início'}`}
                        </span>
                        <span className="font-mono font-bold text-emerald-800 shrink-0">
                          <Clock size={11} className="inline mr-1" />
                          {formatLoggedDuration(s.startedAt, s.lastSeenAt, s.endedAt, s.isOnline, now)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Nome / Identificação</th>
                    <th className="py-2.5 px-3">Perfil</th>
                    <th className="py-2.5 px-3">Turma / Setor</th>
                    <th className="py-2.5 px-3">Local / Atividade Atual</th>
                    <th className="py-2.5 px-3">Tempo Logado</th>
                    <th className="py-2.5 px-3">Entrada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.map((s) => {
                    const online = isSessionActiveOnline(s, now);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 whitespace-nowrap font-bold">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] ${
                              online
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                online ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            {online ? 'Online agora' : 'Concluído'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {s.name}
                          {s.age ? (
                            <span className="text-[11px] font-normal text-slate-500 ml-1">
                              ({s.age} anos)
                            </span>
                          ) : null}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-950 font-bold text-[11px]">
                            {VISITOR_CATEGORY_LABELS[s.category]}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{s.classGroup}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {s.area === 'portal_envio'
                            ? 'Portal /enviar (Gestão e Envios)'
                            : s.area === 'galeria_live'
                            ? 'Galeria Live (/galeria)'
                            : s.area === 'estudio_cobertura'
                            ? 'Estúdio Cobertura (/cobertura)'
                            : s.area === 'sala_cinema'
                            ? 'Sala de Cinema (/cinema)'
                            : `Mostra · ${s.activeCommunityTitle || 'Início'}${s.activeTheme ? ` (${s.activeTheme})` : ''}`}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-emerald-800">
                          <Clock size={12} className="inline mr-1" />
                          {formatLoggedDuration(s.startedAt, s.lastSeenAt, s.endedAt, s.isOnline, now)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                          {new Date(s.startedAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
