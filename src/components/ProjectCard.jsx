import React from 'react';
import {
  Clock,
  ExternalLink,
  FileText,
  Boxes,
  Bookmark
} from 'lucide-react';

export default function ProjectCard({
  project,
  onSelectProject,
  onSelectGuide,
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite,
  hasExpandedGuide = false
}) {
  const {
    title,
    slug,
    guideId,
    guideTitle,
    timeEstimate,
    technicalIdentity,
    description,
    bom
  } = project;

  const controller = technicalIdentity?.controller || technicalIdentity?.controllerFamily;
  const functionClass = technicalIdentity?.function || 'Ingeniería Aplicada';
  const whatDoesItDo = description?.whatDoesItDo || description?.summary || '';
  const bomCount = Array.isArray(bom) ? bom.length : 0;

  // Badge label: prefer the actual controller/chip. When none was detected,
  // fall back to the most identifying technical signal available instead of
  // a generic "Proyecto #N" that repeats identically across many unrelated
  // cards (every guide's first project is #1).
  const badgeLabel =
    controller ||
    technicalIdentity?.sensors?.[0] ||
    technicalIdentity?.actuators?.[0] ||
    technicalIdentity?.communications?.[0] ||
    functionClass;

  const FavoriteButton = ({ size = 'h-4 w-4', pad = 'p-2' }) => onToggleFavorite && (
    <button
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.projectId); }}
      className={`${pad} rounded-full transition-colors ${
        isFavorite
          ? 'text-amber-400'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.06]'
      }`}
      title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <Bookmark className={`${size} ${isFavorite ? 'fill-amber-400' : ''}`} />
    </button>
  );

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onSelectProject(slug || project)}
        className="bg-slate-900 p-5 rounded-2xl transition-colors hover:bg-slate-900/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
            <span className="font-medium text-cyan-400">{badgeLabel}</span>
            <span className="text-slate-600">·</span>
            <span>{functionClass}</span>
            {hasExpandedGuide && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300/90">Guía ampliada</span>
              </>
            )}
          </div>

          <h3 className="text-[17px] font-medium text-white truncate">
            {title}
          </h3>

          <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed">
            {whatDoesItDo}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500 pt-0.5">
            {timeEstimate && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeEstimate}
              </span>
            )}
            {bomCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Boxes className="h-3.5 w-3.5" />
                {bomCount} componentes
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onSelectGuide(guideId); }}
              className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors ml-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]">{guideTitle}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="self-end md:self-center flex-shrink-0">
          <FavoriteButton />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={() => onSelectProject(slug || project)}
      className="bg-slate-900 rounded-2xl transition-colors hover:bg-slate-900/70 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div className="p-5 space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-cyan-400 truncate max-w-[160px]">
            {badgeLabel}
          </span>
          <FavoriteButton size="h-3.5 w-3.5" pad="p-1.5" />
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-medium text-white line-clamp-2 leading-snug">
          {title}
        </h3>

        {hasExpandedGuide && (
          <span className="inline-block text-[11px] font-medium text-amber-300/90 w-fit">
            ✨ Guía ampliada disponible
          </span>
        )}

        {/* What does it do */}
        <p className="text-[13px] text-slate-400 line-clamp-3 leading-relaxed">
          {whatDoesItDo}
        </p>

        {/* Tech Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {technicalIdentity?.sensors?.slice(0, 2).map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] text-slate-300 truncate max-w-[120px]">
              {s}
            </span>
          ))}
          {technicalIdentity?.actuators?.slice(0, 1).map((a, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] text-slate-300 truncate max-w-[120px]">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-3 text-[12px] text-slate-500">
        {timeEstimate && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeEstimate}
          </span>
        )}
        {bomCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <Boxes className="h-3.5 w-3.5" />
            {bomCount} BOM
          </span>
        )}
      </div>
    </div>
  );
}
