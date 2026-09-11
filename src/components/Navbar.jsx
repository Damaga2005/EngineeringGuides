import React from 'react';
import { 
  Cpu, 
  RefreshCw, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
  Layers
} from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({
  totalGuides,
  totalSize,
  isSyncing,
  onSync,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  onOpenStats
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  Engineering<span className="text-cyan-400">Guides</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Portal de Proyectos & Guías de Ingeniería de Alto Nivel
              </p>
            </div>
          </div>

          {/* Quick mobile counters */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {totalGuides} guías
            </span>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          
          {/* Favorites Filter */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              showOnlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Ver solo guías marcadas como favoritas"
          >
            <Bookmark className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px]">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            title="Ver estadísticas del catálogo"
          >
            <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Métricas</span>
          </button>

          {/* Live Sync with GitHub */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/60 hover:text-cyan-200 hover:border-cyan-700 transition-all disabled:opacity-50"
            title="Consultar la API de GitHub para detectar guías recién añadidas"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Live Sync'}</span>
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/Damaga2005/EngineeringGuides"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            title="Abrir repositorio en GitHub"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
          </a>
        </div>

      </div>
    </header>
  );
}
