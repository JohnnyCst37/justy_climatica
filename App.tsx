import React, { useState, useEffect, useMemo } from 'react';
import { ItemMural, GrupoId } from './types';
import { 
  EIXOS_TEMATICOS, 
  DADOS_INICIAIS_MURAL, 
  getMuralProjetos, 
  saveMuralProjetos, 
  resetMuralProjetos 
} from './data/dadosMural';
import MapCanvas from './components/MapCanvas';
import FichaCuradoria from './components/FichaCuradoria';
import PainelJusticaClimatica from './components/PainelJusticaClimatica';
import ModoProfessorModal from './components/ModoProfessorModal';
import ModoHistoriaModal from './components/ModoHistoriaModal';
import { Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [projetos, setProjetos] = useState<ItemMural[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [activeEixo, setActiveEixo] = useState<GrupoId>('todos');
  const [modoProfessorOpen, setModoProfessorOpen] = useState(false);
  const [modoHistoriaOpen, setModoHistoriaOpen] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState<ItemMural | null>(null);
  const [sidebarAbertaMobile, setSidebarAbertaMobile] = useState(false);

  useEffect(() => {
    const dados = getMuralProjetos();
    setProjetos(dados);
    if (dados.length > 0) {
      setSelectedItemId(dados[0].id);
    }
  }, []);

  // Filtra estritamente os itens pelo eixo clicado (ex: clicar em Patrimônio Imaterial exibe apenas Raizeiras do Cerrado)
  const itensFiltrados = useMemo(() => {
    if (activeEixo === 'todos') return projetos;
    return projetos.filter((p) => p.grupoId === activeEixo);
  }, [projetos, activeEixo]);

  const itemAtivo = useMemo(() => {
    return (
      itensFiltrados.find((p) => p.id === selectedItemId) ||
      itensFiltrados[0] ||
      projetos[0] ||
      null
    );
  }, [projetos, selectedItemId, itensFiltrados]);

  const currentIndex = useMemo(() => {
    if (!itemAtivo) return 0;
    const idx = itensFiltrados.findIndex((p) => p.id === itemAtivo.id);
    return idx >= 0 ? idx : 0;
  }, [itensFiltrados, itemAtivo]);

  const handleSelectEixo = (eixoId: GrupoId) => {
    setActiveEixo(eixoId);
    const lista = eixoId === 'todos' ? projetos : projetos.filter((p) => p.grupoId === eixoId);
    if (lista.length > 0) {
      setSelectedItemId(lista[0].id);
    }
  };

  const handleItemSelect = (item: ItemMural) => {
    setSelectedItemId(item.id);
    setSidebarAbertaMobile(true);
  };

  const goToNextItem = () => {
    if (itensFiltrados.length === 0) return;
    const nextIdx = (currentIndex + 1) % itensFiltrados.length;
    setSelectedItemId(itensFiltrados[nextIdx].id);
  };

  const goToPrevItem = () => {
    if (itensFiltrados.length === 0) return;
    const prevIdx = (currentIndex - 1 + itensFiltrados.length) % itensFiltrados.length;
    setSelectedItemId(itensFiltrados[prevIdx].id);
  };

  const handleSalvarNovosProjetos = (novosProjetos: ItemMural[]) => {
    setProjetos(novosProjetos);
    saveMuralProjetos(novosProjetos);
    if (novosProjetos.length > 0 && !novosProjetos.some((p) => p.id === selectedItemId)) {
      setSelectedItemId(novosProjetos[0].id);
    }
  };

  const handleResetarPadrao = () => {
    resetMuralProjetos();
    setProjetos(DADOS_INICIAIS_MURAL);
    setSelectedItemId(DADOS_INICIAIS_MURAL[0].id);
  };

  const handleAbrirEdicaoDoItem = () => {
    setProjetoParaEditar(itemAtivo);
    setModoProfessorOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f8f7f3] text-slate-900 font-sans overflow-hidden">
      {/* TOP BAR CONTRACT: 1 LINHA COMPACTA COM 3 ZONAS */}
      <header className="flex items-center justify-between gap-6 px-4 py-2.5 bg-[#fdfbf7] border-b border-slate-200 flex-none z-30">
        {/* Zona 1: Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectEixo('todos');
          }}
          className="text-sm lg:text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Vozes do Clima & BioPatrimônio MT — Mostra Científica 9º Ano
        </a>

        {/* Zona 2: 4 Links Concisos de Navegação por Eixo Temático */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {EIXOS_TEMATICOS.map((eixo) => {
            const isAtivo = activeEixo === eixo.id;
            return (
              <button
                key={eixo.id}
                onClick={() => handleSelectEixo(eixo.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-0.5 ${
                  isAtivo
                    ? 'text-emerald-800 border-b-2 border-emerald-700 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {eixo.rotulo}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: 1 Ação Primária */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setProjetoParaEditar(null);
              setModoProfessorOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
          >
            Modo Professor
          </button>
        </div>
      </header>

      {/* SUB-BARRA DE ESTUDOS FILTRADOS + BOTÃO DO MODO HISTÓRIA NARRADO */}
      <div className="px-4 py-1.5 bg-[#f2efe6] border-b border-slate-200 flex items-center justify-between gap-2 flex-none z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* Filtro rápido para telas menores que xl */}
          <div className="flex xl:hidden items-center gap-1 pr-2 border-r border-slate-300">
            {EIXOS_TEMATICOS.map((eixo) => (
              <button
                key={eixo.id}
                onClick={() => handleSelectEixo(eixo.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
                  activeEixo === eixo.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white/70 text-slate-600'
                }`}
              >
                {eixo.rotulo}
              </button>
            ))}
          </div>

          {/* Exibe apenas os estudos pertencentes ao eixo selecionado */}
          {itensFiltrados.map((it, idx) => {
            const isSelected = it.id === itemAtivo?.id;
            return (
              <button
                key={it.id}
                onClick={() => handleItemSelect(it)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">{idx + 1}.</span>
                <span className="max-w-[230px] truncate">{it.titulo}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 hidden lg:inline whitespace-nowrap">
            EE João Ribeiro Vilela · Prof. Johnny Martins Fernandes
          </span>

          <button
            onClick={() => setModoHistoriaOpen(true)}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap"
          >
            <Volume2 size={13} />
            <span>Modo História (Fotos & Áudio IA)</span>
          </button>

          <button
            onClick={() => setSidebarAbertaMobile(!sidebarAbertaMobile)}
            className="md:hidden px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-xs font-semibold whitespace-nowrap"
          >
            {sidebarAbertaMobile ? 'Mapa' : 'Ficha'}
          </button>
        </div>
      </div>

      {/* ÁREA DE TRABALHO PROPORCIONAL */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* COLUNA ESQUERDA: MAPA FIEL DO BRASIL/MT (EXIBINDO APENAS OS MARCADORES FILTRADOS) + GUIA COLADO */}
        <main
          className={`flex-1 h-full flex flex-col overflow-hidden ${
            sidebarAbertaMobile ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="flex-1 relative overflow-hidden">
            <MapCanvas
              itens={itensFiltrados}
              itemSelecionadoId={itemAtivo?.id}
              onItemClick={handleItemSelect}
            />
          </div>

          <PainelJusticaClimatica
            projetos={projetos}
            onSelecionarProjetoNoMapa={handleItemSelect}
          />
        </main>

        {/* COLUNA DIREITA: FICHA DE CURADORIA ESTUDANTIL */}
        <aside
          className={`w-full md:w-[410px] lg:w-[450px] xl:w-[490px] h-full flex-none z-20 ${
            sidebarAbertaMobile ? 'block' : 'hidden md:block'
          }`}
        >
          {itemAtivo && (
            <FichaCuradoria
              item={itemAtivo}
              onEditarClick={handleAbrirEdicaoDoItem}
              onAbrirModoHistoria={() => setModoHistoriaOpen(true)}
              onProximo={goToNextItem}
              onAnterior={goToPrevItem}
              posicaoAtual={{
                atual: currentIndex + 1,
                total: itensFiltrados.length,
              }}
            />
          )}
        </aside>
      </div>

      {/* MODAL DO MODO HISTÓRIA (SESSÃO DE FOTOS COM NARRADOR EM ÁUDIO IA) */}
      <ModoHistoriaModal
        isOpen={modoHistoriaOpen}
        onClose={() => setModoHistoriaOpen(false)}
        itens={itensFiltrados}
        itemInicialId={itemAtivo?.id}
      />

      {/* MODAL DO MODO PROFESSOR */}
      <ModoProfessorModal
        isOpen={modoProfessorOpen}
        onClose={() => {
          setModoProfessorOpen(false);
          setProjetoParaEditar(null);
        }}
        projetos={projetos}
        onSaveProjetos={handleSalvarNovosProjetos}
        onResetPadrao={handleResetarPadrao}
        projetoSelecionadoParaEditar={projetoParaEditar}
      />
    </div>
  );
};

export default App;
