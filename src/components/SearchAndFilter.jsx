import React from 'react';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Rocket, 
  Bot, 
  Cpu, 
  Zap, 
  Briefcase, 
  Compass, 
  Layers 
} from 'lucide-react';
import { CATEGORY_DEFINITIONS, SORT_OPTIONS } from '../data/categories';

const ICON_MAP = {
  Layers,
  Rocket,
  Bot,
  Cpu,
  Zap,
  Briefcase,
  Compass
};

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  categoryCounts,
  totalResults
}) {
  return (
    <div className="space-y-4 mb-8">
      
      {/* Top Search & Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, palabra clave o etiqueta (ej. satélite, drone, RF, PCB)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2">
          
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer appearance-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORY_DEFINITIONS.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Layers;
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-200 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-200'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicators / Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
        <div>
          Mostrando <span className="font-semibold text-slate-200">{totalResults}</span> {totalResults === 1 ? 'guía' : 'guías'}
          {searchQuery && (
            <span> para la búsqueda "<span className="text-cyan-400">{searchQuery}</span>"</span>
          )}
        </div>

        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            Limpiar filtros
          </button>
        )}
      </div>

    </div>
  );
}
