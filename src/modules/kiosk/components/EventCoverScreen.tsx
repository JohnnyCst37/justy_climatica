import React, { useState } from 'react';
import { Clapperboard, LogIn, Maximize, Radio, Sparkles, UserCheck, Volume2 } from 'lucide-react';
import type { AgeGroupKey, VisitorCategory } from '../../../shared/types/domain';
import { InstitutionalSynergyBar } from '../../../shared/components/InstitutionalSynergyBar';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';
import { defaultGroupForCategory } from '../../presence/services/presenceService';
import { lyriaEngine } from '../../audio/services/lyriaSoundscapeEngine';

interface EventCoverScreenProps {
  onStartVisitor: (input: {
    nickname: string;
    age: number;
    ageGroup: AgeGroupKey;
    category: VisitorCategory;
    classGroup: string;
  }) => Promise<void>;
  onStartWithGoogle: (input: {
    age: number;
    ageGroup: AgeGroupKey;
    category: VisitorCategory;
    classGroup: string;
  }) => Promise<boolean>;
  authError: string | null;
  onSpeakWelcome: (text: string) => void;
  isSpeakingWelcome: boolean;
}

const STATUS_OPTIONS: Array<{ value: VisitorCategory; label: string }> = [
  { value: 'estudante', label: 'Estudante' },
  { value: 'professor', label: 'Equipe Escolar (Prof., Direção, Secretaria, Apoio)' },
  { value: 'dre', label: 'DRE / Gestão Educacional (Seduc-MT)' },
  { value: 'outro', label: 'Outros / Visitante / Família' },
];

const AGE_GROUPS: Array<{ key: AgeGroupKey; label: string; sampleAge: number; desc: string }> = [
  { key: '10-12', label: '10 a 12 anos', sampleAge: 11, desc: 'História visual e curiosidades' },
  { key: '13-15', label: '13 a 15 anos', sampleAge: 14, desc: 'Ciência clara do 9º ano' },
  { key: '16-18', label: '16 a 18 anos', sampleAge: 17, desc: 'Território & biodiversidade' },
  { key: '19+', label: 'Adulto / 19+', sampleAge: 28, desc: 'Visão cidadã e gestão' },
];

export const WELCOME_SPEECH =
  'Bem-vindo à Jornada da Justiça Climática na EE CM João Ribeiro Vilela. Faça login para começar.';

