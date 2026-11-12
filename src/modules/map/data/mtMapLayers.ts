export const CIDADES_REFERENCIA_MT = [
  { nome: 'Cuiabá (Capital)', lat: -15.601, lng: -56.097, capital: true },
  { nome: 'N. Sra. do Livramento', lat: -15.775, lng: -56.345, capital: false },
  { nome: 'Chapada dos Guimarães', lat: -15.46, lng: -55.749, capital: false },
  { nome: 'Barão de Melgaço', lat: -16.194, lng: -55.967, capital: false },
  { nome: 'Poconé', lat: -16.257, lng: -56.623, capital: false },
  { nome: 'Barra do Garças', lat: -15.89, lng: -52.256, capital: false },
  { nome: 'Cáceres', lat: -16.075, lng: -57.678, capital: false },
  { nome: 'Rondonópolis', lat: -16.467, lng: -54.636, capital: false },
  { nome: 'Sinop', lat: -11.864, lng: -55.505, capital: false },
  { nome: 'Alta Floresta', lat: -9.875, lng: -56.086, capital: false },
];

export const RIOS_REAIS_MT: { nome: string; coords: [number, number][] }[] = [
  {
    nome: 'Rio Cuiabá',
    coords: [
      [-55.45, -14.4],
      [-55.85, -15.05],
      [-56.1, -15.6],
      [-55.97, -16.19],
      [-56.45, -16.75],
      [-57.15, -17.35],
    ],
  },
  {
    nome: 'Rio Paraguai',
    coords: [
      [-57.2, -14.5],
      [-57.68, -16.07],
      [-57.65, -17.1],
      [-57.45, -17.85],
    ],
  },
  {
    nome: 'Rio Araguaia',
    coords: [
      [-53.05, -17.5],
      [-52.25, -15.89],
      [-51.6, -14.2],
      [-50.7, -12.0],
      [-50.55, -10.2],
    ],
  },
  {
    nome: 'Rio Xingu',
    coords: [
      [-53.8, -13.6],
      [-53.4, -12.2],
      [-53.15, -10.8],
      [-52.9, -9.6],
    ],
  },
  {
    nome: 'Rio Teles Pires',
    coords: [
      [-54.7, -14.3],
      [-55.5, -11.86],
      [-56.5, -9.9],
      [-57.8, -8.5],
    ],
  },
];

export const AREAS_PROTEGIDAS_MT: { nome: string; tipo: string; coords: [number, number][] }[] = [
  {
    nome: 'Território Indígena do Xingu (T.I.)',
    tipo: 'TI',
    coords: [
      [-53.95, -10.2],
      [-52.65, -10.2],
      [-52.55, -12.75],
      [-53.85, -12.9],
      [-54.1, -11.5],
    ],
  },
  {
    nome: 'T.I. Xavante / Bororo (Sangradouro & Meruri)',
    tipo: 'TI',
    coords: [
      [-54.1, -15.1],
      [-53.05, -15.05],
      [-52.95, -15.75],
      [-53.95, -15.8],
    ],
  },
  {
    nome: 'UC Parque Nac. do Pantanal & Encontro das Águas',
    tipo: 'UC',
    coords: [
      [-57.65, -17.15],
      [-56.45, -17.1],
      [-56.55, -17.85],
      [-57.55, -17.9],
    ],
  },
];

export const AMAZONIA_COORDS: [number, number][] = [
  [-62.0, -7.0],
  [-50.0, -7.0],
  [-50.5, -11.8],
  [-53.5, -12.6],
  [-56.5, -13.1],
  [-59.5, -13.5],
  [-62.0, -12.5],
];

export const PANTANAL_COORDS: [number, number][] = [
  [-58.6, -15.8],
  [-56.8, -15.65],
  [-55.6, -16.05],
  [-55.2, -16.8],
  [-55.8, -18.2],
  [-58.8, -18.2],
];
