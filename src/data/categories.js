export const CATEGORY_DEFINITIONS = [
  {
    id: 'all',
    name: 'Todas las Guías',
    icon: 'Layers',
    color: 'from-blue-500 to-indigo-600',
    description: 'Catálogo completo de proyectos y documentos técnicos'
  },
  {
    id: 'aerospace',
    name: 'Aeroespacial & Satélites',
    icon: 'Rocket',
    color: 'from-cyan-500 to-blue-600',
    description: 'CubeSats, enlace de radio, RF espacial y telemetría'
  },
  {
    id: 'robotics-drones',
    name: 'Drones & Robótica',
    icon: 'Bot',
    color: 'from-amber-500 to-orange-600',
    description: 'UAVs, cinemática, actuadores y robótica de campo'
  },
  {
    id: 'cs-ai',
    name: 'IA, ML & Computación',
    icon: 'Cpu',
    color: 'from-purple-500 to-indigo-600',
    description: 'Sistemas inteligentes, visión por computador y edge AI'
  },
  {
    id: 'electronics',
    name: 'Hardware & Electrónica',
    icon: 'Zap',
    color: 'from-yellow-500 to-amber-600',
    description: 'Diseño PCB, sensores, RF, señales y circuitos analógicos'
  },
  {
    id: 'career',
    name: 'Carrera & Portafolio',
    icon: 'Briefcase',
    color: 'from-emerald-500 to-teal-600',
    description: 'Estrategias de portafolio para recruiters e ingeniería top tier'
  },
  {
    id: 'ee-general',
    name: 'Ingeniería General & EE',
    icon: 'Compass',
    color: 'from-slate-500 to-slate-700',
    description: 'Proyectos multidisciplinares y guías fundamentales'
  }
];

export const SORT_OPTIONS = [
  { id: 'name-asc', label: 'Nombre (A - Z)' },
  { id: 'name-desc', label: 'Nombre (Z - A)' },
  { id: 'size-desc', label: 'Tamaño (Mayor a Menor)' },
  { id: 'size-asc', label: 'Tamaño (Menor a Mayor)' },
  { id: 'recent', label: 'Más recientes' }
];
