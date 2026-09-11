import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const GUIDES_DIR = path.join(REPO_ROOT, 'Engineering guides');
const OUTPUT_FILE = path.join(REPO_ROOT, 'public', 'guides.json');

const CATEGORIES = [
  {
    id: 'aerospace',
    name: 'Aerospace & Satellites',
    icon: 'Rocket',
    color: 'from-cyan-500 to-blue-600',
    keywords: ['satellite', 'space', 'sky', 'eavesdrop']
  },
  {
    id: 'robotics-drones',
    name: 'Robotics & Drones',
    icon: 'Bot',
    color: 'from-amber-500 to-orange-600',
    keywords: ['drone', 'drones', 'precision', 'move with precision', 'ohmie']
  },
  {
    id: 'cs-ai',
    name: 'CS, AI & Machine Learning',
    icon: 'Cpu',
    color: 'from-purple-500 to-indigo-600',
    keywords: ['cs', 'ai', 'ml', 'think for themselves', 'embodiment', 'machine learning']
  },
  {
    id: 'electronics',
    name: 'Electronics & Hardware',
    icon: 'Zap',
    color: 'from-yellow-500 to-amber-600',
    keywords: ['electronics', 'learn-electronics', 'glow-up', 'radio', 'light', 'read the body', 'invisible', 'survive']
  },
  {
    id: 'career',
    name: 'Career & Portfolio',
    icon: 'Briefcase',
    color: 'from-emerald-500 to-teal-600',
    keywords: ['portfolio', 'recruiter', 'overeducated', 'guide engineers', 'follow']
  },
  {
    id: 'ee-general',
    name: 'Electrical Engineering',
    icon: 'Compass',
    color: 'from-blue-500 to-indigo-600',
    keywords: ['ee', 'engineering']
  }
];

function formatSize(numBytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = numBytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return unitIndex === 0 ? `${size} B` : `${size.toFixed(1)} ${units[unitIndex]}`;
}

function cleanTitle(filename) {
  let name = path.basename(filename, path.extname(filename));
  
  const partMatch = name.match(/^\((PART\s*\d+)\)\s*(.*)$/i);
  let partSuffix = '';
  if (partMatch) {
    partSuffix = ` (${partMatch[1].replace(/part/i, 'Part')})`;
    name = partMatch[2];
  }
  
  name = name.replace(/[_]/g, ' ').replace(/[-]/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  
  const lowercaseWords = new Set(['that', 'for', 'the', 'a', 'an', 'and', 'in', 'on', 'with', 'from', 'to', 'at', 'of']);
  const words = name.split(' ');
  const capitalized = words.map((w, i) => {
    const upper = w.toUpperCase();
    if (['EE', 'CS', 'AI', 'ML', 'ME', 'PART2'].includes(upper)) {
      return upper;
    }
    if (i === 0 || !lowercaseWords.has(w.toLowerCase())) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }
    return w.toLowerCase();
  });
  
  return capitalized.join(' ') + partSuffix;
}

function detectCategory(filename, title) {
  const text = `${filename} ${title}`.toLowerCase();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (text.includes(kw)) {
        return cat.id;
      }
    }
  }
  return 'ee-general';
}

function generateTags(filename, title, categoryId) {
  const tags = new Set();
  const text = `${filename} ${title}`.toLowerCase();
  
  if (text.includes('satellite') || text.includes('space')) {
    tags.add('Satellites');
    tags.add('Aerospace');
  }
  if (text.includes('drone')) {
    tags.add('Drones');
    tags.add('UAV');
  }
  if (text.includes('precision') || text.includes('move')) {
    tags.add('Motion Control');
    tags.add('Motors');
  }
  if (text.includes('radio') || text.includes('rf')) {
    tags.add('RF & SDR');
    tags.add('Wireless');
  }
  if (text.includes('light') || text.includes('optics')) {
    tags.add('Photonics');
    tags.add('Optics');
  }
  if (text.includes('body') || text.includes('bio')) {
    tags.add('Bioelectronics');
    tags.add('Sensors');
  }
  if (text.includes('invisible')) {
    tags.add('Sensors');
    tags.add('Radar/IR');
  }
  if (text.includes('ai') || text.includes('embodiment') || text.includes('ml')) {
    tags.add('Embedded AI');
    tags.add('Machine Learning');
  }
  if (text.includes('portfolio')) {
    tags.add('Portfolio');
    tags.add('Career');
  }
  if (text.includes('defense')) {
    tags.add('Defense Tech');
  }
  if (text.includes('electronics') || text.includes('glow up')) {
    tags.add('Fundamentals');
    tags.add('Circuits');
  }
  if (text.includes('ohmie')) {
    tags.add('Robotics');
    tags.add('DIY Build');
  }
  if (text.includes('cs')) {
    tags.add('Software');
  }
  
  if (tags.size === 0) {
    tags.add('Engineering');
  }
  
  return Array.from(tags).sort();
}

export function buildCatalog() {
  if (!fs.existsSync(GUIDES_DIR)) {
    console.error(`Error: Directory not found: ${GUIDES_DIR}`);
    return;
  }
  
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const files = fs.readdirSync(GUIDES_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .sort();
    
  let totalSizeBytes = 0;
  const guides = files.map((filename, index) => {
    const filePath = path.join(GUIDES_DIR, filename);
    const stat = fs.statSync(filePath);
    const title = cleanTitle(filename);
    const categoryId = detectCategory(filename, title);
    const tags = generateTags(filename, title, categoryId);
    
    totalSizeBytes += stat.size;
    
    return {
      id: `guide-${String(index + 1).padStart(3, '0')}`,
      filename,
      title,
      relativePath: `Engineering guides/${filename}`,
      sizeBytes: stat.size,
      sizeFormatted: formatSize(stat.size),
      categoryId,
      tags,
      lastModified: stat.mtime.toISOString()
    };
  });
  
  const result = {
    generatedAt: new Date().toISOString(),
    totalGuides: guides.length,
    totalSizeBytes,
    totalSizeFormatted: formatSize(totalSizeBytes),
    categories: CATEGORIES,
    guides
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Catalog successfully generated at ${OUTPUT_FILE}`);
  console.log(`Total guides indexed: ${guides.length}`);
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildCatalog();
}
