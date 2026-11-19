import React, { useEffect, useState } from 'react';
import {
  Award, CheckCircle2, Clapperboard, Film, Play,
  RotateCcw, SkipForward, Sparkles, Volume2, VolumeX, XCircle,
} from 'lucide-react';
import type { CinemaSessionRecord } from '../../../shared/types/domain';
import { ResolvedVideoPlayer } from '../../../shared/components/ResolvedVideoPlayer';
import {
  isDirectVideoFileUrl,
  toEmbedVideoUrl,
} from '../../../shared/utils/videoEmbedResolver';
import {
  CINEMA_THEME_LABELS,
  buildCinemaOpeningSpeech,
  buildCinemaQuizAnswerSpeech,
  buildCinemaQuizQuestionSpeech,
} from '../services/cinemaSessionService';

interface CinemaStagePlayerProps {
  session: CinemaSessionRecord;
  isSpeaking: boolean;
  isLoadingVoice: boolean;
  onSpeak: (text: string, slideId: string, onComplete?: () => void) => Promise<void>;
  onStopVoice: () => void;
  onPrewarmQuestions?: (texts: string[]) => void;
  onUpdateState: (
    patch: Partial<Pick<CinemaSessionRecord, 'status' | 'activeVideoIndex'>>
  ) => Promise<void>;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const CinemaStagePlayer: React.FC<CinemaStagePlayerProps> = ({
  session,
  isSpeaking,
  isLoadingVoice,
  onSpeak,
  onStopVoice,
  onPrewarmQuestions,
  onUpdateState,
}) => {
  const [quizIdx, setQuizIdx] = useState(0);
  const [pickedOpt, setPickedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [openingPlaying, setOpeningPlaying] = useState(false);

  useEffect(() => {
    setQuizIdx(0);
    setPickedOpt(null);
    setScore(0);
    setOpeningPlaying(false);
    if (onPrewarmQuestions && session.quizQuestions.length > 0) {
      onPrewarmQuestions(
        session.quizQuestions.map((q, i) =>
          buildCinemaQuizQuestionSpeech(q, i, session.quizQuestions.length)
        )
      );
    }
  }, [session.id, session.quizQuestions, onPrewarmQuestions]);

  const videos = session.videos;
  const activeVideo = videos[session.activeVideoIndex] || videos[0];
  const currentUrl = activeVideo?.mediaUrl || '';
  const isDirectFile = isDirectVideoFileUrl(currentUrl);
  const embedUrl = toEmbedVideoUrl(currentUrl);
  const openingSpeech = buildCinemaOpeningSpeech(session);
  const questions = session.quizQuestions;
  const currentQ = questions[quizIdx];

  const handleStartWithOpeningVoice = () => {
    setOpeningPlaying(true);
    void onSpeak(openingSpeech, `cinema-open-${session.id}`, () => {
      setOpeningPlaying(false);
      void onUpdateState({ status: 'exibindo', activeVideoIndex: 0 });
    });
  };

  const handleEnterQuiz = () => {
    onStopVoice();
    setQuizIdx(0);
    setPickedOpt(null);
    setScore(0);
    void onUpdateState({ status: 'quiz' });
    if (questions[0]) {
      void onSpeak(
        buildCinemaQuizQuestionSpeech(questions[0], 0, questions.length),
        `cinema-q-${session.id}-0`
      );
    }
  };

  const handlePickAnswer = (idx: number) => {
    if (pickedOpt !== null || !currentQ) return;
    setPickedOpt(idx);
    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) setScore((prev) => prev + 1);
    void onSpeak(
      buildCinemaQuizAnswerSpeech(currentQ, isCorrect),
      `cinema-ans-${session.id}-${quizIdx}`
    );
  };

  const handleNextQuestion = () => {
    onStopVoice();
    if (quizIdx + 1 < questions.length) {
      const next = quizIdx + 1;
      setQuizIdx(next);
      setPickedOpt(null);
      if (questions[next]) {
        void onSpeak(
          buildCinemaQuizQuestionSpeech(questions[next], next, questions.length),
          `cinema-q-${session.id}-${next}`
        );
      }
    } else {
      void onUpdateState({ status: 'encerrada' });
      void onSpeak(
        `Sessão encerrada com ${score} de ${questions.length} acertos! Parabéns a todos na Sala de Cinema da EE CM João Ribeiro Vilela.`,
        `cinema-end-${session.id}`
      );
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden">
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#071e17] to-[#0f3326] border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo-jc.png"
            alt="Logo Justiça Climática"
            className="w-10 h-10 rounded-xl object-cover border border-amber-400/50 shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300 block truncate">
              {CINEMA_THEME_LABELS[session.theme]} · {session.hostsLabel}
            </span>
            <h2 className="text-sm sm:text-lg font-black text-white truncate">{session.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(isSpeaking || isLoadingVoice) && (
            <button
              type="button"
              onClick={onStopVoice}
              className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <VolumeX size={13} />
              <span>{isLoadingVoice ? 'Carregando Voz IA...' : 'Silenciar Voz IA'}</span>
            </button>
          )}
          {session.status !== 'aguardando' && (
            <button
              type="button"
              onClick={() => {
                onStopVoice();
                void onUpdateState({ status: 'aguardando', activeVideoIndex: 0 });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Abertura
            </button>
          )}
        </div>
      </div>

      {session.status === 'aguardando' && (
        <div className="p-5 sm:p-8 space-y-5 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-extrabold">
            <Clapperboard size={14} /> Sessão Pronta · {videos.length}{' '}
            {videos.length === 1 ? 'vídeo selecionado' : 'vídeos na coletânea'}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">{session.title}</h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
              <strong className="text-amber-300 block mb-1">🎙️ Texto da Voz Fluida de Abertura:</strong>
              “{openingSpeech}”
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {videos.map((v, i) => (
              <span
                key={v.id}
                className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-slate-100 flex items-center gap-1.5"
              >
                <Film size={12} className="text-emerald-300" />
                <span>
                  #{i + 1} {v.title}
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartWithOpeningVoice}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <Play size={16} className="fill-slate-950" />
              <span>
                {openingPlaying ? 'Voz de Abertura Falando...' : 'Iniciar Sessão (Voz de Abertura + Vídeos)'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onStopVoice();
                setOpeningPlaying(false);
                void onUpdateState({ status: 'exibindo', activeVideoIndex: 0 });
              }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <SkipForward size={15} /> Ir Direto para o Vídeo
            </button>
          </div>
        </div>
      )}

      {session.status === 'exibindo' && activeVideo && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/15">
            {isDirectFile ? (
              <ResolvedVideoPlayer
                key={currentUrl}
                src={currentUrl}
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                key={embedUrl || currentUrl}
                src={embedUrl || currentUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-amber-300">
                Em exibição ({session.activeVideoIndex + 1}/{videos.length}) · {activeVideo.classGroup}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {activeVideo.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onSpeak(openingSpeech, `cinema-reopen-${session.id}`)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
              >
                <Volume2 size={14} className="text-emerald-300" /> Voz de Abertura
              </button>
              {session.activeVideoIndex + 1 < videos.length && (
                <button
                  type="button"
                  onClick={() => void onUpdateState({ activeVideoIndex: session.activeVideoIndex + 1 })}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-extrabold flex items-center gap-1.5"
                >
                  <SkipForward size={14} /> Próximo Vídeo
                </button>
              )}
              <button
                type="button"
                onClick={handleEnterQuiz}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5"
              >
                <Award size={15} /> Iniciar Quiz Coletivo (5 Perguntas)
              </button>
            </div>
          </div>

          {videos.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => void onUpdateState({ activeVideoIndex: idx })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    idx === session.activeVideoIndex
                      ? 'bg-emerald-700 border-emerald-500 text-white'
                      : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  #{idx + 1} · {vid.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {session.status === 'quiz' && currentQ && (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles size={14} /> Mini Quiz da Plateia · Pergunta {quizIdx + 1} de {questions.length}
            </span>
            <button
              type="button"
              onClick={() =>
                void onSpeak(
                  buildCinemaQuizQuestionSpeech(currentQ, quizIdx, questions.length),
                  `cinema-rq-${session.id}-${quizIdx}`
                )
              }
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <Volume2 size={14} /> Ler Pergunta com Voz Fluida IA
            </button>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const answered = pickedOpt !== null;
              const isRight = idx === currentQ.correctIndex;
              const isPicked = idx === pickedOpt;
              let cls = 'bg-white/5 border-white/15 hover:border-amber-400 text-white';
              if (answered) {
                if (isRight) cls = 'bg-emerald-600/30 border-emerald-400 text-white font-extrabold';
                else if (isPicked) cls = 'bg-rose-600/30 border-rose-400 text-rose-100';
                else cls = 'bg-white/5 border-white/10 text-slate-400';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => handlePickAnswer(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-base transition flex items-center justify-between gap-3 ${cls}`}
                >
                  <span>
                    <strong className="text-amber-300 mr-2">{OPTION_LETTERS[idx]})</strong>
                    {opt}
                  </span>
                  {answered && isRight && <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />}
                  {answered && isPicked && !isRight && <XCircle size={18} className="text-rose-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {pickedOpt !== null && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 space-y-3">
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                <strong className="text-amber-300">💡 Comentário da IA:</strong> {currentQ.curiosity}
              </p>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black"
              >
                {quizIdx + 1 < questions.length ? 'Próxima Pergunta (com Voz IA) →' : 'Concluir Sessão & Ver Placar'}
              </button>
            </div>
          )}
        </div>
      )}

      {session.status === 'encerrada' && (
        <div className="p-6 sm:p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
            <Award size={32} />
          </div>
          <h3 className="text-2xl font-black text-white">Sessão Concluída!</h3>
          <p className="text-sm text-emerald-200 font-bold">
            Placar da Plateia: {score} de {questions.length} acertos · {session.hostsLabel}
          </p>
          <button
            type="button"
            onClick={() => {
              onStopVoice();
              void onUpdateState({ status: 'aguardando', activeVideoIndex: 0 });
            }}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-extrabold inline-flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reabrir Sessão do Início
          </button>
        </div>
      )}
    </div>
  );
};
