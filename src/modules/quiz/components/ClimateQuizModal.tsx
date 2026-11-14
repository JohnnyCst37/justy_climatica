import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Sparkles, X, XCircle } from 'lucide-react';
import type { QuizQuestion, ThemeSessionKey } from '../../../shared/types/domain';
import { drawFiveQuestions } from '../services/quizSelector';
import { lyriaEngine } from '../../audio/services/lyriaSoundscapeEngine';

interface ClimateQuizModalProps {
  isOpen: boolean;
  visitorName: string;
  activeTheme: ThemeSessionKey;
  onClose: () => void;
  onFinishVisitorCycle: () => void;
  onSpeakText: (text: string) => void;
}

export const ClimateQuizModal: React.FC<ClimateQuizModalProps> = ({
  isOpen,
  visitorName,
  activeTheme,
  onClose,
  onFinishVisitorCycle,
  onSpeakText,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    setQuestions(drawFiveQuestions(activeTheme));
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setFinished(false);
    setCountdown(30);
  }, [isOpen, activeTheme]);

  useEffect(() => {
    if (!isOpen || !finished) return;
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onFinishVisitorCycle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, finished, onFinishVisitorCycle]);

  if (!isOpen || questions.length === 0) return null;

  const current = questions[currentIdx];

  const handleChoose = (optIdx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    lyriaEngine.playTransitionChime();
    if (optIdx === current.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setFinished(true);
      onSpeakText(
        `Parabéns ${visitorName}! Você concluiu o desafio com ${score} de 5 acertos e recebeu o selo de Guardião da Justiça Climática da EE CM João Ribeiro Vilela!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          title="Fechar Quiz"
        >
          <X size={18} />
        </button>

        {!finished ? (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between pr-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Sparkles size={13} /> Desafio Rápido (5 de 100 Curiosidades)
                </span>
                <span className="text-xs font-extrabold text-slate-700">
                  {currentIdx + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-700 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {current.question}
            </h3>

            <div className="space-y-2">
              {current.options.map((opt, idx) => {
                const answered = selectedOpt !== null;
                const isCorrect = idx === current.correctIndex;
                const isPicked = idx === selectedOpt;

                let btnClass = 'bg-white border-slate-200 hover:border-emerald-600 text-slate-800';
                if (answered) {
                  if (isCorrect) btnClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold';
                  else if (isPicked) btnClass = 'bg-rose-50 border-rose-500 text-rose-900';
                  else btnClass = 'bg-slate-50 border-slate-200 text-slate-400';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoose(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />}
                    {answered && isPicked && !isCorrect && <XCircle size={16} className="text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-xs text-amber-950 leading-relaxed">
                  <strong>💡 Curiosidade do Território:</strong> {current.curiosity}
                </p>
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold"
                >
                  {currentIdx + 1 < questions.length ? 'Próxima Pergunta →' : 'Ver Meu Selo Digital'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
              <Award size={32} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                Certificado Digital de Participação
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Guardião da Justiça Climática
              </h2>
              <p className="text-xs font-bold text-slate-600">
                EE CM João Ribeiro Vilela · Mato Grosso
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
              <p className="text-sm font-extrabold text-slate-900">{visitorName}</p>
              <p className="text-xs text-emerald-800 font-bold">
                Pontuação no Desafio: {score} de {questions.length} acertos
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed pt-1">
                Obrigado por ouvir e dar voz às comunidades tradicionais, às nascentes e à biodiversidade do nosso estado!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={onFinishVisitorCycle}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                <RotateCcw size={15} />
                <span>Concluir e Próximo Visitante ({countdown}s)</span>
              </button>
              <button
                onClick={() => {
                  setQuestions(drawFiveQuestions(activeTheme));
                  setCurrentIdx(0);
                  setSelectedOpt(null);
                  setScore(0);
                  setFinished(false);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Sortear outras 5 perguntas do banco de 100
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

