import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import type {
  AuthorizedEmailEntry,
  AuthorizedEmailRole,
  UserRole,
} from '../../../shared/types/domain';
import {
  ROLE_LABELS,
  addAuthorizedEmail,
  approveAuthorizedEmail,
  listAuthorizedEmails,
  removeAuthorizedEmail,
  updateAuthorizedEmailRole,
} from '../services/accessControlService';

interface StaffEmailManagerModalProps {
  isOpen: boolean;
  actorEmail: string;
  actorRole: UserRole;
  onClose: () => void;
}

export const StaffEmailManagerModal: React.FC<StaffEmailManagerModalProps> = ({
  isOpen,
  actorEmail,
  actorRole,
  onClose,
}) => {
  const [entries, setEntries] = useState<AuthorizedEmailEntry[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AuthorizedEmailRole>('professor');
  const [classGroup, setClassGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSuperAdmin = actorRole === 'super_admin';
  const availableRoles: AuthorizedEmailRole[] = isSuperAdmin
    ? ['diretor', 'coordenador', 'professor', 'cobertura', 'cinema', 'lider']
    : ['lider', 'professor', 'cobertura', 'cinema'];

  const refresh = useCallback(async () => {
    const list = await listAuthorizedEmails();
    setEntries(list);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRole(isSuperAdmin ? 'professor' : 'lider');
      setFeedback(null);
      void refresh();
    }
  }, [isOpen, isSuperAdmin, refresh]);

  if (!isOpen) return null;

  const pendingEntries = entries.filter((e) => e.status === 'pending');
  const approvedEntries = entries.filter((e) => e.status !== 'pending');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await addAuthorizedEmail({ email, name, role, classGroup }, actorEmail);
      setName('');
      setEmail('');
      setClassGroup('');
      setFeedback('E-mail autorizado com sucesso!');
      await refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao cadastrar e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (targetEmail: string) => {
    setFeedback(null);
    try {
      await approveAuthorizedEmail(targetEmail, actorEmail);
      setFeedback(`Acesso aprovado para ${targetEmail}! Já pode entrar pelo Google.`);
      await refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao aprovar acesso.');
    }
  };

  const handleRemove = async (targetEmail: string) => {
    setFeedback(null);
    try {
      await removeAuthorizedEmail(targetEmail);
      await refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Não foi possível remover.');
    }
  };

  const handleChangeRole = async (targetEmail: string, nextRole: AuthorizedEmailRole) => {
    setFeedback(null);
    try {
      await updateAuthorizedEmailRole(targetEmail, nextRole, actorEmail);
      setFeedback(`Cargo atualizado para ${ROLE_LABELS[nextRole]} (${targetEmail}).`);
      await refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao atualizar cargo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl border border-slate-200 relative my-2 sm:my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-950">
          <div className="p-2.5 rounded-2xl bg-emerald-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Governança & Aprovações em 1 Clique · Mostra 19/11
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Aprovar Cadastros & E-mails Autorizados
            </h3>
          </div>
        </div>

        {pendingEntries.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-700" />
              <span>Solicitações Pendentes de Aprovação ({pendingEntries.length})</span>
            </div>
            {pendingEntries.map((entry) => (
              <div
                key={entry.email}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>{entry.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                      {ROLE_LABELS[entry.role]}
                    </span>
                    {entry.classGroup && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {entry.classGroup}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{entry.email}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => void handleApprove(entry.email)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 size={13} /> Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemove(entry.email)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                    title="Recusar solicitação"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Ou pré-cadastrar manualmente (opcional)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo (ex: Prof.ª Ana Paula)"
              required
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Google/Escolar"
              required
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AuthorizedEmailRole)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>

            <input
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              placeholder={
                role === 'lider'
                  ? 'Turma do aluno (ex: 9º Ano B)'
                  : role === 'cobertura'
                  ? 'Setor (ex: Repórter Galeria Live)'
                  : role === 'cinema'
                  ? 'Sala / Dupla (ex: Sala 10 · João e Maria)'
                  : 'Várias turmas (opcional, ex: 9º A, B, C e D)'
              }
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <UserPlus size={14} />
              {loading ? 'Salvando...' : 'Aprovar Direto'}
            </button>
          </div>

          {role === 'cobertura' && (
            <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <strong>Repórter Oficial:</strong> terá acesso exclusivo ao endereço separado <strong>/cobertura</strong> para gravar vídeos (1 a 60 min), tirar fotos e publicar na <strong>Galeria Ao Vivo (/galeria)</strong>.
            </p>
          )}

          {role === 'cinema' && (
            <p className="text-[11px] font-semibold text-sky-900 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2">
              <strong>Monitor(a) da Sala de Cinema:</strong> poderá criar sessões coletivas em <strong>/cinema</strong>, selecionar coletânea de vídeos e acionar o Quiz de 5 perguntas com Voz Fluida da IA.
            </p>
          )}

          {feedback && (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
              {feedback}
            </p>
          )}
        </form>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            E-mails Já Aprovados ({approvedEntries.length})
          </div>
          {approvedEntries.map((entry) => (
            <div
              key={entry.email}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs"
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                  <span>{entry.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                    {ROLE_LABELS[entry.role]}
                  </span>
                  {entry.classGroup && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                      {entry.classGroup}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{entry.email}</div>
              </div>

              {entry.role !== 'super_admin' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    aria-label={`Alterar cargo de ${entry.email}`}
                    value={entry.role}
                    onChange={(e) => void handleChangeRole(entry.email, e.target.value as AuthorizedEmailRole)}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-800 max-w-[165px]"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void handleRemove(entry.email)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                    title="Revogar acesso"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
