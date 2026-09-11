import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  HardDrive, 
  Tag, 
  Rocket, 
  Bot, 
  Cpu, 
  Zap, 
  Briefcase, 
  Compass, 
  Sparkles 
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

export default function GuideCard({
  guide,
  viewMode,
  isFavorite,
  onToggleFavorite,
  onOpenModal,
  onTagClick
}) {
  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  const CategoryIcon = ICON_MAP[category.icon] || FileText;

  // Compute PDF URL (works both locally and on GitHub Pages with base path)
  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;

  if (viewMode === 'list') {
    return (
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
        
        {/* Left: Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
            <CategoryIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-cyan-800/40">
                {category.name}
              </span>
              {guide.isNew && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Nuevo
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <HardDrive className="h-3 w-3" /> {guide.sizeFormatted}
              </span>
            </div>

            <h3 className="font-semibold text-slate-100 text-sm md:text-base truncate group-hover:text-cyan-300 transition-colors" title={guide.title}>
              {guide.title}
            </h3>

            {guide.tags && guide.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {guide.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/80 px-2 py-0.5 rounded transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
          <button
            onClick={() => onToggleFavorite(guide.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onOpenModal(guide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 hover:text-cyan-200 text-xs font-medium transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Ver Guía</span>
          </button>

          <a
            href={pdfUrl}
            download={guide.filename}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white text-xs font-medium transition-all"
            title="Descargar PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Descargar</span>
          </a>
        </div>

      </div>
    );
  }

  // Grid View Card
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 flex flex-col justify-between p-5 group relative overflow-hidden">
      
      {/* Background glow hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />

      {/* Top row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700/60 flex items-center gap-1.5">
            <CategoryIcon className="h-3.5 w-3.5 text-cyan-400" />
            {category.name}
          </span>

          <button
            onClick={() => onToggleFavorite(guide.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3 cursor-pointer"
          onClick={() => onOpenModal(guide)}
          title={guide.title}
        >
          {guide.title}
        </h3>

        {/* Metadata info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 font-mono">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-slate-400" />
            {guide.sizeFormatted}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">PDF Document</span>
        </div>

        {/* Tags */}
        {guide.tags && guide.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-5">
            {guide.tags.slice(0, 3).map(tag => (
              <button
                key={tag}
                onClick={() => onTagClick && onTagClick(tag)}
                className="text-[10px] text-slate-400 hover:text-cyan-300 bg-slate-800/70 hover:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-800 transition-colors"
              >
                #{tag}
              </button>
            ))}
            {guide.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 font-mono">
                +{guide.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onOpenModal(guide)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-200 text-xs font-semibold transition-all shadow-sm"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Abrir Visor</span>
        </button>

        <a
          href={pdfUrl}
          download={guide.filename}
          className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-all"
          title="Descargar PDF"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>

    </div>
  );
}
