import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Dna, Sprout } from 'lucide-react';
import type { CommunityNode } from '../../../shared/types/domain';

interface JourneyStepCienciaProps {
  community: CommunityNode;
  stepIndex: number;
}

export const JourneyStepCiencia: React.FC<JourneyStepCienciaProps> = ({
  community,
  stepIndex,
}) => {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  const titulos = [
    'Ciência Clara: Como esta comunidade preserva a riqueza de espécies e água',
    'Ameaças Bioclimáticas: Fogo, seca severa e fragmentação de habitats',
    'Genética e Sobrevivência: A importância da variabilidade no território',
  ];

  const textos = [
    community.resumoCientifico.diagnosticoEcologico,
    community.resumoCientifico.ameacasImpactos,
    community.resumoCientifico.conclusaoEstudantil ||
      'Manter os corredores ecológicos vivos garante que as espécies troquem genes e resistam às ondas de calor.',
  ];

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
          {titulos[stepIndex] || titulos[0]}
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {textos[stepIndex] || textos[0]}
        </p>
      </div>

      {/* Espécies-chave em destaque sutil (Nomenclatura Binomial em itálico) */}
      {community.especiesCientificas.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <Dna size={12} className="text-emerald-700" />
            Espécies Monitoradas pela Turma:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {community.especiesCientificas.slice(0, 4).map((esp) => (
              <div
                key={esp.nomePopular}
                className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-0.5"
              >
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-bold text-slate-900 text-xs">{esp.nomePopular}</span>
                  <span className="text-[10px] text-slate-400">{esp.familia}</span>
                </div>
                <em className="font-serif italic text-emerald-800 text-[11px] font-semibold block">
                  {esp.nomeCientificoLatim}
                </em>
                <p className="text-[10.5px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                  {esp.papelEcologico}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acordeão de Fontes e Métricas Detalhadas */}
      <div className="pt-2 border-t border-slate-200/70">
        <button
          onClick={() => setDetalhesAbertos((prev) => !prev)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 transition-colors py-1"
        >
          <BookOpen size={13} />
          <span>{detalhesAbertos ? 'Recolher detalhes científicos' : 'Ver diagnósticos do MapBiomas e ISA'}</span>
          {detalhesAbertos ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {detalhesAbertos && (
          <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs text-slate-600 animate-fadeIn">
            <div>
              <strong className="text-slate-800 block mb-0.5">Diagnóstico Completo da Turma:</strong>
              <p>{community.resumoCientifico.introducao}</p>
            </div>
            {community.fontesPesquisa.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-800 block mb-1">Fontes Científicas Consultadas:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {community.fontesPesquisa.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
