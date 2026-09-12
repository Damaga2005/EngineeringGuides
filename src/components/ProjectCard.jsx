import React from 'react';
import {
  Clock,
  ExternalLink,
  ArrowRight,
  FileText,
  Boxes,
  Code2,
  Bookmark,
  FlaskConical,
  GitCompare,
  Check,
  Sparkles
} from 'lucide-react';

export default function ProjectCard({
  project,
  onSelectProject,
  onSelectGuide,
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite,
  hasExpandedGuide = false,
  onOpenInLab,
  onToggleCompare,
  isCompared = false
}) {
  const {
    title,
    slug,
    projectNumber,
    guideId,
    guideTitle,
    difficulty,
    timeEstimate,
    technicalIdentity,
    description,
    bom,
    firmwareLanguage
  } = project;

  const controller = technicalIdentity?.controller || technicalIdentity?.controllerFamily;
  const functionClass = technicalIdentity?.function || 'Ingenier?a Aplicada';
  const whatDoesItDo = description?.whatDoesItDo || description?.summary || '';
  const bomCount = Array.isArray(bom) ? bom.length : 0;

  // Badge label: prefer controller, then sensor, actuator, comms, or fallback
  const badgeLabel =
    controller ||
    technicalIdentity?.sensors?.[0] ||
    technicalIdentity?.actuators?.[0] ||
    technicalIdentity?.communications?.[0] ||
    functionClass ||
    `Proyecto #${projectNumber}`;

  if (viewMode === 'list') {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">
              {badgeLabel}
            </span>
            {hasExpandedGuide && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Gu?a Ampliada
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300">
              {functionClass}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {guideId}
            </span>
          </div>

          <h3 
            onClick={() => onSelectProject(slug || project)}
            className="text-lg font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors truncate"
          >
            {title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {whatDoesItDo}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            {timeEstimate && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {timeEstimate}
              </span>
            )}
            {bomCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Boxes className="h-3.5 w-3.5 text-slate-500" />
                {bomCount} componentes
              </span>
            )}
            {firmwareLanguage && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <Code2 className="h-3.5 w-3.5 text-slate-500" />
                {firmwareLanguage}
              </span>
            )}
            <button
              onClick={() => onSelectGuide(guideId)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors ml-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]">{guideTitle}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(project)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                isCompared
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title={isCompared ? 'Quitar de comparador' : 'A?adir a comparador'}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <GitCompare className="w-3.5 h-3.5" />}
            </button>
          )}

          {onOpenInLab && (
            <button
              onClick={() => onOpenInLab(project)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-cyan-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
              title="Probar proyecto en el Laboratorio Virtual"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Lab</span>
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.projectId); }}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          <button
            onClick={() => onSelectProject(slug || project)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
          >
            <span>Ver Proyecto</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={() => onSelectProject(slug || project)}
      className="glass-panel rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div className="p-5 space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 truncate max-w-[160px]">
            {badgeLabel}
          </span>
          <div className="flex items-center gap-1.5">
            {hasExpandedGuide && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 inline-flex items-center gap-1" title="Gu?a ampliada con pasos de construcci?n detallados disponible">
                <Sparkles className="h-3 w-3" />
                Ampliada
              </span>
            )}

            {onToggleCompare && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleCompare(project); }}
                className={`p-1 rounded-md text-[10px] border transition-all ${
                  isCompared 
                    ? 'bg-cyan-950 border-cyan-700 text-cyan-300' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={isCompared ? 'En el comparador (click para quitar)' : 'A?adir al comparador'}
              >
                <GitCompare className="w-3 h-3" />
              </button>
            )}

            <span className="text-[11px] font-mono text-slate-500">
              {difficulty || 'Intermedio'}
            </span>

            {onToggleFavorite && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.projectId); }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* What does it do */}
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {whatDoesItDo}
        </p>

        {/* Tech Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {technicalIdentity?.sensors?.slice(0, 2).map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/50 truncate max-w-[120px]">
              {s}
            </span>
          ))}
          {technicalIdentity?.actuators?.slice(0, 1).map((a, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-amber-300/80 border border-slate-700/50 truncate max-w-[120px]">
              {a}
            </span>
          ))}
          {functionClass && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 truncate max-w-[150px]">
              {functionClass}
            </span>
          )}
        </div>
      </div>

      {/* Footer info & action */}
      <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {timeEstimate && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3 text-slate-500" />
              {timeEstimate}
            </span>
          )}
          {bomCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Boxes className="h-3 w-3 text-slate-500" />
              {bomCount} BOM
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenInLab && (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenInLab(project); }}
              className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:bg-cyan-950/50 hover:border-cyan-800 text-cyan-400 text-xs transition-all shadow-sm"
              title="Abrir en el Laboratorio Virtual"
            >
              <FlaskConical className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="px-3 py-1.5 rounded-lg bg-cyan-600/90 group-hover:bg-cyan-500 text-white text-[11px] font-semibold inline-flex items-center gap-1 transition-all">
            <span>Ficha T?cnica</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
