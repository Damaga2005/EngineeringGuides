import React from 'react';
import { 
  Cpu, 
  RefreshCw, 
  Bookmark, 
  BarChart2, 
  ExternalLink,
  Layers,
  FlaskConical,
  GitCompare,
  ShoppingCart,
  Search,
  BookOpen
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
  onOpenStats,
  mainView = 'projects',
  setMainView,
  onOpenLab,
  onOpenComparator,
  compareCount = 0,
  onOpenBOMCart,
  cartCount = 0,
  onOpenCommandPalette
}) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Navigation Tabs */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => {
              if (setMainView) setMainView('projects');
              window.location.hash = '';
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                  Engineering<span className="text-cyan-400">Hub</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  Lab v2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Hardware, Firmware & Virtual Engineering Lab
              </p>
            </div>
          </div>

          {/* Primary View Switcher in Navbar */}
          {setMainView && (
            <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setMainView('projects');
                  window.location.hash = '';
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mainView === 'projects'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Proyectos</span>
              </button>

              <button
                onClick={() => {
                  setMainView('guides');
                  window.location.hash = '';
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mainView === 'guides'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guías ({totalGuides})</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenLab) onOpenLab();
                  else if (setMainView) setMainView('lab');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all relative ${
                  mainView === 'lab'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-950/50'
                    : 'text-cyan-300/90 hover:text-cyan-200 hover:bg-cyan-950/40'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                <span>El Lab</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1" />
              </button>
            </div>
          )}
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          
          {/* Quick Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-all shadow-inner"
              title="Buscar en todo el catálogo (Ctrl+K o ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline text-slate-400">Buscar...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Project Comparator Trigger */}
          {onOpenComparator && (
            <button
              onClick={onOpenComparator}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                compareCount > 0 
                  ? 'bg-cyan-950/80 border-cyan-700/80 text-cyan-300 shadow-sm' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Abrir comparador técnico de proyectos"
            >
              <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Comparar</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono text-[10px]">
                  {compareCount}
                </span>
              )}
            </button>
          )}

          {/* BOM Cart Trigger */}
          {onOpenBOMCart && (
            <button
              onClick={onOpenBOMCart}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                cartCount > 0 
                  ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300 shadow-sm' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Abrir cesta de componentes BOM"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">BOM</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold font-mono text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Favorites Filter */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              showOnlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Ver solo elementos marcados como favoritos"
          >
            <Bookmark className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px]">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            title="Ver estadísticas del catálogo"
          >
            <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Métricas</span>
          </button>

          {/* Live Sync with GitHub */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/60 hover:text-cyan-200 hover:border-cyan-700 transition-all disabled:opacity-50"
            title="Consultar la API de GitHub para detectar guías recién añadidas"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isSyncing ? 'Sync...' : 'Live Sync'}</span>
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/Damaga2005/EngineeringGuides"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
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
