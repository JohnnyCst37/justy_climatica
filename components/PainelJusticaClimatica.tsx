import React, { useState } from 'react';
import { ItemMural } from '../types';
import { LINHA_DO_TEMPO_CLIMATICA_MT, FONTES_CONFIAVEIS_PESQUISA } from '../data/dadosMural';
import { 
  Scale, 
  Shield, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface PainelJusticaClimaticaProps {
  projetos: ItemMural[];
  onSelecionarProjetoNoMapa: (item: ItemMural) => void;
}

export const PainelJusticaClimatica: React.FC<PainelJusticaClimaticaProps> = ({
  projetos,
  onSelecionarProjetoNoMapa,
}) => {
  const [expandido, setExpandido] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'justica' | 'timeline' | 'ucs' | 'fontes'>('justica');
  const [indiceTimeline, setIndiceTimeline] = useState(0);

  const comunidadesFoco = projetos.filter((p) => p.grupoId === 'grupo2');
  const eventoAtual = LINHA_DO_TEMPO_CLIMATICA_MT[indiceTimeline] || LINHA_DO_TEMPO_CLIMATICA_MT[0];

  const selecionarAba = (aba: 'justica' | 'timeline' | 'ucs' | 'fontes') => {
    setAbaAtiva(aba);
    setExpandido(true);
  };

  return (
    <div className="bg-white border-t border-slate-300 px-3.5 py-2 flex flex-col gap-2 flex-none z-20 shadow-sm">
      {/* BARRA INTEGRADA DO GUIA (O BOTÃO E A SEÇÃO ESTÃO JUNTOS NO MESMO COMPONENTE) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
          <button
            onClick={() => selecionarAba('justica')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              expandido && abaAtiva === 'justica'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale size={13} className="text-amber-600" />
            <span>Guia: O que é Justiça Climática?</span>
          </button>

          <button
            onClick={() => selecionarAba('timeline')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              expandido && abaAtiva === 'timeline'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={13} className="text-rose-600" />
            <span>Linha do Tempo Climática MT</span>
          </button>

          <button
            onClick={() => selecionarAba('ucs')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              expandido && abaAtiva === 'ucs'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield size={13} className="text-emerald-600" />
            <span>Unidades de Conservação (EF09CI12)</span>
          </button>

          <button
            onClick={() => selecionarAba('fontes')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              expandido && abaAtiva === 'fontes'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} className="text-sky-600" />
            <span>Fontes Confiáveis (MapBiomas / ISA)</span>
          </button>
        </div>

        {/* Botão colado diretamente na própria barra do Guia */}
        <button
          onClick={() => setExpandido(!expandido)}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 whitespace-nowrap"
        >
          <span>{expandido ? 'Recolher Guia' : 'Expandir Guia Didático'}</span>
          {expandido ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
      </div>

      {/* CONTEÚDO EXPANSÍVEL IMEDIATAMENTE ABAIXO DOS BOTÕES DO GUIA */}
      {expandido && (
        <div className="pt-1">
          {abaAtiva === 'justica' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 items-stretch">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-950 mb-1">
                    Por que grupos vulneráveis sofrem primeiro?
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-snug">
                    <strong>Justiça Climática</strong> mostra que povos tradicionais são os que <strong>menos desmatam</strong>, mas sofrem primeiro quando secas severas atingem seus poços, rios e roças.
                  </p>
                </div>
                <div className="text-[10px] text-amber-800 pt-1.5 mt-1.5 border-t border-amber-200/60 font-medium">
                  BNCC: EF09CI12 · EF09CI13
                </div>
              </div>

              {comunidadesFoco.map((com) => (
                <button
                  key={com.id}
                  onClick={() => onSelecionarProjetoNoMapa(com)}
                  className="text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 rounded-xl p-2.5 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-0.5">
                      <span className="truncate">{com.municipio}</span>
                      <span className="text-emerald-700 font-semibold shrink-0">{com.bioma}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-950 leading-snug mb-1">
                      {com.titulo}
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                      {com.justicaClimaticaExplicacao.porQueEInjusto}
                    </p>
                  </div>
                  <div className="pt-1.5 mt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[10.5px] font-semibold text-emerald-700">
                    <span>Focar no mapa e abrir ficha</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {abaAtiva === 'timeline' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {LINHA_DO_TEMPO_CLIMATICA_MT.map((ev, idx) => {
                  const ativo = idx === indiceTimeline;
                  return (
                    <button
                      key={ev.ano}
                      onClick={() => setIndiceTimeline(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-colors whitespace-nowrap shrink-0 ${
                        ativo
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ev.ano}
                    </button>
                  );
                })}
                <span className="text-[11px] text-slate-500 ml-2 truncate">
                  Fonte: {eventoAtual.fonte} · {eventoAtual.biomaAfetado}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <div className="text-[11px] font-semibold text-rose-700">
                    Evento Climático ({eventoAtual.ano})
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {eventoAtual.titulo}
                  </div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold text-slate-500">
                    Evidência Científica ({eventoAtual.fonte}):
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {eventoAtual.dadoCientifico}
                  </p>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold text-slate-500">
                    Impacto nas Populações Tradicionais:
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {eventoAtual.impactoComunidade}
                  </p>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'ucs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-950">
                    1. Unidades de Proteção Integral (SNUC / EF09CI12)
                  </span>
                  <span className="text-[10.5px] font-semibold text-emerald-800">
                    Preservação estrita
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug mb-1.5">
                  Apenas uso indireto (pesquisa científica e educação ambiental). Funcionam como berçários de reprodução de peixes e reserva genética.
                </p>
                <div className="text-[11px] text-emerald-900 font-medium">
                  <strong>Exemplos em MT:</strong> Parque Nacional da Chapada dos Guimarães, Estação Ecológica de Taiamã e Parque Estadual Encontro das Águas.
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-950">
                    2. Uso Sustentável & Territórios Tradicionais (EF09CI12)
                  </span>
                  <span className="text-[10.5px] font-semibold text-amber-800">
                    Conservação + Comunidades
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug mb-1.5">
                  Compatibilizam a conservação da natureza com o manejo sustentável feito por povos tradicionais (extrativismo, pesca artesanal e brigadas indígenas).
                </p>
                <div className="text-[11px] text-amber-900 font-medium">
                  <strong>Exemplos em MT:</strong> Quilombo Mata Cavalo, Terras Indígenas Xavante/Bororo/Xingu e Reservas Extrativistas.
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'fontes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {FONTES_CONFIAVEIS_PESQUISA.map((fonte) => (
                <div
                  key={fonte.sigla}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{fonte.nome}</span>
                      <a
                        href={fonte.urlReferencia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10.5px] text-emerald-700 hover:underline flex items-center gap-0.5 shrink-0"
                      >
                        <span>Consultar</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug mb-1">
                      {fonte.comoUsarNoTrabalho}
                    </p>
                  </div>
                  <div className="text-[10.5px] text-slate-700 bg-white border border-slate-200/80 rounded-lg px-2 py-1">
                    <strong>Destaque MT:</strong> {fonte.dadoDestaqueMT}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PainelJusticaClimatica;
