import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(REPO_ROOT, 'Engineering guides');
const DEST_DIR = path.join(REPO_ROOT, 'dist', 'Engineering guides');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log('Copying PDF guides to dist folder...');
copyFolderSync(SRC_DIR, DEST_DIR);
console.log('PDF guides successfully copied to dist/Engineering guides');

const PROJECTS_SRC = path.join(REPO_ROOT, 'public', 'projects');
const PROJECTS_DEST = path.join(REPO_ROOT, 'dist', 'projects');
if (fs.existsSync(PROJECTS_SRC)) {
  console.log('Ensuring projects blueprint images are in dist...');
  copyFolderSync(PROJECTS_SRC, PROJECTS_DEST);
}

const SCHEMATICS_SRC = path.join(REPO_ROOT, 'public', 'schematics');
const SCHEMATICS_DEST = path.join(REPO_ROOT, 'dist', 'schematics');
if (fs.existsSync(SCHEMATICS_SRC)) {
  console.log('Ensuring SVG schematics are in dist...');
  copyFolderSync(SCHEMATICS_SRC, SCHEMATICS_DEST);
}
