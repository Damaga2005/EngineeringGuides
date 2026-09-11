# ⚙️ Pipeline de Automatización y Extracción Técnica

Este documento detalla el motor de extracción basado en Python, la generación programática de esquemas de circuito vectoriales SVG y el flujo de integración continua.

---

## 🔬 Motor de Minería de Datos (`scripts/extract_official_and_build_manuals.py`)

El script se apoya en **PyMuPDF (`fitz`)** para realizar minería profunda sobre los 31 PDFs del repositorio:

### 1. Detección Heurística de Subproyectos
Cada guía técnica contiene entre 4 y 6 proyectos principales. El motor escanea el texto página a página buscando patrones de frontera:

```python
PROJECT_PATTERN = re.compile(
    r'(?:PROJECT|PART|NODE)\s*0?([1-9])\s*[:\-\.]?\s*([A-Za-z0-9\s,'"\(\)\-\+]+)',
    re.IGNORECASE
)
```

### 2. Extracción de Metadatos Clave
- **Coste Estimado**: Extrae expresiones como `$15`, `$40`, `~$25`, `under $50`.
- **Tiempo de Montaje**: Detecta horas o días de dedicación (`2-3 hours`, `weekend build`).
- **Lista de Materiales (BOM)**: Busca patrones de componentes (`ESP32`, `LiDAR`, `LoRa`, `Resistor 10k`, `Capacitor 100nF`) con cantidades y costes individuales.
- **Secciones Oficiales**:
  - `WHAT THIS PROVES TO A RECRUITER`
  - `THE JOB THIS MAPS TO`
  - `WHY THIS MATTERS`
  - `SAFETY & OPERATIONAL LIMITS`

---

## ⚡ Generación de Esquemáticos Vectoriales SVG

Para cada uno de los 183 proyectos, el motor calcula el conexionado eléctrico específico según la categoría y microcontrolador:

1. **Bloque Controlador (Izquierda)**: Define el microcontrolador o procesador (ESP32-S3, STM32, Teensy 4.1, Raspberry Pi RP2040).
2. **Bloque Sensor/Carga (Derecha)**: Define el periférico exacto del proyecto.
3. **Líneas de Interconexión Vectoriales**:
   - Traza paths cúbicos Bézier (`M x1 y1 C cx1 cy1, cx2 cy2, x2 y2`) entre cada pin de origen y pin de destino.
   - Asigna colores específicos para buses de alimentación, buses diferenciales (CAN/RS485), I2C, SPI y UART.
   - Dibuja símbolos esquemáticos de resistencias pull-up y condensadores de filtro.
4. **Almacenamiento**: Los archivos SVG se guardan en `public/schematics/guide-XXX-pY.svg` para su servicio instantáneo como gráficos vectoriales nítidos a cualquier nivel de zoom.

---

## 🔄 Integración Continua (GitHub Actions)

El archivo `.github/workflows/deploy.yml` orquesta la automatización:

```yaml
name: Deploy EngineeringGuides Portal to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install Python Dependencies
        run: pip install pymupdf

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Auto-Extract Guides, Render Schematics & Build Portal
        run: npm run build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

Con este flujo, **cualquier PDF subido a la carpeta `Engineering guides/` desencadena de manera autónoma todo el proceso**, publicando la nueva versión en GitHub Pages en menos de 3 minutos sin intervención manual.
