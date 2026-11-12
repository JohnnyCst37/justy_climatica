import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ShieldCheck } from 'lucide-react';
import type { CommunityNode } from '../../../shared/types/domain';

interface JourneyStepJusticaProps {
  community: CommunityNode;
  stepIndex: number;
}

export const JourneyStepJustica: React.FC<JourneyStepJusticaProps> = ({
  community,
  stepIndex,
}) => {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  // Sínteses editoriais limpas por passo
  const titulos = [
    'Por que quem mais preserva sofre primeiro com as secas extremas?',
    'A Injustiça Climática no Território: Quem Sofre o Impacto',
    'Ações Comunitárias e Unidades de Conservação de Uso Sustentável',
  ];

  const textos = [
    `No território de ${community.municipio}, as famílias de ${community.titulo} protegem o ${community.bioma} e mantêm suas matas vivas há gerações. Porém, quando o desmatamento ao redor e o aquecimento regional se intensificam, a água subterrânea desaparece primeiro dos poços tradicionais.`,
    community.justicaClimaticaExplicacao.porQueEInjusto,
    community.justicaClimaticaExplicacao.oQueEstaSendoFeito ||
      community.resumoCientifico.solucoesComunitarias ||
      'Restauração das matas ciliares com mudas nativas e manejo sustentável da água.',
  ];

  return (
    <div className="space-y-3.5">
      {/* Manchete Editorial e Síntese Respirada (Zero Caixas Coloridas Empilhadas) */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
          {titulos[stepIndex] || titulos[0]}
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {textos[stepIndex] || textos[0]}
        </p>
      </div>

      {/* Pílulas de Evidências Horizontais (Regra 60-30-10) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700">
          📍 {community.municipio} ({community.bioma})
        </span>

        {community.metricas.slice(0, 3).map((m) => (
          <span
            key={m.rotulo}
            className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700"
          >
            {m.rotulo}: <strong className="text-slate-900 font-mono">{m.valor}</strong>
          </span>
        ))}
      </div>

      {/* Botão Sutil para Expandir Notas Territoriais & BNCC (Recolhido por padrão) */}
      <div className="pt-2 border-t border-slate-200/70">
        <button
          onClick={() => setDetalhesAbertos((prev) => !prev)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 transition-colors py-1"
        >
          <BookOpen size={13} />
          <span>{detalhesAbertos ? 'Recolher notas científicas' : 'Ver notas territoriais, BNCC e fontes'}</span>
          {detalhesAbertos ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {detalhesAbertos && (
          <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs text-slate-600 animate-fadeIn">
            <div>
              <strong className="text-slate-800 block mb-0.5">Causa Raiz do Problema:</strong>
              <p>{community.justicaClimaticaExplicacao.causaDoProblema}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <strong className="text-emerald-950 flex items-center gap-1 mb-0.5">
                <ShieldCheck size={12} className="text-emerald-700" />
                {community.unidadeConservacaoRelacionada.nome} ({community.unidadeConservacaoRelacionada.categoriaSNUC})
              </strong>
              <p>{community.unidadeConservacaoRelacionada.explicacaoEF09CI12}</p>
            </div>

            {community.habilidadesBNCC.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-800 block mb-1">Habilidades BNCC Trabalhadas:</strong>
                <ul className="space-y-1">
                  {community.habilidadesBNCC.map((hab) => (
                    <li key={hab.codigo} className="leading-snug">
                      <strong className="font-mono text-emerald-800">{hab.codigo}:</strong> {hab.descricao}
                    </li>
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
