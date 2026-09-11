# 🏛️ Arquitectura de Software y Frontend

Este documento detalla la arquitectura de software, patrones de diseño, gestión de estado y tolerancia a fallos implementados en **EngineeringGuides Hub**.

---

## 🧩 Patrón Arquitectónico

La interfaz de usuario está construida sobre **React 18** empleando un flujo de datos unidireccional y componentes puramente modulares con **Vite 6** como motor de empaquetado ultrarrápido y **Tailwind CSS** para un diseño responsivo.

```
                           +-------------------+
                           |      App.jsx      |
                           +---------+---------+
                                     |
           +-------------------------+-------------------------+
           |                         |                         |
+----------v----------+    +---------v---------+    +----------v----------+
|     Navbar.jsx      |    | SearchFilter.jsx  |    |  ErrorBoundary.jsx  |
+---------------------+    +-------------------+    +----------+----------+
                                                               |
                                            +------------------+------------------+
                                            |                                     |
                                 +----------v----------+               +----------v----------+
                                 |   GuideCard.jsx     |               |   GuideLanding.jsx  |
                                 +---------------------+               +----------+----------+
                                                                                  |
                                                                       +----------v----------+
                                                                       | ProjectBuildGuide   |
                                                                       +----------+----------+
                                                                                  |
                                                                       +----------v----------+
                                                                       | ImageViewerModal    |
                                                                       +---------------------+
```

---

## 🔀 Sistema de Enrutamiento Reactivo por Hash

En entornos de alojamiento estático como **GitHub Pages**, las rutas de servidor convencionales (`/guide/guide-001`) suelen provocar errores `404 Not Found` al recargar la página o al navegar directamente mediante enlaces compartidos, a menos que se configure un servidor con reescritura de URLs.

Para resolver esto de forma limpia y sin dependencias de servidor:
- Se implementó un enrutamiento por hash (`window.location.hash`).
- **Ruta Catálogo**: `#/`
- **Ruta Landing**: `#/guide/:guideId` (ej. `#/guide/guide-003`)
- `App.jsx` sincroniza el estado local escuchando el evento nativo `hashchange`.
- Si el usuario accede a una guía que no existe, se renderiza un estado 404 integrado con un botón que permite restablecer la navegación al catálogo.

---

## 🛡️ Capa de Tolerancia a Fallos (`ErrorBoundary.jsx`)

Para garantizar que ningún fallo imprevisto de renderizado (incompatibilidad de extensiones, errores en parsers SVG o datos corruptos) deje la pantalla en blanco:
- Todo el renderizado de landings y componentes técnicos está envuelto en `ErrorBoundary`.
- Si se produce un error en el árbol de componentes:
  1. Se captura la excepción y se registra en la consola.
  2. Se sustituye la vista por un panel de diagnóstico de alta fidelidad que explica claramente el motivo del fallo.
  3. Se preserva el estado almacenado en `localStorage` (favoritos y checklists de montaje).
  4. Se proporciona un botón de recuperación para volver al catálogo sin recargar la aplicación completa.

---

## 🎨 Sistema de Diseño y Tokens CSS

La estética sigue la temática **Cyber-Engineering Dark Mode** con soporte de efectos Glassmorphism:

- **Fondo Primario**: `#0B0F19` (Azul espacial profundo).
- **Paneles Glassmorphism**: Fondo con transparencia `rgba(15, 23, 42, 0.75)`, filtro `backdrop-blur-md` y bordes sutiles `rgba(51, 65, 85, 0.6)`.
- **Acentos Semánticos**:
  - `Cian (#06B6D4)`: Selección primaria, enlaces activos, líneas de datos SDA, componentes MCU.
  - `Ámbar (#F59E0B)`: Alertas de seguridad, advertencias térmicas, líneas TX, número de proyectos.
  - `Esmeralda (#10B981)`: Líneas de alimentación VCC, badges de dificultad Principiante, costes económicos BOM.
  - `Púrpura (#A855F7)`: Reloj SCL, inteligencia artificial y machine learning.

---

## 💾 Persistencia en Cliente (Web Storage API)

Sin necesidad de bases de datos externas o autenticación obligatoria, la plataforma persiste la actividad del ingeniero:
- **Favoritos**: Array de IDs de guías guardado en `localStorage.getItem('engineering_guides_favorites')`.
- **Checklist de Montaje de Subproyectos**: Registro booleano de pasos completados guardado en `localStorage.getItem('build_check_{projectId}')`.
