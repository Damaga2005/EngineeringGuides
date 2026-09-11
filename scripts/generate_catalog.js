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
    keywords: ['drone', 'drones', 'precision', 'move with precision', 'ohmie', 'robot framework']
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
    keywords: ['portfolio', 'recruiter', 'overeducated', 'guide engineers', 'framework']
  },
  {
    id: 'ee-general',
    name: 'Electrical Engineering',
    icon: 'Compass',
    color: 'from-blue-500 to-indigo-600',
    keywords: ['ee', 'engineering']
  }
];

// Rich curated database for all guides
const GUIDE_DATABASE = {
  "(PART 20) 6_Engineering_Projects_That_See_Everything_Coming.pdf": {
    customTitle: "6 Engineering Projects That See Everything Coming (Part 20)",
    subtitle: "Sistema personal de conciencia situacional y defensa táctica",
    summary: "Seis construcciones de hardware que se combinan en un sistema de conciencia situacional completo: visión nocturna, HUD, torre de vigilancia, estación RF y mapa de mando unificado.",
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Avanzado",
    buildTimeTotal: "4-6 semanas",
    estimatedBudget: "$250 - $350",
    pageCount: 18,
    keyProjects: [
      {
        id: 1,
        title: "Digital Night-Vision Monocular",
        cost: "$65",
        time: "1 fin de semana",
        description: "Monocular de visión en oscuridad total utilizando un sensor CMOS de ultra-baja iluminación con filtro IR retirado, iluminador VCSEL de 940nm y micro-display OLED.",
        components: ["Sensor Sony Starvis CMOS", "Iluminador VCSEL 940nm", "Micro-display OLED 0.39\"", "Lente F/1.2", "Batería 18650 con BMS"]
      },
      {
        id: 2,
        title: "Wearable Heads-Up Display (HUD)",
        cost: "$45",
        time: "1 fin de semana",
        description: "Visor óptico colimado montable en gafas o casco que proyecta telemetría, brújula digital y avisos sin obstruir el campo de visión natural del ojo.",
        components: ["Prisma colimador semitransparente", "Micro-OLED SPI", "ESP32-S3", "Sensor IMU BNO085", "Chasis ligero impreso en PETG"]
      },
      {
        id: 3,
        title: "Solar Perimeter Sentry Tower",
        cost: "$85",
        time: "2 fines de semana",
        description: "Torreta autónoma alimentada por panel solar y supercondensadores que monitoriza un perímetro de 50 metros con radar Doppler de 24 GHz y cámara con tracking PTZ.",
        components: ["Radar Doppler 24GHz", "Servos metálicos PTZ", "Cámara ESP32-CAM", "Panel solar 10W", "Controlador MPPT LiFePO4"]
      },
      {
        id: 4,
        title: "RF Spectrum Surveillance Station",
        cost: "$35",
        time: "1 fin de semana",
        description: "Estación de escucha y alerta temprana que barre continuamente desde 50 MHz hasta 1.8 GHz identificando transmisiones de drones, walkies y balizas.",
        components: ["Receptor RTL-SDR v4", "Antena dipolo telescópica", "Raspberry Pi Zero 2W / PC", "Filtro paso banda FM"]
      },
      {
        id: 5,
        title: "Off-Grid LoRa Mesh Node",
        cost: "$30",
        time: "1 día",
        description: "Repetidor de comunicaciones cifradas de largo alcance (10-15 km) sin necesidad de internet, telefonía móvil ni infraestructura eléctrica externa.",
        components: ["Módulo Heltec V3 ESP32 LoRa", "Antena fibra de vidrio 868/915 MHz", "Batería LiPo 3000mAh", "Caja estanca IP67"]
      },
      {
        id: 6,
        title: "Situational Awareness Command Map",
        cost: "$20",
        time: "1 fin de semana",
        description: "Software y servidor táctico ligero que recopila en tiempo real las señales de todos los nodos y proyecta posiciones en mapas vectoriales offline (ATAK / WebTAK).",
        components: ["Servidor local Node.js / Python", "Mapas offline OpenStreetMap", "Protocolo CoT (Cursor-on-Target)", "Interfaz WebTAK"]
      }
    ],
    bom: [
      { name: "Receptor RTL-SDR v4", type: "Radio / RF", specs: "500 kHz - 1.76 GHz, TCXO 1ppm", cost: "$35" },
      { name: "Sensor Sony Starvis IMX307", type: "Óptica / Sensor", specs: "0.001 Lux ultra-low light", cost: "$25" },
      { name: "Módulo Heltec LoRa ESP32-S3", type: "Controlador & Comms", specs: "SX1262, Wi-Fi, BLE, OLED integrado", cost: "$26" },
      { name: "Radar Doppler 24 GHz", type: "Sensores", specs: "Banda ISM 24.125 GHz, detección hasta 20m", cost: "$15" },
      { name: "Micro-Display OLED 0.39\"", type: "Visualización", specs: "1920x1080 o 800x600, interfaz HDMI/SPI", cost: "$38" },
      { name: "Baterías 18650 Li-Ion + Cargador MPPT", type: "Alimentación", specs: "3.7V 3500mAh, protección PCM", cost: "$22" }
    ]
  },

  "(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf": {
    customTitle: "6 Upgrades Your Drone Is Missing (Part 21)",
    subtitle: "Actualizaciones críticas de hardware para drones ArduPilot / PX4",
    summary: "Seis módulos de hardware para dotar a tu dron de capacidades avanzadas: vuelo estacionario interior sin GPS, anillo sensor perimétrico, paracaídas balístico y gimbal estabilizado.",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Avanzado",
    buildTimeTotal: "3-4 semanas",
    estimatedBudget: "$220 - $300",
    pageCount: 16,
    keyProjects: [
      {
        id: 1,
        title: "Indoor Position Hold (Optical Flow + ToF)",
        cost: "$35",
        time: "1 fin de semana",
        description: "Permite un vuelo estacionario perfecto en interiores o bajo puentes sin señal de satélite mediante una cámara de flujo óptico inferior y un telémetro láser ToF.",
        components: ["Sensor Matek Optical Flow & LiDAR 3901-L0X", "Cableado I2C/UART", "Soporte antivibración"]
      },
      {
        id: 2,
        title: "Obstacle-Avoidance Sensor Ring",
        cost: "$50",
        time: "1 fin de semana",
        description: "Anillo perimétrico de 4 a 8 sensores Time-of-Flight que miden continuamente la distancia a paredes en 360° y fuerzan al autopiloto a frenar antes del impacto.",
        components: ["4x Sensores VL53L1X ToF (4 metros)", "Hub expansor I2C", "Chasis perimétrico en fibra de carbono"]
      },
      {
        id: 3,
        title: "Parachute Recovery System",
        cost: "$50",
        time: "1 fin de semana",
        description: "Failsafe autónomo dotado de un acelerómetro independiente que detecta caída libre o vuelco incontrolado y dispara un paracaídas mediante servomuelle.",
        components: ["Tolva de paracaídas con resorte", "Servomotor de gatillo 9g", "Campana ripstop de 1m²", "Microcontrolador ATtiny independiente"]
      },
      {
        id: 4,
        title: "2-Axis Brushless Camera Gimbal (FOC)",
        cost: "$45",
        time: "2 fines de semana",
        description: "Gimbal ultraligero accionado por motores brushless y control vectorial de campo (FOC) que neutraliza las vibraciones mecánicas y el cabeceo del dron.",
        components: ["2x Motores BLDC 2204", "Placa controladora Storm32 BGC", "Sensor IMU MPU6050 para la cámara"]
      },
      {
        id: 5,
        title: "Vision Precision Landing Pad",
        cost: "$30",
        time: "1 fin de semana",
        description: "Sistema de aterrizaje automático guiado por visión artificial que detecta un patrón AprilTag o ArUco iluminado y aterriza el dron con precisión milimétrica.",
        components: ["Cámara OpenMV / Raspberry Pi Cam", "Algoritmo de detección ArUco", "Pad de aterrizaje de alto contraste"]
      },
      {
        id: 6,
        title: "RF Signal-Mapping Payload",
        cost: "$25",
        time: "1 día",
        description: "Carga útil para volar patrones de rejilla y registrar la cobertura exacta de redes Wi-Fi, balizas LoRa o telefonía generando mapas de calor en 3D.",
        components: ["Módulo ESP8266 / ESP32 Sniffer", "Tarjeta MicroSD SPI", "Antena omnidireccional 5dBi"]
      }
    ],
    bom: [
      { name: "Sensor Matek 3901-L0X", type: "Sensores", specs: "Optical Flow PMW3901 + VL53L0X ToF", cost: "$35" },
      { name: "Sensores Láser VL53L1X (Pack 4)", type: "Sensores ToF", specs: "Rango 400cm, ángulo de visión 27°", cost: "$28" },
      { name: "Placa Base Gimbal Storm32 BGC", type: "Control de Motores", specs: "Control de 3 ejes FOC, 32-bit ARM", cost: "$24" },
      { name: "Paracaídas de Emergencia 1m²", type: "Seguridad", specs: "Nylon Ripstop ultraligero con cordaje Kevlar", cost: "$22" },
      { name: "Servomotores y resortes de eyección", type: "Actuadores", specs: "Servo metálico digital de alta velocidad", cost: "$12" }
    ]
  },

  "6 EE Projects That Build a Real Satellite.pdf": {
    customTitle: "6 EE Projects That Build a Real Satellite",
    subtitle: "Subsistemas reales de una nave espacial y arquitectura CubeSat",
    summary: "Guía completa para construir los subsistemas reales de un satélite: propulsión de gas frío, estaciones de seguimiento terrestre, ruedas de reacción y computadoras de a bordo.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Avanzado",
    buildTimeTotal: "6-8 semanas",
    estimatedBudget: "$280 - $340",
    pageCount: 23,
    keyProjects: [
      {
        id: 1,
        title: "Cold-Gas Reaction Thruster",
        cost: "$75",
        time: "2-3 fines de semana",
        description: "Plataforma suspendida en un cojinete de baja fricción que gira y mantiene su orientación disparando ráfagas controladas de gas comprimido (propelente frío CO2/aire).",
        components: ["Electroválvulas solenoides miniatura de 12V", "Boquillas Laval mecanizadas", "Regulador de presión de CO2", "IMU de 9 ejes", "Cojinete de aire/baja fricción"]
      },
      {
        id: 2,
        title: "Auto-Tracking Ground Station",
        cost: "$70",
        time: "2 fines de semana",
        description: "Antena direccional Yagi de alta ganancia montada en un rotor azimut/elevación que rastrea automáticamente los pasos de satélites en órbita terrestre baja (LEO).",
        components: ["Antena Yagi cruzada 437 MHz", "2x Servomotores de alto par con engranajes metálicos", "Controlador ESP32 con cliente SGP4 TLE", "Receptor RTL-SDR"]
      },
      {
        id: 3,
        title: "Magnetorquer Detumble System",
        cost: "$30",
        time: "1 fin de semana",
        description: "Bobinas electromagnéticas que interactúan con el campo geomagnético de la Tierra para frenar la rotación del satélite tras la separación del cohete (modo detumble B-dot).",
        components: ["Bobinas magnéticas con núcleo de ferrita", "Driver en puente H DRV8871", "Magnetómetro triaxial de alta sensibilidad", "Algoritmo de control B-dot"]
      },
      {
        id: 4,
        title: "Satellite-in-a-Box Flight Computer (OBC)",
        cost: "$50",
        time: "2 fines de semana",
        description: "Computadora de a bordo de alta fiabilidad basada en microcontrolador STM32 con sistema operativo de tiempo real (FreeRTOS), watchdog y bus espacial I2C/CAN.",
        components: ["Microcontrolador STM32F405 / STM32F411", "Memoria FRAM no volátil", "Watchdog de hardware externo", "Bus de telemetría CAN/I2C"]
      },
      {
        id: 5,
        title: "Sun-Vector Attitude Sensor",
        cost: "$25",
        time: "1 fin de semana",
        description: "Sensor solar de cuadrante con máscara de apertura que calcula el vector tridimensional hacia el Sol para apuntar los paneles solares y orientar la nave.",
        components: ["Fotodiodos de 4 cuadrantes", "Amplificador transimpedancia multicanal", "ADC diferencial de 16 bits", "Cálculo trigonométrico vectorial"]
      },
      {
        id: 6,
        title: "CubeSat Electrical Power System (EPS)",
        cost: "$45",
        time: "2 fines de semana",
        description: "El corazón eléctrico del satélite: gestiona la carga de baterías de litio desde células solares mediante MPPT espacial, regulando buses de 3.3V y 5V con protección contra sobrecorriente.",
        components: ["Células solares espaciales de alta eficiencia", "Controlador MPPT LT3652", "Batería 2S LiFePO4", "Monitores de corriente INA219 en cada raíl"]
      }
    ],
    bom: [
      { name: "Microcontrolador STM32F405 Core", type: "Procesamiento", specs: "Cortex-M4 168MHz, 1MB Flash, CAN, SPI", cost: "$18" },
      { name: "Electroválvulas Solenoides 12V", type: "Actuadores de Gas", specs: "Tiempo de respuesta <5ms, presión hasta 8 bar", cost: "$26" },
      { name: "Sensor IMU 9-DOF BNO085", type: "Determinación de Actitud", specs: "Fusión sensorial en chip con cuaterniones", cost: "$24" },
      { name: "Puente H DRV8871 (x3)", type: "Driver Magnético", specs: "Control bidireccional de corriente para magnetorquers", cost: "$15" },
      { name: "Células Solares Monocristalinas", type: "Energía", specs: "Eficiencia >22%, protegidas con resina UV", cost: "$22" },
      { name: "Rotor Azimut/Elevación con servos de 25kg", type: "Estación Terrena", specs: "360° Azimut, 90° Elevación, precisión 1°", cost: "$48" }
    ]
  },

  "6 EE Projects That Eavesdrop On The Sky.pdf": {
    customTitle: "6 EE Projects That Eavesdrop On The Sky",
    subtitle: "Inteligencia de señales y recepción pasiva con SDR",
    summary: "Recepción pasiva y 100% legal de señales aéreas, marítimas, meteorológicas y espaciales usando receptores de radio definida por software (SDR) de $30.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Intermedio",
    buildTimeTotal: "2-3 semanas",
    estimatedBudget: "$120 - $160",
    pageCount: 23,
    keyProjects: [
      {
        id: 1,
        title: "ADS-B Aircraft Radar (1090 MHz)",
        cost: "$30",
        time: "1 fin de semana",
        description: "Construye un radar aéreo civil en vivo: recibe las tramas que emiten los aviones comerciales decodificando altitud, coordenadas GPS, velocidad y código ICAO.",
        components: ["Receptor RTL-SDR v4", "Antena colineal 1090 MHz casera", "Filtro SAW 1090 MHz", "Software dump1090 + Tar1090"]
      },
      {
        id: 2,
        title: "TPMS Car-ID Sniffer (433 / 315 MHz)",
        cost: "$30",
        time: "1 día",
        description: "Captura los paquetes inalámbricos que transmiten los sensores de presión de los neumáticos de los vehículos que pasan cerca de tu casa.",
        components: ["Dongle RTL-SDR", "Antena omnidireccional 433 MHz", "Herramienta rtl_433"]
      },
      {
        id: 3,
        title: "Radio Meteor Scatter Detector",
        cost: "$30",
        time: "1 fin de semana",
        description: "Detecta estrellas fugaces en pleno día escuchando el reflejo de transmisores de radio lejanos en las estelas ionizadas que dejan los meteoritos en la alta atmósfera.",
        components: ["Antena direccional Yagi VHF", "SDR de bajo ruido", "Señal continua distante (radar GRAVES en 143.050 MHz)", "Software de audio espectrograma"]
      },
      {
        id: 4,
        title: "AIS Marine Vessel Tracker (162 MHz)",
        cost: "$35",
        time: "1 día",
        description: "Rastrea en un mapa marítimo la posición, rumbo y cargamento de todos los buques de carga, pesqueros y ferris en un radio de hasta 40 km.",
        components: ["Antena marina VHF 162 MHz", "Receptor SDR", "Decodificador AISdispatcher / OpenCPN"]
      },
      {
        id: 5,
        title: "433 MHz ISM Sensor Decoder",
        cost: "$25",
        time: "1 día",
        description: "Decodifica estaciones meteorológicas de vecinos, timbres inalámbricos, sensores de puertas y enchufes inteligentes en la banda libre ISM.",
        components: ["RTL-SDR", "Antena dipolo", "Biblioteca rtl_433 en línea de comandos"]
      },
      {
        id: 6,
        title: "Stratospheric Radiosonde Tracker",
        cost: "$35",
        time: "1 fin de semana",
        description: "Persigue globos sonda meteorológicos lanzados dos veces al día que suben hasta 35.000 metros de altitud emitiendo temperatura, humedad y GPS en 403 MHz.",
        components: ["Antena sintonizada a 403 MHz", "Preamplificador LNA", "Software radiosonde_auto_rx"]
      }
    ],
    bom: [
      { name: "Dongle USB RTL-SDR Blog v4", type: "Radio SDR", specs: "Receptor 500kHz a 1766MHz, filtro HF integrado", cost: "$35" },
      { name: "Preamplificador LNA de banda ancha", type: "RF / Front-end", specs: "Ganancia +20dB, figura de ruido <1dB", cost: "$16" },
      { name: "Filtro SAW paso banda 1090 MHz", type: "Filtros RF", specs: "Atenuación fuera de banda >40dB", cost: "$14" },
      { name: "Kit de cable coaxial RG58 y conectores SMA", type: "Cableado RF", specs: "5 metros de baja pérdida con adaptadores SMA", cost: "$18" },
      { name: "Varillas de cobre/aluminio para antenas DIY", type: "Estructura Antena", specs: "Cobre de 2mm para dipolos y planos de tierra", cost: "$10" }
    ]
  },

  "follow @1nska.pdf": {
    customTitle: "The Robot Framework: Patrocinio y Acceso a Robots Industriales de $30.000",
    subtitle: "El método paso a paso para conseguir que gigantes de la industria te cedan equipamiento robótico de primer nivel",
    summary: "La guía estratégica de 5 pasos con la que un estudiante de ingeniería consiguió el préstamo gratuito de un robot industrial KUKA de 80 kg valorado en $30.000 para su proyecto.",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Estratégico / Todos los niveles",
    buildTimeTotal: "2-4 semanas de ejecución",
    estimatedBudget: "$0 (Préstamo / Patrocinio)",
    pageCount: 11,
    keyProjects: [
      {
        id: 1,
        title: "Paso 1: El Gancho de la Reciprocidad y Visibilidad",
        cost: "$0",
        time: "3 días",
        description: "Cómo transformar la necesidad de tu proyecto en una oportunidad de relaciones públicas y marketing técnico irresistible para la división de I+D de la empresa.",
        components: ["Dossier de impacto de proyecto", "Propuesta de valor para la marca", "Definición de público objetivo"]
      },
      {
        id: 2,
        title: "Paso 2: La Redacción del Correo Frío Irrechazable",
        cost: "$0",
        time: "2 días",
        description: "Estructura milimétrica del mensaje inicial a directores técnicos y branch managers: sin pedir dinero, con fechas cerradas y demostración previa de capacidad técnica.",
        components: ["Plantilla de correo de alta conversión", "Portafolio en vídeo de 30 segundos", "Llamada a la acción de bajo compromiso"]
      },
      {
        id: 3,
        title: "Paso 3: La Presentación del Plan de Investigación",
        cost: "$0",
        time: "1 semana",
        description: "Documento de viabilidad técnica: calendario de hitos, requerimientos de espacio, especificaciones de alimentación eléctrica industrial y plan de seguridad.",
        components: ["Diagrama de Gantt de pruebas", "Análisis de seguridad eléctrica trifásica", "Evaluación de riesgos de colisión"]
      },
      {
        id: 4,
        title: "Paso 4: Logística, Seguros y Acuerdos de Préstamo",
        cost: "$0",
        time: "1 semana",
        description: "Gestión de contratos de comodato (equipo en préstamo temporal), transporte de carga pesada, manipulación de palets y pólizas de seguro de responsabilidad.",
        components: ["Contrato de comodato / préstamo temporal", "Acuerdo de confidencialidad (NDA)", "Gestión de muelle de carga universitario"]
      },
      {
        id: 5,
        title: "Paso 5: Programación, Puesta en Marcha y Retorno de Valor",
        cost: "$0",
        time: "2 semanas",
        description: "Integración del robot industrial en la performance/experimento, programación en lenguaje nativo (KRL) y documentación multimedia para catapultar tu carrera profesional.",
        components: ["Programación cinemática KRL", "Controlador KUKA SmartPAD", "Registro fotográfico y videográfico profesional"]
      }
    ],
    bom: [
      { name: "Robot Industrial de 6 ejes (KUKA Agilus / Universal Robots)", type: "Maquinaria Cedida", specs: "Carga útil 3-6 kg, alcance 700-900mm, repetibilidad 0.02mm", cost: "$0 (Valor $30.000)" },
      { name: "Controlador Industrial y Pendant de Enseñanza", type: "Control", specs: "Alimentación 230V/400V, interfaz de seguridad E-Stop", cost: "$0 (Incluido con robot)" },
      { name: "Entorno de Simulación Cinemática", type: "Software", specs: "KUKA.Sim / RoboDK para verificación de trayectorias", cost: "$0 (Licencia académica)" },
      { name: "Materiales para la Performance / Actuador Final", type: "Herramienta", specs: "Pinza neumática o soporte de herramienta impreso en 3D", cost: "$35" }
    ]
  },

  "Ohmie-Build-Guide.pdf": {
    customTitle: "Ohmie Build Guide: Consola Portátil Arduino & OLED",
    subtitle: "Fabricación paso a paso de una consola de videojuegos de 8 bits con Arduino Uno y display OLED de 2.42 pulgadas",
    summary: "Guía oficial de construcción del Club Ohm: montaje eléctrico, soldadura, carga de firmware y programación de dos juegos retro para Arduino Uno, display OLED y slider analógico.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Principiante a Intermedio",
    buildTimeTotal: "1 fin de semana",
    estimatedBudget: "$35 - $45",
    pageCount: 15,
    keyProjects: [
      {
        id: 1,
        title: "Montaje de Pantalla OLED SPI de Alta Velocidad",
        cost: "$18",
        time: "2 horas",
        description: "Conexionado y configuración del bus SPI por hardware para la pantalla monocroma SSD1309 de 2.42\" alcanzando más de 45 fotogramas por segundo.",
        components: ["Display OLED 2.42\" SSD1309 SPI", "Arduino Uno R3", "Cables Dupont de precisión"]
      },
      {
        id: 2,
        title: "Control Analógico por Potenciómetro Deslizante",
        cost: "$5",
        time: "1 hora",
        description: "Acondicionamiento de señal con filtrado por software para un control suave y sin temblores en las paletas de juego.",
        components: ["Slider Potentiometer 10k lineal", "Condensador cerámico 100nF para desacoplo"]
      },
      {
        id: 3,
        title: "Generador de Audio Retro por Buzzer Piezoeléctrico",
        cost: "$3",
        time: "1 hora",
        description: "Diseño de efectos de sonido chiptune mediante interrupciones de temporizador por modulación PWM sin bloquear el bucle de renderizado de vídeo.",
        components: ["Buzzer pasivo electromagnético", "Resistencia limitadora de 220 ohm"]
      },
      {
        id: 4,
        title: "Arquitectura de Software y Motor de Juego Ligero",
        cost: "$0",
        time: "3 horas",
        description: "Estructuración del bucle principal de juego (game loop) con búfer de pantalla de 1 bit para encajar en los 2 KB de memoria RAM del chip ATmega328P.",
        components: ["Entorno PlatformIO en VS Code", "Biblioteca U8g2 optimizada"]
      }
    ],
    bom: [
      { name: "Placa Arduino Uno R3 / Nano", type: "Microcontrolador", specs: "ATmega328P @ 16 MHz, 32KB Flash, 2KB SRAM", cost: "$8" },
      { name: "Pantalla OLED 2.42\" Monocroma", type: "Display", specs: "128x64 píxeles, controlador SSD1309, bus SPI", cost: "$18" },
      { name: "Potenciómetro Deslizante Lineal 10k", type: "Entrada Analógica", specs: "Recorrido de 60mm, curva lineal tipo B", cost: "$5" },
      { name: "Buzzer Pasivo Piezoeléctrico", type: "Sonido", specs: "Rango 1kHz - 5kHz, 5V", cost: "$2" },
      { name: "Cables, Protoboard y Carcasa", type: "Estructura", specs: "Placa de circuito perforada o protoboard mini", cost: "$6" }
    ]
  }
};

