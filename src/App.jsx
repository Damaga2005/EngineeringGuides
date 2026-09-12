import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchAndFilter from './components/SearchAndFilter';
import GuideCard from './components/GuideCard';
import GuideModal from './components/GuideModal';
import StatsModal from './components/StatsModal';
import GuideLanding from './components/GuideLanding';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ErrorBoundary from './components/ErrorBoundary';
import { CATEGORY_DEFINITIONS } from './data/categories';
import { getStoredItem, setStoredItem } from './utils/storage';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  RefreshCw,
  Boxes,
  Cpu,
  Layers,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function App() {
  const [guides, setGuides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expandedGuides, setExpandedGuides] = useState({});
  const [catalogMetadata, setCatalogMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Main View Toggle: 'projects' (Project-First) | 'guides' (Documentary)
  const [mainView, setMainView] = useState(() => {
    return getStoredItem('eng_guides_main_view', 'projects');
  });

  // Routing via Hash
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash || '';
  });

  // Filter and Sort states for Guides
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState(() => {
    return getStoredItem('eng_guides_view_mode', 'grid');
  });

  // Filter states for Projects
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [selectedController, setSelectedController] = useState('all');
  const [selectedFunction, setSelectedFunction] = useState('all');

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    return getStoredItem('eng_guides_favorites', []);
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Modals
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Live Sync status
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // Listen to hash change for browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load guides and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        
        // Fetch guides.json
        const guidesRes = await fetch(`${baseUrl}guides.json?t=${Date.now()}`);
        if (!guidesRes.ok) throw new Error('No se pudo cargar el catálogo de guías.');
        const guidesData = await guidesRes.json();
        setGuides(guidesData.guides || []);
        setCatalogMetadata(guidesData);

        // Fetch projects.json
        try {
          const projectsRes = await fetch(`${baseUrl}projects.json?t=${Date.now()}`);
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setProjects(projectsData.projects || []);
          }
        } catch (projErr) {
          console.warn('Could not load projects.json:', projErr);
        }

        // Fetch expanded_guides.json (optional, pilot-only AI-authored extended guides)
        try {
          const expandedRes = await fetch(`${baseUrl}expanded_guides.json?t=${Date.now()}`);
          if (expandedRes.ok) {
            const expandedData = await expandedRes.json();
            setExpandedGuides(expandedData.guides || {});
          }
        } catch (expErr) {
          console.warn('Could not load expanded_guides.json:', expErr);
        }

      } catch (err) {
        console.error('Error cargando catálogo:', err);
        setError('Error al cargar la biblioteca de ingeniería. Por favor refresca la página.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save mainView
  useEffect(() => {
    setStoredItem('eng_guides_main_view', mainView);
  }, [mainView]);

  // Save viewMode
  useEffect(() => {
    setStoredItem('eng_guides_view_mode', viewMode);
  }, [viewMode]);

  // Save favorites
  useEffect(() => {
    setStoredItem('eng_guides_favorites', favorites);
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (guideId) => {
    setFavorites(prev => 
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  // Determine route type
  const isLandingRoute = currentRoute.startsWith('#/guide/');
  const isProjectRoute = currentRoute.startsWith('#/project/') || currentRoute.startsWith('#/projects/');

  // Guide landing route resolution
  const currentGuideId = useMemo(() => {
    if (!isLandingRoute) return null;
    const cleanHash = currentRoute.replace(/^#\/guide\/?/, '').replace(/\/$/, '').trim();
    try {
      return decodeURIComponent(cleanHash);
    } catch {
      return cleanHash;
    }
  }, [currentRoute, isLandingRoute]);

  const activeLandingGuide = useMemo(() => {
    if (!currentGuideId || !guides.length) return null;
    return guides.find(g => g.id === currentGuideId || g.filename === currentGuideId) || null;
  }, [currentGuideId, guides]);

  // Project detail route resolution
  const currentProjectSlug = useMemo(() => {
    if (!isProjectRoute) return null;
    const cleanHash = currentRoute.replace(/^#\/projects?\/?/, '').replace(/\/$/, '').trim();
    try {
      return decodeURIComponent(cleanHash);
    } catch {
      return cleanHash;
    }
  }, [currentRoute, isProjectRoute]);

  const activeLandingProject = useMemo(() => {
    if (!currentProjectSlug || !projects.length) return null;
    return projects.find(p => p.slug === currentProjectSlug || p.projectId === currentProjectSlug) || null;
  }, [currentProjectSlug, projects]);

  const navigateToLanding = (guideOrId) => {
    if (!guideOrId) return;
    const id = typeof guideOrId === 'object' ? guideOrId.id : guideOrId;
    window.location.hash = `#/guide/${id}`;
  };

  const navigateToProject = (projectOrSlug) => {
    if (!projectOrSlug) return;
    const slug = typeof projectOrSlug === 'object' ? (projectOrSlug.slug || projectOrSlug.projectId) : projectOrSlug;
    window.location.hash = `#/project/${slug}`;
  };

  const navigateToCatalog = () => {
    window.location.hash = '';
  };

  // Live Sync / Catalog reload
  const handleLiveSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
      const [gRes, pRes] = await Promise.all([
        fetch(`${baseUrl}guides.json?t=${Date.now()}`),
        fetch(`${baseUrl}projects.json?t=${Date.now()}`)
      ]);
      if (gRes.ok) {
        const gData = await gRes.json();
        setGuides(gData.guides || []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData.projects || []);
      }
      setSyncMessage({
        type: 'success',
        text: `Catálogo sincronizado exitosamente (${guides.length} guías y ${projects.length} proyectos verificados).`
      });
    } catch (err) {
      console.warn('Catalog reload fallback:', err);
      setSyncMessage({
        type: 'warning',
        text: 'No se pudo recargar el catálogo estático. El catálogo local actual sigue activo.'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // Filter & Sort for Guides
  const filteredAndSortedGuides = useMemo(() => {
    let result = [...guides];

    if (showOnlyFavorites) {
      result = result.filter(g => favorites.includes(g.id));
    }

    if (selectedCategory !== 'all') {
      result = result.filter(g => g.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(g => {
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchFilename = g.filename.toLowerCase().includes(q);
        const matchSubtitle = g.subtitle && g.subtitle.toLowerCase().includes(q);
        const matchSummary = g.summary && g.summary.toLowerCase().includes(q);
        const matchTags = g.tags && g.tags.some(t => t.toLowerCase().includes(q));
        const matchTech = g.technologies && g.technologies.some(t => t.toLowerCase().includes(q));
        const matchKeyPoints = g.keyPoints && g.keyPoints.some(p => p.toLowerCase().includes(q));
        return matchTitle || matchFilename || matchSubtitle || matchSummary || matchTags || matchTech || matchKeyPoints;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'size-desc') return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      if (sortBy === 'size-asc') return (a.sizeBytes || 0) - (b.sizeBytes || 0);
      if (sortBy === 'recent') return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
      return 0;
    });

    return result;
  }, [guides, showOnlyFavorites, favorites, selectedCategory, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts = { all: guides.length };
    CATEGORY_DEFINITIONS.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = guides.filter(g => g.categoryId === cat.id).length;
      }
    });
    return counts;
  }, [guides]);

  // Unique Controllers list for Project Filter
  const availableControllers = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      const c = p.technicalIdentity?.controller || p.technicalIdentity?.controllerFamily;
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filter & Sort for Projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (showOnlyFavorites) {
      result = result.filter(p => favorites.includes(p.projectId));
    }

    if (selectedController !== 'all') {
      result = result.filter(p => {
        const c = p.technicalIdentity?.controller || p.technicalIdentity?.controllerFamily;
        return c === selectedController;
      });
    }

    if (projectSearchQuery.trim()) {
      const q = projectSearchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchSlug = (p.slug || '').toLowerCase().includes(q);
        const matchGuide = (p.guideTitle || '').toLowerCase().includes(q);
        const matchDesc = (p.description?.whatDoesItDo || p.description?.summary || '').toLowerCase().includes(q);
        const matchTech = (p.technicalIdentity?.majorComponents || []).some(c => c.toLowerCase().includes(q));
        const matchSensors = (p.technicalIdentity?.sensors || []).some(s => s.toLowerCase().includes(q));
        const matchController = (p.technicalIdentity?.controller || '').toLowerCase().includes(q);
        return matchTitle || matchSlug || matchGuide || matchDesc || matchTech || matchSensors || matchController;
      });
    }

    return result;
  }, [projects, selectedController, projectSearchQuery, showOnlyFavorites, favorites]);

  // If on a Project Detail route (#/project/:slug)
  if (isProjectRoute) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-700/50 flex items-center justify-center mx-auto text-cyan-400">
              <RefreshCw className="h-7 w-7 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white">Cargando Ficha Técnica...</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cargando las secciones técnicas, trazabilidad documental y BOM.
            </p>
          </div>
        </div>
      );
    }

    if (!activeLandingProject) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-amber-900/50 bg-amber-950/10 text-center max-w-md w-full space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Proyecto no encontrado</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                El identificador <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">{currentProjectSlug}</code> no corresponde a ningún proyecto registrado.
              </p>
            </div>
            <button
              onClick={navigateToCatalog}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/30 inline-flex items-center gap-2"
            >
              <span>Volver al Catálogo</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <ProjectDetail
          project={activeLandingProject}
          allProjects={projects}
          guides={guides}
          expandedGuide={expandedGuides[activeLandingProject.projectId]}
          onBack={navigateToCatalog}
          onSelectProject={navigateToProject}
          onSelectGuide={navigateToLanding}
        />
      </ErrorBoundary>
    );
  }

  // If on a Guide Landing route (#/guide/:id)
  if (isLandingRoute) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-700/50 flex items-center justify-center mx-auto text-cyan-400">
              <RefreshCw className="h-7 w-7 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white">Cargando Guía de Ingeniería...</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cargando esquemáticos vectoriales, proyectos prácticos y manuales de construcción paso a paso.
            </p>
          </div>
        </div>
      );
    }

    if (!activeLandingGuide) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-amber-900/50 bg-amber-950/10 text-center max-w-md w-full space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Guía no encontrada</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                El identificador <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono">{currentGuideId}</code> no corresponde a ningún documento de la biblioteca.
              </p>
            </div>
            <button
              onClick={navigateToCatalog}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/30 inline-flex items-center gap-2"
            >
              <span>Volver a la Biblioteca</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <GuideLanding
          guide={activeLandingGuide}
          allGuides={guides}
          onBack={navigateToCatalog}
          onSelectGuide={navigateToLanding}
          isFavorite={favorites.includes(activeLandingGuide.id)}
          onToggleFavorite={toggleFavorite}
        />
      </ErrorBoundary>
    );
  }

  // Catalog View (Home)
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#0B0F19] engineering-grid">
      
      {/* Navigation Bar */}
      <Navbar
        totalGuides={guides.length}
        totalSize={catalogMetadata?.totalSizeFormatted || '25.8 MB'}
        isSyncing={isSyncing}
        onSync={handleLiveSync}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        onOpenStats={() => setShowStatsModal(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sync Notification Banner */}
        {syncMessage && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
            syncMessage.type === 'success' 
              ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-200' 
              : syncMessage.type === 'warning'
              ? 'bg-amber-950/70 border-amber-700/60 text-amber-200'
              : 'bg-cyan-950/70 border-cyan-700/60 text-cyan-200'
          }`}>
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            )}
            <span className="flex-1">{syncMessage.text}</span>
            <button 
              onClick={() => setSyncMessage(null)}
              className="text-xs underline hover:opacity-80"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Hero Header with View Mode Switcher */}
        <div className="mb-8 border-b border-slate-800 pb-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Arquitectura Project-First & Trazabilidad
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Engineering <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Hub</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Plataforma técnica de ingeniería aplicada. Explora proyectos independientes con fichas de secciones técnicas o accede a las guías documentales completas.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-end flex-shrink-0 font-mono text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-cyan-400 font-bold">{projects.length || 183}</span> Proyectos
              </div>
              <span>•</span>
              <div>
                <span className="text-indigo-400 font-bold">{guides.length}</span> Guías
              </div>
              <span>•</span>
              <div>
                <span className="text-emerald-400 font-bold">{catalogMetadata?.totalSizeFormatted || '25.8 MB'}</span> PDF
              </div>
            </div>
          </div>

          {/* Primary View Switcher Tabs: Proyectos vs Guías */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 max-w-md">
            <button
              onClick={() => setMainView('projects')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mainView === 'projects'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Vista Proyectos ({projects.length || 183})</span>
            </button>

            <button
              onClick={() => setMainView('guides')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mainView === 'guides'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Vista Guías ({guides.length})</span>
            </button>
          </div>
        </div>

        {/* View 1: Project-First Catalog */}
        {mainView === 'projects' && (
          <div className="space-y-6">
            {/* Project Filters Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="Buscar proyectos por nombre, MCU (ESP32, STM32...), sensor o función..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {projectSearchQuery && (
                  <button
                    onClick={() => setProjectSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Controller Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
                  <span>MCU:</span>
                  <select
                    value={selectedController}
                    onChange={(e) => setSelectedController(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">Todos ({projects.length})</option>
                    {availableControllers.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${viewMode === 'grid' ? 'bg-cyan-600/30 text-cyan-300' : 'text-slate-400'}`}
                  >
                    Cuadrícula
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${viewMode === 'list' ? 'bg-cyan-600/30 text-cyan-300' : 'text-slate-400'}`}
                  >
                    Lista
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
              <span>Mostrando {filteredProjects.length} de {projects.length} proyectos técnicos</span>
              {(projectSearchQuery || selectedController !== 'all' || showOnlyFavorites) && (
                <button
                  onClick={() => {
                    setProjectSearchQuery('');
                    setSelectedController('all');
                    setShowOnlyFavorites(false);
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Projects Grid / List */}
            {filteredProjects.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto glass-panel p-8 rounded-2xl border border-slate-800">
                <Boxes className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 mb-1">
                  {showOnlyFavorites ? 'Aún no tienes favoritos' : 'No se encontraron proyectos'}
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  {showOnlyFavorites
                    ? 'Pulsa el icono de marcador en cualquier tarjeta de proyecto para guardarlo aquí.'
                    : 'No hay proyectos que coincidan con los criterios de búsqueda actuales.'}
                </p>
                <button
                  onClick={() => {
                    setProjectSearchQuery('');
                    setSelectedController('all');
                    setShowOnlyFavorites(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs font-semibold transition-all"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(proj => (
                  <ProjectCard
                    key={proj.projectId}
                    project={proj}
                    viewMode="grid"
                    onSelectProject={navigateToProject}
                    onSelectGuide={navigateToLanding}
                    isFavorite={favorites.includes(proj.projectId)}
                    onToggleFavorite={toggleFavorite}
                    hasExpandedGuide={Boolean(expandedGuides[proj.projectId])}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map(proj => (
                  <ProjectCard
                    key={proj.projectId}
                    project={proj}
                    viewMode="list"
                    onSelectProject={navigateToProject}
                    onSelectGuide={navigateToLanding}
                    isFavorite={favorites.includes(proj.projectId)}
                    onToggleFavorite={toggleFavorite}
                    hasExpandedGuide={Boolean(expandedGuides[proj.projectId])}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Documentary Guides Catalog */}
        {mainView === 'guides' && (
          <div className="space-y-6">
            {/* Search, Filter & Sort Controls */}
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              categoryCounts={categoryCounts}
              totalResults={filteredAndSortedGuides.length}
            />

            {/* Guide Cards Content */}
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Cargando biblioteca de guías...</p>
              </div>
            ) : error ? (
              <div className="py-16 text-center max-w-md mx-auto p-6 rounded-2xl bg-red-950/30 border border-red-800/50">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                <h3 className="font-bold text-red-200 mb-1">Error de carga</h3>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            ) : filteredAndSortedGuides.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto glass-panel p-8 rounded-2xl border border-slate-800">
                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 mb-1">
                  No se encontraron guías
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  {showOnlyFavorites 
                    ? 'No tienes guías marcadas como favoritas todavía.' 
                    : 'No hay documentos que coincidan con los criterios de búsqueda o categoría seleccionados.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setShowOnlyFavorites(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs font-semibold transition-all"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedGuides.map(guide => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    viewMode="grid"
                    isFavorite={favorites.includes(guide.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenModal={setActiveGuideModal}
                    onOpenLanding={navigateToLanding}
                    onTagClick={(tag) => setSearchQuery(tag)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedGuides.map(guide => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    viewMode="list"
                    isFavorite={favorites.includes(guide.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenModal={setActiveGuideModal}
                    onOpenLanding={navigateToLanding}
                    onTagClick={(tag) => setSearchQuery(tag)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 bg-slate-950/60 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Engineering Guides Hub • 183 Proyectos Técnicos Independientes & 31 Guías Oficiales
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://github.com/Damaga2005/EngineeringGuides"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Repositorio GitHub
            </a>
            <span>•</span>
            <button 
              onClick={() => setShowStatsModal(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Métricas & Info
            </button>
          </div>
        </div>
      </footer>

      {/* Quick PDF Viewer Modal */}
      {activeGuideModal && (
        <GuideModal
          guide={activeGuideModal}
          onClose={() => setActiveGuideModal(null)}
        />
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <StatsModal
          guides={guides}
          totalSize={catalogMetadata?.totalSizeFormatted || '25.8 MB'}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      </div>
    </ErrorBoundary>
  );
}