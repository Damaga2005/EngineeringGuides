import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  HardDrive,
  FileText,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Cpu
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';

export default function GuideModal({ guide, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  if (!guide) return null;

  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[0];
  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;

  const difficultyColor = 
    guide.difficulty?.includes('Principiante') ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' :
    guide.difficulty?.includes('Intermedio') ? 'text-blue-400 bg-blue-950/60 border-blue-700/50' :
    'text-amber-400 bg-amber-950/60 border-amber-700/50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 rounded-none w-screen h-screen z-50' 
            : 'w-full max-w-7xl h-[92vh]'
        }`}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
          
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-slate-100 truncate" title={guide.title}>
                {guide.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                <span className="text-cyan-400 font-medium">{category.name}</span>
                <span>•</span>
                {guide.pageCount && (
                  <>
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Layers className="h-3 w-3 text-cyan-400" /> {guide.pageCount} págs
                    </span>
                    <span>•</span>
                  </>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="h-3 w-3" /> {guide.sizeFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Toggle Details Panel */}
            <button
              onClick={() => setShowDetailsPanel(!showDetailsPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showDetailsPanel 
                  ? 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60' 
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={showDetailsPanel ? "Ocultar panel de cosas claves" : "Mostrar panel de cosas claves"}
            >
              {showDetailsPanel ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Cosas Claves</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? "Restaurar tamaño" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Open in new tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Abrir en pestaña nueva"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Download */}
            <a
              href={pdfUrl}
              download={guide.filename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition-all"
              title="Descargar archivo PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Descargar</span>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors ml-1"
              title="Cerrar visor (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Viewer & Details Workspace */}
        <div className="flex-1 flex flex-col md:flex-row bg-slate-950 relative overflow-hidden min-h-0">
          
          {/* Side Details Panel (Cosas Claves) */}
          {showDetailsPanel && (
            <aside className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-b md:border-b-0 md:border-r border-slate-800 p-5 overflow-y-auto max-h-[35vh] md:max-h-full flex-shrink-0 space-y-5">
              
              {/* Header inside panel */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Cosas Claves de la Guía
                  </span>
                  {guide.difficulty && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${difficultyColor}`}>
                      {guide.difficulty}
                    </span>
                  )}
                </div>

                {guide.subtitle && (
                  <p className="text-sm font-semibold text-slate-200 mb-2 leading-snug">
                    {guide.subtitle}
                  </p>
                )}

                {guide.summary && (
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {guide.summary}
                  </p>
                )}
              </div>

              {/* Key Highlights List */}
              {guide.keyPoints && guide.keyPoints.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Proyectos & Temas Cubiertos
                  </h3>
                  <div className="space-y-2.5">
                    {guide.keyPoints.map((point, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/90 text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="h-5 w-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span className="leading-snug flex-1">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies & Components */}
              {guide.technologies && guide.technologies.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Hardware & Tecnologías
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Quick Specs */}
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Extensión:</span>
                  <span className="text-slate-200">{guide.pageCount || 15} páginas</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamaño de descarga:</span>
                  <span className="text-slate-200">{guide.sizeFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato:</span>
                  <span className="text-slate-200">PDF Original</span>
                </div>
              </div>

            </aside>
          )}

          {/* PDF Viewer Body */}
          <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col min-h-0">
            {hasError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-12 w-12 text-amber-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-200 mb-1">
                  No se pudo renderizar la vista previa directa
                </h3>
                <p className="text-sm text-slate-400 max-w-md mb-4">
                  El navegador bloqueó la visualización incrustada o el archivo requiere ser descargado para leerse con tu lector habitual.
                </p>
                <div className="flex gap-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Abrir directamente en navegador
                  </a>
                  <a
                    href={pdfUrl}
                    download={guide.filename}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all"
                  >
                    Descargar PDF
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                title={guide.title}
                className="w-full h-full border-none bg-slate-900"
                onError={() => setHasError(true)}
              />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
