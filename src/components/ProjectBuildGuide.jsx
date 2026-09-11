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
  const [activeTab, setActiveTab] = useState('schematic'); // 'schematic' | 'wiring' | 'firmware' | 'mechanical' | 'calibration' | 'troubleshoot' | 'checklist'
  const [codeCopied, setCodeCopied] = useState(false);
  const [bomCopied, setBomCopied] = useState(false);
  const [imageMode, setImageMode] = useState('photo'); // 'photo' | 'diagram'
  const [openTroubleshoot, setOpenTroubleshoot] = useState({});
  const [openInterview, setOpenInterview] = useState({});
  const [svgError, setSvgError] = useState(false);

  // Local storage checklist state for this project
  const [checkedSteps, setCheckedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(`build_check_${project?.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheckStep = (stepIdx) => {
    setCheckedSteps(prev => {
      const next = { ...prev, [stepIdx]: !prev[stepIdx] };
      try {
        localStorage.setItem(`build_check_${project?.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Reset errors when project changes
  React.useEffect(() => {
    setSvgError(false);
    setImageMode('photo');
  }, [project?.id, project?.schematicSvg]);

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyBOM = () => {
    const lines = (project.officialData?.bom || []).map(b => `${b.name}\t${b.specs || ''}\t${b.qty || '1'}\t${b.cost || ''}`);
    const tsv = `Componente\tEspecificación\tCantidad\tCoste\n` + lines.join('\n');
    navigator.clipboard.writeText(tsv);
    setBomCopied(true);
    setTimeout(() => setBomCopied(false), 2000);
  };

  const exportBOM_CSV = () => {
    const rows = [
      ["Componente", "Especificacion", "Cantidad", "Coste"],
      ...(project.officialData?.bom || []).map(b => [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.specs || '').replace(/"/g, '""')}"`,
        `"${b.qty || '1'}"`,
        `"${b.cost || ''}"`
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BOM_${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const activeDisplayImage = (imageMode === 'diagram' && project.guideDiagram)
    ? (project.guideDiagram.startsWith('http') ? project.guideDiagram : `${baseUrl}${project.guideDiagram}`)
    : (project.image?.startsWith('http') ? project.image : `${baseUrl}${project.image}`);

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

      {/* Physical Hardware Build Showcase */}
      {(project.image || project.guideDiagram) && (
        <div className="border-b border-slate-800 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-center gap-5 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950 rounded-2xl p-3.5 sm:p-4 border border-slate-800/80">
            <div className="flex flex-col items-center gap-2 flex-shrink-0 w-full md:w-56">
              <div 
                onClick={() => onOpenImageViewer([activeDisplayImage], 0, `${imageMode === 'diagram' ? 'Plano Oficial en Guía' : 'Hardware Físico'}: ${project.title}`)}
                className="relative w-full h-40 md:h-36 rounded-xl overflow-hidden border-2 border-slate-700/80 hover:border-cyan-400 cursor-pointer group/img shadow-2xl transition-all bg-slate-950"
                title="Haz clic para ampliar la imagen en alta resolución"
              >
                <img 
                  src={activeDisplayImage}
                  alt={`Hardware real de ${project.title}`}
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800">
                    <Activity className="h-3 w-3 text-emerald-400" /> {imageMode === 'diagram' ? 'Plano en PDF' : 'Hardware Físico'}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                    <Maximize2 className="h-3 w-3" /> Zoom
                  </span>
                </div>
              </div>

              {/* View Switcher: Real Photo vs Official Guide Diagram */}
              {project.guideDiagram && project.image && (
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px] font-mono w-full justify-center">
                  <button
                    onClick={() => setImageMode('photo')}
                    className={`flex-1 py-1 rounded text-center transition-all ${
                      imageMode === 'photo' 
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Foto Real
                  </button>
                  <button
                    onClick={() => setImageMode('diagram')}
                    className={`flex-1 py-1 rounded text-center transition-all ${
                      imageMode === 'diagram' 
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Plano en PDF
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                  {project.components?.[0] || "Controlador / MCU"}
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  {project.components?.[1] || "Módulo / Carga Útil"}
                </span>
                {project.components?.[2] && (
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hidden sm:inline-flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-amber-400" />
                    {project.components[2]}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.description}
              </p>

              <div className="text-[11px] text-slate-400 flex items-center justify-between gap-4 pt-1 font-mono flex-wrap">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Montaje Físico Verificado
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Bucle Determinista
                  </span>
                </div>

                {/* BOM Export actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyBOM}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
                    title="Copiar lista de componentes al portapapeles"
                  >
                    {bomCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{bomCopied ? "¡Copiado!" : "Copiar BOM"}</span>
                  </button>
                  <button
                    onClick={exportBOM_CSV}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
                    title="Descargar lista de componentes en formato CSV"
                  >
                    <Download className="h-3 w-3 text-cyan-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-all border-b-2 flex-shrink-0 ${
            activeTab === 'checklist'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Checklist de Montaje</span>
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

            {/* Embedded SVG Viewer Box with Zero-Black-Screen Fallback */}
            {schematicUrl && !svgError ? (
              <div 
                onClick={() => onOpenImageViewer([project.schematicSvg], 0, `Esquemático: ${project.title}`)}
                className="relative rounded-2xl overflow-hidden border-2 border-cyan-900/60 hover:border-cyan-400/80 bg-[#0A1128] shadow-2xl cursor-pointer group/svg transition-all p-2"
                title="Haz clic para inspeccionar el diagrama con zoom interactivo"
              >
                <img
                  src={schematicUrl}
                  alt={`Diagrama esquemático de ${project.title}`}
                  className="w-full h-auto min-h-[260px] max-h-[480px] object-contain transition-transform duration-300 group-hover/svg:scale-[1.01]"
                  onError={() => setSvgError(true)}
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Clic para zoom</span>
                </div>
              </div>
            ) : (
              /* High-Contrast Interactive React Fallback Blueprint */
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-800/80 bg-[#0A1128] p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Esquema Técnico Interactivo · {project.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    Modo Vectorial Interactivo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left Block: Controller */}
                  <div className="bg-[#0F2848] border-2 border-cyan-400/80 rounded-xl p-4 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 font-mono">Microcontrolador / SBC</span>
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50">MCU</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{project.components?.[0] || "ESP32-S3 / ARM Cortex-M4"}</p>
                    <div className="space-y-1.5 pt-1">
                      {(wiringTable.slice(0, 4)).map((w, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1 rounded text-[11px] font-mono border border-slate-800">
                          <span className="text-cyan-300 font-bold">{w.mcuPin}</span>
                          <span className="text-slate-400 text-[10px]">{w.signalType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Block: Module / Payload */}
                  <div className="bg-[#0D332B] border-2 border-emerald-400/80 rounded-xl p-4 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-mono">Módulo / Sensor / Actuador</span>
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50">CARGA</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{project.components?.[1] || project.title}</p>
                    <div className="space-y-1.5 pt-1">
                      {(wiringTable.slice(0, 4)).map((w, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1 rounded text-[11px] font-mono border border-slate-800">
                          <span className="text-emerald-300 font-bold">{w.modulePin}</span>
                          <span className="text-slate-400 text-[10px]">{w.voltage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3.5 py-2 rounded-lg border border-slate-800">
                  <span className="text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Líneas con filtrado y resistencias pull-up externas
                  </span>
                  <span className="text-slate-400">Ver conexionado detallado debajo</span>
                </div>
              </div>
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

        {/* TAB 7: Interactive Hardware Build Checklist */}
        {activeTab === 'checklist' && (
          <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Checklist de Fabricación, Soldadura y Ensayos
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Marca cada etapa completada. Tu progreso se almacena automáticamente en este navegador.
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Progreso:</span>
                <span className="text-emerald-400 font-bold">
                  {Object.values(checkedSteps).filter(Boolean).length} / 6 pasos
                </span>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {[
                { id: 'step_1', title: '1. Verificación de Componentes y Multímetro en Continuidad', desc: 'Comprobar valores de resistencias y condensadores antes de soldar. Verificar ausencia de cortocircuito entre VCC y GND.' },
                { id: 'step_2', title: '2. Soldadura de Componentes Críticos y Alimentación', desc: 'Montar conectores, regulador de tensión LDO y condensadores de desacoplo de 100nF lo más cerca posible de los pines del integrado.' },
                { id: 'step_3', title: '3. Inspección Visual de Soldaduras SMD', desc: 'Revisar con lupa o microscopio que no existan puentes de estaño entre pines adyacentes ni juntas frías.' },
                { id: 'step_4', title: '4. Encendido Inicial Protegido (Current-Limited Supply)', desc: 'Energizar la placa con fuente regulable limitada a 100mA. Medir con polímetro que el riel de 3.3V/5V se encuentre dentro de tolerancia (±2%).' },
                { id: 'step_5', title: '5. Carga de Firmware Base y Test de Bus de Comunicación', desc: 'Flashear el firmware mínimo. Verificar respuesta por consola serie y detección del periférico en el bus I2C/SPI.' },
                { id: 'step_6', title: '6. Calibración en Banco y Ensayo de Carga Continuada', desc: 'Ejecutar el protocolo de calibración y someter el subsistema a una prueba de funcionamiento ininterrumpido durante 30 minutos sin sobrecalentamiento.' }
              ].map((step) => {
                const isChecked = !!checkedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleCheckStep(step.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-600/50 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      isChecked ? 'bg-emerald-500 text-slate-950' : 'border-2 border-slate-600 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className={`text-xs sm:text-sm font-bold transition-colors ${isChecked ? 'text-emerald-300 line-through opacity-80' : 'text-slate-100'}`}>
                        {step.title}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: Interview Questions & Recruiter Proof */}
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
