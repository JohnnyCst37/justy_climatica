import React, { useRef, useState } from 'react';
import { Loader2, MessageSquareText, Send, Volume2 } from 'lucide-react';
import type { AssistantMessage } from '../../../shared/types/domain';

interface GuideAskBoxProps {
  messages: AssistantMessage[];
  loadingReply: boolean;
  onSendQuestion: (text: string) => void;
  onSpeakText: (text: string) => void;
}

const QUICK_QUESTIONS = [
  'Por que isso é injustiça climática?',
  'Como protegem a água e as espécies?',
  'O que nossa escola e os alunos propõem?',
];

export const GuideAskBox: React.FC<GuideAskBoxProps> = ({
  messages,
  loadingReply,
  onSendQuestion,
  onSpeakText,
}) => {
  const [freeQuery, setFreeQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const userMessages = messages.filter((m) => m.sender === 'user');
  const latestUserMsg = userMessages[userMessages.length - 1];
  const guideReplies = messages.filter((m) => m.sender === 'guide' && m.id.startsWith('g-'));
  const latestGuideMsg = guideReplies[guideReplies.length - 1];

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = freeQuery.trim();
    if (!clean) {
      inputRef.current?.focus();
      return;
    }
    onSendQuestion(clean);
    setFreeQuery('');
  };

  return (
    <div className="pt-2 space-y-2.5 border-t border-slate-200/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <MessageSquareText size={13} /> Pergunte ao Guia deste Território (Ativo)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loadingReply}
            onClick={() => onSendQuestion(q)}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-950 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {latestUserMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-900/5 border border-emerald-200 text-xs text-slate-700">
          <strong className="text-emerald-900">Sua pergunta:</strong> {latestUserMsg.text}
        </div>
      )}

      {loadingReply && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-emerald-700" />
          <span>O Guia está preparando a explicação sobre este território...</span>
        </div>
      )}

      {!loadingReply && latestGuideMsg && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-emerald-300/80 text-xs sm:text-sm text-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <strong className="text-emerald-800">Resposta do Guia:</strong>
            <button
              type="button"
              onClick={() => onSpeakText(latestGuideMsg.text)}
              className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-[11px] font-extrabold flex items-center gap-1"
            >
              <Volume2 size={12} /> Ouvir Resposta
            </button>
          </div>
          <p className="leading-relaxed">{latestGuideMsg.text}</p>
        </div>
      )}

      <form onSubmit={handleAskSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={freeQuery}
          onChange={(e) => setFreeQuery(e.target.value)}
          placeholder="Pergunte qualquer dúvida sobre este tema para o Guia..."
          className="flex-1 px-4 py-2.5 min-h-[44px] rounded-2xl border-2 border-emerald-600/60 bg-white text-base sm:text-sm text-slate-900 placeholder:text-slate-500 shadow-2xs focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20"
        />
        <button
          type="submit"
          disabled={loadingReply}
          className="px-4 py-2.5 min-h-[44px] rounded-2xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition"
        >
          <Send size={14} /> {loadingReply ? 'Enviando...' : 'Perguntar ao Guia'}
        </button>
      </form>
    </div>
  );
};
