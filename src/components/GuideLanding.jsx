import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Layers, 
  HardDrive, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Maximize2, 
  FileText, 
  Cpu, 
  Boxes, 
  Check, 
  Sparkles,
  Rocket,
  Bot,
  Zap,
  Briefcase,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';

const ICON_MAP = {
  Rocket,
  Bot,
  Cpu,
  Zap,
  Briefcase,
  Compass
};

export default function GuideLanding({
  guide,
  allGuides,
  onBack,
  onSelectGuide,
  isFavorite,
  onToggleFavorite
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pdf'
  const [expandedProjects, setExpandedProjects] = useState({ 0: true }); // first project expanded
  const [copied, setCopied] = useState(false);

  // Scroll to top when guide changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
    setExpandedProjects({ 0: true });
  }, [guide?.id]);

  if (!guide) return null;

  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  const CategoryIcon = ICON_MAP[category.icon] || FileText;

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;

  // Find previous and next guides
  const currentIndex = allGuides.findIndex(g => g.id === guide.id);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  const toggleProject = (index) => {
    setExpandedProjects(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const difficultyColor = 
    guide.difficulty?.includes('Principiante') ? 'text-emerald-400 bg-emerald-950/70 border-emerald-700/60' :
    guide.difficulty?.includes('Intermedio') ? 'text-blue-400 bg-blue-950/70 border-blue-700/60' :
    'text-amber-400 bg-amber-950/70 border-amber-700/60';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 pb-16">
      
      {/* Top Breadcrumb Bar */}
      <div className="glass-panel border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex-shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 truncate">
              <span>Biblioteca</span>
              <span>/</span>
              <span className="text-cyan-400">{category.name}</span>
              <span>/</span>
              <span className="text-slate-200 truncate">{guide.title}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
              title="Copiar enlace directo al proyecto"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "¡Copiado!" : "Compartir"}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(guide.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <a
              href={pdfUrl}
              download={guide.filename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all"
              title="Descargar archivo PDF oficial"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Hero Section with Contextual Image */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 mb-8 group">
          
          {/* Background Image with Gradient Overlay */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/90 via-[#0B0F19]/40 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end">
            
            {/* Badges Bar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900/90 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5 shadow-md">
                <CategoryIcon className="h-3.5 w-3.5 text-cyan-400" />
                {category.name}
              </span>

              {guide.difficulty && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-xl border ${difficultyColor} shadow-md`}>
                  {guide.difficulty}
                </span>
              )}

              {guide.estimatedBudget && (
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900/90 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  Presupuesto: {guide.estimatedBudget}
                </span>
              )}

              {guide.buildTimeTotal && (
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-800 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {guide.buildTimeTotal}
                </span>
              )}

              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-800 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                {guide.pageCount || 16} páginas
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
              {guide.title}
            </h1>

            {guide.subtitle && (
              <p className="mt-2 text-sm sm:text-lg text-cyan-300/90 font-medium max-w-3xl drop-shadow">
                {guide.subtitle}
              </p>
            )}

            {/* Mode Switcher Tabs */}
            <div className="mt-6 flex items-center gap-2 border-b border-slate-800/80 pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 border-x border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Ficha del Proyecto & Datos Extraídos</span>
              </button>

              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 border-x border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Leer PDF Oficial Original</span>
              </button>
            </div>

          </div>

        </div>

        {/* Tab 1: Project Overview & Extracted Data */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Subprojects & BOM */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Executive Summary Section */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  Visión General & Por Qué Importa Este Proyecto
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {guide.summary}
                </p>

                {guide.technologies && guide.technologies.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Etiquetas:</span>
                    {guide.technologies.map(tag => (
                      <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Subprojects Interactive Accordion */}
              {guide.keyProjects && guide.keyProjects.length > 0 && (
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Boxes className="h-5 w-5 text-amber-400" />
                        Proyectos Incluidos en Esta Guía ({guide.keyProjects.length})
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Haz clic en cada proyecto para desplegar sus detalles, coste y componentes requeridos
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const allOpen = Object.keys(expandedProjects).length === guide.keyProjects.length;
                        if (allOpen) {
                          setExpandedProjects({});
                        } else {
                          const openAll = {};
                          guide.keyProjects.forEach((_, idx) => { openAll[idx] = true; });
                          setExpandedProjects(openAll);
                        }
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline flex-shrink-0"
                    >
                      {Object.keys(expandedProjects).length === guide.keyProjects.length ? "Colapsar todos" : "Desplegar todos"}
                    </button>
                  </div>

                  {/* Accordion list */}
                  <div className="space-y-3">
                    {guide.keyProjects.map((proj, idx) => {
                      const isOpen = !!expandedProjects[idx];
                      return (
                        <div 
                          key={proj.id || idx}
                          className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-all duration-200 hover:border-slate-700"
                        >
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleProject(idx)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-900/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                                  {proj.title}
                                </h3>
                                <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                                  {proj.cost && (
                                    <span className="text-emerald-400 font-mono font-medium">
                                      Coste: {proj.cost}
                                    </span>
                                  )}
                                  {proj.time && (
                                    <>
                                      <span>•</span>
                                      <span className="font-mono">{proj.time}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </div>
                          </button>

                          {/* Accordion Body */}
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-900/40 text-xs sm:text-sm text-slate-300 space-y-3 animate-in fade-in duration-200">
                              <p className="leading-relaxed text-slate-300">
                                {proj.description}
                              </p>

                              {proj.components && proj.components.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1.5">
                                    Hardware & Componentes del Módulo:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {proj.components.map((comp, cIdx) => (
                                      <span 
                                        key={cIdx} 
                                        className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-mono"
                                      >
                                        {comp}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Ordered Bill of Materials (BOM) */}
              {guide.bom && guide.bom.length > 0 && (
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Lista Ordenada de Componentes (Bill of Materials)
                  </h2>
                  <p className="text-xs text-slate-400 mb-5">
                    Componentes necesarios para llevar a cabo los proyectos de esta guía
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase">
                          <th className="py-3 px-4">Componente</th>
                          <th className="py-3 px-4">Tipo / Rol</th>
                          <th className="py-3 px-4">Especificaciones</th>
                          <th className="py-3 px-4 text-right">Coste Estimado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {guide.bom.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-200 font-sans">
                              {item.name}
                            </td>
                            <td className="py-3 px-4 text-cyan-400">
                              {item.type}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-xs font-sans">
                              {item.specs}
                            </td>
                            <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                              {item.cost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Quick Info & Actions Card */}
            <div className="space-y-6">
              
              {/* Document Specs Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" /> Ficha Técnica Oficial
                </h3>

                <div className="space-y-3 text-xs font-mono divide-y divide-slate-800/80">
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Disciplina:</span>
                    <span className="text-cyan-300 font-semibold">{category.name}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Dificultad:</span>
                    <span className="text-slate-200">{guide.difficulty}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Páginas Totales:</span>
                    <span className="text-slate-200">{guide.pageCount || 16} páginas</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Tamaño Archivo:</span>
                    <span className="text-slate-200">{guide.sizeFormatted}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Presupuesto:</span>
                    <span className="text-emerald-400 font-bold">{guide.estimatedBudget}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Tiempo de Construcción:</span>
                    <span className="text-slate-200">{guide.buildTimeTotal}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Archivo Original:</span>
                    <span className="text-slate-400 truncate max-w-[150px]" title={guide.filename}>
                      {guide.filename}
                    </span>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    onClick={() => setActiveTab('pdf')}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Abrir Visor PDF Oficial</span>
                  </button>

                  <a
                    href={pdfUrl}
                    download={guide.filename}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar Documento PDF</span>
                  </a>
                </div>

              </div>

              {/* Author & Verification Card */}
              <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-900/50 text-xs space-y-2 text-slate-300">
                <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                  🛡️ Documentación Técnica Verificada
                </span>
                <p className="leading-relaxed">
                  Esta guía incluye esquemáticos de conexión, fragmentos de código de bajo nivel y recomendaciones de componentes probados en banco de trabajo.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Embedded PDF Official Viewer */}
        {activeTab === 'pdf' && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl h-[85vh] flex flex-col">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Documento Oficial: {guide.filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Abrir en nueva pestaña</span>
                </a>

                <a
                  href={pdfUrl}
                  download={guide.filename}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white flex items-center gap-1.5 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            <div className="flex-1 bg-slate-950">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                title={guide.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}

        {/* Bottom Pagination: Previous / Next Guides */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevGuide ? (
            <button
              onClick={() => onSelectGuide(prevGuide.id)}
              className="flex items-center gap-3 p-4 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 text-left transition-all max-w-sm w-full group"
            >
              <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Guía Anterior</span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 truncate block group-hover:text-cyan-300">
                  {prevGuide.title}
                </span>
              </div>
            </button>
          ) : <div />}

          {nextGuide && (
            <button
              onClick={() => onSelectGuide(nextGuide.id)}
              className="flex items-center justify-end gap-3 p-4 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 text-right transition-all max-w-sm w-full group ml-auto"
            >
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Siguiente Guía</span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 truncate block group-hover:text-cyan-300">
                  {nextGuide.title}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
