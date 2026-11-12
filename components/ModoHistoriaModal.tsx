import React, { useState, useEffect, useRef } from 'react';
import { ItemMural } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

interface ModoHistoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  itens: ItemMural[];
  itemInicialId?: string;
}

export const ModoHistoriaModal: React.FC<ModoHistoriaModalProps> = ({
  isOpen,
  onClose,
  itens,
  itemInicialId,
}) => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [carregandoAudio, setCarregandoAudio] = useState(false);
  const [autoAvancar, setAutoAvancar] = useState(true);
  const [vozSelecionada, setVozSelecionada] = useState<'Kore' | 'Puck' | 'Charon' | 'Zephyr'>('Kore');
  const [modoMotorVoz, setModoMotorVoz] = useState<'gemini-tts' | 'navegador'>('gemini-tts');
  const [statusNarrador, setStatusNarrador] = useState<string>('Pronto para narrar');
  const [pontoAtivo, setPontoAtivo] = useState<number | null>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheAudioCliente = useRef<Record<string, string>>({});

  // Sincroniza o slide inicial ao abrir
  useEffect(() => {
    if (isOpen && itens.length > 0) {
      const idx = itens.findIndex((i) => i.id === itemInicialId);
      setIndiceAtual(idx >= 0 ? idx : 0);
      setPontoAtivo(1);
    } else {
      pararAudioAtual();
    }
  }, [isOpen, itemInicialId, itens]);

  const itemAtual = itens[indiceAtual] || itens[0];

  const pararAudioAtual = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setReproduzindo(false);
    setCarregandoAudio(false);
  };

  const avancarSlide = () => {
    pararAudioAtual();
    if (itens.length === 0) return;
    const prox = (indiceAtual + 1) % itens.length;
    setIndiceAtual(prox);
    setPontoAtivo(1);
  };

  const voltarSlide = () => {
    pararAudioAtual();
    if (itens.length === 0) return;
    const ant = (indiceAtual - 1 + itens.length) % itens.length;
    setIndiceAtual(ant);
    setPontoAtivo(1);
  };

  const narrarComSintetizadorNavegador = (texto: string, aoTerminar: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatusNarrador('Áudio indisponível neste dispositivo');
      setReproduzindo(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    utter.rate = 1.02;
    const vozes = window.speechSynthesis.getVoices();
    const vozPT = vozes.find((v) => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (vozPT) utter.voice = vozPT;

    utter.onstart = () => {
      setCarregandoAudio(false);
      setReproduzindo(true);
      setStatusNarrador('Narrando história (Voz PT-BR)');
    };
    utter.onend = () => {
      setReproduzindo(false);
      setStatusNarrador('Capítulo concluído');
      aoTerminar();
    };
    utter.onerror = () => {
      setReproduzindo(false);
      setCarregandoAudio(false);
    };
    window.speechSynthesis.speak(utter);
  };

  const iniciarNarracaoSlide = async (slideItem: ItemMural) => {
    if (!slideItem) return;
    pararAudioAtual();
    setCarregandoAudio(true);
    setStatusNarrador('Gerando narração com Gemini TTS (API Key)...');

    const chaveCache = `${slideItem.id}:${vozSelecionada}`;

    const handleFimAudio = () => {
      setReproduzindo(false);
      setStatusNarrador('Capítulo concluído');
      if (autoAvancar && itens.length > 1) {
        setTimeout(() => {
          setIndiceAtual((prev) => {
            const next = (prev + 1) % itens.length;
            return next;
          });
        }, 900);
      }
    };

    if (modoMotorVoz === 'navegador') {
      narrarComSintetizadorNavegador(slideItem.narracaoModoHistoria, handleFimAudio);
      return;
    }

    try {
      let audioDataUrl = cacheAudioCliente.current[chaveCache];

      if (!audioDataUrl) {
        const resp = await fetch('/api/narrar-historia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texto: slideItem.narracaoModoHistoria,
            slideId: slideItem.id,
            voz: vozSelecionada,
          }),
        });

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const data = await resp.json();
        if (!data?.audioUrl) {
          throw new Error('Sem URL de áudio');
        }
        audioDataUrl = data.audioUrl;
        cacheAudioCliente.current[chaveCache] = audioDataUrl;
      }

      const audio = new Audio(audioDataUrl);
      audioRef.current = audio;
      audio.onplay = () => {
        setCarregandoAudio(false);
        setReproduzindo(true);
        setStatusNarrador(`Narrando com Gemini TTS (Voz ${vozSelecionada})`);
      };
      audio.onended = handleFimAudio;
      audio.onerror = () => {
        // Fallback automático para voz PT-BR caso o navegador bloqueie o formato
        narrarComSintetizadorNavegador(slideItem.narracaoModoHistoria, handleFimAudio);
      };
      await audio.play();
    } catch (err) {
      console.warn('Usando sintetizador PT-BR local como fallback:', err);
      narrarComSintetizadorNavegador(slideItem.narracaoModoHistoria, handleFimAudio);
    }
  };

  // Quando muda de slide e autoAvancar + estava reproduzindo, podemos narrar se o usuário desejar
  const togglePlayPause = () => {
    if (reproduzindo || carregandoAudio) {
      pararAudioAtual();
      setStatusNarrador('Narração pausada');
    } else if (itemAtual) {
      iniciarNarracaoSlide(itemAtual);
    }
  };

  useEffect(() => {
    return () => {
      pararAudioAtual();
    };
  }, []);

  if (!isOpen || !itemAtual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 md:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* TOPO DO MODO HISTÓRIA */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 flex-none">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold">
              Modo História · Sessão de Fotos Narrada
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Capítulo {indiceAtual + 1} de {itens.length}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · {statusNarrador}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor de Voz Gemini API */}
            <select
              value={vozSelecionada}
              onChange={(e) => setVozSelecionada(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
              title="Escolher timbre do Narrador IA (Gemini API)"
            >
              <option value="Kore">Voz IA: Kore (Documentário)</option>
              <option value="Puck">Voz IA: Puck (Jovem/Dinâmica)</option>
              <option value="Charon">Voz IA: Charon (Grave)</option>
              <option value="Zephyr">Voz IA: Zephyr (Suave)</option>
            </select>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              title="Fechar Modo História"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PALCO VISUAL DA SESSÃO DE FOTOS + INFOGRÁFICO EM PORTUGUÊS + ESPÉCIES EM LATIM */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Lado Esquerdo: Fotografia/Ilustração em Alta Definição com Pontos em Português */}
          <div className="lg:col-span-7 relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[260px]">
            <img
              src={itemAtual.infografico.url}
              alt={itemAtual.titulo}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover max-h-[58vh]"
            />

            {/* Gradiente de leitura na base */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4">
              <div className="text-xs text-emerald-300 font-semibold">
                {itemAtual.grupoNome} · Bioma {itemAtual.bioma} · {itemAtual.municipio} (MT)
              </div>
              <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                {itemAtual.titulo}
              </h3>
            </div>

            {/* Marcadores Interativos em Português-Brasil sobre a Imagem */}
            {itemAtual.pontosInfograficoPT?.map((pt) => {
              const ativo = pontoAtivo === pt.numero;
              return (
                <button
                  key={pt.numero}
                  onClick={() => setPontoAtivo(pt.numero)}
                  style={{ left: `${pt.xPercent}%`, top: `${pt.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full font-mono text-xs font-extrabold flex items-center justify-center transition-transform border-2 shadow-lg ${
                    ativo
                      ? 'bg-amber-500 text-slate-950 border-white scale-125 z-20'
                      : 'bg-emerald-700/90 text-white border-white/90 hover:scale-110 z-10'
                  }`}
                  title={pt.tituloPT}
                >
                  {pt.numero}
                </button>
              );
            })}
          </div>

          {/* Lado Direito: Roteiro Narrado, Legendas em Português e Nomes Científicos em Latim */}
          <div className="lg:col-span-5 p-4 overflow-y-auto flex flex-col justify-between gap-3 bg-slate-900 border-l border-slate-800">
            <div className="space-y-3">
              {/* Texto da Narração de Áudio (Transcrição Sincronizada) */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Volume2 size={13} />
                    Narração da História (Português - Brasil)
                  </span>
                  <span>Equipe 9º Ano</span>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed">
                  {itemAtual.narracaoModoHistoria}
                </p>
              </div>

              {/* Detalhe do Ponto Clicado no Infográfico em Português */}
              {itemAtual.pontosInfograficoPT && itemAtual.pontosInfograficoPT.length > 0 && (
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-amber-400">
                    Legenda Interativa da Imagem (Português-BR):
                  </div>
                  <div className="space-y-1.5">
                    {itemAtual.pontosInfograficoPT.map((pt) => (
                      <div
                        key={pt.numero}
                        onClick={() => setPontoAtivo(pt.numero)}
                        className={`p-2 rounded-lg text-xs cursor-pointer transition-colors border ${
                          pontoAtivo === pt.numero
                            ? 'bg-amber-500/15 border-amber-400/60 text-white'
                            : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between gap-1">
                          <span>
                            {pt.numero}. {pt.tituloPT}
                          </span>
                          {pt.nomeLatim && (
                            <em className="text-[11px] font-serif italic text-emerald-300 font-normal">
                              ({pt.nomeLatim})
                            </em>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                          {pt.detalhePT}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nomenclatura Científica Binomial em Latim */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-300">
                  Taxonomia Científica (Norma Binomial em Latim):
                </div>
                <div className="space-y-1">
                  {itemAtual.especiesCientificas.map((esp, i) => (
                    <div key={i} className="text-[11px] text-slate-200 leading-snug">
                      <span className="font-semibold text-white">{esp.nomePopular}:</span>{' '}
                      <em className="font-serif italic text-emerald-300 font-semibold">
                        {esp.nomeCientificoLatim}
                      </em>{' '}
                      <span className="text-slate-400">({esp.familia})</span> — {esp.papelEcologico}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Miniaturas das Fotos da Sessão */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {itens.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      pararAudioAtual();
                      setIndiceAtual(idx);
                      setPontoAtivo(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors border ${
                      idx === indiceAtual
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}. {it.titulo.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR DE CONTROLE DE ÁUDIO E TRANSIÇÃO DE FOTOS */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-none">
          <div className="flex items-center gap-2">
            <button
              onClick={voltarSlide}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <SkipBack size={14} />
              <span>Anterior</span>
            </button>

            <button
              onClick={togglePlayPause}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              {carregandoAudio ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Gerando Áudio IA...</span>
                </>
              ) : reproduzindo ? (
                <>
                  <Pause size={15} />
                  <span>Pausar Narração</span>
                </>
              ) : (
                <>
                  <Play size={15} />
                  <span>Ouvir Narração deste Capítulo</span>
                </>
              )}
            </button>

            <button
              onClick={avancarSlide}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <span>Próximo</span>
              <SkipForward size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAvancar}
                onChange={(e) => setAutoAvancar(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>Avançar fotos automaticamente ao terminar o áudio</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModoHistoriaModal;
