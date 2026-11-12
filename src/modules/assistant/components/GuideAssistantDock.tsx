import React, { useState } from 'react';
import { Globe, Loader2, Mic, MicOff, Send, Sparkles, Volume2, ChevronUp, ChevronDown } from 'lucide-react';
import type { AssistantMessage } from '../../../shared/types/domain';

interface GuideAssistantDockProps {
  messages: AssistantMessage[];
  loadingReply: boolean;
  discoveringWeb: boolean;
  voiceStatus: 'idle' | 'connecting' | 'live' | 'speaking';
  errorMsg: string | null;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  onToggleLiveVoice: () => void;
  onSearchWebCommunities: () => void;
}

export const GuideAssistantDock: React.FC<GuideAssistantDockProps> = ({
  messages,
  loadingReply,
  discoveringWeb,
  voiceStatus,
  errorMsg,
  onSendMessage,
  onSpeakText,
  onToggleLiveVoice,
  onSearchWebCommunities,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const latestGuide = [...messages].reverse().find((m) => m.sender === 'guide');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setExpanded(true);
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="p-3 space-y-2 bg-[#f8f7f3]">
      {/* Cabeçalho compacto do Motor Guia */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-emerald-800"
        >
          <Sparkles size={13} className="text-amber-500" />
          <span>Guia Natural</span>
          {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onSearchWebCommunities}
            disabled={discoveringWeb}
            title="Buscar comunidades tradicionais anônimas na web"
            className="px-2 py-1 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10.5px] font-bold flex items-center gap-1"
          >
            {discoveringWeb ? <Loader2 size={11} className="animate-spin" /> : <Globe size={11} />}
            <span>Buscar Vozes Web</span>
          </button>

          <button
            onClick={() => latestGuide && onSpeakText(latestGuide.text)}
            disabled={!latestGuide || voiceStatus === 'speaking'}
            title="Ouvir orientação do Guia"
            className="px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[10.5px] font-semibold flex items-center gap-1"
          >
            <Volume2 size={11} />
            <span>Ouvir</span>
          </button>

          <button
            onClick={onToggleLiveVoice}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-colors ${
              voiceStatus === 'live'
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
            }`}
          >
            {voiceStatus === 'live' ? <MicOff size={11} /> : <Mic size={11} />}
            <span>{voiceStatus === 'live' ? 'Encerrar Voz' : voiceStatus === 'connecting' ? 'Conectando...' : 'Falar'}</span>
          </button>
        </div>
      </div>

      {/* Orientação atual em 1 bloco limpo ou histórico expandido */}
      {!expanded && latestGuide && (
        <p className="text-[11.5px] text-slate-700 leading-snug bg-white border border-slate-200 rounded-xl px-3 py-2">
          {latestGuide.text}
        </p>
      )}

      {expanded && (
        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl px-3 py-2 text-[11.5px] leading-snug ${
                m.sender === 'user'
                  ? 'bg-emerald-800 text-white ml-6'
                  : 'bg-white border border-slate-200 text-slate-800 mr-4'
              }`}
            >
              <p>{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1 pt-1 border-t border-slate-100 flex flex-wrap gap-2">
                  {m.sources.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-700 underline"
                    >
                      {s.titulo}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {latestGuide?.prompts && latestGuide.prompts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {latestGuide.prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setExpanded(true);
                onSendMessage(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-emerald-600 text-[10.5px] text-slate-700 whitespace-nowrap shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte ao Guia em linguagem simples..."
          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-700"
        />
        <button
          type="submit"
          disabled={loadingReply || !input.trim()}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white"
          title="Enviar pergunta"
        >
          {loadingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
};
