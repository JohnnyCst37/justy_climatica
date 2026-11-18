import React from 'react';
import type * as d3 from 'd3';
import { Plus, Minus, Compass, Maximize2, Layers, Sparkles } from 'lucide-react';
import { geoFeatureToSvgPath, type GeoFeature } from '../utils/geoHelpers';

interface MapOverlayControlsProps {
  todosEstados: GeoFeature[];
  miniProjection: d3.GeoProjection;
  modoVisao: 'mt' | 'brasil';
  mostrarBiomasEAreas: boolean;
  totalItens: number;
  hasDiscovered: boolean;
  onToggleVisao: () => void;
  onToggleBiomas: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetMt: () => void;
  onStartGuideClick?: () => void;
}

export const MapOverlayControls: React.FC<MapOverlayControlsProps> = ({
  todosEstados,
  miniProjection,
  modoVisao,
  mostrarBiomasEAreas,
  totalItens,
  hasDiscovered,
  onToggleVisao,
  onToggleBiomas,
  onZoomIn,
  onZoomOut,
  onResetMt,
  onStartGuideClick,
}) => {
  return (
    <>
      {/* Mini-mapa do Brasil no canto superior esquerdo (desktop/tablet médio+) */}
      <div
        onClick={onToggleVisao}
        title="Alternar entre Brasil (27 UFs) e foco em Mato Grosso"
        className="hidden md:block absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-xl p-2 shadow-sm cursor-pointer hover:border-emerald-600 transition-colors w-[124px]"
      >
        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 mb-0.5">
          <span>Brasil (27 UFs)</span>
          <span className="text-emerald-700 font-extrabold">MT</span>
        </div>
        <svg
          width="108"
          height="94"
          viewBox="0 0 116 104"
          className="block mx-auto bg-sky-50/60 rounded-lg border border-slate-200/70"
        >
          {todosEstados.map((uf) => {
            const sigla = uf.properties?.sigla || '';
            const isMT = sigla === 'MT';
            return (
              <path
                key={sigla}
                d={geoFeatureToSvgPath(uf, miniProjection)}
                fill={isMT ? '#059669' : '#cbd5e1'}
                stroke={isMT ? '#064e3b' : '#ffffff'}
                strokeWidth={isMT ? 1.1 : 0.45}
              />
            );
          })}
        </svg>
      </div>

      {/* Pílula discreta de início rápido (mobile esquerda sem colidir com botões; desktop centralizada) */}
      {onStartGuideClick && (
        <button
          onClick={onStartGuideClick}
          className="absolute top-2.5 left-2.5 lg:left-1/2 lg:-translate-x-1/2 z-20 bg-white/95 hover:bg-emerald-50 text-slate-800 border border-emerald-300/80 rounded-full px-2.5 sm:px-3.5 py-1.5 shadow-sm text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors max-w-[calc(100%-185px)] md:max-w-[calc(100%-340px)] lg:max-w-md"
        >
          <Sparkles size={13} className="text-amber-500 shrink-0" />
          <span className="truncate md:hidden">Toque em um pino</span>
          <span className="hidden md:inline truncate">Por onde começar? Clique em uma comunidade ou ouça o Guia</span>
        </button>
      )}

      {/* Controles de camada e visão */}
      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={onToggleVisao}
          className="px-2 sm:px-2.5 py-1.5 min-h-[34px] bg-white/95 hover:bg-white text-slate-800 border border-slate-300 rounded-lg text-[10.5px] sm:text-[11px] font-semibold shadow-xs flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap"
        >
          <Maximize2 size={12} className="text-emerald-700" />
          <span>{modoVisao === 'mt' ? 'Ver Brasil' : 'Focar MT'}</span>
        </button>

        <button
          onClick={onToggleBiomas}
          className={`px-2 sm:px-2.5 py-1.5 min-h-[34px] border rounded-lg text-[10.5px] sm:text-[11px] font-semibold shadow-xs flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap ${
            mostrarBiomasEAreas
              ? 'bg-emerald-800 text-white border-emerald-900'
              : 'bg-white/95 text-slate-700 border-slate-300'
          }`}
        >
          <Layers size={12} />
          <span className="hidden xs:inline sm:inline">Biomas & TIs</span>
          <span className="xs:hidden sm:hidden">Biomas</span>
        </button>
      </div>

      {/* Zoom no canto inferior esquerdo */}
      <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 z-20 flex items-center gap-0.5 sm:gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-300 shadow-xs">
        <button onClick={onZoomIn} className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700" title="Aproximar">
          <Plus size={14} />
        </button>
        <button onClick={onZoomOut} className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700" title="Afastar">
          <Minus size={14} />
        </button>
        <button onClick={onResetMt} className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700" title="Centralizar em Mato Grosso">
          <Compass size={14} />
        </button>
      </div>

      {/* Legenda compacta */}
      <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs text-[9.5px] sm:text-[10.5px] text-slate-700 flex flex-wrap items-center justify-end gap-x-2 sm:gap-x-3 gap-y-0.5 max-w-[calc(100%-130px)] sm:max-w-none">
        <span className="font-bold text-slate-900">Mapa ({totalItens}):</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />Justiça Climática</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />Ciência Clara</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />Saberes</span>
        {hasDiscovered && (
          <span className="flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />Vozes da Web
          </span>
        )}
      </div>
    </>
  );
};
