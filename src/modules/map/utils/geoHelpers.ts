import type * as d3 from 'd3';

export interface GeoFeature {
  type?: string;
  properties?: {
    sigla?: string;
    name?: string;
  };
  geometry?: {
    type: 'Polygon' | 'MultiPolygon' | string;
    coordinates: unknown;
  };
}

export function geoFeatureToSvgPath(feature: GeoFeature | undefined, proj: d3.GeoProjection): string {
  if (!feature?.geometry) return '';
  const { type, coordinates } = feature.geometry;

  const ringToPath = (ring: [number, number][]): string => {
    const pts = ring
      .map((c) => proj(c))
      .filter((p): p is [number, number] => p !== null && !Number.isNaN(p[0]) && !Number.isNaN(p[1]));
    if (pts.length < 3) return '';
    return `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}Z`;
  };

  if (type === 'Polygon') {
    return (coordinates as [number, number][][]).map(ringToPath).join(' ');
  }
  if (type === 'MultiPolygon') {
    return (coordinates as [number, number][][][])
      .map((poly) => poly.map(ringToPath).join(' '))
      .join(' ');
  }
  return '';
}

export function getFeatureCenter2D(
  feature: GeoFeature | undefined,
  proj: d3.GeoProjection
): [number, number] | null {
  if (!feature?.geometry) return null;
  const { type, coordinates } = feature.geometry;
  let mainRing: [number, number][] = [];

  if (type === 'Polygon') {
    mainRing = (coordinates as [number, number][][])[0] || [];
  } else if (type === 'MultiPolygon') {
    let maxLen = 0;
    for (const poly of coordinates as [number, number][][][]) {
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
    if (p && !Number.isNaN(p[0]) && !Number.isNaN(p[1])) {
      sumX += p[0];
      sumY += p[1];
      count += 1;
    }
  }
  return count > 0 ? [sumX / count, sumY / count] : null;
}

export function getPinColor(grupoId: string): string {
  switch (grupoId) {
    case 'grupo2':
      return '#d97706';
    case 'grupo1':
      return '#059669';
    case 'grupo3':
      return '#7c3aed';
    case 'descobertas':
      return '#e11d48';
    default:
      return '#0f766e';
  }
}
