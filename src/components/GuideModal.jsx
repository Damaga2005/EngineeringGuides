import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  HardDrive,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';

export default function GuideModal({ guide, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 rounded-none w-screen h-screen z-50' 
            : 'w-full max-w-6xl h-[90vh]'
        }`}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-slate-100 truncate" title={guide.title}>
                {guide.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-medium">{category.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="h-3 w-3" /> {guide.sizeFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all"
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

        {/* Viewer Body */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
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
  );
}
