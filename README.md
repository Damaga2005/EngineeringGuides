# ⚡ EngineeringGuides Hub

> **Plataforma Integral de Ingeniería de Hardware, Robótica, Aeroespacial, Sistemas Embebidos e Inteligencia Artificial Física.**
> 
> Catálogo interactivo con **31 Guías Maestras Oficiales**, **183 Subproyectos Prácticos Desglosados**, **Esquemas de Circuito Vectoriales SVG**, **Manuales de Construcción Hiperdetallados Paso a Paso**, **Fotografía Real de Hardware en Ultra-Alta Resolución** y **Pipeline de Automatización Continua (CI/CD)**.

[![Deploy Portal](https://github.com/Damaga2005/EngineeringGuides/actions/workflows/deploy.yml/badge.svg)](https://github.com/Damaga2005/EngineeringGuides/actions/workflows/deploy.yml)
[![Total Guides](https://img.shields.io/badge/Guides-31%20Oficiales-cyan.svg?style=flat-square)](https://github.com/Damaga2005/EngineeringGuides)
[![Subprojects](https://img.shields.io/badge/Subprojects-183%20Construibles-emerald.svg?style=flat-square)](https://github.com/Damaga2005/EngineeringGuides)
[![Schematics](https://img.shields.io/badge/Schematics-183%20SVG%20Vector-purple.svg?style=flat-square)](https://github.com/Damaga2005/EngineeringGuides)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🌐 Portal Web en Producción

El portal se compila, valida e implementa de forma 100% autónoma en **GitHub Pages**:
🔗 **[https://damaga2005.github.io/EngineeringGuides/](https://damaga2005.github.io/EngineeringGuides/)**

---

## 📑 Tabla de Contenidos

- [🎯 Visión y Alcance del Proyecto](#-visión-y-alcance-del-proyecto)
- [✨ Arquitectura y Capacidades de la Plataforma](#-arquitectura-y-capacidades-de-la-plataforma)
  - [1. Pipeline Automatizado de Extracción y Minería Técnica](#1-pipeline-automatizado-de-extracción-y-minería-técnica)
  - [2. Motor de Fotografía Real de Hardware y Portadas Duales](#2-motor-de-fotografía-real-de-hardware-y-portadas-duales)
  - [3. Generador de Diagramas Esquemáticos Vectoriales SVG](#3-generador-de-diagramas-esquemáticos-vectoriales-svg)
  - [4. Manuales de Construcción e Implementación Hiperdetallados](#4-manuales-de-construcción-e-implementación-hiperdetallados)
  - [5. Landings Específicas por Guía y Navegación Deep-Link](#5-landings-específicas-por-guía-y-navegación-deep-link)
  - [6. Lista de Materiales (BOM), Cálculo de Costes y Copiado 1-Click](#6-lista-de-materiales-bom-cálculo-de-costes-y-copiado-1-click)
  - [7. Checklist Interactivo con Persistencia Local](#7-checklist-interactivo-con-persistencia-local)
  - [8. Preparación Técnica para Entrevistas y Empleabilidad](#8-preparación-técnica-para-entrevistas-y-empleabilidad)
- [🧭 Matriz de Disciplinas y Contenidos](#-matriz-de-disciplinas-y-contenidos)
- [🤖 Flujo de Trabajo Zero-Maintenance (CI/CD Autónomo)](#-flujo-de-trabajo-zero-maintenance-cicd-autónomo)
- [🛠️ Pila Tecnológica](#️-pila-tecnológica)
- [📂 Estructura del Repositorio](#-estructura-del-repositorio)
- [🚀 Instalación, Ejecución y Desarrollo Local](#-instalación-ejecución-y-desarrollo-local)
- [📄 Licencia](#-licencia)

---

## 🎯 Visión y Alcance del Proyecto

Los ingenieros de hardware, firmware y robótica a menudo se enfrentan a guías técnicas en formato PDF densas, difíciles de navegar en dispositivos modernos, sin pasos reproducibles de montaje físico, sin esquemas claros de cableado pin a pin y carentes de firmware verificable.

**EngineeringGuides Hub** transforma una colección estática de 31 libros técnicos y dossiers de ingeniería en una **experiencia interactiva de ingeniería de primer nivel**:
- Cada guía cuenta con una **landing interactiva propia** (`#/guide/guide-XXX`).
- Cada uno de los **183 subproyectos** contiene un **manual de ingeniería paso a paso**: cableado cable a cable, esquemático vectorial, firmware descargable, comandos de consola, consideraciones mecánicas/térmicas, protocolo de calibración y matriz de resolución de averías.
- **Fotografía de ingeniería auténtica**: Sustitución de diapositivas de texto por imágenes reales de instrumentación, PCBs y bancos de prueba, con posibilidad de alternar con la portada original del PDF.

---

## ✨ Arquitectura y Capacidades de la Plataforma

### 1. Pipeline Automatizado de Extracción y Minería Técnica
El script central `scripts/extract_official_and_build_manuals.py` procesa cada PDF mediante **PyMuPDF (`fitz`)**:
- **Normalización de Nombres**: Corrige automáticamente nombres crudos o abreviados (e.g. `Follow @1nska.pdf` pasa a ser su título real: *The Robot Framework: Patrocinio y Acceso a Robots Industriales de $30.000*).
- **Segmentación de Proyectos**: Detecta las páginas de inicio de cada subproyecto analizando encabezados como `PROJECT 1`, `PART 1`, `NODE 1`, `PROJECT 01`.
- **Extracción de Bloques Oficiales**:
  - `WHY THIS MATTERS`: Justificación física, matemática y de integridad de señal del diseño.
  - `WHAT THIS PROVES TO A RECRUITER`: Habilidades demostrables de ingeniería (análisis de ruido, lazo cerrado, diseño EMI).
  - `THE JOB THIS MAPS TO`: Roles laborales exactos (Embedded Systems Engineer, RF Hardware Engineer, Robotics Controls Engineer).
  - `SAFETY & OPERATIONAL LIMITS`: Normas de protección galvánica, límites de corriente y precauciones con alta tensión/RF.
  - `INTERVIEW QUESTIONS`: Preguntas técnicas avanzadas sobre el subproyecto formuladas por reclutadores del sector.

### 2. Motor de Fotografía Real de Hardware y Portadas Duales
- **31 Fotografías Maestras en Ultra-Alta Resolución (`GUIDE_HERO_IMAGES`)**: Cada una de las 31 guías cuenta con una fotografía real representativa de su área de especialidad (óptica láser, drones FPV de competición, satélites orbitales, radiotelescopios parabólicos, prótesis biónicas mioeléctricas, analizadores de espectro RF, bancos de ensayo de propulsión de cohetes, aceleradores de inferencia en PCB, robots móviles con LiDAR 360°, mecanizado CNC de 5 ejes, etc.).
- **Pool de Fotografía para 183 Subproyectos (`HARDWARE_PHOTO_POOL`)**: Sistema determinista de 28 filtros temáticos (visión nocturna, pantallas HUD, antenas parabólicas, LoRa mesh, etc.) combinado con un algoritmo hash cíclico que garantiza que **ningún proyecto adyacente comparta la misma foto**.
- **Conmutador Dual "Foto Real" ↔ "Portada PDF"**: Tanto en las tarjetas del catálogo como en las fichas principales, el usuario puede alternar con 1 clic entre la fotografía del hardware y el escaneo de alta fidelidad de la primera página del PDF original (`pdfCover`).
- **Visor Modal de Pantalla Completa con Zoom**: Permite hacer zoom interactivo, mover y explorar ambas imágenes en ultra-alta definición.

### 3. Generador de Diagramas Esquemáticos Vectoriales SVG
- El script genera para cada subproyecto un diagrama vectorial SVG dedicado (`public/schematics/guide-XXX-pY.svg`).
- **Codificación de Conexiones Lógicas**:
  - Microcontrolador / SBC a la izquierda (ESP32-S3, STM32, Raspberry Pi, Teensy, nRF52840).
  - Sensor / Actuador / Carga Útil a la derecha (IMU 6-DOF, LiDAR, Transceptor LoRa, Driver BLDC, etc.).
  - Buses de alimentación con código de colores normalizado: VCC en Rojo (`#EF4444`), GND en Azul Oscuro (`#3B82F6`), SDA en Cian (`#06B6D4`), SCL en Púrpura (`#A855F7`), TX en Naranja (`#F97316`), RX en Amarillo (`#EAB308`).
  - Representación de componentes pasivos de protección: Resistencias pull-up en buses I2C y condensadores de desacoplo cerámicos de 100 nF.
- **Blueprint Interactivo de Respaldo (Zero-Black-Screen)**: Si el archivo SVG se bloquea por red o políticas de origen, un circuito reactivo en CSS/SVG vectorial renderiza instantáneamente las señales y tensiones, garantizando que el usuario jamás experimente pantallas en negro.

### 4. Manuales de Construcción e Implementación Hiperdetallados
Cada uno de los 183 subproyectos incluye en `src/components/ProjectBuildGuide.jsx` **7 pestañas técnicas**:
1. **Esquema de Circuito SVG**: Diagrama vectorial descargable y ampliable a pantalla completa con tabla de patillaje asociada.
2. **Cableado Cable a Cable**: Secuencia física numerada para soldadura y conexionado sobre protoboard o PCB, con avisos de aislamiento y masa de referencia.
3. **Firmware & Comandos de Consola**: 
   - Comandos de terminal de instalación (e.g. `pip install esptool`, `pio pkg install`).
   - Código de producción determinista en **C++ (Arduino/ESP-IDF)** o **MicroPython** con watchdog, control de errores y adquisición continua.
   - Botón de copiado en 1 clic y **descarga directa del archivo de código fuente** (`.ino` o `.py`).
4. **Montaje Mecánico y Térmico**: Especificaciones de par de apriete, tolerancias de impresión 3D (PETG/ASA/aluminio) y gestión térmica de reguladores LDO/MOSFETs.
5. **Calibración y Validación en Banco**: Protocolo con multímetro, osciloscopio o analizador lógico para verificar señales antes de energizar.
6. **Matriz de Diagnóstico y Resolución de Averías**: Acordeón interactivo con síntomas, causas probables (caída de tensión, ruido capacitivo, colisión de direcciones I2C) y solución directa.
7. **Checklist de Montaje Interactivo**: Pasos verificables con barra de progreso porcentual dinámica y persistencia automática en el navegador.

### 5. Landings Específicas por Guía y Navegación Deep-Link
- **Rutas directas basadas en hash**: `https://damaga2005.github.io/EngineeringGuides/#/guide/guide-003` para compartir o guardar proyectos concretos.
- **Navegación por Teclado**: Flecha Izquierda (`←`) y Flecha Derecha (`→`) para pasar de una guía a otra sin usar el ratón.
- **Buscador Interno de Subproyectos**: Filtrado dinámico dentro de la propia guía por nombre de actuador, sensor o palabra clave.
- **Visor PDF Oficial Embebido**: Pestaña dedicada para consultar el documento PDF original en alta resolución sin salir de la plataforma.

### 6. Lista de Materiales (BOM), Cálculo de Costes y Copiado 1-Click
- **Cálculo Automático del Presupuesto BOM**: Suma agregada en tiempo real de todos los componentes del subproyecto (`BOM Estimado: $XX`).
- **Exportación Versátil**:
  - Copiar BOM en formato TSV tabulado listo para pegar en Excel o Google Sheets.
  - Descargar BOM en formato `.csv` limpio con un solo clic.
- **Copiado Rápido de Filas de Conexionado**: Botón `Copiar` en cada fila de la tabla de cableado que copia al portapapeles la asignación exacta (`Pin MCU -> Pin Módulo`).

### 7. Checklist Interactivo con Persistencia Local
- Cada paso de verificación de montaje puede marcarse individualmente.
- El estado se almacena en `localStorage` bajo la clave `build_check_{projectId}`, permitiendo que el usuario retome el proyecto días después sin perder el progreso.
- Indicador de estado: `X / Y pasos completados (Z%)`.

### 8. Preparación Técnica para Entrevistas y Empleabilidad
- Cada proyecto incluye preguntas reales formuladas en entrevistas técnicas de hardware y robótica:
  - *¿Cómo garantizas la integridad de señal y minimizas el jitter en este bus?*
  - *¿Por qué es crítico separar la masa analógica de la masa de conmutación?*
  - *¿Qué estrategia de recuperación ante bloqueos implementa el firmware si el sensor deja de responder?*
- Respuestas modelo y razonamientos basados en física y arquitectura de computadores.

---

## 🧭 Matriz de Disciplinas y Contenidos

| Categoría | Icono | Guías | Ejemplos de Proyectos Incluidos |
| :--- | :---: | :---: | :--- |
| **Aeroespacial & Satélites** | 🚀 | 4 | CubeSats orbitales, receptores ADS-B de aviación, radiotelescopios de hidrógeno 21cm, telemetría espacial VHF/UHF. |
| **Drones & Robótica** | 🤖 | 7 | Drones FPV autónomos, navegación por LiDAR 360°, brazos manipuladores de 6 ejes, acompañantes robóticos de escritorio. |
| **Hardware & Electrónica** | ⚡ | 10 | Analizadores de espectro RF, cámaras termográficas, amplificadores de bajo ruido (LNA), visión nocturna analógica y digital. |
| **IA, ML & Computación** | 🧠 | 5 | Aceleradores neuronales edge (Edge TPU), visión por computador embebida, physical AI embodiment, cluster servers de telemetría. |
| **Carrera & Portafolio EE** | 💼 | 5 | Dossiers de ingeniería de alta empleabilidad, diseño de PCBs de grado industrial, patrocinio y acceso a robots industriales. |

---

## 🤖 Flujo de Trabajo Zero-Maintenance (CI/CD Autónomo)

El portal está configurado para que **el usuario jamás necesite editar código para añadir nuevo material**:

```
[Subir nuevo PDF a Engineering guides/]
                   │
                   ▼ (git push o subida web)
[GitHub Actions Triggered (.github/workflows/deploy.yml)]
                   │
                   ▼
[Setup Python 3.10 & Node.js 20]
                   │
                   ▼
[scripts/extract_official_and_build_manuals.py]
  ├── PyMuPDF fitz: Minería de texto, proyectos y BOM
  ├── Render de 183 Esquemáticos SVG de alta precisión
  ├── Mapeo de fotos de hardware real
  └── Actualización de public/guides.json
                   │
                   ▼
[Vite Production Build (dist/)]
                   │
                   ▼
[scripts/copy_guides.js: Copia de PDFs a dist/Engineering guides/]
                   │
                   ▼
[Deploy to GitHub Pages] ──▶ En Vivo en damaga2005.github.io/EngineeringGuides
```

### ¿Cómo añadir una guía nueva?
1. Copia tu archivo PDF dentro de la carpeta `Engineering guides/`.
2. Haz `git add .`, `git commit -m "feat: añadir nueva guía"` y `git push origin main` (o súbelo con el botón *Add file* desde la web de GitHub).
3. En menos de 3 minutos, el flujo de GitHub Actions:
   - Extraerá los proyectos y componentes.
   - Diseñará los esquemáticos SVG.
   - Asignará fotografías técnicas.
   - Compilará la aplicación y la publicará en producción.

---

## 🛠️ Pila Tecnológica

- **Frontend Core**: React 18 con Vite 6.
- **Estilos & Diseño**: Tailwind CSS con paleta Glassmorphic Cyber-Engineering (`#0B0F19`, acentos en Cian Neón `#06B6D4`, Ámbar y Esmeralda).
- **Iconografía**: Lucide React.
- **Procesamiento de Documentos**: Python 3.10+ con **PyMuPDF (`fitz`)**, expresiones regulares avanzadas y algoritmos heurísticos de segmentación de texto.
- **Generación Vectorial**: Motor en Python para generación programática de esquemas SVG con anotaciones eléctricas de buses y componentes pasivos.
- **Persistencia en Cliente**: Web Storage API (`localStorage`) para favoritos de catálogo y checklists de montaje.
- **CI/CD & Hosting**: GitHub Actions (`.github/workflows/deploy.yml`) y GitHub Pages con despliegue de artefactos comprimidos.

---

## 📂 Estructura del Repositorio

```
EngineeringGuides/
├── .github/
│   └── workflows/
│       └── deploy.yml                             # Pipeline CI/CD completo de extracción y despliegue
├── Engineering guides/                            # Repositorio central de los 31 PDFs oficiales
├── public/
│   ├── covers/                                    # Escaneos de portadas oficiales de los PDFs (PNG)
│   ├── projects/                                  # Capturas de planos y diagramas de páginas internas
│   ├── schematics/                                # 183 Esquemáticos de circuito vectoriales (SVG)
│   ├── favicon.svg                                # Logotipo vectorial del proyecto
│   └── guides.json                                # Base de datos JSON indexada (31 guías + 183 proyectos)
├── scripts/
│   ├── extract_official_and_build_manuals.py      # Motor maestro de extracción, schematics SVG y fotos
│   ├── build_comprehensive_catalog.py             # Metadatos estructurados base
│   ├── copy_guides.js                             # Copia recursiva de PDFs y esquemáticos al bundle dist
│   └── generate_catalog.py / generate_catalog.js  # Indexadores auxiliares
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx                      # Blindaje contra caídas de vista y reporte amigable
│   │   ├── GuideCard.jsx                          # Tarjeta con selector dual (Foto Real / Portada) y chips
│   │   ├── GuideLanding.jsx                       # Landing interactiva con deep linking y navegación
│   │   ├── GuideModal.jsx                         # Visor embebido de PDF en pantalla completa
│   │   ├── ImageViewerModal.jsx                   # Visor de alta resolución con zoom interactivo
│   │   ├── Navbar.jsx                             # Cabecera con estadísticas, live sync y enlaces
│   │   ├── ProjectBuildGuide.jsx                  # Manual paso a paso con 7 pestañas, BOM y esquemas
│   │   ├── SearchAndFilter.jsx                    # Buscador en tiempo real, filtros y ordenación
│   │   └── StatsModal.jsx                         # Métricas agregadas de ingeniería y páginas
│   ├── data/
│   │   └── categories.js                          # Mapeo de taxonomías y disciplinas técnicas
│   ├── App.jsx                                    # Enrutador por hash, skeletons y estados globales
│   ├── index.css                                  # Clases Glassmorphism, scrollbars y animaciones
│   └── main.jsx                                   # Punto de entrada de la aplicación React
├── docs/
│   ├── ARCHITECTURE.md                            # Guía profunda de arquitectura de software y UI
│   └── AUTOMATION_PIPELINE.md                     # Documentación exhaustiva del motor de extracción
├── index.html                                     # Entrada HTML con metadatos OpenGraph
├── package.json                                   # Definición de scripts y dependencias Node
├── tailwind.config.js                             # Configuración del motor de estilos Tailwind
└── vite.config.js                                 # Configuración de empaquetado de producción
```

---

## 🚀 Instalación, Ejecución y Desarrollo Local

### Prerrequisitos
- **Node.js**: v18.0 o superior
- **Python**: v3.10 o superior (con `pip`)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Damaga2005/EngineeringGuides.git
cd EngineeringGuides
```

### 2. Instalar Dependencias
```bash
# Dependencias de Node (React, Tailwind, Lucide, Vite)
npm install

# Dependencias de Python (PyMuPDF)
pip install pymupdf
```

### 3. Ejecutar el Pipeline de Extracción (Opcional)
Para regenerar `public/guides.json` y todos los esquemáticos SVG vectoriales:
```bash
python scripts/extract_official_and_build_manuals.py
```

### 4. Servidor de Desarrollo Local
```bash
npm run dev
```
Abre en tu navegador: **[http://localhost:5173/](http://localhost:5173/)** (con Hot Module Reloading activado).

### 5. Compilar para Producción
```bash
npm run build
```
Este comando ejecuta de manera secuencial:
1. La extracción en Python y generación de esquemas SVG.
2. La compilación y optimización de activos con Vite en `dist/`.
3. El copiado de los PDFs y esquemas a `dist/` para entrega estática.

Para probar la compilación en local:
```bash
npm run preview
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Las guías y dossiers técnicos están diseñados para fines educativos, formativos y de desarrollo profesional en ingeniería.

---

*Diseñado y construido con precisión de ingeniería de hardware y software.*  
**Portal Oficial**: [damaga2005.github.io/EngineeringGuides](https://damaga2005.github.io/EngineeringGuides/)
