import React, { useState } from 'react';
import { Maximize, Sparkles, UserCheck, Volume2 } from 'lucide-react';
import type { AgeGroupKey, VisitorCategory } from '../../../shared/types/domain';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';
import {
  VISITOR_CATEGORY_LABELS,
  defaultGroupForCategory,
} from '../../presence/services/presenceService';
import {
  requiresRolePasscode,
  validateRolePasscode,
} from '../../auth/services/rolePasscodesService';
import { lyriaEngine } from '../../audio/services/lyriaSoundscapeEngine';

interface EventCoverScreenProps {
  onStartVisitor: (input: {
    nickname: string;
    age: number;
    ageGroup: AgeGroupKey;
    category: VisitorCategory;
    classGroup: string;
  }) => Promise<void>;
  onSpeakWelcome: (text: string) => void;
  isSpeakingWelcome: boolean;
}

const OTHER_ROLE_OPTIONS: Array<{ value: VisitorCategory; label: string }> = [
  { value: 'professor', label: 'Professor(a)' },
  { value: 'coordenador', label: 'Coordenador(a)' },
  { value: 'diretor', label: 'Diretor(a)' },
  { value: 'dre', label: 'Representante da DRE' },
  { value: 'outro', label: 'Outro / Convidado / Família' },
];

const AGE_GROUPS: Array<{ key: AgeGroupKey; label: string; sampleAge: number; desc: string }> = [
  { key: '10-12', label: '10 a 12 anos', sampleAge: 11, desc: 'História visual e curiosidades' },
  { key: '13-15', label: '13 a 15 anos', sampleAge: 14, desc: 'Ciência clara do 9º ano' },
  { key: '16-18', label: '16 a 18 anos', sampleAge: 17, desc: 'Território & biodiversidade' },
  { key: '19+', label: 'Adulto / 19+', sampleAge: 25, desc: 'Visão cidadã e pesquisa' },
];

export const WELCOME_SPEECH =
  'Bem-vindo à Jornada da Justiça Climática na EE CM João Ribeiro Vilela. Faça login para começar.';

