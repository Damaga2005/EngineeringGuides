import React from 'react';
import {
  Bookmark,
  BarChart2,
  ExternalLink
} from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({
  totalGuides,
  isSyncing,
  onSync,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  onOpenStats
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

        {/* Wordmark */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-[15px] tracking-tight text-white truncate">
            Engineering Guides
          </span>
          <span className="hidden sm:inline text-[13px] text-slate-400 truncate">
            · {totalGuides} guías técnicas
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              showOnlyFavorites
                ? 'bg-amber-400/15 text-amber-300'
                : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
            title="Ver solo tus proyectos y guías marcados como favoritos"
          >
            <Bookmark className={`h-[15px] w-[15px] ${showOnlyFavorites ? 'fill-amber-300 text-amber-300' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="text-[11px] tabular-nums text-amber-300/90">{favoritesCount}</span>
            )}
          </button>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-slate-300 hover:bg-white/[0.06] transition-colors"
            title="Ver estadísticas del catálogo"
          >
            <BarChart2 className="h-[15px] w-[15px]" />
            <span className="hidden sm:inline">Métricas</span>
          </button>

          <a
            href="https://github.com/Damaga2005/EngineeringGuides"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-slate-300 hover:bg-white/[0.06] transition-colors"
            title="Abrir repositorio en GitHub"
          >
            <GithubIcon className="h-[15px] w-[15px]" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </a>
        </div>

      </div>
    </header>
  );
}
