import React, { useState } from 'react';
import { 
  Wrench, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink, 
  Maximize2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Clock, 
  DollarSign, 
  Sliders, 
  ShieldCheck, 
  Boxes,
  Eye
} from 'lucide-react';

export default function ProjectBuildGuide({
  project,
  projectNumber,
  onOpenImageViewer
}) {
  const [activeTab, setActiveTab] = useState('build'); // 'build' | 'blueprints' | 'physics' | 'recruiter' | 'bom'
  const [codeCopied, setCodeCopied] = useState(false);
  const [openTroubleshoot, setOpenTroubleshoot] = useState({});
  const [openInterview, setOpenInterview] = useState({});

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const toggleTroubleshoot = (idx) => {
    setOpenTroubleshoot(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleInterview = (idx) => {
    setOpenInterview(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const official = project.officialData || {};
  const guide = project.constructionGuide || {};
  const blueprints = project.blueprintImages || [];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl mb-8 group">
      
      {/* Project Card Header Banner */}
      <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold flex items-center justify-center text-sm">
            {projectNumber < 10 ? `0${projectNumber}` : projectNumber}
          </span>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {project.title}
              </h3>
              {project.cost && (
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {project.cost}
                </span>
              )}
              {project.time && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" /> {project.time}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Blueprint count badge & quick button */}
        {blueprints.length > 0 && (
          <button
            onClick={() => onOpenImageViewer(blueprints, 0, `Planos: ${project.title}`)}
            className="self-start md:self-center flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all flex-shrink-0"
            title="Ver planos oficiales extraídos"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{blueprints.length} Planos Oficiales</span>
          </button>
        )}

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800/80 bg-slate-950/50 overflow-x-auto text-xs font-semibold">
        
        <button
          onClick={() => setActiveTab('build')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'build'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Guía de Construcción Paso a Paso</span>
        </button>

        <button
          onClick={() => setActiveTab('blueprints')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'blueprints'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Planos e Imágenes ({blueprints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('physics')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'physics'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Principios de Ingeniería</span>
        </button>

        <button
          onClick={() => setActiveTab('recruiter')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'recruiter'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Preguntas de Entrevista</span>
        </button>

        <button
          onClick={() => setActiveTab('bom')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'bom'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="h-3.5 w-3.5" />
          <span>Componentes BOM</span>
        </button>

      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-6 md:p-8">
        
        {/* TAB 1: Step-by-Step Construction Guide */}
        {activeTab === 'build' && (
          <div className="space-y-8">
            
            {/* Safety Banner */}
            {official.safety && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">Seguridad y Precaución Crítica:</strong>
                  {official.safety}
                </div>
              </div>
            )}

            {/* Fase 1: Workbench & Tools */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Wrench className="h-4 w-4" />
                Fase 1: Preparación del Banco de Trabajo e Instrumentación
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Herramientas Recomendadas:</h5>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {guide.fase1_workbench?.tools?.map((tool, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Lista de Verificación Previa:</h5>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {guide.fase1_workbench?.prepChecklist?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Fase 2: Wiring Diagram & Pinouts */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Cpu className="h-4 w-4" />
                Fase 2: Diagrama de Conexiones Eléctricas & Pinout
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800 mb-3">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-cyan-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Pin Microcontrolador</th>
                      <th className="p-2.5">Pin Módulo / Sensor</th>
                      <th className="p-2.5">Tipo de Señal</th>
                      <th className="p-2.5">Nivel de Voltaje</th>
                      <th className="p-2.5">Notas Eléctricas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                    {guide.fase2_wiring?.wiringTable?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2.5 text-cyan-300 font-semibold">{row.mcuPin}</td>
                        <td className="p-2.5 text-amber-300">{row.modulePin}</td>
                        <td className="p-2.5 text-purple-300">{row.signalType}</td>
                        <td className="p-2.5 text-emerald-300">{row.voltage}</td>
                        <td className="p-2.5 text-slate-400 font-sans">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {guide.fase2_wiring?.busNotes && (
                <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-cyan-400 font-bold not-italic">Nota de Bus: </span>
                  {guide.fase2_wiring.busNotes}
                </p>
              )}
            </div>

            {/* Fase 3: Mechanical Assembly */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4" />
                Fase 3: Montaje Físico y Carcasa
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {guide.fase3_mechanical?.mountingNotes?.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fase 4: Firmware Architecture & Code */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Fase 4: Firmware & Lógica de Control
                </h4>

                {guide.fase4_firmware?.loopRate && (
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-purple-300 border border-purple-800/50 self-start sm:self-auto">
                    Loop Rate: {guide.fase4_firmware.loopRate}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-3">
                {guide.fase4_firmware?.algorithm}
              </p>

              {/* Code Snippet Box */}
              {guide.fase4_firmware?.codeSnippet && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070A10]">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-mono">firmware_control_loop.cpp</span>
                    <button
                      onClick={() => copyCode(guide.fase4_firmware.codeSnippet)}
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {codeCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{codeCopied ? "¡Copiado!" : "Copiar código"}</span>
                    </button>
                  </div>

                  <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
                    <code>{guide.fase4_firmware.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Fase 5: Calibration & Bench Tests */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Sliders className="h-4 w-4" />
                Fase 5: Calibración y Pruebas en Banco
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {guide.fase5_calibration?.steps?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fase 6: Troubleshooting */}
            {guide.fase6_troubleshooting && guide.fase6_troubleshooting.length > 0 && (
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Fase 6: Detección y Resolución de Fallos (Troubleshooting)
                </h4>

                <div className="space-y-2.5">
                  {guide.fase6_troubleshooting.map((item, idx) => {
                    const isOpen = openTroubleshoot[idx];
                    return (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                        <button
                          onClick={() => toggleTroubleshoot(idx)}
                          className="w-full p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300 flex items-center justify-between gap-3 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-amber-400">⚠️</span>
                            {item.symptom}
                          </span>
                          {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="p-3.5 pt-0 text-xs border-t border-slate-800/80 space-y-2">
                            <p className="text-slate-400">
                              <strong className="text-rose-400">Causa Probable: </strong>
                              {item.cause}
                            </p>
                            <p className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                              <strong className="text-emerald-400">Solución: </strong>
                              {item.fix}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Official Blueprints & Rendered Pages */}
        {activeTab === 'blueprints' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Láminas y Planos Oficiales Extraídos ({blueprints.length})
              </h4>
              <span className="text-xs text-slate-400">Haz clic en cualquier lámina para ver a pantalla completa</span>
            </div>

            {blueprints.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No se han encontrado láminas separadas para este proyecto.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blueprints.map((img, idx) => {
                  const imgUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => onOpenImageViewer(blueprints, idx, `Plano ${idx + 1}: ${project.title}`)}
                      className="group/img relative rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/60 bg-slate-950 cursor-pointer shadow-lg transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Plano oficial ${idx + 1}`}
                        className="w-full h-64 object-cover object-top group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-cyan-300">
                        <span>Lámina Oficial #{idx + 1}</span>
                        <Maximize2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Physics & Engineering Principles */}
        {activeTab === 'physics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                ¿Por qué importa en la ingeniería real?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {official.whyThisMatters}
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                Principios Físicos y de Señal (How It Works)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {official.howItWorks?.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <strong className="text-xs font-bold text-cyan-400 block mb-1">
                      {pt.title}
                    </strong>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Recruiter Proof & Interview Questions */}
        {activeTab === 'recruiter' && (
          <div className="space-y-6">
            <div className="bg-cyan-950/30 p-5 rounded-2xl border border-cyan-500/40">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Lo que este proyecto demuestra a un Reclutador Técnico
              </h4>
              <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed mb-3">
                {official.whatThisProves}
              </p>
              {official.jobMapping && (
                <div className="pt-2 border-t border-cyan-800/50 text-xs text-cyan-300">
                  <strong>Puestos de trabajo directos: </strong>
                  <span>{official.jobMapping}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Preguntas de Entrevista Técnica Real
              </h4>

              <div className="space-y-2.5">
                {official.interviewQuestions?.map((q, idx) => {
                  const isOpen = openInterview[idx];
                  return (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                      <button
                        onClick={() => toggleInterview(idx)}
                        className="w-full p-3.5 text-left text-xs sm:text-sm font-medium text-slate-200 hover:text-cyan-300 flex items-center justify-between gap-3 transition-colors"
                      >
                        <span>{idx + 1}. {q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-slate-400 border-t border-slate-800/80">
                          <strong className="text-cyan-400 block mb-1">Clave de Respuesta Técnica:</strong>
                          Fundamenta tu respuesta en los principios físicos medidos en el osciloscopio: tiempos de subida de señal, compensación de polos y ceros, cálculo del presupuesto de enlace RF (link budget) o latencia de bucle de control.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BOM Table */}
        {activeTab === 'bom' && (
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Boxes className="h-4 w-4" />
              Lista de Componentes y Costes (BOM)
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-cyan-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Componente</th>
                    <th className="p-2.5">Especificación / Referencia</th>
                    <th className="p-2.5">Cantidad</th>
                    <th className="p-2.5">Coste Aprox.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {official.bom?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-2.5 font-bold text-slate-100">{item.name}</td>
                      <td className="p-2.5 font-mono text-slate-400">{item.specs}</td>
                      <td className="p-2.5 font-mono text-center text-cyan-300">{item.qty}</td>
                      <td className="p-2.5 font-mono text-emerald-400">{item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
