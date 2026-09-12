import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Layers, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Sparkles, 
  Boxes, 
  Code2, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal,
  Zap,
  Sliders,
  Download,
  Share2,
  Info,
  BookOpen,
  Wrench
} from 'lucide-react';
import ProjectBuildGuide from './ProjectBuildGuide';

export default function ProjectDetail({
  project,
  allProjects = [],
  guides = [],
  expandedGuide,
  onBack,
  onSelectProject,
  onSelectGuide
}) {
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation' | 'build' | 'expanded' | 'relations'
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBom, setCopiedBom] = useState(false);

  // Reset to the default tab whenever the viewed project changes, so a
  // 'expanded' tab left active doesn't render blank on a project with no
  // expandedGuide (or 'relations' on one with no related projects).
  React.useEffect(() => {
    setActiveTab('explanation');
  }, [project?.projectId]);

  // Parse sections from detailedExplanation
  const sections = useMemo(() => {
    if (!project?.detailedExplanation) return [];
    const de = project.detailedExplanation;
    return Object.keys(de)
      .map(key => de[key])
      .filter(s => s && typeof s === 'object' && s.title)
      .sort((a, b) => (a.sectionIndex || 0) - (b.sectionIndex || 0));
  }, [project?.detailedExplanation]);

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const expandAllSections = () => {
    const all = {};
    sections.forEach((_, idx) => { all[idx] = true; });
    setExpandedSections(all);
  };

  const collapseAllSections = () => {
    setExpandedSections({});
  };

  const copyProjectLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/project/${project?.slug || project?.projectId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyBOM = () => {
    const lines = (project?.bom || []).map(b => `${b.name}\t${b.specs || ''}\t${b.qty || '1'}\t${b.cost || ''}`);
    const tsv = `Componente\tEspecificación\tCantidad\tCoste\n` + lines.join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedBom(true);
    setTimeout(() => setCopiedBom(false), 2000);
  };

  const exportBOM_CSV = () => {
    const rows = [
      ['Componente', 'Especificacion', 'Cantidad', 'Coste Estimado'],
      ...(project?.bom || []).map(b => [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.specs || '').replace(/"/g, '""')}"`,
        `"${b.qty || 1}"`,
        `"${(b.cost || '').replace(/"/g, '""')}"`
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BOM_${project?.slug || 'project'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find related canonical projects if present
  const relatedProjects = useMemo(() => {
    if (!project || !allProjects.length) return [];
    // Show projects from same guide or same controller
    return allProjects
      .filter(p => p.projectId !== project.projectId && (
        p.guideId === project.guideId || 
        (project.technicalIdentity?.controller && p.technicalIdentity?.controller === project.technicalIdentity?.controller)
      ))
      .slice(0, 4);
  }, [project, allProjects]);

  // Construct officialData object to allow reusing ProjectBuildGuide if wanted
  const buildGuideProject = useMemo(() => {
    if (!project) return null;
    return {
      id: project.projectId,
      title: project.title,
      schematicSvg: project.schematicSvg,
      difficulty: project.difficulty,
      timeEstimate: project.timeEstimate,
      officialData: {
        bom: project.bom || [],
        firmware: project.firmwareCode ? {
          code: project.firmwareCode,
          language: project.firmwareLanguage || 'cpp',
          title: `Firmware ${project.title}`
        } : null,
        wiring: [],
        troubleshooting: [],
        checklist: []
      }
    };
  }, [project]);

  if (!project) return null;

  const techId = project.technicalIdentity || {};
  const desc = project.description || {};
  const prov = project.provenance || {};

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-white/[0.06] text-slate-300 transition-colors inline-flex items-center gap-1 text-[13px] font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[13px] text-slate-500 min-w-0">
              <span className="text-slate-700">/</span>
              <span className="text-slate-200 font-medium truncate max-w-[300px]">{project.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={copyProjectLink}
              className="px-3 py-1.5 rounded-full hover:bg-white/[0.06] text-slate-300 text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors"
              title="Copiar enlace permanente"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={() => onSelectGuide && onSelectGuide(project.guideId)}
              className="px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Ver guía origen</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-7">
          {/* Badges & Provenance Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
              <span className="text-slate-300 font-medium">Proyecto independiente</span>
              <span>·</span>
              <span>{project.projectId}</span>
              {project.difficulty && (
                <>
                  <span>·</span>
                  <span>{project.difficulty}</span>
                </>
              )}
              {project.timeEstimate && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {project.timeEstimate}
                  </span>
                </>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Trazable a PDF fuente · pág. {project.sourcePageRange || '1'}</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-[32px] sm:text-[38px] font-semibold text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-3xl leading-relaxed">
              Documentado originalmente en <span className="text-slate-200">{project.guideTitle}</span>. Extraído y estructurado bajo arquitectura Project-First sin pérdida de fidelidad.
            </p>
          </div>

          {/* Structured Answers Core: Qué es, Qué hace, Para qué sirve */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-900 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-[12px] font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>¿Qué es?</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {desc.whatIsIt || desc.summary || project.title}
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-[12px] font-medium">
                <Activity className="h-3.5 w-3.5" />
                <span>¿Qué hace?</span>
              </div>
              {desc.whatDoesItDo ? (
                <p className="text-[13px] text-slate-300 leading-relaxed">{desc.whatDoesItDo}</p>
              ) : (
                <p className="text-[13px] text-slate-500 italic leading-relaxed">
                  No documentado en la fuente original.
                </p>
              )}
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-[12px] font-medium">
                <Zap className="h-3.5 w-3.5" />
                <span>¿Para qué sirve?</span>
              </div>
              {(desc.whatIsItFor || desc.purpose) ? (
                <p className="text-[13px] text-slate-300 leading-relaxed">{desc.whatIsItFor || desc.purpose}</p>
              ) : (
                <p className="text-[13px] text-slate-500 italic leading-relaxed">
                  No documentado en la fuente original.
                </p>
              )}
            </div>
          </div>

          {/* Technical Identity Chips */}
          <div className="p-4 rounded-2xl bg-slate-900 space-y-3">
            <div className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" />
              <span>Identidad técnica</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[12px]">
              {techId.controller && (
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300">
                  <span className="opacity-60 mr-1">MCU</span>
                  <span className="font-medium">{techId.controller}</span>
                </div>
              )}
              {techId.function && (
                <div className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300">
                  <span className="opacity-60 mr-1">Función</span>
                  <span className="font-medium">{techId.function}</span>
                </div>
              )}
              {techId.architecture && (
                <div className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300">
                  <span className="opacity-60 mr-1">Arquitectura</span>
                  <span>{techId.architecture}</span>
                </div>
              )}
              {techId.sensors?.map((s, idx) => (
                <div key={idx} className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300">
                  <span className="opacity-60 mr-1">Sensor</span>
                  <span>{s}</span>
                </div>
              ))}
              {techId.actuators?.map((a, idx) => (
                <div key={idx} className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300">
                  <span className="opacity-60 mr-1">Actuador</span>
                  <span>{a}</span>
                </div>
              ))}
              {techId.communications?.map((c, idx) => (
                <div key={idx} className="px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300">
                  <span className="opacity-60 mr-1">Comms</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 py-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors inline-flex items-center gap-2 ${
                activeTab === 'explanation'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Secciones técnicas ({sections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('build')}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors inline-flex items-center gap-2 ${
                activeTab === 'build'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Esquemático, BOM & Firmware</span>
            </button>

            {expandedGuide && (
              <button
                onClick={() => setActiveTab('expanded')}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors inline-flex items-center gap-2 ${
                  activeTab === 'expanded'
                    ? 'bg-amber-500 text-black'
                    : 'text-amber-300/90 hover:text-amber-200'
                }`}
              >
                <span>Guía ampliada</span>
              </button>
            )}

            {relatedProjects.length > 0 && (
              <button
                onClick={() => setActiveTab('relations')}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors inline-flex items-center gap-2 ${
                  activeTab === 'relations'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Proyectos relacionados ({relatedProjects.length})</span>
              </button>
            )}
          </nav>

          {activeTab === 'explanation' && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={expandAllSections}
                className="px-3 py-1.5 rounded-full text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
              >
                Expandir todo
              </button>
              <button
                onClick={collapseAllSections}
                className="px-3 py-1.5 rounded-full text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
              >
                Colapsar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explanation' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900 flex items-start gap-3">
              <Info className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-slate-400 leading-relaxed">
                <span className="font-medium text-slate-200">Separación estricta: fuente vs. derivado. </span>
                Cada sección muestra únicamente el texto oficial extraído literalmente de la fuente documental original,
                con trazabilidad criptográfica SHA-256. Si no existe evidencia literal para una sección, se indica
                explícitamente en lugar de generar contenido de relleno.
              </div>
            </div>

            {sections.map((section, idx) => {
              const isExpanded = expandedSections[idx] ?? true; // expanded by default
              const sProv = section.provenance || {};

              return (
                <div
                  key={idx}
                  className="bg-slate-900 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-900/40 hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center font-medium text-[12px] text-slate-400">
                        {section.sectionIndex || idx + 1}
                      </span>
                      <h3 className="text-[14px] font-medium text-white">
                        {section.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {section.status === 'SOURCE' ? (
                        <span className="hidden sm:inline-block text-[11px] text-emerald-400">
                          Fuente PDF
                        </span>
                      ) : (
                        <span className="hidden sm:inline-block text-[11px] text-slate-500">
                          No documentado
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 space-y-3 border-t border-white/[0.06]">
                      {section.sourceText ? (
                        <div className="p-4 rounded-xl bg-emerald-500/[0.06] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-400">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Texto oficial de la fuente (inmutable)</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {sProv.source} · pág. {sProv.sourcePage || 1}
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {section.sourceText}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white/[0.03] space-y-1">
                          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                            <Info className="h-3.5 w-3.5" />
                            <span>Sin evidencia literal</span>
                          </div>
                          <p className="text-[13px] text-slate-500 italic leading-relaxed">
                            No se encontró texto literal en la fuente documental para esta sección. No se muestra contenido generado en su lugar.
                          </p>
                        </div>
                      )}

                      {/* Derived Explanation Box: only rendered when a real derivation exists */}
                      {section.derivedExplanation && (
                        <div className="p-4 rounded-xl bg-cyan-500/[0.06] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[12px] font-medium text-cyan-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Análisis técnico derivado</span>
                            </div>
                            {sProv.confidence && (
                              <span className="text-[11px] text-slate-500">
                                Confianza: {sProv.confidence}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {section.derivedExplanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'build' && (
          <div className="space-y-8">
            {/* BOM Section */}
            <div className="bg-slate-900 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-[17px] font-medium text-white flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-slate-400" />
                    <span>Lista de materiales (BOM)</span>
                  </h3>
                  <p className="text-[13px] text-slate-400 mt-0.5">
                    Componentes oficiales requeridos para el ensamblaje de este proyecto.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyBOM}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    {copiedBom ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copiar TSV</span>
                  </button>
                  <button
                    onClick={exportBOM_CSV}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {project.bom && project.bom.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Componente</th>
                        <th className="py-2.5 px-3">Especificación</th>
                        <th className="py-2.5 px-3">Cantidad</th>
                        <th className="py-2.5 px-3">Coste Estimado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {project.bom.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-300 font-mono">{item.specs || 'Estándar'}</td>
                          <td className="py-2.5 px-3 font-mono text-cyan-400">{item.qty || 1}</td>
                          <td className="py-2.5 px-3 text-slate-400">{item.cost || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No hay componentes BOM detallados para este proyecto en la fuente original.
                </div>
              )}
            </div>

            {/* Firmware Section */}
            {project.firmwareCode && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-cyan-400" />
                      <span>Firmware & Lógica de Control</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Lenguaje: <span className="font-mono text-cyan-400">{project.firmwareLanguage || 'cpp'}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => copyCode(project.firmwareCode)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copiar Código</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto max-h-[500px]">
                  <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                    <code>{project.firmwareCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Schematic SVG Section if present */}
            {project.schematicSvg && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  <span>Diagrama Esquemático Vectorial</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-center">
                  <img 
                    src={project.schematicSvg.startsWith('/') ? project.schematicSvg : `/${project.schematicSvg}`} 
                    alt={`Esquemático de ${project.title}`}
                    className="max-h-[500px] w-auto object-contain rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expanded' && expandedGuide && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-amber-300">Guía Ampliada — IA + investigación, NO literal del PDF. </span>
                Este contenido fue redactado a partir de conocimiento técnico general y verificación puntual de componentes reales,
                para dar una guía de construcción completa y accionable. No proviene de la fuente documental original ni ha sido
                verificado byte a byte como el resto de la ficha. Trátalo como una guía de referencia razonada, no como una
                transcripción oficial. Disponible actualmente solo para un piloto de 5 proyectos.
              </div>
            </div>

            {expandedGuide.summary && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">Resumen</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{expandedGuide.summary}</p>
                {expandedGuide.difficultyNotes && (
                  <p className="text-xs text-slate-400 italic pt-1">{expandedGuide.difficultyNotes}</p>
                )}
              </div>
            )}

            {expandedGuide.bom?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-amber-400" /> Lista de Materiales Detallada
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-800">
                        <th className="py-2 pr-3">Componente</th>
                        <th className="py-2 pr-3">Especificación</th>
                        <th className="py-2 pr-3">Cant.</th>
                        <th className="py-2 pr-3">Coste est.</th>
                        <th className="py-2">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedGuide.bom.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-900">
                          <td className="py-2.5 pr-3 text-slate-200 font-semibold">{item.name}</td>
                          <td className="py-2.5 pr-3 text-slate-400">{item.spec}</td>
                          <td className="py-2.5 pr-3 text-slate-300 font-mono">{item.qty}</td>
                          <td className="py-2.5 pr-3 text-emerald-400 font-mono">{item.estCost || '-'}</td>
                          <td className="py-2.5 text-slate-500">{item.notes || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {expandedGuide.wiring?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" /> Cableado y Conexiones
                </h3>
                <div className="space-y-2">
                  {expandedGuide.wiring.map((w, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="text-slate-200"><span className="text-cyan-400 font-mono">{w.from}</span> → <span className="text-cyan-400 font-mono">{w.to}</span></div>
                      {w.notes && <div className="text-slate-500 mt-1">{w.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedGuide.steps?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-400" /> Pasos de Construcción
                </h3>
                <div className="space-y-3">
                  {expandedGuide.steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-sm font-bold text-amber-300 mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedGuide.firmware && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-amber-400" /> Firmware Ilustrativo
                </h3>
                {expandedGuide.firmware.note && (
                  <p className="text-xs text-slate-500 italic">{expandedGuide.firmware.note}</p>
                )}
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto max-h-[400px]">
                  <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                    <code>{expandedGuide.firmware.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {expandedGuide.calibration?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" /> Calibración y Verificación
                </h3>
                <ul className="space-y-2">
                  {expandedGuide.calibration.map((c, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span><span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {expandedGuide.troubleshooting?.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Resolución de Problemas
                </h3>
                <div className="space-y-2">
                  {expandedGuide.troubleshooting.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <div className="text-red-300 font-semibold">Síntoma: {t.symptom}</div>
                      <div className="text-slate-400">Causa probable: {t.cause}</div>
                      <div className="text-emerald-300">Solución: {t.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedGuide.safety?.length > 0 && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Seguridad
                </h3>
                <ul className="space-y-1.5">
                  {expandedGuide.safety.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">
                Proyectos Relacionados o del Mismo Ecosistema
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Proyectos que comparten la misma guía de origen o arquitectura de microcontrolador.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedProjects.map((relProj) => (
                  <div 
                    key={relProj.projectId}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-700/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
                        <span>#{relProj.projectNumber}</span>
                        <span>{relProj.guideId}</span>
                      </div>
                      <h4 
                        onClick={() => onSelectProject(relProj.slug || relProj)}
                        className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                      >
                        {relProj.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {relProj.description?.whatDoesItDo || relProj.description?.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400">
                        {relProj.technicalIdentity?.controller || 'Hardware'}
                      </span>
                      <button
                        onClick={() => onSelectProject(relProj.slug || relProj)}
                        className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}