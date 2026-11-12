import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { ItemMural } from '../types';
import { BRASIL_STATES_GEOJSON } from '../data/brasilGeo';
import { Plus, Minus, Compass, Maximize2, Layers } from 'lucide-react';

interface MapCanvasProps {
  itens: ItemMural[];
  itemSelecionadoId?: string;
  onItemClick: (item: ItemMural) => void;
}

const CIDADES_REFERENCIA_MT = [
  { nome: 'Cuiabá (Capital)', lat: -15.601, lng: -56.097, capital: true },
  { nome: 'N. Sra. do Livramento', lat: -15.775, lng: -56.345, capital: false },
  { nome: 'Chapada dos Guimarães', lat: -15.460, lng: -55.749, capital: false },
  { nome: 'Barão de Melgaço', lat: -16.194, lng: -55.967, capital: false },
  { nome: 'Poconé', lat: -16.257, lng: -56.623, capital: false },
  { nome: 'Barra do Garças', lat: -15.890, lng: -52.256, capital: false },
  { nome: 'Cáceres', lat: -16.075, lng: -57.678, capital: false },
  { nome: 'Rondonópolis', lat: -16.467, lng: -54.636, capital: false },
  { nome: 'Sinop', lat: -11.864, lng: -55.505, capital: false },
  { nome: 'Alta Floresta', lat: -9.875, lng: -56.086, capital: false },
];

const RIOS_REAIS_MT: { nome: string; coords: [number, number][] }[] = [
  {
    nome: 'Rio Cuiabá',
    coords: [
      [-55.45, -14.40],
      [-55.85, -15.05],
      [-56.10, -15.60],
      [-55.97, -16.19],
      [-56.45, -16.75],
      [-57.15, -17.35],
    ],
  },
  {
    nome: 'Rio Paraguai',
    coords: [
      [-57.20, -14.50],
      [-57.68, -16.07],
      [-57.65, -17.10],
      [-57.45, -17.85],
    ],
  },
  {
    nome: 'Rio Araguaia',
    coords: [
      [-53.05, -17.50],
      [-52.25, -15.89],
      [-51.60, -14.20],
      [-50.70, -12.00],
      [-50.55, -10.20],
    ],
  },
  {
    nome: 'Rio Xingu',
    coords: [
      [-53.80, -13.60],
      [-53.40, -12.20],
      [-53.15, -10.80],
      [-52.90, -9.60],
    ],
  },
  {
    nome: 'Rio Teles Pires',
    coords: [
      [-54.70, -14.30],
      [-55.50, -11.86],
      [-56.50, -9.90],
      [-57.80, -8.50],
    ],
  },
];

const AREAS_PROTEGIDAS_MT = [
  {
    nome: 'Território Indígena do Xingu (T.I.)',
    tipo: 'TI',
    coords: [
      [-53.95, -10.20],
      [-52.65, -10.20],
      [-52.55, -12.75],
      [-53.85, -12.90],
      [-54.10, -11.50],
    ] as [number, number][],
  },
  {
    nome: 'T.I. Xavante / Bororo (Sangradouro & Meruri)',
    tipo: 'TI',
    coords: [
      [-54.10, -15.10],
      [-53.05, -15.05],
      [-52.95, -15.75],
      [-53.95, -15.80],
    ] as [number, number][],
  },
  {
    nome: 'UC Parque Nac. do Pantanal & Encontro das Águas',
    tipo: 'UC',
    coords: [
      [-57.65, -17.15],
      [-56.45, -17.10],
      [-56.55, -17.85],
      [-57.55, -17.90],
    ] as [number, number][],
  },
];

/**
 * Converte qualquer Feature GeoJSON (Polygon ou MultiPolygon) em SVG Path 2D
 * sem depender da ordem esférica de D3 (evitando que estados desapareçam).
 */
function geoFeatureToSvgPath(feature: any, proj: d3.GeoProjection): string {
  if (!feature || !feature.geometry) return '';
  const { type, coordinates } = feature.geometry;

  const ringToPath = (ring: [number, number][]) => {
    const pts = ring
      .map((c) => proj(c))
      .filter((p): p is [number, number] => p !== null && !isNaN(p[0]) && !isNaN(p[1]));
    if (pts.length < 3) return '';
    return 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z';
  };

  if (type === 'Polygon') {
    return coordinates.map(ringToPath).join(' ');
  }
  if (type === 'MultiPolygon') {
    return coordinates
      .map((poly: [number, number][][]) => poly.map(ringToPath).join(' '))
      .join(' ');
  }
  return '';
}

