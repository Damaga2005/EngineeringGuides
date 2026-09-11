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
  Eye,
  Terminal,
  Activity,
  Compass
} from 'lucide-react';

export default function ProjectBuildGuide({
  project,
  projectNumber,
  onOpenImageViewer
}) {
  const [activeTab, setActiveTab] = useState('schematic'); // 'schematic' | 'wiring' | 'firmware' | 'mechanical' | 'calibration' | 'troubleshoot'
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
  const manual = project.detailedBuildManual || {};
  const wiringTable = project.wiringTable || [];
  const schematicUrl = project.schematicSvg 
    ? (project.schematicSvg.startsWith('http') ? project.schematicSvg : `${baseUrl}${project.schematicSvg}`)
    : null;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl mb-8 group">
      
      {/* Project Card Header Banner */}
      <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5 min-w-0">
          <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold flex items-center justify-center text-sm shadow-md shadow-cyan-500/10">
            {projectNumber < 10 ? `0${projectNumber}` : projectNumber}
          </span>

          <div className="min-w-0">
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

        {/* Quick button to view full schematic SVG */}
        {schematicUrl && (
          <button
            onClick={() => onOpenImageViewer([project.schematicSvg], 0, `Esquemático: ${project.title}`)}
            className="self-start md:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all flex-shrink-0 shadow-sm"
            title="Abrir diagrama esquemático a pantalla completa"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Ver Esquemático Completo</span>
          </button>
        )}

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto text-xs font-semibold">
        
        <button
          onClick={() => setActiveTab('schematic')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'schematic'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Esquema de Circuito SVG</span>
        </button>

        <button
          onClick={() => setActiveTab('wiring')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'wiring'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Cableado Cable a Cable</span>
        </button>

        <button
          onClick={() => setActiveTab('firmware')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'firmware'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Firmware & Comandos</span>
        </button>

        <button
          onClick={() => setActiveTab('mechanical')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'mechanical'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Montaje Mecánico</span>
        </button>

        <button
          onClick={() => setActiveTab('calibration')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'calibration'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Calibración en Banco</span>
        </button>

        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'troubleshoot'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Resolución de Fallos</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'interview'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Preguntas de Entrevista</span>
        </button>

      </div>

      {/* Main Tab Body */}
      <div className="p-5 sm:p-6 md:p-8">
        
        {/* TAB 1: SVG Circuit Schematic Diagram */}
        {activeTab === 'schematic' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Diagrama Esquemático de Circuito Vectorial
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conexiones lógicas directas, componentes pasivos de protección (pull-up y desacoplo) y código de colores oficial.
                </p>
              </div>

              {schematicUrl && (
                <button
                  onClick={() => onOpenImageViewer([project.schematicSvg], 0, `Esquemático: ${project.title}`)}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Ampliar a Pantalla Completa</span>
                </button>
              )}
            </div>

            {/* Embedded SVG Viewer Box */}
            {schematicUrl ? (
              <div 
                onClick={() => onOpenImageViewer([project.schematicSvg], 0, `Esquemático: ${project.title}`)}
                className="relative rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-cyan-500/50 bg-[#080D1A] shadow-2xl cursor-pointer group/svg transition-all"
                title="Haz clic para inspeccionar el diagrama con zoom"
              >
                <img
                  src={schematicUrl}
                  alt={`Diagrama esquemático de ${project.title}`}
                  className="w-full h-auto max-h-[460px] object-contain transition-transform duration-300 group-hover/svg:scale-[1.01]"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Clic para zoom</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Esquemático en proceso de generación.</p>
            )}

            {/* Pinout Table below Schematic */}
            {wiringTable && wiringTable.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-cyan-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Pin Microcontrolador</th>
                      <th className="p-2.5">Pin Módulo / Carga</th>
                      <th className="p-2.5">Señal</th>
                      <th className="p-2.5">Tensión</th>
                      <th className="p-2.5">Instrucción Eléctrica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono text-xs">
                    {wiringTable.map((row, idx) => (
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
            )}
          </div>
        )}

        {/* TAB 2: Detailed Wire-by-Wire Instructions */}
        {activeTab === 'wiring' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4" />
                Instrucciones de Cableado Cable a Cable (Físico y Soldadura)
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Sigue esta secuencia exacta para garantizar que el circuito sea eléctricamente seguro y libre de oscilaciones parásitas.
              </p>

              <ol className="space-y-3">
                {manual.wiringSteps?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {official.safety && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">Seguridad y Normas de Protección:</strong>
                  {official.safety}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Firmware & Console Commands */}
        {activeTab === 'firmware' && (
          <div className="space-y-6">
            {/* Terminal Commands */}
            {manual.consoleCommands && manual.consoleCommands.length > 0 && (
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Comandos de Consola y Dependencias de Software
                  </h4>
                </div>

                <div className="bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                  {manual.consoleCommands.map((cmd, idx) => (
                    <div key={idx} className={cmd.startsWith('#') ? 'text-slate-500 italic' : 'text-emerald-400 font-bold'}>
                      {cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Firmware Code Snippet */}
            {manual.firmwareCode && (
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Firmware de Control en Tiempo Real
                  </h4>

                  <button
                    onClick={() => copyCode(manual.firmwareCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
                  >
                    {codeCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{codeCopied ? "¡Copiado!" : "Copiar Código"}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070A10]">
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
                    <code>{manual.firmwareCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Mechanical Assembly */}
        {activeTab === 'mechanical' && (
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Directrices de Montaje Mecánico, Carcasa y Térmica
            </h4>
            
            <ul className="space-y-3">
              {manual.mechanicalSteps?.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 5: Bench Calibration Protocol */}
        {activeTab === 'calibration' && (
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Protocolo de Calibración Segura en Banco de Trabajo
            </h4>

            <ul className="space-y-3">
              {manual.benchCalibration?.map((calib, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{calib}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 6: Troubleshooting Matrix */}
        {activeTab === 'troubleshoot' && (
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Matriz de Detección y Resolución de Fallos Típicos
            </h4>

            <div className="space-y-3">
              {manual.troubleshooting?.map((item, idx) => {
                const isOpen = openTroubleshoot[idx];
                return (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                    <button
                      onClick={() => toggleTroubleshoot(idx)}
                      className="w-full p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300 flex items-center justify-between gap-3 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-amber-400 text-sm">⚠️</span>
                        <span>{item.symptom}</span>
                      </span>
                      {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-0 text-xs border-t border-slate-800/80 space-y-2.5">
                        <p className="text-slate-400 leading-relaxed">
                          <strong className="text-rose-400 block mb-0.5">Causa Raíz Eléctrica / Lógica:</strong>
                          {item.cause}
                        </p>
                        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 leading-relaxed">
                          <strong className="text-emerald-400 block mb-0.5">Solución Técnica Directa:</strong>
                          {item.fix}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: Interview Questions & Recruiter Proof */}
        {activeTab === 'interview' && (
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

      </div>

    </div>
  );
}
