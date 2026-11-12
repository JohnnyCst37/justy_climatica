import React, { useState, useEffect } from 'react';
import { ItemMural, BiomaType } from '../types';
import { 
  X, 
  Save, 
  Plus, 
  RotateCcw, 
  Check, 
  FileCode, 
  Video, 
  Image as ImageIcon, 
  GraduationCap, 
  Copy
} from 'lucide-react';

interface ModoProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projetos: ItemMural[];
  onSaveProjetos: (projetos: ItemMural[]) => void;
  onResetPadrao: () => void;
  projetoSelecionadoParaEditar?: ItemMural | null;
}

export const ModoProfessorModal: React.FC<ModoProfessorModalProps> = ({
  isOpen,
  onClose,
  projetos,
  onSaveProjetos,
  onResetPadrao,
  projetoSelecionadoParaEditar,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    projetoSelecionadoParaEditar?.id || projetos[0]?.id || ''
  );
  const [isNovo, setIsNovo] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'exportar'>('editor');

  useEffect(() => {
    if (projetoSelecionadoParaEditar) {
      handleSelectProjeto(projetoSelecionadoParaEditar.id);
    }
  }, [projetoSelecionadoParaEditar]);

  const projetoAtual = isNovo
    ? null
    : projetos.find((p) => p.id === selectedId) || projetos[0];

  const [titulo, setTitulo] = useState(projetoAtual?.titulo || '');
  const [subtitulo, setSubtitulo] = useState(projetoAtual?.subtitulo || '');
  const [grupoId, setGrupoId] = useState<'grupo1' | 'grupo2' | 'grupo3'>(projetoAtual?.grupoId || 'grupo2');
  const [bioma, setBioma] = useState<BiomaType>(projetoAtual?.bioma || 'Cerrado');
  const [municipio, setMunicipio] = useState(projetoAtual?.municipio || '');
  const [regiaoMT, setRegiaoMT] = useState(projetoAtual?.regiaoMT || '');
  const [lat, setLat] = useState(projetoAtual?.coordenadas.lat.toString() || '-15.60');
  const [lng, setLng] = useState(projetoAtual?.coordenadas.lng.toString() || '-56.10');
  const [alunosText, setAlunosText] = useState(projetoAtual?.equipeAlunos.join(', ') || '');
  const [focoTematico, setFocoTematico] = useState(projetoAtual?.focoTematico || '');
  const [infograficoUrl, setInfograficoUrl] = useState(projetoAtual?.infografico.url || '');
  const [infograficoTitulo, setInfograficoTitulo] = useState(projetoAtual?.infografico.titulo || '');
  const [infograficoLegenda, setInfograficoLegenda] = useState(projetoAtual?.infografico.legenda || '');
  const [videoUrl, setVideoUrl] = useState(projetoAtual?.videoEquipe.url || '');
  const [videoTitulo, setVideoTitulo] = useState(projetoAtual?.videoEquipe.titulo || '');
  const [videoRoteiro, setVideoRoteiro] = useState(projetoAtual?.videoEquipe.roteiroResumo || '');
  const [resumoIntro, setResumoIntro] = useState(projetoAtual?.resumoCientifico.introducao || '');
  const [resumoDiag, setResumoDiag] = useState(projetoAtual?.resumoCientifico.diagnosticoEcologico || '');
  const [resumoAmeacas, setResumoAmeacas] = useState(projetoAtual?.resumoCientifico.ameacasImpactos || '');
  const [resumoSolucoes, setResumoSolucoes] = useState(projetoAtual?.resumoCientifico.solucoesComunitarias || '');
  const [depoimentoVoz, setDepoimentoVoz] = useState(projetoAtual?.diarioDeBordo.depoimentoOuVoz || '');
  const [autorVoz, setAutorVoz] = useState(projetoAtual?.diarioDeBordo.autorVoz || '');
  const [cargoVoz, setCargoVoz] = useState(projetoAtual?.diarioDeBordo.cargoOuFuncao || '');

  const handleSelectProjeto = (id: string) => {
    setIsNovo(false);
    setSelectedId(id);
    const p = projetos.find((proj) => proj.id === id);
    if (!p) return;
    setTitulo(p.titulo);
    setSubtitulo(p.subtitulo);
    setGrupoId(p.grupoId);
    setBioma(p.bioma);
    setMunicipio(p.municipio);
    setRegiaoMT(p.regiaoMT);
    setLat(p.coordenadas.lat.toString());
    setLng(p.coordenadas.lng.toString());
    setAlunosText(p.equipeAlunos.join(', '));
    setFocoTematico(p.focoTematico);
    setInfograficoUrl(p.infografico.url);
    setInfograficoTitulo(p.infografico.titulo);
    setInfograficoLegenda(p.infografico.legenda);
    setVideoUrl(p.videoEquipe.url);
    setVideoTitulo(p.videoEquipe.titulo);
    setVideoRoteiro(p.videoEquipe.roteiroResumo);
    setResumoIntro(p.resumoCientifico.introducao);
    setResumoDiag(p.resumoCientifico.diagnosticoEcologico);
    setResumoAmeacas(p.resumoCientifico.ameacasImpactos);
    setResumoSolucoes(p.resumoCientifico.solucoesComunitarias);
    setDepoimentoVoz(p.diarioDeBordo.depoimentoOuVoz);
    setAutorVoz(p.diarioDeBordo.autorVoz);
    setCargoVoz(p.diarioDeBordo.cargoOuFuncao);
  };

  const handleIniciarNovo = () => {
    setIsNovo(true);
    setSelectedId('');
    setTitulo('Novo Estudo de Campo 9º Ano');
    setSubtitulo('Impacto climático e conservação em Mato Grosso');
    setGrupoId('grupo2');
    setBioma('Cerrado');
    setMunicipio('Cuiabá');
    setRegiaoMT('Baixada Cuiabana');
    setLat('-15.60');
    setLng('-56.10');
    setAlunosText('Estudante 1, Estudante 2, Estudante 3');
    setFocoTematico('Justiça climática e preservação de recursos hídricos');
    setInfograficoUrl('/src/assets/images/foto_quilombo_mata_cavalo_pt_1794410879621.jpg');
    setInfograficoTitulo('Infográfico da Equipe');
    setInfograficoLegenda('Elaborado com dados do MapBiomas, ISA e Observatório do Pantanal.');
    setVideoUrl('');
    setVideoTitulo('Vídeo da Equipe (YouTube ou Drive)');
    setVideoRoteiro('Roteiro resumido do vídeo.');
    setResumoIntro('Introdução ao território estudado em Mato Grosso.');
    setResumoDiag('Diagnóstico com base nos dados do MapBiomas e ISA.');
    setResumoAmeacas('Impacto das secas severas e queimadas.');
    setResumoSolucoes('Propostas de manejo sustentável e Unidades de Conservação.');
    setDepoimentoVoz('"Relato colhido sobre a importância da água e da floresta em pé."');
    setAutorVoz('Liderança Comunitária');
    setCargoVoz('Morador tradicional');
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();

    const grupoNomes = {
      grupo1: 'Grupo 1: Biodiversidade & Genética',
      grupo2: 'Grupo 2: Comunidades & Impactos',
      grupo3: 'Grupo 3: Patrimônio Imaterial',
    };

    const grupoCores = {
      grupo1: '#059669',
      grupo2: '#d97706',
      grupo3: '#7c3aed',
    };

    const alunosArray = alunosText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const targetId = isNovo ? `projeto-${Date.now()}` : selectedId;
    const baseProjeto = projetos.find((p) => p.id === targetId);

    const updatedItem: ItemMural = {
      id: targetId,
      titulo,
      subtitulo,
      grupoId,
      grupoNome: grupoNomes[grupoId],
      grupoCor: grupoCores[grupoId],
      bioma,
      municipio,
      regiaoMT,
      coordenadas: {
        lat: parseFloat(lat) || -15.6,
        lng: parseFloat(lng) || -56.1,
      },
      equipeAlunos: alunosArray.length > 0 ? alunosArray : ['Equipe 9º Ano'],
      orientador: 'Prof. Johnny Martins Fernandes',
      escola: 'EE João Ribeiro Vilela',
      serie: '9º Ano — Ciências',
      especiesCientificas: baseProjeto?.especiesCientificas || [
        {
          nomePopular: 'Pequizeiro',
          nomeCientificoLatim: 'Caryocar brasiliense',
          familia: 'Caryocaraceae',
          papelEcologico: 'Espécie nativa símbolo da sociobiodiversidade de Mato Grosso.',
        },
      ],
      pontosInfograficoPT: baseProjeto?.pontosInfograficoPT || [
        {
          x: 35,
          y: 45,
          titulo: 'Território e Biodiversidade (MT)',
          nomeCientifico: 'Caryocar brasiliense',
          descricao: 'Ponto focal de análise socioambiental conduzido pelos estudantes do 9º Ano.',
        },
      ],
      narracaoModoHistoria:
        baseProjeto?.narracaoModoHistoria ||
        `${titulo}. Estudo realizado no município de ${municipio}, no bioma ${bioma}. ${resumoIntro} ${resumoDiag} ${resumoSolucoes}`,
      justicaClimaticaExplicacao: baseProjeto?.justicaClimaticaExplicacao || {
        quemSofreImpacto: `Comunidade local em ${municipio}`,
        causaDoProblema: resumoAmeacas,
        porQueEInjusto: 'Populações que preservam o bioma sofrem primeiro com os extremos climáticos.',
      },
      unidadeConservacaoRelacionada: baseProjeto?.unidadeConservacaoRelacionada || {
        nome: 'Unidade de Conservação / Território Protegido',
        categoriaSNUC: 'Uso Sustentável / Território Tradicional',
        explicacaoEF09CI12: 'Garante a conservação da biodiversidade aliada aos modos de vida tradicionais (EF09CI12).',
      },
      focoTematico,
      conceitosChave: baseProjeto?.conceitosChave || ['Justiça Climática', 'Unidades de Conservação (EF09CI12)'],
      habilidadesBNCC: baseProjeto?.habilidadesBNCC || [
        {
          codigo: 'EF09CI12',
          titulo: 'Unidades de Conservação e Populações Tradicionais',
          descricao: 'Justificar a importância das unidades de conservação para a preservação da biodiversidade e do patrimônio nacional.',
        },
      ],
      fontesPesquisa: baseProjeto?.fontesPesquisa || [
        'MapBiomas (Dados de queimadas e água no Cerrado e Pantanal)',
        'Instituto Socioambiental (ISA)',
        'Observatório do Pantanal',
      ],
      infografico: {
        url: infograficoUrl,
        titulo: infograficoTitulo || 'Infográfico Científico',
        legenda: infograficoLegenda || 'Produzido pelos alunos do 9º Ano.',
        autor: 'Equipe 9º Ano',
        formato: 'imagem',
      },
      videoEquipe: {
        url: videoUrl,
        titulo: videoTitulo || 'Vídeo da Equipe',
        duracao: '4 min',
        descricao: videoRoteiro,
        roteiroResumo: videoRoteiro,
      },
      resumoCientifico: {
        introducao: resumoIntro,
        diagnosticoEcologico: resumoDiag,
        ameacasImpactos: resumoAmeacas,
        solucoesComunitarias: resumoSolucoes,
        conclusaoEstudantil:
          baseProjeto?.resumoCientifico.conclusaoEstudantil ||
          'Estudo concluído com propostas de conservação ativa.',
      },
      diarioDeBordo: {
        dataRegistro: baseProjeto?.diarioDeBordo.dataRegistro || 'Registro de Campo',
        depoimentoOuVoz: depoimentoVoz,
        autorVoz,
        cargoOuFuncao: cargoVoz,
        observacoesCampo: baseProjeto?.diarioDeBordo.observacoesCampo || 'Pesquisa escolar.',
      },
      metricas: baseProjeto?.metricas || [
        { rotulo: 'Impacto Analisado', valor: 'Prioritário', detalhe: 'Dados MapBiomas/ISA', icone: 'alerta' },
        { rotulo: 'Bioma MT', valor: bioma, detalhe: municipio, icone: 'arvore' },
        { rotulo: 'Habilidade BNCC', valor: 'EF09CI12', detalhe: 'Unidades de Conservação', icone: 'comunidade' },
      ],
      acoesPropostas: baseProjeto?.acoesPropostas || [
        'Apresentação na Mostra Científica da EE João Ribeiro Vilela',
      ],
    };

    const novosProjetos = isNovo
      ? [...projetos, updatedItem]
      : projetos.map((p) => (p.id === targetId ? updatedItem : p));

    if (isNovo) {
      setSelectedId(targetId);
      setIsNovo(false);
    }

    onSaveProjetos(novosProjetos);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCopiarCodigo = () => {
    const code = `export const DADOS_INICIAIS_MURAL = ${JSON.stringify(projetos, null, 2)};\n`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-slate-900">
        {/* Cabeçalho Compacto */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Modo Professor · Gestão de Trabalhos (Prof. Johnny M. Fernandes)
              </h2>
              <p className="text-[11px] text-slate-500">
                Cole links de infográficos (Canva/Drive) e vídeos (YouTube/Drive) das equipes do 9º Ano
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Abas */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2 flex items-center justify-between flex-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editar Trabalhos
            </button>
            <button
              onClick={() => setActiveTab('exportar')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'exportar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode size={13} />
              <span>Exportar JSON (dadosMural.ts)</span>
            </button>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs text-amber-800 hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Restaurar 6 Estudos Originais</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-rose-700 font-semibold">Confirmar restauração?</span>
              <button
                onClick={() => {
                  onResetPadrao();
                  setConfirmReset(false);
                }}
                className="px-2 py-0.5 bg-rose-600 text-white rounded font-semibold"
              >
                Sim
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded"
              >
                Não
              </button>
            </div>
          )}
        </div>

        {activeTab === 'exportar' ? (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950">
              Copie o JSON abaixo caso queira atualizar diretamente o arquivo <code className="font-mono font-bold">/data/dadosMural.ts</code>.
            </div>
            <div className="relative flex-1">
              <pre className="bg-slate-900 text-slate-100 text-xs font-mono p-4 rounded-xl h-[360px] overflow-auto">
                {JSON.stringify(projetos, null, 2)}
              </pre>
              <button
                onClick={handleCopiarCodigo}
                className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-row overflow-hidden">
            {/* Lista Lateral */}
            <div className="w-56 bg-slate-50 border-r border-slate-200 p-2.5 overflow-y-auto flex flex-col gap-1 flex-none">
              <button
                onClick={handleIniciarNovo}
                className="w-full py-1.5 px-2.5 rounded-lg border border-dashed border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1 mb-1.5"
              >
                <Plus size={13} />
                <span>Novo Trabalho</span>
              </button>

              {projetos.map((proj, idx) => {
                const isSelected = !isNovo && proj.id === selectedId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => handleSelectProjeto(proj.id)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'bg-white border-emerald-600 font-bold text-slate-900 shadow-2xs'
                        : 'border-transparent text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="truncate">
                      {idx + 1}. {proj.titulo}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {proj.municipio} · {proj.bioma}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Formulário Compacto */}
            <form onSubmit={handleSalvar} className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {savedNotice && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5">
                  <Check size={14} />
                  <span>Alterações salvas imediatamente no Mural Digital!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Título do Estudo:</label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subtítulo / Foco:</label>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grupo:</label>
                  <select
                    value={grupoId}
                    onChange={(e) => setGrupoId(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5"
                  >
                    <option value="grupo2">Grupo 2: Comunidades</option>
                    <option value="grupo1">Grupo 1: Biodiversidade</option>
                    <option value="grupo3">Grupo 3: Patrimônio</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bioma:</label>
                  <select
                    value={bioma}
                    onChange={(e) => setBioma(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5"
                  >
                    <option value="Cerrado">Cerrado</option>
                    <option value="Pantanal">Pantanal</option>
                    <option value="Amazônia-Cerrado">Amazônia-Cerrado</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Município (MT):</label>
                  <input
                    type="text"
                    required
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lat / Lng:</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-mono"
                    />
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                    <ImageIcon size={13} className="text-emerald-700" />
                    <span>URL do Infográfico (Canva / Drive / Imagem):</span>
                  </label>
                  <input
                    type="text"
                    value={infograficoUrl}
                    onChange={(e) => setInfograficoUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                    <Video size={13} className="text-rose-700" />
                    <span>URL do Vídeo da Equipe (YouTube / Google Drive):</span>
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Equipe de Alunos (9º Ano):</label>
                <input
                  type="text"
                  value={alunosText}
                  onChange={(e) => setAlunosText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Diagnóstico Ecológico:</label>
                  <textarea
                    rows={2}
                    value={resumoDiag}
                    onChange={(e) => setResumoDiag(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 resize-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Soluções Comunitárias:</label>
                  <textarea
                    rows={2}
                    value={resumoSolucoes}
                    onChange={(e) => setResumoSolucoes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModoProfessorModal;