// Default fallback generator for remaining guides
function getFallbackData(filename, title, categoryId) {
  let image = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
  if (categoryId === 'aerospace') image = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
  else if (categoryId === 'robotics-drones') image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80";
  else if (categoryId === 'cs-ai') image = "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80";
  else if (categoryId === 'electronics') image = "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80";
  else if (categoryId === 'career') image = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80";

  return {
    subtitle: `Guía técnica y de laboratorio: ${title}`,
    summary: `Proyecto exhaustivo que cubre fundamentos teóricos, diagramas esquemáticos, lista de componentes y metodologías de prueba para construir sistemas de ingeniería profesionales.`,
    image,
    difficulty: "Intermedio / Avanzado",
    buildTimeTotal: "2-4 semanas",
    estimatedBudget: "$80 - $180",
    pageCount: 16,
    keyProjects: [
      { id: 1, title: `Arquitectura de Hardware de ${title}`, cost: "$35", time: "1 semana", description: "Diseño y selección de subsistemas para garantizar máxima fiabilidad y rendimiento.", components: ["Microcontrolador principal", "Front-end de acondicionamiento"] },
      { id: 2, title: "Captura Esquemática y Simulación", cost: "$0", time: "3 días", description: "Validación de cálculos eléctricos y respuesta transitoria mediante simuladores SPICE.", components: ["KiCad EDA", "SPICE Engine"] },
      { id: 3, title: "Prototipado en Placa y Medición", cost: "$40", time: "1 fin de semana", description: "Ensamblaje del circuito y verificación con osciloscopio y analizador lógico.", components: ["Componentes pasivos SMD", "Osciloscopio digital"] },
      { id: 4, title: "Desarrollo de Firmware de Tiempo Real", cost: "$0", time: "1 semana", description: "Control en bajo nivel mediante registros, periféricos DMA e interrupciones.", components: ["C/C++ Bare-metal", "RTOS"] },
      { id: 5, title: "Pruebas de Estrés y Validación Final", cost: "$15", time: "3 días", description: "Ensayos de carga, térmicos y verificación de compatibilidad.", components: ["Banco de pruebas", "Cargas dinámicas"] }
    ],
    bom: [
      { name: "Placa de Desarrollo / Microcontrolador", type: "Control", specs: "32-bit ARM Cortex / ESP32", cost: "$15 - $25" },
      { name: "Sensores y Transductores", type: "Adquisición", specs: "Sensores de precisión calibrados", cost: "$20 - $40" },
      { name: "Etapa de Potencia y Regulación", type: "Alimentación", specs: "Reguladores LDO y convertidores buck de bajo ruido", cost: "$12 - $20" },
      { name: "PCB a Medida de 2 o 4 capas", type: "Fabricación", specs: "FR4, acabado ENIG o HASL sin plomo", cost: "$15" },
      { name: "Componentes Pasivos y Conectores", type: "Miscelánea", specs: "Resistencias 1%, condensadores cerámicos X7R", cost: "$15" }
    ]
  };
}

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
  if (filename === 'follow @1nska.pdf') {
    return 'The Robot Framework: Patrocinio de Robots de $30.000';
  }

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
  if (filename === 'follow @1nska.pdf') {
    return 'career';
  }
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
  if (filename === 'follow @1nska.pdf') {
    return ['Career', 'Industrial Robots', 'KUKA', 'Networking', 'Robotics', 'Sponsorship'];
  }

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
  
  let existingGuidesMap = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      if (existingData && Array.isArray(existingData.guides)) {
        existingData.guides.forEach(g => {
          existingGuidesMap[g.filename] = g;
        });
      }
    } catch (e) {
      console.warn('Could not parse existing guides.json, creating fresh catalog.');
    }
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
    
    const id = `guide-${String(index + 1).padStart(3, '0')}`;
    const existing = existingGuidesMap[filename];
    const curated = GUIDE_DATABASE[filename] || getFallbackData(filename, title, categoryId);
    
    const finalTitle = existing?.title || curated.customTitle || title;
    const summary = existing?.summary || curated.summary;
    const subtitle = existing?.subtitle || curated.subtitle;
    const keyProjects = (existing?.keyProjects && existing.keyProjects.length > 0) ? existing.keyProjects : (curated.keyProjects || []);
    const bom = (existing?.bom && existing.bom.length > 0) ? existing.bom : (curated.bom || []);
    const image = existing?.image || `covers/${id}.png`;
    const difficulty = existing?.difficulty || curated.difficulty || "Intermedio / Avanzado";
    const pageCount = existing?.pageCount || curated.pageCount || 15;
    const buildTimeTotal = existing?.buildTimeTotal || curated.buildTimeTotal || "2-4 semanas";
    const estimatedBudget = existing?.estimatedBudget || curated.estimatedBudget || "$100 - $200";
    
    // Flatten keyPoints strings for quick card views
    const keyPoints = existing?.keyPoints && existing.keyPoints.length > 0 
      ? existing.keyPoints 
      : keyProjects.map(p => `${p.id}. ${p.title} (${p.cost || ''}) — ${p.description ? p.description.slice(0, 90) : ''}...`);

    return {
      id,
      filename,
      title: finalTitle,
      subtitle,
      summary,
      image,
      difficulty,
      pageCount,
      buildTimeTotal,
      estimatedBudget,
      keyProjects,
      bom,
      keyPoints,
      technologies: existing?.technologies || tags,
      relativePath: `Engineering guides/${filename}`,
      sizeBytes: stat.size,
      sizeFormatted: formatSize(stat.size),
      categoryId: existing?.categoryId || categoryId,
      tags: existing?.tags || tags,
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