export const EventCoverScreen: React.FC<EventCoverScreenProps> = ({
  onStartVisitor,
  onSpeakWelcome,
  isSpeakingWelcome,
}) => {
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<VisitorCategory>('estudante');
  const [classGroup, setClassGroup] = useState<string>('9º Ano A');
  const [disciplineOrSector, setDisciplineOrSector] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroupKey>('13-15');
  const [exactAge, setExactAge] = useState<number>(14);
  const [starting, setStarting] = useState(false);

  const handleSelectCategory = (nextCat: VisitorCategory) => {
    setCategory(nextCat);
    setClassGroup(defaultGroupForCategory(nextCat));
    setPasscode('');
    setPasscodeError(null);
    if (nextCat !== 'estudante' && ageGroup === '13-15' && exactAge === 14) {
      setAgeGroup('19+');
      setExactAge(28);
    } else if (nextCat === 'estudante' && ageGroup === '19+' && exactAge === 28) {
      setAgeGroup('13-15');
      setExactAge(14);
    }
  };

  const handleSelectAgeGroup = (group: { key: AgeGroupKey; sampleAge: number }) => {
    setAgeGroup(group.key);
    setExactAge(group.sampleAge);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresRolePasscode(category) && !validateRolePasscode(category, passcode)) {
      setPasscodeError(
        `Senha inválida para ${VISITOR_CATEGORY_LABELS[category]}. Solicite a senha ao Super Admin ou selecione "Estudante".`
      );
      return;
    }

    setPasscodeError(null);
    setStarting(true);
    try {
      // Prepara áudio Lyria e solicita Tela Cheia diretamente no gesto do clique
      lyriaEngine.initOnLogin();
      lyriaEngine.setThemeAmbience('cerrado');
      lyriaEngine.playTransitionChime();

      if (document.fullscreenEnabled && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => undefined);
      }

      const resolvedGroup =
        category === 'estudante'
          ? classGroup
          : requiresRolePasscode(category)
          ? disciplineOrSector.trim() || defaultGroupForCategory(category)
          : defaultGroupForCategory(category);

      await onStartVisitor({
        nickname: nickname.trim() || 'Visitante da Mostra',
        age: exactAge,
        ageGroup,
        category,
        classGroup: resolvedGroup,
      });
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#071e17] via-[#0d3326] to-[#1a2e1a] text-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Brilhos orgânicos de fundo */}
      <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[460px] h-[460px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Coluna Esquerda: Capa Cinematográfica do Evento */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-amber-300 tracking-wide uppercase">
            <Sparkles size={14} />
            <span>Mostra Científica & Interativa · Mato Grosso</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] text-white">
            Jornada da Justiça Climática
            <span className="block text-emerald-300 text-2xl sm:text-3xl font-extrabold mt-2">
              na EE CM João Ribeiro Vilela
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            Uma experiência guiada de <strong>1 a 5 minutos</strong> com paisagens sonoras dos nossos biomas,
            mapas vivos, histórias reais das comunidades e desafio interativo adaptado à sua idade.
          </p>

          <button
            type="button"
            onClick={() => {
              lyriaEngine.initOnLogin();
              onSpeakWelcome(WELCOME_SPEECH);
            }}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all"
          >
            <Volume2 size={16} className={isSpeakingWelcome ? 'text-amber-300 animate-pulse' : 'text-emerald-300'} />
            <span>
              {isSpeakingWelcome ? 'Recepção em áudio falando...' : 'Ouvir boas-vindas do Guia de Voz'}
            </span>
          </button>
        </div>

        {/* Coluna Direita: Entrada Rápida (Nome + Idade) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-[#fdfbf7] text-slate-900 rounded-3xl p-6 shadow-2xl border border-white/20 space-y-4"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <UserCheck size={14} /> Entrada Rápida de Visitante
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Faça login para começar
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Seu primeiro nome ou apelido</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ex: Ana Clara, Lucas 9ºB..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Você é:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectCategory('estudante')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition ${
                  category === 'estudante'
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500'
                }`}
              >
                Estudante
              </button>
              <button
                type="button"
                onClick={() => {
                  if (category === 'estudante') handleSelectCategory('professor');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition ${
                  category !== 'estudante'
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500'
                }`}
              >
                Outro Perfil ▾
              </button>
            </div>

            {category === 'estudante' ? (
              <select
                aria-label="Selecione sua Turma"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800"
              >
                {SCHOOL_CLASS_OPTIONS.map((turma) => (
                  <option key={turma} value={turma}>
                    Turma: {turma}
                  </option>
                ))}
                <option value="Outra Turma / Escola">Outra Turma / Escola</option>
              </select>
            ) : (
              <div className="space-y-2 pt-1">
                <select
                  aria-label="Selecione seu cargo ou perfil"
                  value={category}
                  onChange={(e) => handleSelectCategory(e.target.value as VisitorCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-600 bg-emerald-50/40 text-xs font-extrabold text-emerald-950"
                >
                  {OTHER_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {requiresRolePasscode(category) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={disciplineOrSector}
                      onChange={(e) => setDisciplineOrSector(e.target.value)}
                      placeholder={
                        category === 'professor'
                          ? 'Disciplina (ex: Ciências)'
                          : 'Setor (ex: Coordenação / DRE)'
                      }
                      required
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Senha do perfil"
                      required
                      className="px-3 py-2 rounded-xl border border-amber-400 bg-amber-50/40 text-xs font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {passcodeError && (
            <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {passcodeError}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Qual a sua idade?</label>
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

            <div className="grid grid-cols-2 gap-2">
              {AGE_GROUPS.map((g) => {
                const active = ageGroup === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => handleSelectAgeGroup(g)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
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
            type="submit"
            disabled={starting}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Maximize size={16} />
            <span>{starting ? 'Preparando Biomas e Áudio...' : 'Começar Jornada (Tela Cheia)'}</span>
          </button>

          <p className="text-[10.5px] text-slate-500 text-center leading-snug">
            O Guia adapta as palavras para a sua idade e inicia a ambientação sonora automaticamente.
          </p>
        </form>
      </div>
    </div>
  );
};

