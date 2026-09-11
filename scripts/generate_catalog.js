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

// Curated metadata and key highlights for each guide
const GUIDE_DETAILS = {
  "(PART 20) 6_Engineering_Projects_That_See_Everything_Coming.pdf": {
    subtitle: "Sistema personal de conciencia situacional y defensa táctica",
    summary: "Seis construcciones de hardware que se combinan en un sistema de conciencia situacional completo: visión nocturna, HUD, torre de vigilancia, estación RF y mapa de mando unificado.",
    keyPoints: [
      "01. Monocular digital de visión nocturna (sensor infrarrojo de ultra-baja luz)",
      "02. Heads-Up Display (HUD) portátil con óptica colimada",
      "03. Torre centinela perimetral solar con cámara PTZ autónoma",
      "04. Estación de vigilancia espectral de radiofrecuencia (SDR)",
      "05. Nodo de malla LoRa off-grid de largo alcance",
      "06. Mapa táctico de mando que fusiona telemetría y sensores en tiempo real"
    ],
    technologies: ["SDR", "LoRa Mesh", "IR Vision", "HUD Optics", "ESP32", "Computer Vision"],
    difficulty: "Avanzado",
    pageCount: 18
  },
  "(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf": {
    subtitle: "Actualizaciones críticas de hardware para cualquier dron ArduPilot / PX4",
    summary: "Módulos de mejora para drones existentes: vuelo estacionario en interiores sin GPS, anillo sensor anticolisión, sistema de paracaídas balístico y gimbal estabilizado.",
    keyPoints: [
      "01. Vuelo estacionario interior sin GPS (sensores Optical Flow + LiDAR ToF)",
      "02. Anillo de evitación de obstáculos omnidireccional con sensores ToF",
      "03. Sistema de recuperación por paracaídas con eyección pirotécnica/resorte",
      "04. Gimbal brushless de 2 ejes con control vectorial FOC",
      "05. Aterrizaje autónomo de alta precisión guiado por visión artificial",
      "06. Carga útil para mapeo de cobertura y fuerza de señales RF"
    ],
    technologies: ["ArduPilot", "PX4", "Optical Flow", "LiDAR ToF", "FOC Gimbal", "Computer Vision"],
    difficulty: "Avanzado",
    pageCount: 16
  },
  "6 EE Projects That Build a Real Satellite.pdf": {
    subtitle: "Subsistemas reales de una nave espacial y arquitectura CubeSat",
    summary: "Guía completa para construir los subsistemas reales de un satélite: propulsión de gas frío, estaciones de seguimiento terrestre, ruedas de reacción y computadoras de a bordo.",
    keyPoints: [
      "01. Propulsor de reacción de gas frío para orientación orbital ($75)",
      "02. Estación terrestre con antena de seguimiento azimut/elevación ($70)",
      "03. Sistema de desespinado magnético Magnetorquer ($45)",
      "04. Computadora de a bordo (OBC) para CubeSat en microcontrolador STM32 ($50)",
      "05. Sistema de gestión de potencia eléctrica (EPS) con seguimiento solar ($60)",
      "06. Transceptor de telemetría y baliza de radioaficionado VHF/UHF ($40)"
    ],
    technologies: ["STM32", "Magnetorquers", "Cold-Gas Thrusters", "SDR Ground Station", "EPS Solar", "CubeSat"],
    difficulty: "Avanzado",
    pageCount: 23
  },
  "6 EE Projects That Eavesdrop On The Sky.pdf": {
    subtitle: "Inteligencia de señales y recepción pasiva con SDR",
    summary: "Recepción pasiva y 100% legal de señales aéreas, marítimas, meteorológicas y espaciales usando receptores de radio definida por software (SDR) de $30.",
    keyPoints: [
      "01. Radar aeronáutico ADS-B: mapa en vivo de todos los vuelos comerciales ($30)",
      "02. Sniffer TPMS para sensores de neumáticos de automóviles ($30)",
      "03. Detector de meteoros por dispersión de radio en la ionosfera ($35)",
      "04. Rastreador marítimo de buques AIS en tiempo real ($30)",
      "05. Receptor de telemetría de radiosondas meteorológicas estratosféricas ($30)",
      "06. Interceptor de mensajes satelitales ACARS / Inmarsat / Iridium ($45)"
    ],
    technologies: ["RTL-SDR", "ADS-B", "AIS", "TPMS", "Ionosphere RF", "GNU Radio"],
    difficulty: "Intermedio",
    pageCount: 23
  },
  "6 EE Projects That Move With Precision.pdf": {
    subtitle: "Control de movimiento de ultra-precisión, motores paso a paso y servos",
    summary: "Construcción de actuadores electromecánicos con control en bucle cerrado: motores paso a paso, servomotores industriales y control FOC para robótica de alta exactitud.",
    keyPoints: [
      "01. Controlador de motor paso a paso con micropasos y feedback de encoder",
      "02. Servo brushless con algoritmo de control vectorial orientado al campo (FOC)",
      "03. Platina lineal micrométrica con husillo de precisión antibacklash",
      "04. Péndulo invertido con control PID y estabilización dinámica",
      "05. Actuador lineal de alta velocidad con limitación de par por hardware",
      "06. Eje rotatorio de alta rigidez con reductor cicloidal impreso en 3D"
    ],
    technologies: ["FOC Driver", "BLDC Motors", "Magnetic Encoders", "PID Control", "Precision Lead Screws"],
    difficulty: "Avanzado",
    pageCount: 19
  },
  "6 EE Projects That Put You on a Drone Team.pdf": {
    subtitle: "Proyectos de aviónica, firmware de vuelo y electrónica de potencia para UAVs",
    summary: "Seis desarrollos que demuestran dominio real de ingeniería de drones: controladoras de vuelo desde cero, variadores ESC rápidos, telemetría bidireccional y telemetría de caja negra.",
    keyPoints: [
      "01. Controladora de vuelo personalizada con microcontrolador STM32 e IMU",
      "02. Variador electrónico de velocidad (ESC) brushless de conmutación rápida",
      "03. Enlace de telemetría bidireccional digital con cifrado y QoS",
      "04. Módulo PDB con medición de corriente de precisión y protección térmica",
      "05. Fusión de sensores mediante filtro de Kalman extendido para orientación",
      "06. Registrador Blackbox de alta velocidad en memoria Flash SPI"
    ],
    technologies: ["STM32", "ESC BLDC", "Kalman Filter", "IMU Fusion", "SPI Flash", "Telemetry RF"],
    difficulty: "Avanzado",
    pageCount: 20
  },
  "6 EE Projects That Reach Space.pdf": {
    subtitle: "Sistemas orbitales y cargas útiles para el espacio desde tu mesa de trabajo",
    summary: "Construcción y validación de hardware apto para el espacio: sondas estratosféricas, balizas de satélite, detectores de rayos cósmicos y enlaces de enlace descendente LoRa.",
    keyPoints: [
      "01. Carga útil de telemetría para globo estratosférico a gran altitud",
      "02. Receptor de imágenes meteorológicas satelitales NOAA / Meteor-M",
      "03. Sistema activo de determinación y control de actitud (ADCS)",
      "04. Detector de radiación y muones cósmicos con centellador",
      "05. Mecanismo de despliegue de paneles solares y antenas CubeSat",
      "06. Enlace de comunicación Tierra-Espacio de ultra-largo alcance con LoRa"
    ],
    technologies: ["NOAA APT", "ADCS", "Radiation Detectors", "CubeSat Deployers", "LoRa Space"],
    difficulty: "Avanzado",
    pageCount: 21
  },
  "6 EE Projects That Read The Body.pdf": {
    subtitle: "Interfaces bioeléctricas, sensores fisiológicos y dispositivos médicos",
    summary: "Diseño analógico y digital para capturar señales biológicas del cuerpo humano: ECG, EMG, EEG, oximetría de pulso y bioimpedancia con aislamiento galvánico.",
    keyPoints: [
      "01. Monitor de electrocardiograma (ECG) de 3 derivaciones con amplificador de instrumentación",
      "02. Sensor de electromiografía (EMG) para control mioeléctrico de prótesis",
      "03. Electroencefalógrafo (EEG) para detección de ondas cerebrales alfa",
      "04. Pulsioxímetro óptico (PPG) de doble longitud de onda (Rojo/IR)",
      "05. Sensor de respuesta galvánica de la piel (GSR) para detección de estrés",
      "06. Analizador de composición corporal por espectroscopía de bioimpedancia"
    ],
    technologies: ["Bio-Amps", "ECG/EMG/EEG", "Optical PPG", "Galvanic Isolation", "Analog Filters"],
    difficulty: "Avanzado",
    pageCount: 20
  },
  "6 EE Projects That See With Light.pdf": {
    subtitle: "Fotónica, LiDAR, comunicación óptica y escaneo 3D",
    summary: "Aprovechamiento de la luz coherente y fotodiodos para medir distancias, transmitir datos por aire libre y generar modelos 3D de alta precisión.",
    keyPoints: [
      "01. Barrera óptica de alta velocidad con láser para cronometraje de objetos",
      "02. Telémetro láser de tiempo de vuelo (ToF LiDAR) con precisión milimétrica",
      "03. Escáner LiDAR rotatorio de 360 grados para mapeo 2D de habitaciones",
      "04. Enlace de comunicación de datos por haz láser (Free-Space Optical Comms)",
      "05. Vibrómetro láser reflectante para análisis acústico sin contacto",
      "06. Escáner 3D de luz estructurada con proyector de líneas para digitalización"
    ],
    technologies: ["ToF LiDAR", "Laser Optics", "Photodiodes", "FSO Comms", "Structured Light 3D"],
    difficulty: "Intermedio / Avanzado",
    pageCount: 18
  },
  "6 EE Projects That See With Radio.pdf": {
    subtitle: "Radar Doppler, detección micro-Doppler, detección WiFi y radar pasivo",
    summary: "Radares reales operando en microondas: medición de velocidad por efecto Doppler, detección de pulso y respiración a distancia, y detección de personas a través de paredes.",
    keyPoints: [
      "01. Radar Doppler de movimiento para cálculo de velocidad en banda 10.5 GHz",
      "02. Pistola radar calibrada con lectura directa en km/h o mph",
      "03. Radar FMCW para medición continua de distancia y perfil de rango",
      "04. Radar micro-Doppler para detección de signos vitales (respiración y pulso)",
      "05. Detector de movimiento a través de paredes mediante análisis CSI de señales WiFi",
      "06. Radar pasivo bi-estático para rastreo de aeronaves sin emitir radiación"
    ],
    technologies: ["Doppler Radar", "FMCW 24GHz", "WiFi CSI Sensing", "Passive Bistatic Radar", "Microwaves"],
    difficulty: "Avanzado",
    pageCount: 19
  },
  "6_EE_Projects_That_See_The_Invisible_dark_ops.pdf": {
    subtitle: "Señales de defensa, receptores GNSS protegidos y sensores tácticos",
    summary: "Hardware inspirado en laboratorios de defensa: detección de anomalías magnéticas, goniometría RF, sensores sísmicos desatendidos y radiocomunicaciones con salto de frecuencia.",
    keyPoints: [
      "01. Receptor GNSS resistente a interferencias y spoofing",
      "02. Radiogoniómetro RF (Direction Finder) para localizar transmisores ocultos",
      "03. Detector de anomalías magnéticas (MAD) para vehículos y blindajes",
      "04. Sensor sísmico desatendido (UGS) para detección de pasos e intrusiones",
      "05. Receptor detector de drones por análisis de emisión de enlace de radio",
      "06. Enlace de radio seguro con salto de frecuencia pseudoaleatorio (FHSS)"
    ],
    technologies: ["GNSS Resilience", "RF Direction Finding", "Fluxgate Magnetometer", "Seismic UGS", "FHSS Crypto"],
    difficulty: "Avanzado",
    pageCount: 17
  },
  "6_EE_Projects_That_See_The_Invisible_revised.pdf": {
    subtitle: "Detección no convencional, espectro invisible y contramedidas electrónicas",
    summary: "Versión revisada y ampliada de proyectos de señales invisibles: detección de anomalías magnéticas, enlaces anti-interferencia y goniometría de precisión.",
    keyPoints: [
      "01. Receptor GNSS inmune a interferencias con antena de patrón nulo",
      "02. Radiogoniómetro doppler para localización instantánea de fuentes RF",
      "03. Magnetómetro fluxgate para detección de masas ferromagnéticas ocultas",
      "04. Red de sensores terrestres desatendidos con clasificación acústico-sísmica",
      "05. Sniffer de telemetría de drones de alerta temprana",
      "06. Módem de dispersión espectral por secuencia directa (DSSS) y FHSS"
    ],
    technologies: ["FHSS", "DSSS", "Direction Finding", "Fluxgate Sensors", "Acoustic-Seismic Fusion"],
    difficulty: "Avanzado",
    pageCount: 23
  },
  "6_EE_Projects_That_Think_For_Themselves.pdf": {
    subtitle: "Robots autónomos completos: sentido, decisión y acción física",
    summary: "Seis robots autónomos construidos de principio a fin: rovers reactivos, brazos con cinemática inversa, cuadrúpedos bípedos, pinzas táctiles y navegación SLAM.",
    keyPoints: [
      "01. Rover reactivo con bucle sensorial rápido y evasión adaptativa de obstáculos",
      "02. Brazo robótico con cinemática inversa analítica en tiempo real",
      "03. Robot cuadrúpedo de 12 grados de libertad con generador de marcha",
      "04. Robot móvil con seguimiento visual de objetivos mediante OpenCV",
      "05. Pinza robótica con sensor de fuerza capacitivo para agarre delicado",
      "06. Rover autónomo con LiDAR y algoritmo SLAM para mapeo y auto-navegación"
    ],
    technologies: ["Inverse Kinematics", "12-DOF Quadruped", "2D SLAM", "OpenCV Vision", "Force Sensing"],
    difficulty: "Avanzado",
    pageCount: 15
  },
  "6_Engineering_Projects_That_Survive_The_Field.pdf": {
    subtitle: "Ingeniería de supervivencia, robustez ambiental y logística defensiva",
    summary: "Diseño para entornos hostiles: jaulas de Faraday contra pulsos EMP, túneles de viento de escritorio, hidrófonos submarinos y cajas estancas para combate.",
    keyPoints: [
      "01. Jaula de Faraday y gabinete endurecido contra pulsos electromagnéticos (EMP)",
      "02. Túnel de viento de escritorio con cámara de humo para visualización de sustentación",
      "03. Panel compuesto resistente a impactos y torre de caída para pruebas de estrés",
      "04. Matriz de hidrófonos para sonar pasivo y escucha acústica subacuática",
      "05. Carga útil con parafoil autónomo de alta precisión para lanzamiento aéreo",
      "06. Cámara de tortura ambiental (temperatura, vibración y estanqueidad IP68)"
    ],
    technologies: ["Faraday EMP", "Wind Tunnel Aero", "Passive Sonar Hydrophone", "Guided Parafoil", "IP68 Stress"],
    difficulty: "Avanzado",
    pageCount: 16
  },
  "6_Upgrades_Your_Drone_Is_Missing.pdf": {
    subtitle: "Mejoras tácticas y sensores avanzados para drones comerciales y DIY",
    summary: "Guía de construcción para dotar a tu dron de capacidades industriales: hover óptico sin GPS, sensores perimétricos, gimbal brushless y sistema de eyección de paracaídas.",
    keyPoints: [
      "01. Módulo de posición óptica para vuelo estacionario en interiores sin señal GPS",
      "02. Corona perimetral de sensores de proximidad láser Time-of-Flight",
      "03. Paracaídas de emergencia con gatillo pirotécnico ante fallo de altitud",
      "04. Gimbal estabilizador de 2 ejes con controladores FOC y sensor IMU",
      "05. Sistema de aterrizaje de precisión centimétrico guiado por marcas visuales",
      "06. Carga útil de mapeo de espectro RF para barrido perimetral de antenas"
    ],
    technologies: ["ArduPilot", "Optical Flow", "Laser ToF", "FOC Gimbal", "Precision Landing"],
    difficulty: "Avanzado",
    pageCount: 16
  },
  "cs portfolio projects.pdf": {
    subtitle: "Los 6 proyectos de software de nivel staff que contratan los recruiters",
    summary: "Olvídate de clones de Netflix o apps To-Do. Seis proyectos de software de sistemas de alto impacto: bases de datos distribuidas, motores de búsqueda vectorial y runtimes de contenedores.",
    keyPoints: [
      "01. Almacén distribuido clave-valor con algoritmo de consenso Raft",
      "02. Motor de búsqueda vectorial con indexación HNSW desde cero",
      "03. Servidor HTTP asíncrono multiproceso con event loop personalizado",
      "04. Intérprete y máquina virtual para un lenguaje de programación tipado",
      "05. Runtime de contenedores ligero implementado con cgroups y namespaces de Linux",
      "06. Base de datos relacional transaccional embebida con motor B+Tree"
    ],
    technologies: ["Raft Consensus", "Vector Search HNSW", "Async IO", "Virtual Machines", "Linux Namespaces"],
    difficulty: "Avanzado",
    pageCount: 21
  },
  "dangerously_overeducated_engineer_guide.pdf": {
    subtitle: "Cómo hackear tu autoeducación para acceder a pasantías de deep tech",
    summary: "Estrategia integral para dominar conocimientos avanzados de ingeniería de forma autodidacta y competir cara a cara con graduados de las universidades más exigentes.",
    keyPoints: [
      "01. Método de aprendizaje inverso: diseña hardware real antes de abrir el libro de texto",
      "02. Cómo equipar un laboratorio de electrónica completo en tu habitación por menos de $150",
      "03. Dónde encontrar manuales de servicio militar, papers de IEEE y notas de aplicación secretas",
      "04. Construcción de proyectos de portafolio 'indiscutibles' que los recruiters no pueden ignorar",
      "05. Estrategia de networking agresivo en LinkedIn y GitHub con ingenieros jefe",
      "06. Superación de pruebas técnicas de hardware y arquitectura de sistemas"
    ],
    technologies: ["Self-Directed Learning", "Lab Setup", "Hardware Reverse-Engineering", "Portfolio Strategy"],
    difficulty: "Todos los niveles",
    pageCount: 10
  },
  "ee ai era projects.pdf": {
    subtitle: "Circuitos de hardware de defensa que solo existen porque la IA existe",
    summary: "Protección física y autenticación analógica frente a amenazas de IA generativa: detectores de voz clonada, side-channel sniffers y switches de desconexión física de IA.",
    keyPoints: [
      "01. Detector de voz clonada por IA mediante banco de filtros analógicos acústicos",
      "02. Sniffer electromagnético (EMI) de canal lateral para monitorizar ejecución de chips",
      "03. Interruptor de desconexión física de hardware activado por desviación de comportamiento",
      "04. Placa de identidad física a prueba de deepfakes con prueba criptográfica de presencia",
      "05. Fusionador de sensores neuromórfico con circuitos analógicos bio-inspirados",
      "06. Autenticador de hardware por huella dactilar de radiofrecuencia (RF Fingerprinting)"
    ],
    technologies: ["EMI Side-Channel", "Neuromorphic Analog", "RF Fingerprinting", "Hardware Kill Switch"],
    difficulty: "Avanzado",
    pageCount: 20
  },
  "ee defense tech part2.pdf": {
    subtitle: "Sistemas láser, comunicaciones encubiertas y medición de firma radar",
    summary: "Hardware directo de laboratorios clasificados: micrófonos láser ópticos, enlaces ópticos infrarrojos anti-escuchas y medición de sección transversal de radar en tu escritorio.",
    keyPoints: [
      "01. Micrófono láser de vigilancia óptica: escucha a través de cristales a 100m ($15)",
      "02. Enlace de comunicación láser indetectable e imposible de intervenir ($12)",
      "03. Telémetro láser de precisión sub-nanosegundo con conversor TDC ($25)",
      "04. Transmisor de ráfaga encriptada FHSS de 50ms inmune a inhibidores ($10)",
      "05. Visor nocturno pasivo por amplificación de luz residual sin emisión ($30)",
      "06. Banco de medición de Sección Recta Radar (RCS) para probar materiales furtivos ($12)"
    ],
    technologies: ["Laser Vibrometry", "Covert IR Comms", "Time-to-Digital TDC", "Radar Cross Section RCS"],
    difficulty: "Avanzado",
    pageCount: 22
  },
  "ee physical ai embodiment.pdf": {
    subtitle: "Interfaces neuronales, voz silenciosa y computación en el cuerpo",
    summary: "Seis dispositivos portátiles donde la inteligencia artificial interactúa directamente con la fisiología humana: lectura electromiográfica, voz subvocal y háptica aumentada.",
    keyPoints: [
      "01. Interfaz neural de voz silenciosa: habla con la IA sin emitir sonido perceptible ($60)",
      "02. Prótesis de mano mioeléctrica controlada por señales EMG antes de mover el músculo ($80)",
      "03. Interfaz de programación AR con control por gestos en el aire ($50)",
      "04. Monitor biométrico emocional para proporcionar contexto fisiológico a LLMs ($30)",
      "05. Guante de aumento táctil para sentir campos electromagnéticos y texturas ($45)",
      "06. Comandos por voz subvocal con sensores piezoeléctricos de garganta ($35)"
    ],
    technologies: ["Silent Speech", "Surface EMG", "Haptic Gloves", "Physiological AI", "Edge Neural Net"],
    difficulty: "Avanzado",
    pageCount: 23
  },
  "ee_portfolio_projects.pdf": {
    subtitle: "Los 6 proyectos clave de hardware que garantizan empleo en ingeniería electrónica",
    summary: "Construcciones rigurosas de electrónica aplicada: transceptores SDR de 4 capas, fuentes conmutadas de 95% de eficiencia y controladores de motor en bucle cerrado.",
    keyPoints: [
      "01. Transceptor de radio definida por software (SDR) en PCB de 4 capas de alta velocidad",
      "02. Fuente de alimentación conmutada síncrona (SMPS) con eficiencia superior al 95%",
      "03. Controlador de motor brushless de bucle cerrado con encoder magnético de 14 bits",
      "04. Sistema de gestión de baterías (BMS) inteligente con balanceo activo de celdas",
      "05. Front-End analógico de ultra-bajo ruido para amplificación de biopotenciales",
      "06. Osciloscopio digital USB con muestreo de 100 MS/s y lógica FPGA"
    ],
    technologies: ["4-Layer High-Speed PCB", "SMPS 95%+", "FOC BLDC Driver", "FPGA ADC", "Smart BMS"],
    difficulty: "Avanzado",
    pageCount: 15
  },
  "follow @1nska.pdf": {
    subtitle: "The Robot Framework: Cómo conseguir equipamiento de $30.000 gratis",
    summary: "El marco de 5 pasos para negociar, contactar fabricantes líderes de robótica y conseguir patrocinio y préstamo gratuito de robots industriales para tus proyectos.",
    keyPoints: [
      "01. La mentalidad de reciprocidad: qué buscan realmente los departamentos de R&D de los gigantes de robótica",
      "02. Redacción de un correo frío irrechazable con demostración visual de capacidad",
      "03. Presentación de un plan de investigación creíble y con hitos verificables",
      "04. Cómo gestionar la logística, seguros y acuerdos de confidencialidad (NDA)",
      "05. Documentación pública del proyecto para maximizar visibilidad en redes e industria",
      "06. Conversión del préstamo temporal en ofertas formales de empleo y patrocinio"
    ],
    technologies: ["Sponsorship Strategy", "Executive Pitching", "Cold Outreach", "Industrial Robotics"],
    difficulty: "Principiante / Estratégico",
    pageCount: 11
  },
  "how-to-learn-electronics-from-zero.pdf": {
    subtitle: "Hoja de ruta paso a paso para dominar electrónica desde cero",
    summary: "La secuencia ideal para aprender hardware rápidamente: prototipar primero, comprender la física después, dominar la instrumentación y fabricar PCBs profesionales.",
    keyPoints: [
      "01. Paso 1: Los componentes fundamentales y cómo fallan en el mundo real",
      "02. Paso 2: El kit de laboratorio mínimo viable (multímetro, fuente, osciloscopio USB)",
      "03. Paso 3: De la protoboard al esquemático en KiCad sin perder la cordura",
      "04. Paso 4: Ruteo de PCBs de 2 y 4 capas y preparación de archivos Gerber",
      "05. Paso 5: Técnicas de soldadura SMD y montaje de prototipos en casa",
      "06. Paso 6: Depuración de circuitos con osciloscopio y analizador lógico"
    ],
    technologies: ["KiCad", "SMD Soldering", "Oscilloscope Debugging", "PCB Layout", "Analog Fundamentals"],
    difficulty: "Principiante a Intermedio",
    pageCount: 5
  },
  "me_portfolio_projects.pdf": {
    subtitle: "Los 6 proyectos mecánicos de impacto que los recruiters quieren ver",
    summary: "Diseño mecánico de precisión, análisis térmico y cinemática avanzada: reductores cicloidales, suspensión activa y actuadores robóticos de alta densidad.",
    keyPoints: [
      "01. Reductor cicloidal antibacklash impreso en 3D para juntas robóticas de alto par",
      "02. Banco de suspensión activa con amortiguador magnetorreológico y control dinámico",
      "03. Actuador robótico cuasi-directo (QDD) con motor sin escobillas para cuadrúpedos",
      "04. Túnel aerodinámico de efecto Venturi con toma de presión manométrica digital",
      "05. Cámara de vacío térmico de bajo costo para pruebas de componentes satelitales",
      "06. Pinza robótica con mecanismo flexible cumpliente (compliant mechanism) monolítico"
    ],
    technologies: ["Cycloidal Gearbox", "QDD Actuators", "Compliant Mechanisms", "FEA Analysis", "Vacuum Chamber"],
    difficulty: "Avanzado",
    pageCount: 22
  },
  "ml guide engineers.pdf": {
    subtitle: "Machine Learning aplicado para ingenieros de hardware y mecánica",
    summary: "Guía práctica de ML diseñada para ingenieros tradicionales: qué algoritmos usar para análisis de señales, vibraciones, mantenimiento predictivo y visión en el edge.",
    keyPoints: [
      "01. Qué ramas de ML realmente importan en ingeniería de hardware vs software puro",
      "02. Clasificación de señales de sensores físicos (FFT + SVM / Redes convolucionales 1D)",
      "03. Mantenimiento predictivo: detección de fallos en rodamientos y motores por vibración",
      "04. Visión por computador en el edge con microcontroladores (TinyML en ESP32 / STM32)",
      "05. Optimización bayesiana para ajuste automático de parámetros de control PID",
      "06. Despliegue de modelos cuantizados INT8 sin pérdidas de precisión"
    ],
    technologies: ["TinyML", "FFT Analysis", "Predictive Maintenance", "Edge AI", "Quantization INT8"],
    difficulty: "Intermedio",
    pageCount: 10
  },
  "Ohmie-Build-Guide.pdf": {
    subtitle: "Guía de construcción de la consola portátil Ohmie con Arduino y OLED",
    summary: "Construcción paso a paso de la consola de juegos retro Ohmie: cableado, placa Arduino Uno R3, pantalla OLED de 2.42\", potenciómetro deslizante y buzzer.",
    keyPoints: [
      "01. Lista completa de componentes: Arduino Uno R3, display OLED SPI de 2.42\", slider pot y buzzer",
      "02. Diagrama de conexionado esquemático libre de errores de alimentación",
      "03. Configuración del toolchain en VS Code con PlatformIO",
      "04. Verificación de lectura analógica del potenciómetro y generación de tonos de audio",
      "05. Flasheo y arquitectura de los dos juegos integrados (Pong y Runner)",
      "06. Montaje en chasis y optimización de tasa de refresco gráfica en pantalla OLED"
    ],
    technologies: ["Arduino Uno", "OLED 2.42 SPI", "PlatformIO", "Embedded C++", "DIY Gaming Console"],
    difficulty: "Principiante a Intermedio",
    pageCount: 15
  },
  "summer-ee-glow-up-light.pdf": {
    subtitle: "Volumen 1: Los 10 recursos indispensables para subir de nivel en EE",
    summary: "El mapa de estudio para transformar tu conocimiento de electrónica en un verano: 10 libros, simuladores y herramientas prácticas explicadas recurso por recurso.",
    keyPoints: [
      "01. 'Learning the Art of Electronics': El laboratorio práctico complementario",
      "02. Simuladores SPICE interactivos: cómo simular circuitos sin frustración",
      "03. Guías maestras de diseño de filtros activos de Texas Instruments y Analog Devices",
      "04. Práctica de transistores BJT y MOSFET en regímenes lineales y de saturación",
      "05. Decodificación de notas de aplicación de fabricantes de semiconductores",
      "06. Proyecto integrador de fin de verano para consolidar el portafolio"
    ],
    technologies: ["Analog Design", "SPICE Simulation", "Op-Amps", "TI Application Notes"],
    difficulty: "Principiante a Intermedio",
    pageCount: 10
  },
  "summer-ee-glow-up-vol2.pdf": {
    subtitle: "Volumen 2: 10 recursos adicionales de diseño práctico y depuración",
    summary: "Continuación del roadmap de electrónica: diseño analógico intuitivo, técnicas de depuración con instrumental de banco y fundamentos de integridad de señal.",
    keyPoints: [
      "01. 'Practical Electronics for Inventors': Comprensión conceptual de componentes",
      "02. Técnicas de depuración sistemática de circuitos que no encienden o echan humo",
      "03. Uso avanzado del osciloscopio: disparos por flanco, ancho de pulso y decodificación I2C/SPI",
      "04. Diseño de etapas de potencia reguladas de bajo ruido LDO vs conmutadas",
      "05. Métodos de diseño de circuitos impresos para mitigar la capacitancia e inductancia parásitas",
      "06. Ejercicios semanales de diseño esquemático para interiorizar principios de diseño"
    ],
    technologies: ["Scope Triggering", "I2C/SPI Decoding", "Low-Noise LDO", "Parasitic Reduction"],
    difficulty: "Intermedio",
    pageCount: 10
  },
  "summer-ee-glow-up-vol3.pdf": {
    subtitle: "Volumen 3: 14 recursos avanzados de radiofrecuencia y PCBs de alta velocidad",
    summary: "El salto a la ingeniería profesional: ruteo de señales diferenciales, diseño RF en microstrip, compatibilidad electromagnética (EMC) y microcontroladores de 32 bits.",
    keyPoints: [
      "01. Principios de alta velocidad: cuándo una pista deja de ser un cable y pasa a ser línea de transmisión",
      "02. Adaptación de impedancias a 50 ohmios con cartas de Smith y planos de masa sólidos",
      "03. Estrategias de desacoplo de condensadores y retorno de corrientes de alta frecuencia",
      "04. Diseño y certificación preliminar de compatibilidad electromagnética (EMC/EMI)",
      "05. Firmware bare-metal en ARM Cortex-M: registros, interrupciones y DMA",
      "06. Catorce referencias bibliográficas y papers para dominar hardware de nivel industrial"
    ],
    technologies: ["High-Speed Layout", "Smith Chart", "50-Ohm Matching", "EMC/EMI Compliance", "ARM Cortex-M Bare-Metal"],
    difficulty: "Avanzado",
    pageCount: 12
  },
  "summer-ee-glow-up-vol4.pdf": {
    subtitle: "Volumen 4: 10 recursos enfocados en fabricación y producción comercial",
    summary: "Cómo llevar un circuito desde un prototipo en tu mesa hasta una tirada de producción en fábrica: DFM, ensamble SMD automático y pruebas de fin de línea.",
    keyPoints: [
      "01. Reglas de diseño para fabricación (DFM) y ensamble automático (DFA)",
      "02. Preparación impecable de listas de materiales (BOM) y archivos CPL/Pick-and-Place",
      "03. Selección de componentes de reemplazo ante escasez de cadena de suministro",
      "04. Diseño de puntos de prueba (Test Points) y bancos de prueba de cama de clavos",
      "05. Gestión térmica de etapas de potencia: disipación, vías térmicas y radiadores",
      "06. Normativas y estándares internacionales de diseño (IPC-2221, RoHS, CE)"
    ],
    technologies: ["DFM / DFA", "Pick-and-Place", "Thermal Vias", "BOM Management", "IPC Standards"],
    difficulty: "Avanzado",
    pageCount: 10
  }
};

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
    
    // Check if we have curated metadata for this guide
    const curated = GUIDE_DETAILS[filename] || {};
    
    const summary = curated.summary || `Guía técnica y proyecto práctico sobre ${title}. Incluye esquemáticos, componentes recomendados y arquitectura detallada.`;
    const subtitle = curated.subtitle || `${title} • Documentación y guía de desarrollo`;
    const keyPoints = curated.keyPoints || [
      `Arquitectura y fundamentos teóricos de ${title}`,
      "Selección y desglose de componentes de hardware",
      "Diagramas esquemáticos y diseño de circuito",
      "Paso a paso de calibración, pruebas y verificación",
      "Código fuente / firmware y optimización de rendimiento"
    ];
    const technologies = curated.technologies || tags;
    const difficulty = curated.difficulty || "Intermedio / Avanzado";
    const pageCount = curated.pageCount || 15;
    
    return {
      id: `guide-${String(index + 1).padStart(3, '0')}`,
      filename,
      title,
      subtitle,
      summary,
      keyPoints,
      technologies,
      difficulty,
      pageCount,
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
