import React, { useState, useEffect } from 'react';
import { ItemMural } from '../types';
import { MetricaIcon } from './Icons';
import { 
  BookOpen, 
  Video, 
  Image as ImageIcon, 
  Edit3, 
  Maximize2, 
  X, 
  Scale, 
  Shield, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Dna
} from 'lucide-react';

interface FichaCuradoriaProps {
  item: ItemMural;
  onEditarClick: () => void;
  onAbrirModoHistoria: () => void;
  onProximo: () => void;
  onAnterior: () => void;
  posicaoAtual: { atual: number; total: number };
}

type TabMidia = 'infografico' | 'video' | 'resumo';

function getEmbedVideoUrl(url: string): { embedUrl: string | null } {
  if (!url) return { embedUrl: null };

  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&autoplay=0` };
  }

  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return { embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }

  return { embedUrl: url };
}

function getDirectImageUrl(url: string): string {
  if (!url) return '';
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  return url;
}

export const FichaCuradoria: React.FC<FichaCuradoriaProps> = ({
  item,
  onEditarClick,
  onAbrirModoHistoria,
  onProximo,
  onAnterior,
  posicaoAtual,
}) => {
  const [activeTab, setActiveTab] = useState<TabMidia>('infografico');
  const [modalImagemOpen, setModalImagemOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState<number>(1);
  const [acoesChecadas, setAcoesChecadas] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setImgError(false);
    setPontoSelecionado(1);
  }, [item.id]);

  const toggleAcao = (index: number) => {
    setAcoesChecadas((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const videoInfo = getEmbedVideoUrl(item.videoEquipe.url);
  const imagemDireta = getDirectImageUrl(item.infografico.url);
  const pontoAtivoObj =
    item.pontosInfograficoPT?.find((p) => p.numero === pontoSelecionado) ||
    item.pontosInfograficoPT?.[0];

  return (
    <div className="h-full flex flex-col bg-[#fdfbf7] text-slate-900 overflow-hidden select-text border-l border-slate-200">
      {/* 1. CABEÇALHO COMPACTO DE NAVEGAÇÃO DA FICHA */}
      <div className="bg-[#f5f2e8] border-b border-slate-200 px-4 py-2 flex-none flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
          <span className="font-bold text-slate-900">Ficha de Curadoria</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {posicaoAtual.atual} de {posicaoAtual.total}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onAnterior}
            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Estudo Anterior"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={onProximo}
            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Próximo Estudo"
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onAbrirModoHistoria}
            className="ml-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
            title="Abrir Sessão de Fotos com Narração em Áudio IA"
          >
            <Volume2 size={12} />
            <span>Narrar História</span>
          </button>

          <button
            onClick={onEditarClick}
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
            title="Editar links e textos"
          >
            <Edit3 size={12} />
            <span>Editar</span>
          </button>
        </div>
      </div>

      {/* CORPO ROLÁVEL COMPACTO E PROPORCIONAL */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* IDENTIFICAÇÃO DO ESTUDO */}
        <div className="space-y-1 border-b border-slate-200 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="text-emerald-800 font-semibold">{item.grupoNome}</span>
            <span aria-hidden="true">·</span>
            <span>Bioma {item.bioma}</span>
            <span aria-hidden="true">·</span>
            <span>{item.municipio} (MT)</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug text-balance">
            {item.titulo}
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            {item.subtitulo}
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              <strong className="text-slate-700">Equipe 9º Ano:</strong> {item.equipeAlunos.join(', ')}
            </span>
            <span>{item.orientador} · {item.escola}</span>
          </div>
        </div>

        {/* 2. ABAS INTERATIVAS DE MÍDIA DOS ESTUDANTES */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setActiveTab('infografico')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'infografico'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon size={13} />
              <span>Infográfico (PT-BR)</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video size={13} />
              <span>Vídeo da Equipe</span>
            </button>

            <button
              onClick={() => setActiveTab('resumo')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'resumo'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={13} />
              <span>Resumo & Fontes</span>
            </button>
          </div>

          {/* ABA 1: INFOGRÁFICO EM PORTUGUÊS DO BRASIL COM PONTOS NUMERADOS */}
          {activeTab === 'infografico' && (
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                {!imgError && imagemDireta ? (
                  <img
                    src={imagemDireta}
                    alt={item.infografico.titulo}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex flex-col items-center justify-center p-4 text-center bg-emerald-950 text-white">
                    <ImageIcon size={28} className="text-emerald-400 mb-1.5" />
                    <span className="text-xs font-semibold">{item.infografico.titulo}</span>
                  </div>
                )}

                {/* Faixa superior de título em Português sobre o Infográfico */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white truncate">
                    {item.titulo} · Bioma {item.bioma} (MT)
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold shrink-0 ml-2">
                    Clique nos números (1–{item.pontosInfograficoPT?.length || 4})
                  </span>
                </div>

                {/* Pontos Interativos em Português-Brasil sobre a Prancha */}
                {item.pontosInfograficoPT?.map((pt) => {
                  const isAtivo = pontoSelecionado === pt.numero;
                  return (
                    <button
                      key={pt.numero}
                      onClick={() => setPontoSelecionado(pt.numero)}
                      style={{ left: `${pt.xPercent}%`, top: `${pt.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full font-mono text-[11px] font-extrabold flex items-center justify-center transition-transform border-2 shadow-md ${
                        isAtivo
                          ? 'bg-amber-500 text-slate-950 border-white scale-125 z-20'
                          : 'bg-emerald-800/90 text-white border-white/90 hover:scale-110 z-10'
                      }`}
                      title={pt.tituloPT}
                    >
                      {pt.numero}
                    </button>
                  );
                })}

                <button
                  onClick={() => setModalImagemOpen(true)}
                  className="absolute bottom-2 right-2 bg-slate-900/85 hover:bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors z-20"
                >
                  <Maximize2 size={11} />
                  <span>Ampliar Infográfico</span>
                </button>
              </div>

              {/* Explicação em Português-Brasil do Ponto Selecionado na Imagem */}
              {pontoAtivoObj && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-950">
                      Ponto {pontoAtivoObj.numero}: {pontoAtivoObj.tituloPT}
                    </span>
                    {pontoAtivoObj.nomeLatim && (
                      <em className="font-serif italic text-emerald-800 font-semibold text-[11.5px]">
                        {pontoAtivoObj.nomeLatim}
                      </em>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {pontoAtivoObj.detalhePT}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: VÍDEO DA EQUIPE */}
          {activeTab === 'video' && (
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-video">
                {videoInfo.embedUrl ? (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={item.videoEquipe.titulo}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center text-white">
                    <Video size={26} className="text-amber-400 mb-1.5" />
                    <span className="font-bold text-xs">{item.videoEquipe.titulo}</span>
                    <p className="text-[11px] text-slate-300 mt-1 max-w-sm">
                      Espaço preparado para o vídeo da equipe (YouTube ou Google Drive) ou ouça agora no Modo História.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={onAbrirModoHistoria}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Volume2 size={13} />
                        <span>Ouvir no Modo História</span>
                      </button>
                      <button
                        onClick={onEditarClick}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Colar Link do Vídeo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs space-y-1 px-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.videoEquipe.titulo}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{item.videoEquipe.duracao}</span>
                </div>
                <p className="text-[11px] text-slate-600">{item.videoEquipe.descricao}</p>
              </div>
            </div>
          )}

          {/* ABA 3: RESUMO CIENTÍFICO & FONTES CONFIÁVEIS */}
          {activeTab === 'resumo' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs leading-relaxed">
              <div>
                <span className="font-bold text-slate-900 block">1. Contexto Territorial em MT:</span>
                <p className="text-slate-700 text-[11.5px]">{item.resumoCientifico.introducao}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block">2. Diagnóstico Científico:</span>
                <p className="text-slate-700 text-[11.5px]">{item.resumoCientifico.diagnosticoEcologico}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-rose-900 block">3. Impactos das Secas e Queimadas:</span>
                <p className="text-slate-700 text-[11.5px]">{item.resumoCientifico.ameacasImpactos}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-emerald-900 block">4. Soluções Comunitárias e Conservação:</span>
                <p className="text-slate-700 text-[11.5px]">{item.resumoCientifico.solucoesComunitarias}</p>
              </div>
              {item.fontesPesquisa && item.fontesPesquisa.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">
                    Fontes Confiáveis Consultadas pela Equipe:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                    {item.fontesPesquisa.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. ESPÉCIES ESTUDADAS — NOMENCLATURA CIENTÍFICA BINOMIAL EM LATIM (EM ITÁLICO) */}
        {item.especiesCientificas && item.especiesCientificas.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Dna size={13} className="text-emerald-700" />
                Espécies & Nomenclatura Científica Binomial (Latim)
              </span>
              <span className="text-[10.5px] text-slate-500">Norma ICZN / ICN</span>
            </div>

            <div className="divide-y divide-slate-100">
              {item.especiesCientificas.map((esp, idx) => (
                <div key={idx} className="py-1.5 first:pt-0 last:pb-0 text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{esp.nomePopular}</span>
                      <span className="mx-1.5 text-slate-400">·</span>
                      <em className="font-serif italic font-semibold text-emerald-800">
                        {esp.nomeCientificoLatim}
                      </em>
                    </div>
                    <span className="text-[10.5px] text-slate-500">Família {esp.familia}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    {esp.papelEcologico}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SÍNTESE DE JUSTIÇA CLIMÁTICA E UNIDADE DE CONSERVAÇÃO (EF09CI12) */}
        {item.justicaClimaticaExplicacao && (
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3 space-y-1.5">
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Scale size={13} className="text-amber-700" />
              Justiça Climática & Unidades de Conservação (EF09CI12)
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div>
                <strong className="text-amber-950">Quem sofre o impacto:</strong>{' '}
                {item.justicaClimaticaExplicacao.quemSofreImpacto}
              </div>
              <div>
                <strong className="text-amber-950">Por que é injusto:</strong>{' '}
                {item.justicaClimaticaExplicacao.porQueEInjusto}
              </div>
            </div>
            {item.unidadeConservacaoRelacionada && (
              <div className="pt-1.5 border-t border-amber-200/70 text-[11px] text-slate-700">
                <strong className="text-emerald-950">
                  {item.unidadeConservacaoRelacionada.nome} ({item.unidadeConservacaoRelacionada.categoriaSNUC}):
                </strong>{' '}
                {item.unidadeConservacaoRelacionada.explicacaoEF09CI12}
              </div>
            )}
          </div>
        )}

        {/* 5. INDICADORES QUANTITATIVOS (TABULAR NUMS) */}
        <div className="grid grid-cols-3 gap-2">
          {item.metricas.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10.5px] font-medium truncate">{m.rotulo}</span>
                <MetricaIcon tipo={m.icone} className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums block">
                  {m.valor}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  {m.detalhe}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 6. SEÇÃO CONCEITOS CIENTÍFICOS & HABILIDADES BNCC */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950">
              Conceitos & Habilidades BNCC (9º Ano)
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {item.habilidadesBNCC.map((hab, i) => (
              <div key={i} className="text-xs border-t border-emerald-200/70 pt-1.5 first:border-0 first:pt-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-900 text-[11px]">
                    {hab.codigo}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-800 text-[11.5px]">{hab.titulo}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                  {hab.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. VOZES DO TERRITÓRIO */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-bold text-slate-800">Vozes do Território</span>
            <span>{item.diarioDeBordo.dataRegistro}</span>
          </div>
          <blockquote className="text-xs text-slate-800 italic leading-relaxed">
            {item.diarioDeBordo.depoimentoOuVoz}
          </blockquote>
          <div className="text-[11px] text-slate-600 font-medium">
            — {item.diarioDeBordo.autorVoz} · {item.diarioDeBordo.cargoOuFuncao}
          </div>
        </div>

        {/* 8. ENTREGAS E AÇÕES DA EQUIPE */}
        <div className="space-y-1.5 pb-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Entregas e Ações da Equipe
          </span>
          <div className="space-y-1">
            {item.acoesPropostas.map((acao, idx) => {
              const isChecked = !!acoesChecadas[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleAcao(idx)}
                  className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-[11px] text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-700"
                  />
                  <span className={isChecked ? 'line-through text-slate-400' : ''}>{acao}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL DE IMAGEM EM TELA CHEIA COM LEGENDAS EM PORTUGUÊS-BRASIL E NOMES EM LATIM */}
      {modalImagemOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4"
          onClick={() => setModalImagemOpen(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[92vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{item.infografico.titulo}</h3>
                <span className="text-xs text-slate-500">
                  {item.titulo} · Bioma {item.bioma} · {item.municipio} (MT)
                </span>
              </div>
              <button
                onClick={() => setModalImagemOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1">
              <div className="lg:col-span-8 relative bg-slate-950 flex items-center justify-center">
                <img
                  src={imagemDireta}
                  alt={item.infografico.titulo}
                  referrerPolicy="no-referrer"
                  className="max-h-[68vh] w-full object-contain"
                />
                {item.pontosInfograficoPT?.map((pt) => (
                  <button
                    key={pt.numero}
                    onClick={() => setPontoSelecionado(pt.numero)}
                    style={{ left: `${pt.xPercent}%`, top: `${pt.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full font-mono text-xs font-extrabold flex items-center justify-center border-2 shadow-lg ${
                      pontoSelecionado === pt.numero
                        ? 'bg-amber-500 text-slate-950 border-white scale-125'
                        : 'bg-emerald-700 text-white border-white'
                    }`}
                  >
                    {pt.numero}
                  </button>
                ))}
              </div>

              <div className="lg:col-span-4 p-4 overflow-y-auto bg-slate-50 border-l border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-900">
                  Legenda Científica em Português (Brasil):
                </div>
                {item.pontosInfograficoPT?.map((pt) => (
                  <div
                    key={pt.numero}
                    onClick={() => setPontoSelecionado(pt.numero)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer ${
                      pontoSelecionado === pt.numero
                        ? 'bg-white border-emerald-600 shadow-xs'
                        : 'bg-white/60 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900">
                      {pt.numero}. {pt.tituloPT}
                    </div>
                    {pt.nomeLatim && (
                      <em className="font-serif italic text-emerald-800 font-semibold block text-[11px]">
                        {pt.nomeLatim}
                      </em>
                    )}
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{pt.detalhePT}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaCuradoria;
