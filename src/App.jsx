import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchAndFilter from './components/SearchAndFilter';
import GuideCard from './components/GuideCard';
import GuideModal from './components/GuideModal';
import StatsModal from './components/StatsModal';
import { CATEGORY_DEFINITIONS } from './data/categories';
import { 
  Cpu, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';

export default function App() {
  const [guides, setGuides] = useState([]);
  const [catalogMetadata, setCatalogMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('eng_guides_view_mode') || 'grid';
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('eng_guides_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Modals
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Live Sync status
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // Load catalog on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const res = await fetch(`${baseUrl}guides.json?t=${Date.now()}`);
        if (!res.ok) throw new Error('No se pudo cargar el catálogo de guías.');
        const data = await res.json();
        setGuides(data.guides || []);
        setCatalogMetadata(data);
      } catch (err) {
        console.error('Error cargando guides.json:', err);
        setError('Error al cargar la biblioteca de guías. Por favor refresca la página.');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Save viewMode
  useEffect(() => {
    localStorage.setItem('eng_guides_view_mode', viewMode);
  }, [viewMode]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('eng_guides_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (guideId) => {
    setFavorites(prev => 
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  // Live Sync with GitHub API
  const handleLiveSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const response = await fetch('https://api.github.com/repos/Damaga2005/EngineeringGuides/contents/Engineering%20guides');
      if (!response.ok) {
        throw new Error(`GitHub API HTTP ${response.status}`);
      }
      const remoteFiles = await response.json();
      const pdfFiles = remoteFiles.filter(item => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'));

      // Check for any newly added files not yet in guides
      const currentFilenames = new Set(guides.map(g => g.filename));
      const newlyDiscovered = [];

      pdfFiles.forEach((rf, idx) => {
        if (!currentFilenames.has(rf.name)) {
          // Format title and tags
          const cleanName = rf.name.replace(/\.pdf$/i, '').replace(/[_]/g, ' ').trim();
          newlyDiscovered.push({
            id: `guide-remote-${Date.now()}-${idx}`,
            filename: rf.name,
            title: cleanName,
            relativePath: `Engineering guides/${rf.name}`,
            sizeBytes: rf.size,
            sizeFormatted: `${(rf.size / (1024 * 1024)).toFixed(1)} MB`,
            categoryId: detectCategoryFromText(rf.name),
            tags: ['LiveSync', 'Nuevo'],
            lastModified: new Date().toISOString(),
            isNew: true
          });
        }
      });

      if (newlyDiscovered.length > 0) {
        setGuides(prev => [...newlyDiscovered, ...prev]);
        setSyncMessage({
          type: 'success',
          text: `¡Sincronizado con éxito! Se detectaron ${newlyDiscovered.length} nuevas guías directamente de GitHub.`
        });
      } else {
        setSyncMessage({
          type: 'info',
          text: 'El catálogo ya se encuentra 100% actualizado con la última versión de GitHub.'
        });
      }
    } catch (err) {
      console.warn('GitHub Live Sync fallback:', err);
      setSyncMessage({
        type: 'warning',
        text: 'No se pudo conectar directamente a la API de GitHub (límite de peticiones anónimas alcanzado). El catálogo local sigue disponible.'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  // Helper for live sync detection
  const detectCategoryFromText = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('satellite') || lower.includes('space') || lower.includes('sky')) return 'aerospace';
    if (lower.includes('drone') || lower.includes('precision') || lower.includes('ohmie')) return 'robotics-drones';
    if (lower.includes('cs') || lower.includes('ai') || lower.includes('ml')) return 'cs-ai';
    if (lower.includes('electronics') || lower.includes('radio') || lower.includes('body')) return 'electronics';
    if (lower.includes('portfolio') || lower.includes('recruiter')) return 'career';
    return 'ee-general';
  };

  // Filter & Sort computation
  const filteredAndSortedGuides = useMemo(() => {
    let result = [...guides];

    // Favorites only
    if (showOnlyFavorites) {
      result = result.filter(g => favorites.includes(g.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(g => g.categoryId === selectedCategory);
    }

    // Search query filter
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

    // Sorting
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

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: guides.length };
    CATEGORY_DEFINITIONS.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = guides.filter(g => g.categoryId === cat.id).length;
      }
    });
    return counts;
  }, [guides]);

  return (
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

        {/* Hero Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Ingeniería Aplicada & Hardware
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Biblioteca de <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Guías & Proyectos</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Explora, lee online o descarga guías prácticas de nivel avanzado: Electrónica de potencia, radiofrecuencia, robótica de drones, satélites y portafolio técnico.
            </p>
          </div>

          <div className="flex items-center gap-3 self-center sm:self-end flex-shrink-0 font-mono text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-cyan-400 font-bold">{guides.length}</span> Guías Activas
            </div>
            <span>•</span>
            <div>
              <span className="text-emerald-400 font-bold">{catalogMetadata?.totalSizeFormatted || '25.8 MB'}</span> Almacenamiento
            </div>
          </div>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                viewMode="grid"
                isFavorite={favorites.includes(guide.id)}
                onToggleFavorite={toggleFavorite}
                onOpenModal={setActiveGuideModal}
                onTagClick={(tag) => setSearchQuery(tag)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                viewMode="list"
                isFavorite={favorites.includes(guide.id)}
                onToggleFavorite={toggleFavorite}
                onOpenModal={setActiveGuideModal}
                onTagClick={(tag) => setSearchQuery(tag)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 bg-slate-950/60 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Engineering Guides Hub • Actualización automática mediante GitHub Actions y Google Drive
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

      {/* PDF Viewer Modal */}
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
  );
}
