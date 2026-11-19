import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Download,
  Film,
  Image as ImageIcon,
  Maximize2,
  Radio,
  X,
} from 'lucide-react';
import type { LiveCoverageItem } from '../../../shared/types/domain';
import { ResolvedVideoPlayer } from '../../../shared/components/ResolvedVideoPlayer';
import {
  endPresenceSession,
  heartbeatPresenceSession,
  startPresenceSession,
} from '../../presence/services/presenceService';
import { subscribeLiveCoverage } from '../services/liveCoverageService';
import {
  downloadCoverageVideo,
  downloadWatermarkedPhoto,
} from '../utils/mediaWatermarkEngine';

export const PublicLiveGalleryPage: React.FC = () => {
  const [items, setItems] = useState<LiveCoverageItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [zoomPhoto, setZoomPhoto] = useState<LiveCoverageItem | null>(null);

  useEffect(() => subscribeLiveCoverage(setItems), []);

  useEffect(() => {
    let sid = '';
    void startPresenceSession({
      name: 'Visitante Galeria Live',
      category: 'outro',
      classGroup: 'Galeria Ao Vivo',
      area: 'galeria_live',
    }).then((id) => {
      sid = id;
    });
    const timer = window.setInterval(() => {
      if (sid) void heartbeatPresenceSession(sid);
    }, 20000);
    return () => {
      window.clearInterval(timer);
      if (sid) void endPresenceSession(sid);
    };
  }, []);

  const filtered = items.filter((item) => (filter === 'all' ? true : item.mediaType === filter));

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-900">
      <header className="bg-white border-b border-slate-200 px-3 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <a href="/" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 shrink-0" title="Voltar à Tela Inicial">
            <ArrowLeft size={16} />
          </a>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
              <Radio size={12} className="animate-pulse" /> LIVE · Cobertura em Tempo Real
            </span>
            <h1 className="text-xs sm:text-base font-extrabold text-slate-900 truncate">
              Galeria Oficial do Evento · EE CM João Ribeiro Vilela
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/cobertura"
            className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5"
          >
            <Camera size={14} className="text-amber-300" />
            <span>Área do Repórter</span>
          </a>
          <a
            href="/"
            className="px-3 py-1.5 min-h-[36px] rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center"
          >
            Voltar à Jornada
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3.5 sm:p-8 space-y-5">
        <div className="bg-gradient-to-r from-[#071e17] via-[#0d3326] to-[#134e3a] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10.5px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Ao Vivo Agora
            </span>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              Apresentações, Entrevistas & Momentos da Mostra
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Todos os vídeos e fotos baixados desta cobertura herdam automaticamente o selo do evento, o nome da escola e a data e hora exatas do registro.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl shrink-0 self-start sm:self-center">
            {(
              [
                { key: 'all', label: `Tudo (${items.length})` },
                { key: 'photo', label: 'Fotos' },
                { key: 'video', label: 'Vídeos Live' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  filter === tab.key ? 'bg-white text-emerald-950 shadow-xs' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <Radio size={28} className="mx-auto text-rose-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Transmissão pronta · Aguardando a primeira foto ou vídeo ao vivo!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Assim que a equipe autorizada registrar uma apresentação ou entrevista em <strong>/cobertura</strong>, ela aparecerá aqui em tempo real para todos acompanharem e baixarem.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <article key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
                <div className="relative aspect-video bg-slate-950">
                  {item.mediaType === 'video' ? (
                    <ResolvedVideoPlayer src={item.mediaUrl} className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setZoomPhoto(item)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/75 text-white hover:bg-slate-900"
                        title="Ampliar foto"
                      >
                        <Maximize2 size={14} />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[10.5px] font-mono font-bold text-emerald-800">
                      <span className="flex items-center gap-1">
                        {item.mediaType === 'video' ? <Film size={12} className="text-rose-600" /> : <ImageIcon size={12} />}
                        {item.eventDateLabel} · {item.eventTimeLabel}
                      </span>
                      <span className="text-slate-500 truncate">{item.classOrGuest}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.caption}</p>
                    <p className="text-[10.5px] text-slate-400 font-semibold">Por: {item.reporterName}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void (item.mediaType === 'photo'
                        ? downloadWatermarkedPhoto(item.mediaUrl, {
                            title: item.title,
                            classOrGuest: item.classOrGuest,
                            dateLabel: item.eventDateLabel,
                            timeLabel: item.eventTimeLabel,
                            timestamp: item.createdAt,
                          })
                        : downloadCoverageVideo(item.mediaUrl, {
                            title: item.title,
                            classOrGuest: item.classOrGuest,
                            dateLabel: item.eventDateLabel,
                            timeLabel: item.eventTimeLabel,
                            timestamp: item.createdAt,
                          }))
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} /> Baixar c/ Logo, Escola & Data/Hora
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {zoomPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3" onClick={() => setZoomPhoto(null)}>
          <div className="relative bg-white rounded-2xl max-w-4xl w-full p-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomPhoto(null)} className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white">
              <X size={18} />
            </button>
            <img src={zoomPhoto.mediaUrl} alt={zoomPhoto.title} className="w-full max-h-[82vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
