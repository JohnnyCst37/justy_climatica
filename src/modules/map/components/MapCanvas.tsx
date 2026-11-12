import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { CommunityNode } from '../../../shared/types/domain';
import { BRASIL_STATES_GEOJSON } from '../../../shared/data/brasilGeo';
import {
  AMAZONIA_COORDS,
  AREAS_PROTEGIDAS_MT,
  CIDADES_REFERENCIA_MT,
  PANTANAL_COORDS,
  RIOS_REAIS_MT,
} from '../data/mtMapLayers';
import {
  geoFeatureToSvgPath,
  getFeatureCenter2D,
  getPinColor,
  type GeoFeature,
} from '../utils/geoHelpers';
import { MapOverlayControls } from './MapOverlayControls';

interface MapCanvasProps {
  itens: CommunityNode[];
  itemSelecionadoId?: string;
  onItemClick: (item: CommunityNode) => void;
  onStartGuideClick?: () => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  itens,
  itemSelecionadoId,
  onItemClick,
  onStartGuideClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [dimensions, setDimensions] = useState({ width: 720, height: 520 });
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [modoVisao, setModoVisao] = useState<'mt' | 'brasil'>('mt');
  const [mostrarBiomasEAreas, setMostrarBiomasEAreas] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > 0) setDimensions({ width: rect.width, height: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { mtFeature, todosEstados } = useMemo(() => {
    const features = (BRASIL_STATES_GEOJSON.features || []) as GeoFeature[];
    return { mtFeature: features.find((f) => f.properties?.sigla === 'MT'), todosEstados: features };
  }, []);

  const projection = useMemo(() => {
    const scaleBase = Math.min(dimensions.width, dimensions.height) * 3.1;
    return d3
      .geoMercator()
      .center([-55.9, -13.1])
      .scale(Math.max(900, scaleBase))
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions]);

  const miniProjection = useMemo(
    () => d3.geoMercator().center([-53.5, -14.8]).scale(132).translate([58, 52]),
    []
  );

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.28, 10])
      .on('zoom', (event) => {
        setZoomTransform(event.transform);
        d3.select(gRef.current).attr('transform', event.transform.toString());
      });
    d3.select(svgRef.current).call(zoom);
    zoomBehaviorRef.current = zoom;
  }, [dimensions]);

  const centralizarVisao = (modo: 'mt' | 'brasil') => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    setModoVisao(modo);
    const svg = d3.select(svgRef.current);
    if (modo === 'mt') {
      svg.transition().duration(600).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      return;
    }
    const brCenter = projection([-52.8, -14.8]) || [dimensions.width / 2, dimensions.height / 2];
    const t = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
      .scale(0.34)
      .translate(-brCenter[0], -brCenter[1]);
    svg.transition().duration(600).call(zoomBehaviorRef.current.transform, t);
  };

  useEffect(() => {
    if (!svgRef.current || !zoomBehaviorRef.current || !itemSelecionadoId) return;
    const item = itens.find((i) => i.id === itemSelecionadoId);
    if (!item) return;
    const coords = projection([item.coordenadas.lng, item.coordenadas.lat]);
    if (!coords) return;

    const outsideMt = item.coordenadas.lat > -7 || item.coordenadas.lat < -19 || item.coordenadas.lng > -50 || item.coordenadas.lng < -62;
    const targetK = outsideMt ? 0.45 : 1.35;
    const t = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
      .scale(targetK)
      .translate(-coords[0], -coords[1]);
    setModoVisao(outsideMt ? 'brasil' : 'mt');
    d3.select(svgRef.current).transition().duration(550).call(zoomBehaviorRef.current.transform, t);
  }, [itemSelecionadoId, itens.length, projection, dimensions]);

  const biomasPaths = useMemo(() => {
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRomClosed.alpha(0.5))
      .x((d) => projection(d)?.[0] || 0)
      .y((d) => projection(d)?.[1] || 0);
    return {
      amazonia: lineGen(AMAZONIA_COORDS) || '',
      pantanal: lineGen(PANTANAL_COORDS) || '',
    };
  }, [projection]);

  const riosRender = useMemo(() => {
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => projection(d)?.[0] || 0)
      .y((d) => projection(d)?.[1] || 0);
    return RIOS_REAIS_MT.map((r) => ({
      nome: r.nome,
      d: lineGen(r.coords) || '',
      labelPos: projection(r.coords[Math.floor(r.coords.length / 2)]),
    }));
  }, [projection]);

  const areasProtegidasRender = useMemo(() => {
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCardinalClosed.tension(0.6))
      .x((d) => projection(d)?.[0] || 0)
      .y((d) => projection(d)?.[1] || 0);
    return AREAS_PROTEGIDAS_MT.map((ap) => ({ ...ap, d: lineGen(ap.coords) || '' }));
  }, [projection]);

  const mtSvgPath = useMemo(() => geoFeatureToSvgPath(mtFeature, projection), [projection, mtFeature]);
  const activeScale = 1 / Math.max(0.3, zoomTransform.k);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#d4e4e8] select-none">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="block cursor-grab active:cursor-grabbing"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <defs>
          <clipPath id="clip-estado-mt"><path d={mtSvgPath} /></clipPath>
          <pattern id="pattern-uc-ti" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#15803d" strokeWidth="1.5" opacity="0.28" />
          </pattern>
          <pattern id="pattern-pantanal" width="20" height="12" patternUnits="userSpaceOnUse">
            <path d="M 2,6 Q 6,3 10,6 T 18,6" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.32" strokeLinecap="round" />
          </pattern>
          <filter id="pin-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.28" />
          </filter>
        </defs>

        <g ref={gRef}>
          {todosEstados.map((uf) => {
            const sigla = uf.properties?.sigla || '';
            if (sigla === 'MT') return null;
            const center = getFeatureCenter2D(uf, projection);
            return (
              <g key={sigla}>
                <path d={geoFeatureToSvgPath(uf, projection)} fill="#eaefea" stroke="#94a3b8" strokeWidth={0.9 * activeScale} strokeLinejoin="round" />
                {center && (
                  <text x={center[0]} y={center[1]} textAnchor="middle" fill="#475569" fontSize={Math.max(7.5, 9.5 * activeScale)} fontWeight="700" className="pointer-events-none" opacity="0.8">
                    {sigla}
                  </text>
                )}
              </g>
            );
          })}

          <g>
            <path d={mtSvgPath} fill="#f5eccb" stroke="#14532d" strokeWidth={2.2 * activeScale} strokeLinejoin="round" />
            {mostrarBiomasEAreas && (
              <g clipPath="url(#clip-estado-mt)">
                <path d={biomasPaths.amazonia} fill="#bbf7d0" opacity="0.68" />
                <path d={biomasPaths.pantanal} fill="#bae6fd" opacity="0.85" />
                <path d={biomasPaths.pantanal} fill="url(#pattern-pantanal)" />
                {areasProtegidasRender.map((ap) => (
                  <path key={ap.nome} d={ap.d} fill="url(#pattern-uc-ti)" stroke="#15803d" strokeWidth={1.1 * activeScale} strokeDasharray={`${3 * activeScale},${2 * activeScale}`} />
                ))}
              </g>
            )}
            <path d={mtSvgPath} fill="none" stroke="#14532d" strokeWidth={2.2 * activeScale} strokeLinejoin="round" />
          </g>

          {riosRender.map((rio) => (
            <g key={rio.nome} className="pointer-events-none">
              <path d={rio.d} fill="none" stroke="#0284c7" strokeWidth={2 * activeScale} strokeLinecap="round" opacity="0.75" />
              {rio.labelPos && (
                <text x={rio.labelPos[0]} y={rio.labelPos[1] - 3.5 * activeScale} textAnchor="middle" fill="#0369a1" fontSize={7.2 * activeScale} fontStyle="italic" fontWeight="700">
                  {rio.nome}
                </text>
              )}
            </g>
          ))}

          {CIDADES_REFERENCIA_MT.map((cid) => {
            const pos = projection([cid.lng, cid.lat]);
            if (!pos) return null;
            return (
              <g key={cid.nome} transform={`translate(${pos[0]}, ${pos[1]}) scale(${activeScale})`} className="pointer-events-none">
                <circle r={cid.capital ? 3 : 1.8} fill={cid.capital ? '#dc2626' : '#334155'} stroke="#ffffff" strokeWidth="0.9" />
                <text x="4.5" y="2.5" fontSize={cid.capital ? '8' : '7'} fontWeight={cid.capital ? '800' : '600'} fill="#1e293b">
                  {cid.nome}
                </text>
              </g>
            );
          })}

          {[...itens]
            .sort((a, b) => (a.id === itemSelecionadoId ? 1 : 0) - (b.id === itemSelecionadoId ? 1 : 0))
            .map((item, idx) => {
              const pos = projection([item.coordenadas.lng, item.coordenadas.lat]);
              if (!pos) return null;
              const isSelected = item.id === itemSelecionadoId;
              const isHovered = hoveredItemId === item.id;
              const fillPin = getPinColor(item.grupoId);
              const scalePin = (isSelected ? 1.15 : 0.94) * activeScale;

              return (
                <g
                  key={item.id}
                  transform={`translate(${pos[0]}, ${pos[1]})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  {(isSelected || item.isWebDiscovered) && (
                    <circle r={19 * activeScale} fill={fillPin} fillOpacity="0.2" stroke={fillPin} strokeWidth={1.8 * activeScale} />
                  )}
                  <g transform={`scale(${scalePin})`} filter="url(#pin-drop-shadow)">
                    <circle r={isSelected ? 13 : 11} fill="#ffffff" stroke={fillPin} strokeWidth={isSelected ? 3 : 2.2} />
                    <circle r={isSelected ? 9.5 : 8} fill={fillPin} />
                    <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800">
                      {item.isWebDiscovered ? 'W' : idx + 1}
                    </text>
                  </g>
                  {(isSelected || isHovered) && (
                    <g transform={`translate(0, ${-20 * activeScale}) scale(${activeScale})`} filter="url(#pin-drop-shadow)" className="pointer-events-none">
                      <rect x="-86" y="-20" width="172" height="19" rx="5" fill="#0f172a" />
                      <text x="0" y="-7.5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="700">
                        {item.titulo.length > 27 ? `${item.titulo.slice(0, 26)}…` : item.titulo}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </g>
      </svg>

      <MapOverlayControls
        todosEstados={todosEstados}
        miniProjection={miniProjection}
        modoVisao={modoVisao}
        mostrarBiomasEAreas={mostrarBiomasEAreas}
        totalItens={itens.length}
        hasDiscovered={itens.some((i) => i.isWebDiscovered)}
        onToggleVisao={() => centralizarVisao(modoVisao === 'mt' ? 'brasil' : 'mt')}
        onToggleBiomas={() => setMostrarBiomasEAreas((prev) => !prev)}
        onZoomIn={() => {
          if (svgRef.current && zoomBehaviorRef.current) {
            d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 1.35);
          }
        }}
        onZoomOut={() => {
          if (svgRef.current && zoomBehaviorRef.current) {
            d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 0.72);
          }
        }}
        onResetMt={() => centralizarVisao('mt')}
        onStartGuideClick={onStartGuideClick}
      />
    </div>
  );
};
