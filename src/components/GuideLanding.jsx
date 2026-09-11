import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';
import ProjectBuildGuide from './ProjectBuildGuide';
import ImageViewerModal from './ImageViewerModal';

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
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all'); // 'all' | projectId
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Modal image viewer state
  const [imageViewerState, setImageViewerState] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: ''
  });

  // Scroll to top when guide changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
    setSelectedProjectFilter('all');
    setProjectSearchQuery('');
  }, [guide?.id]);

  // Keyboard navigation for subprojects and guides
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (imageViewerState.isOpen) return;

      if (e.key === 'ArrowRight' && nextGuide) {
        onSelectGuide(nextGuide.id);
      } else if (e.key === 'ArrowLeft' && prevGuide) {
        onSelectGuide(prevGuide.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guide?.id, prevGuide?.id, nextGuide?.id, imageViewerState.isOpen]);

  if (!guide) return null;

  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  const CategoryIcon = ICON_MAP[category.icon] || FileText;

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;
  const imageUrl = guide.image?.startsWith('http') ? guide.image : `${baseUrl}${guide.image}`;

  // Find previous and next guides
  const currentIndex = allGuides.findIndex(g => g.id === guide.id);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenImageViewer = (images, initialIndex = 0, title = 'Plano Técnico') => {
    const resolved = (images || []).map(img => {
      if (!img) return `${baseUrl}favicon.svg`;
      return img.startsWith('http') ? img : `${baseUrl}${img}`;
    });
    setImageViewerState({
      isOpen: true,
      images: resolved,
      initialIndex,
      title
    });
  };

  const handleCloseImageViewer = () => {
    setImageViewerState(prev => ({ ...prev, isOpen: false }));
  };

  const difficultyColor = 
    guide.difficulty?.includes('Principiante') ? 'text-emerald-400 bg-emerald-950/70 border-emerald-700/60' :
    guide.difficulty?.includes('Intermedio') ? 'text-blue-400 bg-blue-950/70 border-blue-700/60' :
    'text-amber-400 bg-amber-950/70 border-amber-700/60';

  const visibleProjects = useMemo(() => {
    let projs = guide.keyProjects || [];
    if (selectedProjectFilter !== 'all') {
      projs = projs.filter(p => String(p.id) === String(selectedProjectFilter));
    }
    if (projectSearchQuery.trim()) {
      const q = projectSearchQuery.toLowerCase().trim();
      projs = projs.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const compMatch = p.components?.some(c => c.toLowerCase().includes(q));
        const costMatch = p.cost?.toLowerCase().includes(q);
        return titleMatch || descMatch || compMatch || costMatch;
      });
    }
    return projs;
  }, [guide.keyProjects, selectedProjectFilter, projectSearchQuery]);

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
              <span>Volver a la Biblioteca</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 truncate">
              <span>Biblioteca</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-400">{category.name}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-200 truncate font-medium">{guide.title}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Copiar enlace de esta landing"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden xs:inline">{copied ? "¡Copiado!" : "Compartir"}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(guide.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <a
              href={pdfUrl}
              download={guide.filename}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-900/30"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Descargar PDF Oficial</span>
              <span className="sm:hidden">PDF</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Hero Section with Official PDF Dossier Card */}
        <div className="glass-panel rounded-3xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 md:p-10 mb-8 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            
            {/* Real PDF Cover Preview Card with Click-to-Zoom */}
            <div 
              onClick={() => handleOpenImageViewer([guide.image], 0, `Portada Oficial: ${guide.title}`)}
              className="w-48 sm:w-56 md:w-64 flex-shrink-0 cursor-pointer group/cover"
              title="Haz clic para ver la portada en alta resolución"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 group-hover/cover:border-cyan-400/80 shadow-2xl shadow-black/80 bg-slate-950 transition-all">
                <img 
                  src={imageUrl} 
                  alt={guide.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `${baseUrl}favicon.svg`;
                  }}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover/cover:scale-105" 
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-300">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Portada Oficial
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Maximize2 className="h-3 w-3" /> {guide.pageCount || 16} págs
                  </span>
                </div>
              </div>
            </div>

            {/* Title, Badges & Overview */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              
              <div>
                {/* Badges Bar */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap mb-3.5">
                  <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5 shadow-sm">
                    <CategoryIcon className="h-3.5 w-3.5 text-cyan-400" />
                    {category.name}
                  </span>

                  {guide.difficulty && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-xl border ${difficultyColor} shadow-sm`}>
                      {guide.difficulty}
                    </span>
                  )}

                  {guide.estimatedBudget && (
                    <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 shadow-sm">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      {guide.estimatedBudget}
                    </span>
                  )}

                  {guide.buildTimeTotal && (
                    <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1 shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {guide.buildTimeTotal}
                    </span>
                  )}

                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1 shadow-sm">
                    <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                    {guide.sizeFormatted}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {guide.title}
                </h1>

                {/* Subtitle */}
                {guide.subtitle && (
                  <p className="text-sm sm:text-base text-cyan-300/90 font-medium mt-2 leading-relaxed">
                    {guide.subtitle}
                  </p>
                )}

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-4xl">
                  {guide.summary}
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex items-center gap-3 pt-6 flex-wrap">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === 'overview'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Explorar Proyectos y Manuales</span>
                </button>

                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === 'pdf'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Leer PDF Oficial Integrado</span>
                </button>

                <a
                  href={pdfUrl}
                  download={guide.filename}
                  className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-2 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Archivo</span>
                </a>
              </div>

            </div>

          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-slate-800/80 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Proyectos, Manuales de Construcción & Planos Oficiales</span>
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
              <span>Visor PDF Integrado</span>
            </button>
          </div>

        </div>

        {/* Tab 1: Project Overview & Extracted Data */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Subproject Selector Bar & Live Search */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Project Pills */}
              {guide.keyProjects && guide.keyProjects.length > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mr-1">
                    <Boxes className="h-4 w-4 text-cyan-400" />
                    <span className="font-semibold hidden sm:inline">Proyectos:</span>
                  </div>

                  <button
                    onClick={() => setSelectedProjectFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedProjectFilter === 'all'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Todos ({guide.keyProjects.length})
                  </button>

                  {guide.keyProjects.map((proj, pIdx) => {
                    const isSelected = String(selectedProjectFilter) === String(proj.id);
                    return (
                      <button
                        key={proj.id || pIdx}
                        onClick={() => setSelectedProjectFilter(proj.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                        title={proj.title}
                      >
                        <span className="font-mono text-[10px] opacity-75">#{pIdx + 1}</span>
                        <span className="truncate max-w-[120px] sm:max-w-[170px]">{proj.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Subprojects Live Search Input */}
              <div className="relative min-w-[220px]">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="Filtrar proyectos (ej. SDR, GPS...)"
                  className="w-full pl-8 pr-8 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {projectSearchQuery && (
                  <button
                    onClick={() => setProjectSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* List of Projects rendered via ProjectBuildGuide */}
            {visibleProjects.length === 0 ? (
              <div className="py-12 text-center glass-panel p-6 rounded-2xl border border-slate-800 max-w-md mx-auto">
                <Boxes className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-semibold">No hay proyectos coincidentes</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">No se encontró ningún subproyecto con "{projectSearchQuery}"</p>
                <button
                  onClick={() => {
                    setProjectSearchQuery('');
                    setSelectedProjectFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-600/30 transition-all"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleProjects.map((proj, idx) => (
                  <ProjectBuildGuide
                    key={proj.id || idx}
                    project={proj}
                    projectNumber={proj.id || idx + 1}
                    onOpenImageViewer={handleOpenImageViewer}
                  />
                ))}
              </div>
            )}

            {/* Overall Bill of Materials (BOM) Table for the whole Guide */}
            {guide.bom && guide.bom.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Lista Resumen de Componentes (Bill of Materials Global)
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                  Resumen de los principales módulos, integrados y subsistemas requeridos en esta guía
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="bg-slate-950 text-cyan-400 font-mono text-xs uppercase">
                      <tr>
                        <th className="py-3 px-4">Componente</th>
                        <th className="py-3 px-4">Tipo / Categoría</th>
                        <th className="py-3 px-4">Especificación Técnica</th>
                        <th className="py-3 px-4 text-right">Coste Estimado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {guide.bom.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-100">{item.name}</td>
                          <td className="py-3 px-4 text-cyan-300 font-mono text-xs">{item.type || 'Hardware'}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-xs">{item.specs}</td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-mono font-semibold">{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Embedded PDF Viewer */}
        {activeTab === 'pdf' && (
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                  Visor Oficial: {guide.filename}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Abrir en Pestaña Nueva</span>
                </a>

                <a
                  href={pdfUrl}
                  download={guide.filename}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-all shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="w-full h-[80vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1`}
                title={guide.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}

        {/* Next / Previous Navigation Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevGuide ? (
            <button
              onClick={() => onSelectGuide(prevGuide.id)}
              className="w-full sm:w-auto flex items-center gap-3 p-3.5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">Guía Anterior</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate max-w-xs block">
                  {prevGuide.title}
                </span>
              </div>
            </button>
          ) : <div />}

          {nextGuide && (
            <button
              onClick={() => onSelectGuide(nextGuide.id)}
              className="w-full sm:w-auto flex items-center justify-end gap-3 p-3.5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/50 transition-all text-right group"
            >
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">Siguiente Guía</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate max-w-xs block">
                  {nextGuide.title}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </div>

      {/* Lightbox / High-Resolution Image Viewer Modal */}
      {imageViewerState.isOpen && (
        <ImageViewerModal
          images={imageViewerState.images}
          initialIndex={imageViewerState.initialIndex}
          title={imageViewerState.title}
          onClose={handleCloseImageViewer}
        />
      )}

    </div>
  );
}
