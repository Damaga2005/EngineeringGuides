import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Cpu, 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  Activity, 
  ShoppingCart, 
  GitCompare, 
  ArrowRight, 
  CornerDownLeft,
  Compass,
  Zap
} from 'lucide-react';

export default function QuickCommandPalette({
  isOpen,
  onClose,
  projects = [],
  guides = [],
  onSelectProject,
  onSelectGuide,
  onOpenLab,
  onOpenComparator,
  onOpenCart
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K / Ctrl+K is in App.jsx, but handle Escape & Arrows here
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    // Default static actions if query is empty or matches
    const staticActions = [
      {
        id: 'action_lab_analyzer',
        type: 'lab',
        title: 'Laboratorio: Analizador L?gico I2C / SPI / UART',
        subtitle: 'Simulador de formas de onda e inyecci?n de fallos con exportaci?n VCD',
        icon: Activity,
        action: () => { onOpenLab('analyzer'); onClose(); }
      },
      {
        id: 'action_lab_calculators',
        type: 'lab',
        title: 'Laboratorio: Calculadoras de Dise?o Hardware',
        subtitle: 'Pull-up I2C (NXP UM10204), Divisor de Tensi?n E24, Bater?a IoT, Filtro RC',
        icon: Calculator,
        action: () => { onOpenLab('calculators'); onClose(); }
      },
      {
        id: 'action_lab_pinout',
        type: 'lab',
        title: 'Laboratorio: Matriz de Pinout Multi-MCU',
        subtitle: 'ESP32-S3, STM32F4, RP2040, Teensy 4.1 con strapping pins y tolerancias 5V',
        icon: Cpu,
        action: () => { onOpenLab('pinout'); onClose(); }
      },
      {
        id: 'action_lab_telemetry',
        type: 'lab',
        title: 'Laboratorio: Telemetr?a de Sensores & Terminal Serie',
        subtitle: 'Streaming en tiempo real a 115200 baud con inyecci?n de comandos',
        icon: FlaskConical,
        action: () => { onOpenLab('telemetry'); onClose(); }
      },
      {
        id: 'action_open_comparator',
        type: 'util',
        title: 'Abrir Comparador T?cnico de Proyectos',
        subtitle: 'Comparar arquitecturas, consumo y BOM de hasta 3 proyectos',
        icon: GitCompare,
        action: () => { onOpenComparator(); onClose(); }
      },
      {
        id: 'action_open_cart',
        type: 'util',
        title: 'Abrir Cesta BOM Consolidada',
        subtitle: 'Revisar presupuesto global y exportar lista a CSV/TSV',
        icon: ShoppingCart,
        action: () => { onOpenCart(); onClose(); }
      }
    ];

    if (!q) {
      return staticActions;
    }

    const matchedStatic = staticActions.filter(
      a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );

    const matchedProjects = projects
      .filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.microcontroller && p.microcontroller.toLowerCase().includes(q)) ||
        (p.technicalIdentity?.controller && p.technicalIdentity.controller.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map(p => ({
        id: `proj_${p.slug || p.projectId || p.id}`,
        type: 'project',
        title: p.title,
        subtitle: `${p.guideTitle || 'Proyecto'} ? ${p.microcontroller || p.technicalIdentity?.controller || 'MCU'} ? ${p.difficulty || 'Intermedio'}`,
        icon: Cpu,
        action: () => { onSelectProject(p); onClose(); }
      }));

    const matchedGuides = guides
      .filter(g => 
        (g.title && g.title.toLowerCase().includes(q)) ||
        (g.id && g.id.toLowerCase().includes(q)) ||
        (g.description && g.description.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map(g => ({
        id: `guide_${g.id}`,
        type: 'guide',
        title: g.title,
        subtitle: `Gu?a Oficial ? ${g.projectCount || 0} proyectos ? ${g.category || 'General'}`,
        icon: BookOpen,
        action: () => { onSelectGuide(g.id); onClose(); }
      }));

    return [...matchedStatic, ...matchedProjects, ...matchedGuides];
  }, [query, projects, guides, onOpenLab, onOpenComparator, onOpenCart, onSelectProject, onSelectGuide, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe para buscar proyectos, gu?as, herramientas de laboratorio..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-slate-300 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ESC para salir
            </span>
          )}
        </div>

        {/* Results list */}
        <div 
          ref={listRef}
          className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-900"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No se encontraron coincidencias para &quot;{query}&quot;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/60 border border-cyan-700/60 shadow-md text-white' 
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : item.type === 'lab' 
                        ? 'bg-indigo-950/40 text-indigo-400' 
                        : item.type === 'project' 
                        ? 'bg-slate-900 text-cyan-400' 
                        : 'bg-slate-900 text-amber-400'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.type === 'lab' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                            LAB
                          </span>
                        )}
                        {item.type === 'project' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 font-mono">
                            PROYECTO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 shrink-0 ml-2">
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; para navegar</span>
            <span>&crarr; para abrir</span>
          </div>
          <span>Engineering Hub Quick Commands</span>
        </div>
      </div>
    </div>
  );
}
