import React from 'react';
import { 
  X, 
  BarChart3, 
  HardDrive, 
  Layers, 
  FolderSync, 
  CheckCircle2, 
  Cpu, 
  Rocket, 
  Bot, 
  Zap, 
  Briefcase, 
  Compass 
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

export default function StatsModal({ guides, totalSize, onClose }) {
  // Compute category breakdown
  const categoryStats = CATEGORY_DEFINITIONS.filter(c => c.id !== 'all').map(cat => {
    const matching = guides.filter(g => g.categoryId === cat.id);
    const count = matching.length;
    const totalBytes = matching.reduce((acc, g) => acc + (g.sizeBytes || 0), 0);
    const percentage = guides.length > 0 ? ((count / guides.length) * 100).toFixed(0) : 0;
    return {
      ...cat,
      count,
      totalBytes,
      percentage
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">
                Estadísticas del Repositorio
              </h2>
              <p className="text-xs text-slate-400">
                Métricas del catálogo y estado de automatización
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" /> Total Guías
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono">
                {guides.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-blue-400" /> Tamaño Total
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono">
                {totalSize}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Auto-Deploy
              </div>
              <div className="text-xs font-semibold text-emerald-300 font-mono mt-1.5">
                GitHub Actions Activo
              </div>
            </div>
          </div>

          {/* Breakdown by Discipline */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              Distribución por Disciplina
            </h3>
            <div className="space-y-3">
              {categoryStats.map(cat => {
                const Icon = ICON_MAP[cat.icon] || Layers;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                        <Icon className="h-3.5 w-3.5 text-cyan-400" />
                        {cat.name}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {cat.count} {cat.count === 1 ? 'guía' : 'guías'} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Automation Information */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderSync className="h-4 w-4" /> ¿Cómo funciona la sincronización automática?
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Al subir a GitHub:</strong> Simplemente añade el archivo PDF a la carpeta <code className="text-cyan-300">Engineering guides/</code> y haz push (o súbelo directo en la web de GitHub). GitHub Actions indexará la guía y actualizará el portal web automáticamente.
              </li>
              <li>
                <strong>Live Sync en el navegador:</strong> Haz clic en el botón <strong className="text-cyan-300">Live Sync</strong> en la barra superior para forzar la consulta en vivo a GitHub y detectar PDFs recién subidos al instante.
              </li>
              <li>
                <strong>Google Drive Sync:</strong> El workflow de GitHub Actions o el script local <code className="text-cyan-300">python scripts/sync_gdrive.py</code> sincroniza periódicamente la carpeta de Drive con el repositorio.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