export const EventCoverScreen: React.FC<EventCoverScreenProps> = ({
  onStartVisitor,
  onStartWithGoogle,
  authError,
  onSpeakWelcome,
  isSpeakingWelcome,
}) => {
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<VisitorCategory>('estudante');
  const [classGroup, setClassGroup] = useState<string>('9º Ano A');
  const [sectorOrRole, setSectorOrRole] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<AgeGroupKey>('13-15');
  const [exactAge, setExactAge] = useState<number>(14);
  const [startingGoogle, setStartingGoogle] = useState(false);
  const [startingQuick, setStartingQuick] = useState(false);

  const handleSelectCategory = (nextCat: VisitorCategory) => {
    setCategory(nextCat);
    setClassGroup(defaultGroupForCategory(nextCat));
    if (nextCat !== 'estudante' && ageGroup === '13-15' && exactAge === 14) {
      setAgeGroup('19+');
      setExactAge(28);
    } else if (nextCat === 'estudante' && ageGroup === '19+' && exactAge === 28) {
      setAgeGroup('13-15');
      setExactAge(14);
    }
  };

  const resolveGroup = (): string =>
    category === 'estudante' ? classGroup : sectorOrRole.trim() || defaultGroupForCategory(category);

  const requestKioskFullscreen = async () => {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  const handleGoogleEntry = async () => {
    setStartingGoogle(true);
    try {
      await requestKioskFullscreen();
      await onStartWithGoogle({
        age: exactAge,
        ageGroup,
        category,
        classGroup: resolveGroup(),
      });
    } finally {
      setStartingGoogle(false);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartingQuick(true);
    try {
      await requestKioskFullscreen();
      await onStartVisitor({
        nickname: nickname.trim() || (category === 'dre' ? 'Gestor(a) DRE' : 'Visitante da Mostra'),
        age: exactAge,
        ageGroup,
        category,
        classGroup: resolveGroup(),
      });
    } finally {
      setStartingQuick(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#071e17] via-[#0d3326] to-[#1a2e1a] text-white flex items-start sm:items-center justify-center px-3.5 py-6 sm:p-8 relative overflow-x-hidden overflow-y-auto">
      <div className="absolute -top-28 -left-28 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 sm:w-[460px] h-80 sm:h-[460px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-center">
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo-jc.png"
              alt="Logo Oficial Jornada da Justiça Climática"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300/60 shadow-xl shrink-0"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[11px] sm:text-xs font-bold text-amber-300 tracking-wide uppercase">
              <Sparkles size={13} className="shrink-0" />
              <span>2ª Mostra Cultural · 19/11 · Mato Grosso</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Jornada da Justiça Climática
            <span className="block text-emerald-300 text-lg sm:text-3xl font-extrabold mt-1.5 sm:mt-2">
              na EE CM João Ribeiro Vilela
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-xl">
            Experiência guiada de <strong>1 a 5 minutos</strong> com mapas vivos de MT, vozes reais das comunidades,
            <strong> Sala de Cinema com Quiz da IA</strong> e <strong>Galeria ao Vivo</strong>.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
            <a
              href="/cinema"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg transition-all"
            >
              <Clapperboard size={16} className="shrink-0" />
              <span>Sala de Cinema (Sessões & Quiz)</span>
            </a>

            <a
              href="/galeria"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-rose-600/95 hover:bg-rose-500 border border-rose-300/40 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all"
            >
              <Radio size={16} className="animate-pulse shrink-0" />
              <span>Galeria & Cobertura Live</span>
            </a>

            <button
              type="button"
              onClick={() => {
                lyriaEngine.initOnLogin();
                lyriaEngine.setMuted(false);
                onSpeakWelcome(WELCOME_SPEECH);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all"
            >
              <Volume2 size={16} className={isSpeakingWelcome ? 'text-amber-300 animate-pulse' : 'text-emerald-300'} />
              <span>{isSpeakingWelcome ? 'Recepção falando...' : 'Ouvir boas-vindas'}</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleQuickSubmit}
          className="lg:col-span-5 bg-[#fdfbf7] text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 space-y-3.5"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <UserCheck size={14} /> Entrada Sem Senha na Jornada
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Escolha seu status e entre em 1 clique
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Seu status na 2ª Mostra Cultural:
            </label>
            <select
              aria-label="Selecione seu status na Mostra"
              value={category}
              onChange={(e) => handleSelectCategory(e.target.value as VisitorCategory)}
              className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-emerald-600 bg-white text-sm sm:text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {category === 'estudante' ? (
              <select
                aria-label="Selecione sua Turma"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800"
              >
                {SCHOOL_CLASS_OPTIONS.map((turma) => (
                  <option key={turma} value={turma}>
                    Turma: {turma}
                  </option>
                ))}
                <option value="Outra Turma / Escola">Outra Turma / Escola</option>
              </select>
            ) : (
              <input
                type="text"
                value={sectorOrRole}
                onChange={(e) => setSectorOrRole(e.target.value)}
                placeholder={
                  category === 'dre'
                    ? 'DRE / Setor (ex: DRE Tangará / Assessoria)'
                    : category === 'professor'
                    ? 'Função ou disciplina (opcional)'
                    : 'Cidade ou vínculo (opcional)'
                }
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-300 bg-white text-xs"
              />
            )}

            {category === 'dre' && (
              <p className="text-[11px] font-bold text-amber-950 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2">
                Seja bem-vindo(a), gestor(a) da DRE! Sua visita fica destacada para a nossa escola acompanhar sua participação ao vivo.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Faixa etária (adapta o Guia IA):</label>
              <input
                type="number"
                min={6}
                max={99}
                value={exactAge}
                onChange={(e) => {
                  const val = Math.max(6, Math.min(99, Number(e.target.value) || 14));
                  setExactAge(val);
                  if (val <= 12) setAgeGroup('10-12');
                  else if (val <= 15) setAgeGroup('13-15');
                  else if (val <= 18) setAgeGroup('16-18');
                  else setAgeGroup('19+');
                }}
                className="w-16 px-2 py-1 text-center text-xs font-bold rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {AGE_GROUPS.map((g) => {
                const active = ageGroup === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => {
                      setAgeGroup(g.key);
                      setExactAge(g.sampleAge);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs'
                        : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{g.label}</div>
                    <div className={`text-[10px] mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={startingGoogle}
            onClick={() => void handleGoogleEntry()}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <LogIn size={16} />
            <span>{startingGoogle ? 'Conectando Google...' : 'Entrar com Conta Google (1 Clique)'}</span>
          </button>

          {authError && (
            <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {authError}
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block text-center">
              Ou acesse pelo Chromebook sem Conta Google:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Seu primeiro nome ou apelido..."
                required
                className="flex-1 px-3 py-2 min-h-[42px] rounded-xl border border-slate-300 bg-white text-sm sm:text-xs"
              />
              <button
                type="submit"
                disabled={startingQuick}
                className="px-4 py-2 min-h-[42px] rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Maximize size={14} />
                <span>{startingQuick ? 'Abrindo...' : 'Entrar Rápido'}</span>
              </button>
            </div>
          </div>
        </form>
        </div>

        <InstitutionalSynergyBar variant="dark" />
      </div>
    </div>
  );
};
