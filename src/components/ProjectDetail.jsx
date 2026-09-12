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
  FlaskConical,
  GitCompare,
  ShoppingCart,
  FileDown
} from 'lucide-react';
import ProjectBuildGuide from './ProjectBuildGuide';

export default function ProjectDetail({
  project,
  allProjects = [],
  guides = [],
  onBack,
  onSelectProject,
  onSelectGuide,
  onOpenInLab,
  onToggleCompare,
  isCompared = false,
  onAddBOMToCart
}) {
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation' | 'build' | 'relations'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBom, setCopiedBom] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

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

  const handleAddToCart = () => {
    if (onAddBOMToCart) {
      onAddBOMToCart(project);
      setAddedToCartToast(true);
      setTimeout(() => setAddedToCartToast(false), 2500);
    }
  };

  const exportMarkdown = () => {
    if (!project) return;
    let md = `# ${project.title}\n\n`;
    md += `> **ID de Proyecto**: \`${project.projectId}\` | **Guía Oficial Origen**: ${project.guideTitle} (\`${project.guideId}\`)\n`;
    md += `> **Microcontrolador**: ${techId.controller || 'Microcontrolador Dedicado'} | **Dificultad**: ${project.difficulty || 'Intermedio'} | **Tiempo Estimado**: ${project.timeEstimate || '2-4 horas'}\n\n`;
    
    md += `## 1. Resumen Ejecutivo\n\n`;
    md += `* **¿Qué es?**: ${desc.whatIsIt || ''}\n`;
    md += `* **¿Qué hace?**: ${desc.whatDoesItDo || ''}\n`;
    md += `* **¿Para qué sirve?**: ${desc.whatIsItFor || ''}\n\n`;

    md += `## 2. Lista de Materiales (BOM)\n\n`;
    md += `| Componente | Especificación | Cantidad | Coste Estimado |\n`;
    md += `| :--- | :--- | :---: | :---: |\n`;
    (project.bom || []).forEach(b => {
      const name = typeof b === 'string' ? b : b.name || 'Componente';
      const specs = b.specs || '-';
      const qty = b.qty || 1;
      const cost = b.cost || '-';
      md += `| ${name} | ${specs} | ${qty} | ${cost} |\n`;
    });
    md += `\n`;

    md += `## 3. Especificación Técnica Detallada\n\n`;
    sections.forEach(s => {
      md += `### ${s.title}\n\n${s.content}\n\n`;
    });

    if (project.firmwareCode) {
      md += `## 4. Código Firmware de Producción\n\n\`\`\`${project.firmwareLanguage || 'cpp'}\n${project.firmwareCode}\n\`\`\`\n\n`;
    }

    md += `---\n*Exportado automáticamente desde EngineeringGuides Hub - Plataforma de Ingeniería Aplicada*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.slug || project.projectId || 'proyecto'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col engineering-grid">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>Proyecto</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 font-mono font-bold">#{project.projectNumber}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-medium truncate max-w-[250px]">{project.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenInLab && (
              <button
                onClick={() => onOpenInLab(project)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
                title="Abrir este proyecto en el Laboratorio Virtual"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Probar en</span> Lab
              </button>
            )}

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(project)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 border transition-all ${
                  isCompared 
                    ? 'bg-cyan-950 border-cyan-700 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
                title={isCompared ? 'En el comparador' : 'Añadir al comparador'}
              >
                <GitCompare className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden md:inline">{isCompared ? 'En Comparador' : 'Comparar'}</span>
              </button>
            )}

            {onAddBOMToCart && (
              <button
                onClick={handleAddToCart}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                title="Añadir componentes a la cesta BOM"
              >
                <ShoppingCart className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden md:inline">{addedToCartToast ? '¡Añadido!' : 'Cesta BOM'}</span>
              </button>
            )}

            <button
              onClick={exportMarkdown}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              title="Descargar especificación completa en Markdown (.md)"
            >
              <FileDown className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Descargar MD</span>
            </button>

            <button
              onClick={copyProjectLink}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              title="Copiar enlace permanente"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Compartir'}</span>
            </button>

            <button
              onClick={() => onSelectGuide && onSelectGuide(project.guideId)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/50 hover:bg-cyan-900/80 text-cyan-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Guía Origen</span>
              <span className="font-mono text-[11px]">({project.guideId})</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Badges & Provenance Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/90 border border-cyan-700/60 text-cyan-300">
                PROYECTO TÉCNICO INDEPENDIENTE
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50">
                ID: {project.projectId}
              </span>
              {project.difficulty && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                  {project.difficulty}
                </span>
              )}
              {project.timeEstimate && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {project.timeEstimate}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Trazable a PDF Fuente (Pág. {project.sourcePageRange || '1'})</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-3xl">
              Documentado originalmente en <span className="text-cyan-400 font-medium">{project.guideTitle}</span>. 
              Extraído y estructurado bajo arquitectura Project-First sin pérdida de fidelidad.
            </p>
          </div>

          {/* Structured Answers Core: Qué es, Qué hace, Para qué sirve */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="glass-panel p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>1. ¿Qué es?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {desc.whatIsIt || desc.summary || 'Sistema embebido de ingeniería aplicada con procesamiento dedicado.'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-blue-900/40 bg-blue-950/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Activity className="h-4 w-4" />
                <span>2. ¿Qué hace?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {desc.whatDoesItDo || 'Adquiere variables físicas, aplica lógica de control en tiempo real y ejecuta actuadores.'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/10 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="h-4 w-4" />
                <span>3. ¿Para qué sirve?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {desc.whatIsItFor || desc.purpose || 'Despliegues industriales, telemetría remota, instrumentación y aplicaciones autónomas.'}
              </p>
            </div>
          </div>

          {/* Technical Identity Chips */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Identidad Técnica Canónica</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {techId.controller && (
                <div className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-700/50 text-cyan-300">
                  <span className="text-slate-400 mr-1">Microcontrolador:</span>
                  <span className="font-mono font-bold">{techId.controller}</span>
                </div>
              )}
              {techId.function && (
                <div className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-300">
                  <span className="text-slate-400 mr-1">Función:</span>
                  <span className="font-semibold">{techId.function}</span>
                </div>
              )}
              {techId.architecture && (
                <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300">
                  <span className="text-slate-400 mr-1">Arquitectura:</span>
                  <span>{techId.architecture}</span>
                </div>
              )}
              {techId.sensors?.map((s, idx) => (
                <div key={idx} className="px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-300">
                  <span className="text-slate-400 mr-1">Sensor:</span>
                  <span>{s}</span>
                </div>
              ))}
              {techId.actuators?.map((a, idx) => (
                <div key={idx} className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
                  <span className="text-slate-400 mr-1">Actuador:</span>
                  <span>{a}</span>
                </div>
              ))}
              {techId.communications?.map((c, idx) => (
                <div key={idx} className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-mono">
                  <span className="text-slate-400 mr-1">Comms:</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-2 py-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                activeTab === 'explanation'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>18 Secciones Técnicas ({sections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('build')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                activeTab === 'build'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Esquemático, BOM & Firmware</span>
            </button>

            {relatedProjects.length > 0 && (
              <button
                onClick={() => setActiveTab('relations')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                  activeTab === 'relations'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Proyectos Relacionados ({relatedProjects.length})</span>
              </button>
            )}
          </nav>

          {activeTab === 'explanation' && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={expandAllSections}
                className="px-3 py-1 rounded-lg text-xs text-cyan-400 hover:bg-cyan-950/40 border border-cyan-800/40 transition-colors"
              >
                Expandir Todo
              </button>
              <button
                onClick={collapseAllSections}
                className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:bg-slate-900 border border-slate-800 transition-colors"
              >
                Colapsar Todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explanation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Separación Estricta: Fuente vs Derivado. </span>
                Cada sección presenta claramente el texto oficial extraído directamente de la fuente documental original
                y el desglose técnico complementario derivado. Ambas partes cuentan con trazabilidad criptográfica SHA-256.
              </div>
            </div>

            {sections.map((section, idx) => {
              const isExpanded = expandedSections[idx] ?? true; // expanded by default
              const sProv = section.provenance || {};

              return (
                <div 
                  key={idx}
                  className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-900/40 hover:bg-slate-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/50 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                        {section.sectionIndex || idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {section.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        Fuente PDF
                      </span>
                      <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                        Derivado
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 space-y-4 border-t border-slate-800/80">
                      {/* Source Text Box */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Texto Oficial de la Fuente (Inmutable)</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-500/80">
                            {sProv.source} • Pág. {sProv.sourcePage || 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {section.sourceText || 'No se registraron declaraciones literales en esta sección para este proyecto.'}
                        </p>
                      </div>

                      {/* Derived Explanation Box */}
                      <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/30 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                            <Sparkles className="h-4 w-4" />
                            <span>Análisis Técnico Derivado</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            Confianza: {sProv.confidence || 'EXACT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {section.derivedExplanation || 'Análisis técnico consolidado.'}
                        </p>
                      </div>
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
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Boxes className="h-5 w-5 text-cyan-400" />
                    <span>Lista de Materiales (BOM)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
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