/**
 * Calcula o centroide 2D do maior anel de um estado para posicionar sua sigla (UF)
 */
function getFeatureCenter2D(feature: any, proj: d3.GeoProjection): [number, number] | null {
  if (!feature || !feature.geometry) return null;
  const { type, coordinates } = feature.geometry;
  let mainRing: [number, number][] = [];

  if (type === 'Polygon') {
    mainRing = coordinates[0] || [];
  } else if (type === 'MultiPolygon') {
    let maxLen = 0;
    for (const poly of coordinates) {
      if (poly[0] && poly[0].length > maxLen) {
        maxLen = poly[0].length;
        mainRing = poly[0];
      }
    }
  }
  if (mainRing.length === 0) return null;

  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (const coord of mainRing) {
    const p = proj(coord);
    if (p && !isNaN(p[0]) && !isNaN(p[1])) {
      sumX += p[0];
      sumY += p[1];
      count++;
    }
  }
  return count > 0 ? [sumX / count, sumY / count] : null;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  itens,
  itemSelecionadoId,
  onItemClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 720, height: 480 });
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [modoVisao, setModoVisao] = useState<'mt' | 'brasil'>('mt');
  const [mostrarBiomasEAreas, setMostrarBiomasEAreas] = useState(true);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    ro.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      setDimensions({ width: rect.width, height: rect.height });
    }

    return () => ro.disconnect();
  }, []);

  const { mtFeature, todosEstados } = useMemo(() => {
    const features = BRASIL_STATES_GEOJSON.features || [];
    const mt = features.find((f: any) => f.properties?.sigla === 'MT');
    return { mtFeature: mt, todosEstados: features };
  }, []);

  // Projeção Principal calibrada exatamente para o centro de Mato Grosso (-55.9°W, -12.9°S)
  const projection = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return null;
    const scaleBase = Math.min(dimensions.width, dimensions.height) * 3.1;
    return d3
      .geoMercator()
      .center([-55.9, -13.1])
      .scale(Math.max(900, scaleBase))
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions]);

  // Projeção do Mini-Mapa do Brasil (exibindo 100% das 27 UFs do Brasil)
  const miniProjection = useMemo(() => {
    return d3
      .geoMercator()
      .center([-53.5, -14.8])
      .scale(132)
      .translate([58, 52]);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !gRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.28, 10])
      .on('zoom', (event) => {
        setZoomTransform(event.transform);
        d3.select(gRef.current).attr('transform', event.transform.toString());
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;
  }, [dimensions]);

  const centralizarVisao = (modo: 'mt' | 'brasil') => {
    if (!svgRef.current || !zoomBehaviorRef.current || !projection) return;
    setModoVisao(modo);
    const svg = d3.select(svgRef.current);

    if (modo === 'mt') {
      svg
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity);
    } else {
      const brCenter = projection([-52.8, -14.8]) || [dimensions.width / 2, dimensions.height / 2];
      const scaleBr = 0.34;
      const t = d3.zoomIdentity
        .translate(dimensions.width / 2, dimensions.height / 2)
        .scale(scaleBr)
        .translate(-brCenter[0], -brCenter[1]);

      svg
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.transform as any, t);
    }
  };

  useEffect(() => {
    if (!projection || !svgRef.current || !zoomBehaviorRef.current || !itemSelecionadoId) return;
    const item = itens.find((i) => i.id === itemSelecionadoId);
    if (!item) return;

    const coords = projection([item.coordenadas.lng, item.coordenadas.lat]);
    if (!coords) return;

    const targetK = 1.45;
    const svg = d3.select(svgRef.current);
    const transform = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
      .scale(targetK)
      .translate(-coords[0], -coords[1]);

    setModoVisao('mt');
    svg
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform as any, transform);
  }, [itemSelecionadoId, itens.length]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy as any, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy as any, 0.72);
  };

  const biomasPaths = useMemo(() => {
    if (!projection) return { amazonia: '', pantanal: '' };
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRomClosed.alpha(0.5))
      .x((d) => projection(d)?.[0] || 0)
      .y((d) => projection(d)?.[1] || 0);

    const amazoniaCoords: [number, number][] = [
      [-62.0, -7.0],
      [-50.0, -7.0],
      [-50.5, -11.8],
      [-53.5, -12.6],
      [-56.5, -13.1],
      [-59.5, -13.5],
      [-62.0, -12.5],
    ];

    const pantanalCoords: [number, number][] = [
      [-58.6, -15.8],
      [-56.8, -15.65],
      [-55.6, -16.05],
      [-55.2, -16.8],
      [-55.8, -18.2],
      [-58.8, -18.2],
    ];

    return {
      amazonia: lineGen(amazoniaCoords) || '',
      pantanal: lineGen(pantanalCoords) || '',
    };
  }, [projection]);

  const riosRender = useMemo(() => {
    if (!projection) return [];
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
    if (!projection) return [];
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCardinalClosed.tension(0.6))
      .x((d) => projection(d)?.[0] || 0)
      .y((d) => projection(d)?.[1] || 0);

    return AREAS_PROTEGIDAS_MT.map((ap) => ({
      ...ap,
      d: lineGen(ap.coords) || '',
    }));
  }, [projection]);

  const mtSvgPath = useMemo(() => {
    if (!projection || !mtFeature) return '';
    return geoFeatureToSvgPath(mtFeature, projection);
  }, [projection, mtFeature]);

  const activeScale = 1 / Math.max(0.3, zoomTransform.k);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#d4e4e8] select-none"
    >
      {projection && (
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="block cursor-grab active:cursor-grabbing"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          <defs>
            <clipPath id="clip-estado-mt">
              <path d={mtSvgPath} />
            </clipPath>

            <pattern id="pattern-uc-ti" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#15803d" strokeWidth="1.5" opacity="0.28" />
            </pattern>

            <pattern id="pattern-pantanal" width="20" height="12" patternUnits="userSpaceOnUse">
              <path
                d="M 2,6 Q 6,3 10,6 T 18,6"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
                opacity="0.32"
                strokeLinecap="round"
              />
            </pattern>

            <filter id="pin-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.28" />
            </filter>
          </defs>

          <g ref={gRef}>
            {/* 1. TODOS OS 27 ESTADOS DO BRASIL (100% COMPLETOS, SEM FALHAS DE POLÍGONO) */}
            {todosEstados.map((uf: any) => {
              const sigla = uf.properties?.sigla;
              if (sigla === 'MT') return null;
              const dPath = geoFeatureToSvgPath(uf, projection);
              const center = getFeatureCenter2D(uf, projection);

              return (
                <g key={sigla}>
                  <path
                    d={dPath}
                    fill="#eaefea"
                    stroke="#94a3b8"
                    strokeWidth={0.9 * activeScale}
                    strokeLinejoin="round"
                  />
                  {center && (
                    <text
                      x={center[0]}
                      y={center[1]}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize={Math.max(7.5, 9.5 * activeScale)}
                      fontWeight="700"
                      className="pointer-events-none"
                      opacity="0.8"
                    >
                      {sigla}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 2. ESTADO DE MATO GROSSO — DESTAQUE CENTRAL COM OS 3 BIOMAS */}
            <g>
              <path
                d={mtSvgPath}
                fill="#f5eccb"
                stroke="#14532d"
                strokeWidth={2.2 * activeScale}
                strokeLinejoin="round"
              />

              {mostrarBiomasEAreas && (
                <g clipPath="url(#clip-estado-mt)">
                  <path d={biomasPaths.amazonia} fill="#bbf7d0" opacity="0.68" />
                  <path d={biomasPaths.pantanal} fill="#bae6fd" opacity="0.85" />
                  <path d={biomasPaths.pantanal} fill="url(#pattern-pantanal)" />

                  {areasProtegidasRender.map((ap, idx) => (
                    <path
                      key={idx}
                      d={ap.d}
                      fill="url(#pattern-uc-ti)"
                      stroke="#15803d"
                      strokeWidth={1.1 * activeScale}
                      strokeDasharray={`${3 * activeScale},${2 * activeScale}`}
                    />
                  ))}
                </g>
              )}

              <path
                d={mtSvgPath}
                fill="none"
                stroke="#14532d"
                strokeWidth={2.2 * activeScale}
                strokeLinejoin="round"
              />
            </g>

            {/* 3. RÓTULOS DOS 3 BIOMAS DENTRO DE MATO GROSSO */}
            {mostrarBiomasEAreas && (
              <g className="pointer-events-none">
                {projection([-55.8, -10.5]) && (
                  <text
                    x={projection([-55.8, -10.5])![0]}
                    y={projection([-55.8, -10.5])![1]}
                    textAnchor="middle"
                    fill="#166534"
                    fontSize={9 * activeScale}
                    fontWeight="800"
                    opacity="0.78"
                  >
                    BIOMA AMAZÔNIA (NORTE MT)
                  </text>
                )}
                {projection([-54.2, -13.9]) && (
                  <text
                    x={projection([-54.2, -13.9])![0]}
                    y={projection([-54.2, -13.9])![1]}
                    textAnchor="middle"
                    fill="#854d0e"
                    fontSize={9.5 * activeScale}
                    fontWeight="800"
                    opacity="0.82"
                  >
                    BIOMA CERRADO (CAIXA D’ÁGUA)
                  </text>
                )}
                {projection([-56.9, -16.95]) && (
                  <text
                    x={projection([-56.9, -16.95])![0]}
                    y={projection([-56.9, -16.95])![1]}
                    textAnchor="middle"
                    fill="#0369a1"
                    fontSize={9 * activeScale}
                    fontWeight="800"
                    opacity="0.9"
                  >
                    BIOMA PANTANAL (PLANÍCIE ALAGÁVEL)
                  </text>
                )}
              </g>
            )}

            {/* 4. PRINCIPAIS RIOS DE MATO GROSSO */}
            {riosRender.map((rio, idx) => (
              <g key={idx} className="pointer-events-none">
                <path
                  d={rio.d}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={2 * activeScale}
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {rio.labelPos && (
                  <text
                    x={rio.labelPos[0]}
                    y={rio.labelPos[1] - 3.5 * activeScale}
                    textAnchor="middle"
                    fill="#0369a1"
                    fontSize={7.2 * activeScale}
                    fontStyle="italic"
                    fontWeight="700"
                  >
                    {rio.nome}
                  </text>
                )}
              </g>
            ))}

            {/* 5. CIDADES DE REFERÊNCIA EM MATO GROSSO */}
            {CIDADES_REFERENCIA_MT.map((cid, idx) => {
              const pos = projection([cid.lng, cid.lat]);
              if (!pos) return null;
              return (
                <g
                  key={idx}
                  transform={`translate(${pos[0]}, ${pos[1]}) scale(${activeScale})`}
                  className="pointer-events-none"
                >
                  <circle
                    r={cid.capital ? 3 : 1.8}
                    fill={cid.capital ? '#dc2626' : '#334155'}
                    stroke="#ffffff"
                    strokeWidth="0.9"
                  />
                  <text
                    x="4.5"
                    y="2.5"
                    fontSize={cid.capital ? '8' : '7'}
                    fontWeight={cid.capital ? '800' : '600'}
                    fill="#1e293b"
                  >
                    {cid.nome}
                  </text>
                </g>
              );
            })}

            {/* 6. MARCADORES DOS ESTUDOS FILTRADOS PELO EIXO ATUAL */}
            {[...itens]
              .sort((a, b) => (a.id === itemSelecionadoId ? 1 : 0) - (b.id === itemSelecionadoId ? 1 : 0))
              .map((item, idx) => {
                const pos = projection([item.coordenadas.lng, item.coordenadas.lat]);
                if (!pos) return null;

                const isSelected = item.id === itemSelecionadoId;
                const isHovered = hoveredItemId === item.id;
                const scalePin = (isSelected ? 1.15 : 0.94) * activeScale;

                const fillPin =
                  item.grupoId === 'grupo2'
                    ? '#d97706'
                    : item.grupoId === 'grupo1'
                    ? '#059669'
                    : '#7c3aed';

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
                    {isSelected && (
                      <circle
                        r={19 * activeScale}
                        fill={fillPin}
                        fillOpacity="0.2"
                        stroke={fillPin}
                        strokeWidth={1.8 * activeScale}
                      />
                    )}

                    <g transform={`scale(${scalePin})`} filter="url(#pin-drop-shadow)">
                      <circle
                        r={isSelected ? 13 : 11}
                        fill="#ffffff"
                        stroke={fillPin}
                        strokeWidth={isSelected ? 3 : 2.2}
                      />
                      <circle r={isSelected ? 9.5 : 8} fill={fillPin} />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="800"
                      >
                        {idx + 1}
                      </text>
                    </g>

                    {(isSelected || isHovered) && (
                      <g
                        transform={`translate(0, ${-20 * activeScale}) scale(${activeScale})`}
                        filter="url(#pin-drop-shadow)"
                        className="pointer-events-none"
                      >
                        <rect
                          x="-86"
                          y="-20"
                          width="172"
                          height="19"
                          rx="5"
                          fill="#0f172a"
                        />
                        <text
                          x="0"
                          y="-7.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8.5"
                          fontWeight="700"
                        >
                          {item.titulo.length > 27 ? item.titulo.slice(0, 26) + '…' : item.titulo}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
          </g>
        </svg>
      )}

      {/* MINI-MAPA DO BRASIL COMPLETO (27 UFs) NO CANTO SUPERIOR ESQUERDO */}
      <div
        onClick={() => centralizarVisao(modoVisao === 'mt' ? 'brasil' : 'mt')}
        title="Clique para alternar entre o Mapa do Brasil inteiro (27 Estados) e o Foco em Mato Grosso"
        className="absolute top-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-xl p-2 shadow-sm cursor-pointer hover:border-emerald-600 transition-colors w-[132px]"
      >
        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 mb-0.5">
          <span>Brasil (27 UFs)</span>
          <span className="text-emerald-700 font-extrabold">MT</span>
        </div>
        <svg width="116" height="104" viewBox="0 0 116 104" className="block mx-auto bg-sky-50/60 rounded-lg border border-slate-200/70">
          {todosEstados.map((uf: any) => {
            const sigla = uf.properties?.sigla;
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
        <span className="block text-center text-[9.5px] font-semibold text-emerald-800 mt-1">
          {modoVisao === 'mt' ? 'Ver Brasil Inteiro' : 'Focar Mato Grosso'}
        </span>
      </div>

      {/* CONTROLES DO MAPA NO CANTO SUPERIOR DIREITO */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
        <button
          onClick={() => centralizarVisao(modoVisao === 'mt' ? 'brasil' : 'mt')}
          className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-slate-800 border border-slate-300 rounded-lg text-[11px] font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <Maximize2 size={12} className="text-emerald-700" />
          <span>{modoVisao === 'mt' ? 'Visão Brasil (27 UFs)' : 'Focar Mato Grosso'}</span>
        </button>

        <button
          onClick={() => setMostrarBiomasEAreas(!mostrarBiomasEAreas)}
          className={`px-2.5 py-1.5 border rounded-lg text-[11px] font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            mostrarBiomasEAreas
              ? 'bg-emerald-800 text-white border-emerald-900'
              : 'bg-white/95 text-slate-700 border-slate-300'
          }`}
        >
          <Layers size={12} />
          <span>Biomas & TIs/UCs</span>
        </button>
      </div>

      {/* CONTROLES DE ZOOM NO CANTO INFERIOR ESQUERDO */}
      <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-300 shadow-xs">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700"
          title="Aproximar"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700"
          title="Afastar"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => centralizarVisao('mt')}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700"
          title="Centralizar em Mato Grosso"
        >
          <Compass size={14} />
        </button>
      </div>

      {/* LEGENDA COMPACTA NO CANTO INFERIOR DIREITO */}
      <div className="absolute bottom-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-xl px-3 py-1.5 shadow-xs text-[10px] text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-bold text-slate-900">Exibindo ({itens.length}):</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          Comunidades & Clima
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          Biodiversidade
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
          Patrimônio (IPHAN)
        </span>
      </div>
    </div>
  );
};

export default MapCanvas;