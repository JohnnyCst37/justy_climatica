import React, { useEffect, useState } from 'react';
import { CheckSquare, Clapperboard, Plus, Square, X } from 'lucide-react';
import type {
  CinemaPlaylistVideo,
  CinemaSessionRecord,
  CommunityNode,
  ThemeSessionKey,
} from '../../../shared/types/domain';
import {
  CINEMA_THEME_LABELS,
  createCinemaSession,
  fetchAllAvailableCinemaVideos,
} from '../services/cinemaSessionService';

interface CreateCinemaSessionModalProps {
  isOpen: boolean;
  communities: CommunityNode[];
  creatorName: string;
  creatorEmail?: string;
  onClose: () => void;
  onCreated: (session: CinemaSessionRecord) => void;
}

export const CreateCinemaSessionModal: React.FC<CreateCinemaSessionModalProps> = ({
  isOpen,
  communities,
  creatorName,
  creatorEmail,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [hostsLabel, setHostsLabel] = useState(creatorName);
  const [theme, setTheme] = useState<ThemeSessionKey>('justica');
  const [communityId, setCommunityId] = useState(communities[0]?.id || 'sala10');
  const [availableVideos, setAvailableVideos] = useState<CinemaPlaylistVideo[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    void fetchAllAvailableCinemaVideos(communities).then((list) => {
      setAvailableVideos(list);
      if (list.length > 0 && selectedIds.length === 0) {
        setSelectedIds([list[0].id]);
      }
    });
  }, [isOpen, communities]);

  if (!isOpen) return null;

  const toggleVideo = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomVideo = () => {
    const cleanUrl = customUrl.trim();
    if (!cleanUrl) return;
    const comm = communities.find((c) => c.id === communityId) || communities[0];
    const extra: CinemaPlaylistVideo = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || 'Vídeo Adicionado na Sessão',
      mediaUrl: cleanUrl,
      communityTitle: comm?.titulo || 'Sala 10 · Mostra',
      classGroup: 'Sala de Cinema',
    };
    setAvailableVideos((prev) => [extra, ...prev]);
    setSelectedIds((prev) => [extra.id, ...prev]);
    setCustomTitle('');
    setCustomUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = availableVideos.filter((v) => selectedIds.includes(v.id));
    if (chosen.length === 0) {
      setErrorMsg('Marque pelo menos 1 vídeo da lista (ou adicione um link) para a coletânea.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const comm = communities.find((c) => c.id === communityId) || communities[0];
      const created = await createCinemaSession({
        title: title.trim() || `Sessão ${chosen[0].title}`,
        theme,
        communityId: comm?.id || communityId,
        communityTitle: comm?.titulo || 'Justiça Climática MT',
        hostsLabel: hostsLabel.trim() || creatorName,
        createdByName: creatorName,
        createdByEmail: creatorEmail,
        videos: chosen,
      });
      setTitle('');
      onCreated(created);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Não foi possível criar a sessão.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-950 pr-6">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
            <Clapperboard size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              2 Alunos Monitores · Telão Coletivo + Voz Fluida IA
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Criar Nova Sessão da Sala de Cinema
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da Sessão (ex: Sessão 1 · Águas do Cerrado)"
              required
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
            />
            <input
              value={hostsLabel}
              onChange={(e) => setHostsLabel(e.target.value)}
              placeholder="Dupla de alunos apresentadores"
              required
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <select
              aria-label="Tema do Evento e do Quiz"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeSessionKey)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900"
            >
              {(Object.keys(CINEMA_THEME_LABELS) as ThemeSessionKey[]).map((key) => (
                <option key={key} value={key}>
                  Tema & Quiz: {CINEMA_THEME_LABELS[key]}
                </option>
              ))}
            </select>

            <select
              aria-label="Território de Referência"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  Território: {c.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-900">
                Coletânea de Vídeos ({selectedIds.length} selecionado{selectedIds.length === 1 ? '' : 's'})
              </span>
              <span className="text-[11px] font-semibold text-emerald-800">
                Mínimo: 1 vídeo
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {availableVideos.map((vid) => {
                const picked = selectedIds.includes(vid.id);
                return (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => toggleVideo(vid.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-start gap-2 transition ${
                      picked
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {picked ? (
                      <CheckSquare size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Square size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate">{vid.title}</div>
                      <div className="text-[10.5px] text-slate-500 font-normal truncate">
                        {vid.classGroup} · {vid.communityTitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Nome de outro vídeo (opcional)"
                className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              />
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Cole link YouTube / Drive..."
                className="sm:col-span-6 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomVideo}
                className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus size={13} /> Incluir
              </button>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-amber-950 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            Ao iniciar a sessão: a <strong>Voz Fluida da IA</strong> fará a abertura anunciando o tema e o nome do(s) vídeo(s), exibirá a coletânea e conduzirá o <strong>Mini Quiz de 5 perguntas</strong> com o público!
          </p>

          {errorMsg && (
            <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-extrabold shadow-md"
          >
            {saving ? 'Criando Sessão...' : 'Salvar & Abrir Sessão na Sala de Cinema'}
          </button>
        </form>
      </div>
    </div>
  );
};
