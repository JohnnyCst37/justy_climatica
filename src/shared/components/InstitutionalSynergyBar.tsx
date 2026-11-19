import React from 'react';
import { Code2, Handshake } from 'lucide-react';

interface InstitutionalSynergyBarProps {
  variant?: 'dark' | 'light';
}

const LOGOS = [
  { src: '/logo-jrv.png', alt: 'EE João Ribeiro Vilela', bg: 'bg-white' },
  { src: '/logo-civico.png', alt: 'Escola Estadual Cívico-Militar', bg: 'bg-white' },
  { src: '/logo-dre.jpeg', alt: 'DRE Primavera do Leste', bg: 'bg-white' },
  { src: '/logo-seduc-mt.jpeg', alt: 'Governo de Mato Grosso · SEDUC-MT', bg: 'bg-white' },
  { src: '/logo-jc.png', alt: 'Jornada da Justiça Climática', bg: 'bg-[#062c22]' },
];

export const InstitutionalSynergyBar: React.FC<InstitutionalSynergyBarProps> = ({
  variant = 'light',
}) => {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`rounded-2xl sm:rounded-3xl border px-4 py-3.5 sm:px-6 sm:py-4 space-y-3 ${
        isDark
          ? 'bg-white/5 border-white/15 backdrop-blur-md text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider ${
              isDark ? 'text-amber-300' : 'text-emerald-800'
            }`}
          >
            <Handshake size={13} /> União & Sinergia pela Educação de Mato Grosso
          </span>
          <p className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            EE Cívico-Militar João Ribeiro Vilela · DRE Primavera do Leste · SEDUC-MT
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {LOGOS.map((item) => (
            <div
              key={item.src}
              className={`${item.bg} px-2 py-1 rounded-xl border ${
                isDark ? 'border-white/25' : 'border-slate-200'
              } shadow-2xs flex items-center justify-center`}
              title={item.alt}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-8 sm:h-9 w-auto max-w-[100px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
          isDark ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Code2 size={13} className={isDark ? 'text-emerald-300' : 'text-emerald-700'} />
          <span>
            Tecnologia, Arquitetura de IA &amp; Desenvolvimento:{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>
              Prof. Johnny Fernandes
            </strong>{' '}
            ·{' '}
            <span className={isDark ? 'text-amber-300 font-bold' : 'text-emerald-800 font-bold'}>
              Venture Builder &amp; Desenvolvedor Full-Stack IA
            </span>
          </span>
        </span>
        <span className={isDark ? 'text-emerald-200/80 font-semibold' : 'text-slate-500 font-medium'}>
          2ª Mostra Cultural · 19/11 · Primavera do Leste / MT
        </span>
      </div>
    </footer>
  );
};
