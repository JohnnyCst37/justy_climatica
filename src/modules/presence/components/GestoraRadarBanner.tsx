import React from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import type { PresenceSessionRecord } from '../../../shared/types/domain';
import { VISITOR_CATEGORY_LABELS, isSessionActiveOnline } from '../services/presenceService';

interface GestoraRadarBannerProps {
  sessions: PresenceSessionRecord[];
  now: number;
}

export const GestoraRadarBanner: React.FC<GestoraRadarBannerProps> = ({ sessions, now }) => {
  const gestores = sessions.filter(
    (s) => s.category === 'dre' || s.category === 'diretor' || s.category === 'coordenador'
  );
  const dreOnline = gestores.filter((s) => s.category === 'dre' && isSessionActiveOnline(s, now));
  const dreTotal = gestores.filter((s) => s.category === 'dre').length;

  return (
    <section
      className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        dreOnline.length > 0
          ? 'bg-amber-50 border-amber-400 shadow-sm'
          : gestores.length > 0
          ? 'bg-sky-50/70 border-sky-200'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            dreOnline.length > 0 ? 'bg-amber-200 text-amber-950' : 'bg-sky-100 text-sky-900'
          }`}
        >
          {dreOnline.length > 0 ? <Eye size={18} /> : <ShieldAlert size={18} />}
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
            Radar da Equipe Gestora & DRE (Seduc-MT)
          </span>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
            {dreOnline.length > 0
              ? `Representante da DRE assistindo AGORA (${dreOnline.map((d) => d.name).join(', ')})`
              : dreTotal > 0
              ? `${dreTotal} visita(s) da DRE registrada(s) nesta Mostra`
              : gestores.length > 0
              ? `${gestores.length} gestor(es) escolar(es) acompanhando a Mostra · Aguardando DRE`
              : 'Monitorando em tempo real a entrada de gestores da DRE, Direção e Coordenação'}
          </h2>
        </div>
      </div>

      {gestores.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {gestores.slice(0, 6).map((g) => {
            const online = isSessionActiveOnline(g, now);
            return (
              <span
                key={g.id}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                  online
                    ? 'bg-white border-amber-400 text-amber-950'
                    : 'bg-white/70 border-slate-200 text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                <span>{g.name}</span>
                <span className="text-[10px] opacity-80">({VISITOR_CATEGORY_LABELS[g.category]})</span>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
};
