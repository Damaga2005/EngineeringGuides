import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2,
  Minimize2,
  FileImage,
  Layers
} from 'lucide-react';

export default function ImageViewerModal({
  images = [],
  initialIndex = 0,
  title = "Plano Técnico Oficial",
  onClose
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleResetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  if (!images || images.length === 0) return null;

  const currentImgRaw = images[currentIndex];
  const currentImgUrl = currentImgRaw.startsWith('http') ? currentImgRaw : `${baseUrl}${currentImgRaw}`;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.3, 3.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.3, 0.6));
  const handleResetZoom = () => setScale(1);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/90 text-slate-200 z-10">
        
        {/* Title & Page Counter */}
        <div className="flex items-center gap-3 min-w-0">
          <FileImage className="h-5 w-5 text-cyan-400 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-100 truncate">{title}</h3>
            <p className="text-xs text-slate-400">
              Plano / Lámina {currentIndex + 1} de {images.length}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
              title="Reducir zoom (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-[11px] text-cyan-300">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-800 hover:text-white rounded"
              title="Aumentar zoom (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-800 hover:text-white rounded border-l border-slate-800"
              title="Restablecer (100%)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Download Original Image */}
          <a
            href={currentImgUrl}
            download={`plano_oficial_${currentIndex + 1}.png`}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Descargar plano en alta resolución"
          >
            <Download className="h-4 w-4" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-white border border-red-800/50 transition-colors"
            title="Cerrar visor (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative overflow-auto flex items-center justify-center p-4 select-none">
        
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-600/80 text-white border border-slate-700/80 backdrop-blur transition-all shadow-xl"
            title="Plano anterior (Flecha Izq)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* The Image */}
        <div 
          className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${scale})` }}
        >
          <img
            src={currentImgUrl}
            alt={`${title} - Plano ${currentIndex + 1}`}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-slate-800/80"
          />
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-600/80 text-white border border-slate-700/80 backdrop-blur transition-all shadow-xl"
            title="Siguiente plano (Flecha Der)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-center gap-2 overflow-x-auto">
          {images.map((img, idx) => {
            const thumbUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setScale(1);
                }}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-900 ${
                  isActive
                    ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
