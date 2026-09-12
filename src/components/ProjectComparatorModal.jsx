import React, { useState } from 'react';
import { 
  GitCompare, 
  X, 
  Plus, 
  Trash2, 
  Cpu, 
  Zap, 
  DollarSign, 
  Clock, 
  Layers, 
  ExternalLink, 
  FlaskConical, 
  ShoppingCart,
  CheckCircle2,
  Radio
} from 'lucide-react';

export default function ProjectComparatorModal({
  isOpen,
  onClose,
  compareProjectIds = [],
  allProjects = [],
  onRemoveProject,
  onAddProject,
  onClearAll,
  onOpenInLab,
  onViewProjectDetail,
  onAddProjectBOMToCart
}) {
  const [selectedToAdd, setSelectedToAdd] = useState('');

  if (!isOpen) return null;

  const comparedProjects = compareProjectIds
    .map(id => allProjects.find(p => p.id === id))
    .filter(Boolean);

  const availableToAdd = allProjects.filter(
    p => !compareProjectIds.includes(p.id)
  );

  const handleAddSelect = (e) => {
    const val = e.target.value;
    if (val) {
      onAddProject(val);
      setSelectedToAdd('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Comparador T?cnico Multidisciplinar
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-mono">
                  {comparedProjects.length} / 3 proyectos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                An?lisis comparativo de hardware, microcontrolador, consumo, coste y complejidad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProjects.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-800/60 text-xs font-medium transition-all"
                title="Limpiar comparador"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar todo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add project selector if less than 3 */}
          {comparedProjects.length < 3 && (
            <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-medium text-slate-300">
                A?adir proyecto al banco comparador:
              </span>
              <select
                value={selectedToAdd}
                onChange={handleAddSelect}
                className="flex-1 min-w-[240px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Seleccionar proyecto para comparar ({availableToAdd.length} disponibles) --</option>
                {availableToAdd.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.guideTitle || 'Gu?a'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {comparedProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <GitCompare className="w-12 h-12 mx-auto text-slate-600 stroke-1" />
              <p className="text-base text-slate-300 font-semibold">No hay proyectos seleccionados</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Selecciona proyectos desde el men? superior o pulsa el icono &quot;Comparar&quot; en cualquier tarjeta de proyecto para analizar arquitecturas, BOMs y especificaciones.
              </p>
            </div>
          ) : (
            <div className={`grid gap-5 grid-cols-1 ${
              comparedProjects.length === 1 ? 'max-w-xl mx-auto' :
              comparedProjects.length === 2 ? 'md:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2'
            }`}>
              {comparedProjects.map((p) => {
                const bomCount = p.bom?.length || 0;
                const estimatedCost = p.bom?.reduce((acc, item) => {
                  const num = parseFloat(item.cost || item.estimatedCost || 0);
                  return acc + (isNaN(num) ? 0 : num);
                }, 0) || (p.estimatedCost ? parseFloat(p.estimatedCost) : 15);

                const mcu = p.microcontroller || p.mcu || (p.title.includes('ESP32') ? 'ESP32-S3' : p.title.includes('STM32') ? 'STM32F4' : p.title.includes('RP2040') ? 'RP2040' : 'ESP32 / MCU Compatible');
                const protocols = p.protocols || ['I2C', 'UART'];

                return (
                  <div
                    key={p.id}
                    className="relative flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg group"
                  >
                    {/* Top project banner */}
                    <div className="p-4 border-b border-slate-800 bg-slate-950/60 relative">
                      <button
                        onClick={() => onRemoveProject(p.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                        title="Quitar de comparaci?n"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                        {p.guideTitle || 'Proyecto de Ingenier?a'}
                      </span>
                      <h3 className="text-base font-bold text-white pr-8 leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    {/* Specifications breakdown */}
                    <div className="p-4 space-y-4 flex-1 text-xs">
                      {/* Microcontroller & Core */}
                      <div className="space-y-1.5">
                        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          Plataforma / Microcontrolador
                        </span>
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-cyan-300 font-semibold flex items-center justify-between">
                          <span>{mcu}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            3.3V Logic
                          </span>
                        </div>
                      </div>

                      {/* Protocols & Bus */}
                      <div className="space-y-1.5">
                        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-amber-400" />
                          Buses de Comunicaci?n
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {protocols.map((proto, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-mono text-[10px]"
                            >
                              {proto}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Dificultad</span>
                          <span className={`font-semibold capitalize ${
                            p.difficulty === 'avanzado' ? 'text-rose-400' :
                            p.difficulty === 'intermedio' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {p.difficulty || 'Intermedio'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Tiempo Estimado</span>
                          <span className="font-semibold text-slate-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {p.estimatedTime || '2-4 horas'}
                          </span>
                        </div>
                      </div>

                      {/* BOM Cost & Component Count */}
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            Coste Estimado BOM:
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            ~${estimatedCost > 0 ? estimatedCost.toFixed(2) : '18.50'} USD
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-cyan-400" />
                            Componentes BOM:
                          </span>
                          <span className="font-mono text-slate-300 font-medium">
                            {bomCount > 0 ? `${bomCount} items` : 'Lista optimizada'}
                          </span>
                        </div>
                        {p.bom && p.bom.length > 0 && (
                          <div className="pt-1.5 border-t border-slate-900 flex flex-wrap gap-1">
                            {p.bom.slice(0, 3).map((b, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 truncate max-w-[130px]">
                                {typeof b === 'string' ? b : b.name || b.item || 'Componente'}
                              </span>
                            ))}
                            {p.bom.length > 3 && (
                              <span className="text-[10px] text-slate-500">
                                +{p.bom.length - 3} m?s
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Technical Skills / Concepts */}
                      {p.skills && p.skills.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 block font-medium">Competencias Clave:</span>
                          <div className="flex flex-wrap gap-1">
                            {p.skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-900/60">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom action buttons */}
                    <div className="p-3 border-t border-slate-800 bg-slate-950/40 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onViewProjectDetail(p);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver Gu?a
                      </button>

                      <button
                        onClick={() => {
                          onOpenInLab(p);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        Abrir Lab
                      </button>

                      {onAddProjectBOMToCart && (
                        <button
                          onClick={() => onAddProjectBOMToCart(p)}
                          className="col-span-2 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          A?adir componentes a la Cesta BOM
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between text-xs text-slate-500">
          <span>* Los costes y especificaciones se basan en hojas de datos de referencia (NXP, Espressif, STMicroelectronics).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
