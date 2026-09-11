import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  HardDrive, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Rocket, 
  Bot, 
  Zap, 
  Briefcase, 
  Compass, 
  Gauge 
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
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  const CategoryIcon = ICON_MAP[category.icon] || FileText;

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;

  const difficultyColor = 
    guide.difficulty?.includes('Principiante') ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' :
    guide.difficulty?.includes('Intermedio') ? 'text-blue-400 bg-blue-950/60 border-blue-700/50' :
    'text-amber-400 bg-amber-950/60 border-amber-700/50';

  if (viewMode === 'list') {
    return (
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 flex flex-col gap-3 group">
        
        {/* Main Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
              <CategoryIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-cyan-800/40">
                  {category.name}
                </span>
                {guide.pageCount && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-cyan-400" /> {guide.pageCount} págs
                  </span>
                )}
                {guide.difficulty && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${difficultyColor}`}>
                    {guide.difficulty}
                  </span>
                )}
                {guide.isNew && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Nuevo
                  </span>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> {guide.sizeFormatted}
                </span>
              </div>

              <h3 
                className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors cursor-pointer" 
                onClick={() => onOpenModal(guide)}
                title={guide.title}
              >
                {guide.title}
              </h3>

              {guide.subtitle && (
                <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">
                  {guide.subtitle}
                </p>
              )}

              {guide.summary && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {guide.summary}
                </p>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
            {guide.keyPoints && guide.keyPoints.length > 0 && (
              <button
                onClick={() => setShowKeyPoints(!showKeyPoints)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700 transition-all"
                title="Ver puntos clave"
              >
                <span>Cosas Claves</span>
                {showKeyPoints ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs font-medium transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ver Guía</span>
            </button>

            <a
              href={pdfUrl}
              download={guide.filename}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              title="Descargar PDF"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Expandable Key Points Drawer in List View */}
        {showKeyPoints && guide.keyPoints && (
          <div className="mt-2 pt-3 border-t border-slate-800/80 bg-slate-950/40 p-3.5 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Cosas Claves & Proyectos Incluidos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {guide.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-500 font-mono text-[11px] mt-0.5">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {guide.technologies && (
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60 flex-wrap">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Tecnologías:</span>
                {guide.technologies.map(tech => (
                  <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

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
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700/60 flex items-center gap-1.5">
            <CategoryIcon className="h-3.5 w-3.5 text-cyan-400" />
            {category.name}
          </span>

          <div className="flex items-center gap-1.5">
            {guide.difficulty && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${difficultyColor}`}>
                {guide.difficulty}
              </span>
            )}
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
        </div>

        {/* Title */}
        <h3 
          className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5 cursor-pointer"
          onClick={() => onOpenModal(guide)}
          title={guide.title}
        >
          {guide.title}
        </h3>

        {/* Subtitle / Focus */}
        {guide.subtitle && (
          <p className="text-xs text-cyan-400/90 font-medium line-clamp-1 mb-2">
            {guide.subtitle}
          </p>
        )}

        {/* Summary */}
        {guide.summary && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {guide.summary}
          </p>
        )}

        {/* Metadata info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 font-mono">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-slate-400" />
            {guide.sizeFormatted}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Layers className="h-3 w-3 text-cyan-400" />
            {guide.pageCount || 15} págs
          </span>
        </div>

        {/* Key Highlights Section (Cosas Claves) */}
        {guide.keyPoints && guide.keyPoints.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-cyan-400" /> Cosas Claves
              </span>
              <button
                onClick={() => setShowKeyPoints(!showKeyPoints)}
                className="text-[10px] text-slate-400 hover:text-cyan-300 underline"
              >
                {showKeyPoints ? "Ver menos" : `Ver todas (${guide.keyPoints.length})`}
              </button>
            </div>

            <ul className="space-y-1.5">
              {(showKeyPoints ? guide.keyPoints : guide.keyPoints.slice(0, 3)).map((point, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies / Tags */}
        {guide.technologies && guide.technologies.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {guide.technologies.slice(0, 3).map(tech => (
              <button
                key={tech}
                onClick={() => onTagClick && onTagClick(tech)}
                className="text-[10px] text-slate-400 hover:text-cyan-300 bg-slate-800/70 hover:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-800 transition-colors"
              >
                #{tech}
              </button>
            ))}
            {guide.technologies.length > 3 && (
              <span className="text-[10px] text-slate-500 font-mono">
                +{guide.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onOpenModal(guide)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-200 text-xs font-semibold transition-all shadow-sm"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Abrir & Leer</span>
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
