# ⚡ EngineeringGuides Hub

> **Portal interactivo y automatizado para explorar, leer online y descargar guías avanzadas de ingeniería (Hardware, Satélites, Drones, Robótica, IA y Portafolio técnico).**

[![Deploy Portal](https://github.com/Damaga2005/EngineeringGuides/actions/workflows/deploy.yml/badge.svg)](https://github.com/Damaga2005/EngineeringGuides/actions/workflows/deploy.yml)
[![Total Guides](https://img.shields.io/badge/Guides-31+-cyan.svg)](https://github.com/Damaga2005/EngineeringGuides)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Portal Web en Vivo

El sistema está preparado para desplegarse automáticamente en **GitHub Pages**:
🔗 **[https://damaga2005.github.io/EngineeringGuides/](https://damaga2005.github.io/EngineeringGuides/)**

*(Para activar en GitHub: Ve a **Settings > Pages > Build and deployment > Source: GitHub Actions**)*

---

## ✨ Características Principales

- 🔍 **Buscador Instantáneo en Tiempo Real:** Búsqueda predictiva por título, disciplina, etiquetas y palabras clave (ej. `satélite`, `drone`, `RF`, `PCB`, `portafolio`).
- 🧭 **Clasificación por Disciplinas:**
  - 🚀 **Aeroespacial & Satélites:** CubeSats, enlaces de radio en el espacio, telemetría y RF.
  - 🤖 **Drones & Robótica:** Control de movimiento de precisión, UAVs y robótica de campo.
  - ⚡ **Hardware & Electrónica:** Circuitos analógicos, diseño PCB, sensores y proyectos de radio.
  - 🧠 **IA, ML & Computación:** Visión artificial, embodiment y edge AI.
  - 💼 **Carrera & Portafolio:** Guías para construir un portafolio de ingeniería de impacto ante recruiters.
- 📖 **Visor PDF Integrado:** Lee cualquier guía directamente en el navegador con visor modal a pantalla completa sin necesidad de descargar el archivo.
- 💾 **Descarga Directa en 1 Clic:** Descarga los archivos PDF originales con un solo clic.
- ⭐ **Favoritos Locales:** Marca guías para guardarlas en tu lista personalizada (persisten en tu navegador).
- 🔄 **Live Sync (Tiempo Real):** Botón integrado en la web que consulta la API de GitHub para detectar inmediatamente cualquier PDF recién subido sin esperar al despliegue estático.

---

## 🤖 ¿Cómo Funciona la Automatización?

El sistema está diseñado para que **nunca tengas que tocar código** para añadir nuevas guías:

### Opción 1: Añadir guías desde GitHub (Recomendado)
1. Coloca tu nuevo archivo `.pdf` en la carpeta `Engineering guides/`.
2. Haz `git push` o súbelo directamente desde la interfaz web de GitHub (*Add file > Upload files*).
3. **Automáticamente**:
   - GitHub Actions ejecuta `.github/workflows/deploy.yml`.
   - Se indexa el archivo, se extraen metadatos (tamaño, categoría, tags, título formateado).
   - Se actualiza el catálogo `public/guides.json`.
   - Se despliega la nueva versión en GitHub Pages en segundos.

### Opción 2: Sincronización con Google Drive
Tienes dos formas de sincronizar desde Google Drive:

1. **Sincronización Local (en tu PC):**
   Si usas Google Drive para escritorio o tienes una carpeta con tus PDFs, ejecuta:
   ```bash
   python scripts/sync_gdrive.py --local-dir "C:\Ruta\A\Tu\Google Drive\Guias"
   ```
   El script copiará los PDFs nuevos a `Engineering guides/`. Luego solo haces `git push`.

2. **Sincronización en la Nube (GitHub Actions):**
   El workflow `.github/workflows/sync-gdrive.yml` se ejecuta automáticamente todos los días a las 04:00 UTC (o manualmente desde la pestaña *Actions > Sync Guides from Google Drive*).
   - Para configurarlo, añade en los **Secrets del repositorio** (`Settings > Secrets and variables > Actions`):
     - `GDRIVE_FOLDER_ID`: El ID de tu carpeta de Google Drive.
     - `GDRIVE_API_KEY` o `GDRIVE_SERVICE_ACCOUNT`: Tus credenciales de Google Cloud / Google Drive API.

---

## 🛠️ Instalación y Desarrollo Local

Si deseas probar o modificar el portal en tu ordenador:

### Prerrequisitos
- Node.js 18+ y npm
- Python 3.10+ (opcional para scripts en Python)

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Damaga2005/EngineeringGuides.git
   cd EngineeringGuides
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173/](http://localhost:5173/) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   El catálogo se re-indexará y los archivos listos se generarán en la carpeta `dist/`.

---

## 📁 Estructura del Proyecto

```
EngineeringGuides/
├── .github/
│   └── workflows/
│       ├── deploy.yml             # Despliegue automático a GitHub Pages
│       └── sync-gdrive.yml        # Sincronización periódica con Google Drive
├── Engineering guides/            # Carpeta con todos los PDFs originales
├── scripts/
│   ├── generate_catalog.js        # Indexador del catálogo en Node.js
│   ├── generate_catalog.py        # Indexador del catálogo en Python
│   ├── copy_guides.js             # Copia de PDFs al bundle dist
│   └── sync_gdrive.py             # Script de sincronización con Google Drive
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Barra superior con Live Sync y métricas
│   │   ├── SearchAndFilter.jsx    # Buscador en vivo y selector de categorías
│   │   ├── GuideCard.jsx          # Tarjeta individual con vista grid/list
│   │   ├── GuideModal.jsx         # Visor integrado de PDF
│   │   └── StatsModal.jsx         # Métricas y distribución por disciplina
│   ├── data/
│   │   └── categories.js          # Definición de disciplinas y etiquetas
│   ├── App.jsx                    # Componente principal
│   ├── main.jsx                   # Entrada de React
│   └── index.css                  # Estilos Tailwind CSS
├── public/
│   ├── guides.json                # Índice generado con metadatos de las guías
│   └── favicon.svg                # Icono SVG de ingeniería
├── package.json                   # Dependencias y scripts
├── tailwind.config.js             # Configuración visual y temas
└── vite.config.js                 # Configuración de Vite con soporte de PDFs
```

---

## 📄 Licencia

Este proyecto y sus guías de ingeniería están organizados para fines educativos y profesionales.
Distribuido bajo la licencia MIT.
