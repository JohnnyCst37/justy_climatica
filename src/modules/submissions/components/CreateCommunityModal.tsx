import React, { useState } from 'react';
import { MapPinPlus, Sparkles, X } from 'lucide-react';
import type { BiomaType, CommunityNode } from '../../../shared/types/domain';
import {
  MT_MUNICIPALITY_COORDS,
  type CreateCommunityInput,
} from '../../../shared/services/customCommunitiesService';
import { SCHOOL_CLASS_OPTIONS } from '../../auth/services/accessControlService';

interface CreateCommunityModalProps {
  isOpen: boolean;
  defaultOrientador?: string;
  userClasses?: string[];
  onClose: () => void;
  onCreateCommunity: (input: CreateCommunityInput) => Promise<CommunityNode>;
  onCreated: (community: CommunityNode) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  defaultOrientador = '',
  userClasses,
  onClose,
  onCreateCommunity,
  onCreated,
}) => {
  const quickClasses =
    userClasses && userClasses.length > 0
      ? userClasses
      : ['9º Ano A', '9º Ano B', '9º Ano C', '9º Ano D'];
  const [titulo, setTitulo] = useState('');
  const [municipio, setMunicipio] = useState('Cuiabá');
  const [regiaoMT, setRegiaoMT] = useState('Baixada Cuiabana');
  const [bioma, setBioma] = useState<BiomaType>('Cerrado');
  const [grupoId, setGrupoId] = useState<'grupo1' | 'grupo2' | 'grupo3'>('grupo2');
  const [equipeAlunos, setEquipeAlunos] = useState('');
  const [orientador, setOrientador] = useState(defaultOrientador);
  const [serie, setSerie] = useState(quickClasses[0] || '9º Ano A');
  const [quemSofreImpacto, setQuemSofreImpacto] = useState('');
  const [causaDoProblema, setCausaDoProblema] = useState('');
  const [solucoesComunitarias, setSolucoesComunitarias] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const created = await onCreateCommunity({
        titulo,
        municipio,
        regiaoMT,
        bioma,
        grupoId,
        equipeAlunos,
        orientador,
        serie,
        quemSofreImpacto,
        causaDoProblema,
        solucoesComunitarias,
      });
      onCreated(created);
      setTitulo('');
      setEquipeAlunos('');
      setQuemSofreImpacto('');
      setCausaDoProblema('');
      setSolucoesComunitarias('');
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Não foi possível criar o território.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-900">
          <div className="p-2.5 rounded-2xl bg-emerald-100">
            <MapPinPlus size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Novo Pino no Mapa & Carrossel do Evento
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Criar Novo Território / Comunidade
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome do Território / Comunidade (ex: Nascente do Coxipó ou Aldeia Pakuera)"
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-medium"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <input
                list="mt-municipios"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                placeholder="Município em MT"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
              <datalist id="mt-municipios">
                {Object.keys(MT_MUNICIPALITY_COORDS).map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <input
              value={regiaoMT}
              onChange={(e) => setRegiaoMT(e.target.value)}
              placeholder="Região MT (ex: Baixada Cuiabana)"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <select
              value={bioma}
              onChange={(e) => setBioma(e.target.value as BiomaType)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
            >
              <option value="Cerrado">Bioma: Cerrado</option>
              <option value="Pantanal">Bioma: Pantanal</option>
              <option value="Amazônia-Cerrado">Bioma: Amazônia / Transição</option>
            </select>

            <select
              value={grupoId}
              onChange={(e) => setGrupoId(e.target.value as 'grupo1' | 'grupo2' | 'grupo3')}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
            >
              <option value="grupo2">Eixo: Quilombos & Cerrado</option>
              <option value="grupo1">Eixo: Povos Indígenas & Floresta</option>
              <option value="grupo3">Eixo: Pantanal & Águas</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mr-1">
                Turma da Pesquisa:
              </span>
              {quickClasses.map((turma) => (
                <button
                  key={turma}
                  type="button"
                  onClick={() => setSerie(turma)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                    serie === turma
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  {turma}
                </button>
              ))}
              <select
                aria-label="Selecionar qualquer turma do 6º ao 9º Ano"
                value={SCHOOL_CLASS_OPTIONS.includes(serie) ? serie : ''}
                onChange={(e) => {
                  if (e.target.value) setSerie(e.target.value);
                }}
                className="px-2 py-0.5 rounded-md text-[11px] font-bold border border-slate-200 bg-white text-slate-700"
              >
                <option value="">Todas (6º–9º)...</option>
                {SCHOOL_CLASS_OPTIONS.map((turma) => (
                  <option key={turma} value={turma}>
                    {turma}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                value={equipeAlunos}
                onChange={(e) => setEquipeAlunos(e.target.value)}
                placeholder="Alunos (separados por vírgula)"
                required
                className="sm:col-span-2 px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
              <input
                list="create-community-turmas"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                placeholder="Turma (ex: 9º Ano B)"
                required
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl font-semibold"
              />
            </div>

            <datalist id="create-community-turmas">
              {SCHOOL_CLASS_OPTIONS.map((turma) => (
                <option key={turma} value={turma} />
              ))}
            </datalist>
          </div>

          <input
            value={orientador}
            onChange={(e) => setOrientador(e.target.value)}
            placeholder="Professor(a) Orientador(a)"
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
          />

          <textarea
            value={quemSofreImpacto}
            onChange={(e) => setQuemSofreImpacto(e.target.value)}
            placeholder="Quem sofre os impactos do clima neste território e o que está acontecendo?"
            rows={2}
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl resize-none"
          />

          <textarea
            value={causaDoProblema}
            onChange={(e) => setCausaDoProblema(e.target.value)}
            placeholder="Principal causa do problema ambiental (ex: queimadas, assoreamento, seca severa)..."
            rows={2}
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl resize-none"
          />

          <textarea
            value={solucoesComunitarias}
            onChange={(e) => setSolucoesComunitarias(e.target.value)}
            placeholder="Como a comunidade e os estudantes protegem a natureza aqui?"
            rows={2}
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl resize-none"
          />

          {errorMsg && (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              {saving ? 'Criando pino...' : 'Criar Território e Selecionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

