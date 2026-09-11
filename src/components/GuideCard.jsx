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
  ArrowRight,
  Boxes
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
  onOpenLanding,
  onTagClick
}) {
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const category = CATEGORY_DEFINITIONS.find(c => c.id === guide.categoryId) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  const CategoryIcon = ICON_MAP[category.icon] || FileText;

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const pdfUrl = `${baseUrl}Engineering guides/${encodeURIComponent(guide.filename)}`;
  const imageUrl = guide.image?.startsWith('http') ? guide.image : `${baseUrl}${guide.image}`;

  const difficultyColor = 
    guide.difficulty?.includes('Principiante') ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' :
    guide.difficulty?.includes('Intermedio') ? 'text-blue-400 bg-blue-950/60 border-blue-700/50' :
    'text-amber-400 bg-amber-950/60 border-amber-700/50';

  const handleOpenLanding = () => {
    if (typeof onOpenLanding === 'function') {
      onOpenLanding(guide);
    } else {
      window.location.hash = `#/guide/${guide.id}`;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 flex flex-col gap-3 group">
        
        {/* Main Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            
            {/* Thumbnail Preview */}
            <div 
              onClick={handleOpenLanding}
              className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-700/80 cursor-pointer group-hover:border-cyan-500/60 transition-all bg-slate-950"
            >
              <img 
                src={imageUrl} 
                alt={guide.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `${baseUrl}favicon.svg`;
                }}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1 right-1 p-1 bg-slate-900/90 rounded text-cyan-400 border border-slate-700">
                <CategoryIcon className="h-3 w-3" />
              </div>
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
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> {guide.sizeFormatted}
                </span>
              </div>

              <h3 
                className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors cursor-pointer" 
                onClick={handleOpenLanding}
                title={guide.title}
              >
                {guide.title}
              </h3>

              {guide.subtitle && (
                <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">
                  {guide.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
            <button
              onClick={handleOpenLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs font-semibold transition-all"
            >
              <span>Ver Landing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onOpenModal(guide)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-all"
              title="Abrir visor PDF directo"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onToggleFavorite(guide.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
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
        {guide.keyProjects && guide.keyProjects.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5 text-amber-400" />
              Incluye <strong>{guide.keyProjects.length} proyectos</strong> prácticos
            </span>

            <button
              onClick={() => setShowKeyPoints(!showKeyPoints)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              {showKeyPoints ? "Ocultar info" : "Ver info rápida"}
              {showKeyPoints ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        )}

        {showKeyPoints && guide.keyProjects && (
          <div className="pt-2 bg-slate-950/40 p-3.5 rounded-xl space-y-2 border border-slate-800/80">
            {guide.keyProjects.map((p, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-cyan-400 font-mono font-bold mt-0.5">{idx + 1}.</span>
                <div>
                  <strong className="text-slate-200">{p.title}</strong>
                  {p.cost && <span className="text-emerald-400 ml-1.5 font-mono">({p.cost})</span>}
                  <p className="text-slate-400 mt-0.5">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  // Grid View Card
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Image Preview Header */}
      <div 
        onClick={handleOpenLanding}
        className="relative h-48 w-full overflow-hidden cursor-pointer border-b border-slate-800 bg-slate-950"
      >
        <img 
          src={imageUrl} 
          alt={guide.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `${baseUrl}favicon.svg`;
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/20 pointer-events-none" />
        
        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5 shadow-md">
            <CategoryIcon className="h-3.5 w-3.5 text-cyan-400" />
            {category.name}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(guide.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
              : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700'
          }`}
          title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Bottom stats inside image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
            {guide.pageCount || 16} páginas
          </span>
          {guide.difficulty && (
            <span className={`px-2 py-0.5 rounded border ${difficultyColor}`}>
              {guide.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5 cursor-pointer"
            onClick={handleOpenLanding}
            title={guide.title}
          >
            {guide.title}
          </h3>

          {/* Subtitle */}
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

          {/* Subprojects Mini Dropdown Info */}
          {guide.keyProjects && guide.keyProjects.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Boxes className="h-3 w-3 text-amber-400" /> {guide.keyProjects.length} Proyectos
                </span>
                <button
                  onClick={() => setShowKeyPoints(!showKeyPoints)}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 underline"
                >
                  {showKeyPoints ? "Ocultar" : "Ver lista"}
                </button>
              </div>

              <ul className="space-y-1.5">
                {(showKeyPoints ? guide.keyProjects : guide.keyProjects.slice(0, 3)).map((p, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                    <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                    <span className="line-clamp-1">
                      <strong>{p.title}</strong>
                      {p.cost && <span className="text-emerald-400 ml-1 font-mono">{p.cost}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={handleOpenLanding}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
          >
            <span>Ver Landing</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onOpenModal(guide)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Leer PDF oficial"
          >
            <Eye className="h-4 w-4" />
          </button>

          <a
            href={pdfUrl}
            download={guide.filename}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Descargar PDF"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>

      </div>

    </div>
  );
}
