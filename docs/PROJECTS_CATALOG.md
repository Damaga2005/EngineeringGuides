# 📚 Catálogo Completo de Guías y Subproyectos

> Índice oficial exhaustivo de las 31 guías maestras y los 183 proyectos prácticos construibles.

- **Total de Guías Oficiales**: 31
- **Tamaño Total de Documentación**: 25.8 MB
- **Plataforma en Producción**: [damaga2005.github.io/EngineeringGuides](https://damaga2005.github.io/EngineeringGuides/)

---

## [guide-001] 6 Engineering Projects That See Everything Coming (Part 20)
- **Disciplina**: Electrical Engineering
- **Páginas**: 18 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $260 - $340
- **Archivo Original**: `(PART 20) 6_Engineering_Projects_That_See_Everything_Coming.pdf` (1.2 MB)
- **Resumen**: Seis construcciones de hardware que se combinan en un sistema de alerta temprana: monocular de visión nocturna, HUD wearable, torre de vigilancia solar, estación RF y mapa de mando táctico unificado.

### Proyectos Prácticos Incluidos:
1. **Digital Night-Vision Monocular** ($65, 1 fin de semana)
   - *Descripción*: Sensor CMOS de ultra-baja iluminación con filtro IR retirado, iluminador VCSEL de 940nm y micro-display OLED.
   - *Componentes Clave*: `Sony Starvis IMX307, VCSEL 940nm, Micro-OLED 0.39", Lente F/1.2`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p1.svg`
1. **Wearable Heads-Up Display (HUD)** ($45, 1 fin de semana)
   - *Descripción*: Óptica colimada montada en casco que proyecta brújula, telemetría y waypoints sin tapar la visión natural.
   - *Componentes Clave*: `Prisma colimador, ESP32-S3, IMU BNO085, Display OLED`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p2.svg`
1. **Solar Perimeter Sentry Tower** ($85, 2 fines de semana)
   - *Descripción*: Torreta autónoma perimetral con radar Doppler de 24 GHz, tracking PTZ y alimentación solar con supercondensadores.
   - *Componentes Clave*: `Radar 24GHz, Servos PTZ, ESP32-CAM, Panel 10W`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p3.svg`
1. **RF Spectrum Surveillance Station** ($35, 1 fin de semana)
   - *Descripción*: Escáner continuo de 50 MHz a 1.8 GHz que detecta y alerta sobre transmisiones de drones y walkies.
   - *Componentes Clave*: `RTL-SDR v4, Antena telescópica, Raspberry Pi Zero 2W`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p4.svg`
1. **Off-Grid LoRa Mesh Node** ($30, 1 día)
   - *Descripción*: Malla cifrada de largo alcance (10-15 km) para comunicación táctica sin depender de internet ni telefonía.
   - *Componentes Clave*: `Heltec V3 ESP32 LoRa, Antena fibra de vidrio, Caja IP67`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p5.svg`
1. **Tactical Situational Awareness Map** ($20, 1 fin de semana)
   - *Descripción*: Servidor táctico offline compatible con ATAK/WebTAK que unifica en tiempo real todos los sensores.
   - *Componentes Clave*: `Servidor Node.js, OpenStreetMap offline, Protocolo CoT`
   - *Esquemático Vectorial*: `public/schematics/guide-001_p6.svg`

---

## [guide-002] 6 Upgrades Your Drone Is Missing (Part 21)
- **Disciplina**: Robotics & Drones
- **Páginas**: 16 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $220 - $290
- **Archivo Original**: `(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf` (1.6 MB)
- **Resumen**: Mejoras tácticas modulares: vuelo estacionario interior sin GPS, anillo sensor anticolisión, paracaídas de emergencia, gimbal FOC y aterrizaje guiado por visión.

### Proyectos Prácticos Incluidos:
1. **Indoor Position Hold (Optical Flow + ToF)** ($35, 1 fin de semana)
   - *Descripción*: Vuelo estacionario milimétrico en interiores sin señal GPS usando flujo óptico hacia el suelo.
   - *Componentes Clave*: `Matek 3901-L0X, UART/I2C`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p1.svg`
1. **Obstacle-Avoidance Sensor Ring** ($50, 1 fin de semana)
   - *Descripción*: Anillo perimétrico de 4 a 8 sensores láser ToF que frena el dron a distancia segura de muros.
   - *Componentes Clave*: `4x VL53L1X, Hub I2C, Soporte carbono`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p2.svg`
1. **Parachute Recovery System** ($50, 1 fin de semana)
   - *Descripción*: Failsafe autónomo con sensor de caída libre que eyecta un paracaídas para salvar el dron.
   - *Componentes Clave*: `Tolva con resorte, Servo gatillo, Campana 1m²`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p3.svg`
1. **2-Axis Brushless Gimbal (FOC)** ($45, 2 fines de semana)
   - *Descripción*: Gimbal ultraligero con control vectorial de campo que elimina vibraciones en la cámara.
   - *Componentes Clave*: `2x Motores BLDC 2204, Storm32 BGC, IMU MPU6050`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p4.svg`
1. **Vision Precision Landing** ($30, 1 fin de semana)
   - *Descripción*: Aterrizaje autónomo sobre una plataforma pequeña mediante detección visual de marcadores ArUco.
   - *Componentes Clave*: `OpenMV Cam, Algoritmo ArUco, Pad de aterrizaje`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p5.svg`
1. **Signal-Mapping Payload** ($25, 1 día)
   - *Descripción*: Carga útil para generar mapas tridimensionales de potencia de señales Wi-Fi y LoRa.
   - *Componentes Clave*: `ESP32 Sniffer, MicroSD SPI, Antena 5dBi`
   - *Esquemático Vectorial*: `public/schematics/guide-002_p6.svg`

---

## [guide-003] 6 EE Projects That Build a Real Satellite
- **Disciplina**: Aerospace & Satellites
- **Páginas**: 23 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $280 - $340
- **Archivo Original**: `6 EE Projects That Build a Real Satellite.pdf` (393.9 KB)
- **Resumen**: Construcción práctica de subsistemas orbitales: propulsión de gas frío RCS, estación terrestre auto-tracking, magnetorquers, OBC espacial y energía solar MPPT.

### Proyectos Prácticos Incluidos:
1. **Cold-Gas Reaction Thruster** ($75, 2-3 fines de semana)
   - *Descripción*: Plataforma que gira y mantiene el rumbo disparando ráfagas de gas comprimido (sistema RCS).
   - *Componentes Clave*: `Electroválvulas 12V, Boquillas Laval, Regulador CO2, IMU 9-DOF`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p1.svg`
1. **Auto-Tracking Ground Station** ($70, 2 fines de semana)
   - *Descripción*: Antena Yagi orientable en azimut y elevación que rastrea satélites LEO automáticamente.
   - *Componentes Clave*: `Yagi 437 MHz, Servos 25kg, ESP32, SGP4 TLE`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p2.svg`
1. **Magnetorquer Detumble System** ($30, 1 fin de semana)
   - *Descripción*: Bobinas que frenan el giro del satélite interactuando con el campo magnético de la Tierra.
   - *Componentes Clave*: `Bobinas ferrita, Driver DRV8871, Magnetómetro`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p3.svg`
1. **CubeSat Flight Computer (OBC)** ($50, 2 fines de semana)
   - *Descripción*: Computadora de a bordo de alta fiabilidad en STM32 con FreeRTOS y bus espacial CAN.
   - *Componentes Clave*: `STM32F405, FRAM SPI, Watchdog externo`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p4.svg`
1. **Sun-Vector Attitude Sensor** ($25, 1 fin de semana)
   - *Descripción*: Sensor de cuadrante de fotodiodos que calcula el vector solar tridimensional.
   - *Componentes Clave*: `Fotodiodos 4 cuadrantes, Amplificador transimpedancia`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p5.svg`
1. **CubeSat Power System (EPS)** ($45, 2 fines de semana)
   - *Descripción*: Sistema de gestión eléctrica con seguimiento MPPT, baterías LiFePO4 y telemetría de raíles.
   - *Componentes Clave*: `Células solares, MPPT LT3652, Monitores INA219`
   - *Esquemático Vectorial*: `public/schematics/guide-003_p6.svg`

---

## [guide-004] 6 EE Projects That Eavesdrop On The Sky
- **Disciplina**: Aerospace & Satellites
- **Páginas**: 23 págs | **Dificultad**: Intermedio | **Presupuesto Est.**: $110 - $150
- **Archivo Original**: `6 EE Projects That Eavesdrop On The Sky.pdf` (380.7 KB)
- **Resumen**: Recepción pasiva y legal de señales del cielo con un dongle SDR de $30: radar de aviones ADS-B, sensores de coches TPMS, meteoros en ionosfera y sondas meteorológicas.

### Proyectos Prácticos Incluidos:
1. **ADS-B Aircraft Radar** ($30, 1 fin de semana)
   - *Descripción*: Mapa en vivo de todos los aviones sobrevolando tu ciudad en 1090 MHz.
   - *Componentes Clave*: `RTL-SDR v4, Antena colineal, dump1090`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p1.svg`
1. **TPMS Car-ID Sniffer** ($30, 1 día)
   - *Descripción*: Decodificación de sensores de presión de neumáticos de vehículos en 433/315 MHz.
   - *Componentes Clave*: `RTL-SDR, Antena dipolo, rtl_433`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p2.svg`
1. **Radio Meteor Scatter Detector** ($30, 1 fin de semana)
   - *Descripción*: Detección de meteoritos reflejando ondas en la ionosfera con radar GRAVES.
   - *Componentes Clave*: `Antena Yagi VHF, SDR, Audio FFT`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p3.svg`
1. **AIS Marine Vessel Tracker** ($35, 1 día)
   - *Descripción*: Rastreador en vivo de buques, cargueros y ferris en 162 MHz.
   - *Componentes Clave*: `Antena marina 162MHz, OpenCPN, SDR`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p4.svg`
1. **433 MHz ISM Sensor Decoder** ($25, 1 día)
   - *Descripción*: Lectura de estaciones meteorológicas y dispositivos inalámbricos locales.
   - *Componentes Clave*: `RTL-SDR, Herramienta rtl_433`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p5.svg`
1. **Stratospheric Radiosonde Tracker** ($35, 1 fin de semana)
   - *Descripción*: Seguimiento de globos meteorológicos a 30 km de altura en 403 MHz.
   - *Componentes Clave*: `Antena 403MHz, LNA, radiosonde_auto_rx`
   - *Esquemático Vectorial*: `public/schematics/guide-004_p6.svg`

---

## [guide-005] 6 EE Projects That Move With Precision
- **Disciplina**: Robotics & Drones
- **Páginas**: 19 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $180 - $260
- **Archivo Original**: `6 EE Projects That Move With Precision.pdf` (1.1 MB)
- **Resumen**: Construcción de actuadores electromecánicos de alta precisión: control vectorial de motores brushless, etapas lineales de husillo antibacklash y péndulo invertido dinámico.

### Proyectos Prácticos Incluidos:
1. **Closed-Loop Stepper Controller** ($35, 1 fin de semana)
   - *Descripción*: Motor paso a paso con encoder magnético absoluto que nunca pierde pasos.
   - *Componentes Clave*: `NEMA 17, AS5600, Driver TMC2209`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p1.svg`
1. **Field-Oriented Control (FOC) BLDC Servo** ($45, 2 fines de semana)
   - *Descripción*: Servomotor sin escobillas suave y silencioso con control vectorial de par.
   - *Componentes Clave*: `Motor BLDC gimbal, Driver SimpleFOC, STM32`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p2.svg`
1. **Micrometric Linear Lead-Screw Stage** ($40, 1 fin de semana)
   - *Descripción*: Platina de desplazamiento lineal con resolución de 5 micras y husillo antibacklash.
   - *Componentes Clave*: `Husillo T8, Raíl lineal MGN12, Cuerpo aluminio`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p3.svg`
1. **PID Inverted Pendulum Balancer** ($35, 1 fin de semana)
   - *Descripción*: Péndulo auto-estabilizado dinámicamente mediante control PID en bucle cerrado rápido.
   - *Componentes Clave*: `Carro lineal, Encoder rotatorio, Algoritmo PID`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p4.svg`
1. **Torque-Limiting Linear Actuator** ($45, 1 fin de semana)
   - *Descripción*: Actuador con sensor de corriente de alta velocidad para protección de pinzas.
   - *Componentes Clave*: `Motorreductor, Sensor INA226, Puente H`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p5.svg`
1. **3D-Printed Cycloidal Drive Joint** ($30, 1 fin de semana)
   - *Descripción*: Junta robótica de alto par sin holgura basada en reducción cicloidal 20:1.
   - *Componentes Clave*: `Rodamientos, Pines mecanizados, Impresión PETG`
   - *Esquemático Vectorial*: `public/schematics/guide-005_p6.svg`

---

## [guide-006] 6 EE Projects That Put You on a Drone Team
- **Disciplina**: Robotics & Drones
- **Páginas**: 20 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $190 - $270
- **Archivo Original**: `6 EE Projects That Put You on a Drone Team.pdf` (133.6 KB)
- **Resumen**: Seis desarrollos clave para demostrar nivel profesional en ingeniería de UAVs: controladora de vuelo propia en STM32, variador ESC con conmutación rápida y registrador blackbox.

### Proyectos Prácticos Incluidos:
1. **Custom STM32 Flight Controller** ($35, 2 fines de semana)
   - *Descripción*: Controladora de vuelo en PCB de 4 capas con IMU SPI y filtro Kalman en C.
   - *Componentes Clave*: `STM32F405, ICM-42688-P, Barómetro DPS310`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p1.svg`
1. **High-Speed Brushless ESC** ($25, 1 fin de semana)
   - *Descripción*: Variador de velocidad electrónico con conmutación por MOSFETs y DShot600.
   - *Componentes Clave*: `6x MOSFETs N-channel, Gate Drivers, ATtiny/STM32`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p2.svg`
1. **Bidirectional Telemetry Link** ($30, 1 fin de semana)
   - *Descripción*: Módem de telemetría digital bidireccional con protocolo MAVLink y cifrado.
   - *Componentes Clave*: `Transceptor RFM95 / ELRS, Antena dipolo T`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p3.svg`
1. **Power Distribution Board & Shunt Monitor** ($20, 1 fin de semana)
   - *Descripción*: Placa PDB para 6S LiPo con reguladores duales de bajo ruido y sensor de 100A.
   - *Componentes Clave*: `Shunt 0.5mΩ, Regulador Buck 5V 3A, Filtro LC`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p4.svg`
1. **Attitude Sensor Fusion Engine** ($0, 1 fin de semana)
   - *Descripción*: Filtro de Kalman extendido (EKF) para estimación precisa de orientación en vuelo.
   - *Componentes Clave*: `Firmware en C, Matemáticas de cuaterniones`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p5.svg`
1. **High-Rate SPI Blackbox Logger** ($15, 1 día)
   - *Descripción*: Grabador de telemetría a 1 kHz en memoria flash SPI para análisis de vibraciones.
   - *Componentes Clave*: `Memoria Flash SPI W25Q128 16MB, Lector USB`
   - *Esquemático Vectorial*: `public/schematics/guide-006_p6.svg`

---

## [guide-007] 6 EE Projects That Reach Space
- **Disciplina**: Aerospace & Satellites
- **Páginas**: 21 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $200 - $280
- **Archivo Original**: `6 EE Projects That Reach Space.pdf` (389.5 KB)
- **Resumen**: Proyectos espaciales realizables desde tu laboratorio: recepción directa de satélites meteorológicos geoestacionarios, ruedas de reacción y detector de muones cósmicos.

### Proyectos Prácticos Incluidos:
1. **GOES Full-Disk Earth Receiver (1.7 GHz)** ($65, 2 fines de semana)
   - *Descripción*: Descarga imágenes completas de la Tierra en tiempo real desde el satélite GOES a 36.000 km.
   - *Componentes Clave*: `Antena parabólica de rejilla WiFi, LNA Sawbird GOES, RTL-SDR`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p1.svg`
1. **Meteor-M2 Weather Satellite Receiver (137 MHz)** ($30, 1 fin de semana)
   - *Descripción*: Recepción de fotos de alta resolución de tu ciudad con antena V-dipole casera.
   - *Componentes Clave*: `Antena V-dipole, RTL-SDR, Software satdump`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p2.svg`
1. **Reaction-Wheel Attitude Controller** ($45, 2 fines de semana)
   - *Descripción*: Rueda de reacción balanceada que orienta una plataforma espacial mediante conservación de momento.
   - *Componentes Clave*: `Volante de inercia latón, Motor brushless, Sensor IMU`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p3.svg`
1. **Camera-Based Star Tracker** ($40, 1 fin de semana)
   - *Descripción*: Cámara que identifica constelaciones nocturnas y calcula la orientación absoluta de la nave.
   - *Componentes Clave*: `Cámara de baja luz, Lente 16mm, Base de datos estelar`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p4.svg`
1. **GPS-Disciplined Oscillator (GPSDO)** ($35, 1 fin de semana)
   - *Descripción*: Reloj de referencia de 10 MHz con precisión atómica sincronizado con la señal PPS de GPS.
   - *Componentes Clave*: `Módulo GPS PPS, Oscilador OCXO 10MHz, Bucle PLL`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p5.svg`
1. **Cosmic-Ray Muon Detector** ($45, 2 fines de semana)
   - *Descripción*: Detector de partículas subatómicas del espacio profundo mediante fotomultiplicador de silicio.
   - *Componentes Clave*: `Centellador plástico, SiPM, Amplificador rápido`
   - *Esquemático Vectorial*: `public/schematics/guide-007_p6.svg`

---

## [guide-008] 6 EE Projects That Read The Body
- **Disciplina**: Electronics & Hardware
- **Páginas**: 20 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $140 - $210
- **Archivo Original**: `6 EE Projects That Read The Body.pdf` (1.2 MB)
- **Resumen**: Diseño de circuitos analógicos de ultra-bajo ruido con aislamiento galvánico para captar bioseñales humanas: ECG cardíaco, EMG muscular, EEG cerebral y oximetría.

### Proyectos Prácticos Incluidos:
1. **3-Lead ECG Heart Rate Monitor** ($30, 1 fin de semana)
   - *Descripción*: Electrocardiógrafo analógico con amplificador de instrumentación y pierna derecha activa.
   - *Componentes Clave*: `INA128, Filtro Notch 50/60Hz, Electrodos Ag/AgCl`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p1.svg`
1. **EMG Muscle-Controlled Prosthetic Trigger** ($25, 1 fin de semana)
   - *Descripción*: Sensor de electromiografía que detecta la flexión muscular y acciona una mano mecánica.
   - *Componentes Clave*: `Rectificador de precisión, Integrador analógico, Servo`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p2.svg`
1. **Single-Channel Alpha-Wave EEG Monitor** ($35, 1 fin de semana)
   - *Descripción*: Detección de ondas cerebrales alfa (8-12 Hz) al cerrar los ojos mediante filtrado activo.
   - *Componentes Clave*: `Amplificador de muy bajo ruido, Filtro paso banda activo`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p3.svg`
1. **Dual-Wavelength Pulse Oximeter (PPG)** ($20, 1 día)
   - *Descripción*: Medición de oxígeno en sangre y pulso mediante absorción diferencial de luz roja e infrarroja.
   - *Componentes Clave*: `Sensor MAX30102, I2C, OLED`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p4.svg`
1. **Galvanic Skin Response (GSR) Stress Sensor** ($15, 1 día)
   - *Descripción*: Medición de la conductancia eléctrica de la piel para cuantificar niveles de estrés.
   - *Componentes Clave*: `Puente divisor sensible, Electrodos en dedos`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p5.svg`
1. **Bio-Impedance Body Composition Analyzer** ($35, 1 fin de semana)
   - *Descripción*: Inyección de corriente alterna segura de 50 kHz para calcular porcentaje de masa grasa.
   - *Componentes Clave*: `Generador AD9833, Aislamiento galvánico, ADC`
   - *Esquemático Vectorial*: `public/schematics/guide-008_p6.svg`

---

## [guide-009] 6 EE Projects That See With Light
- **Disciplina**: Electronics & Hardware
- **Páginas**: 18 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $160 - $240
- **Archivo Original**: `6 EE Projects That See With Light.pdf` (1.1 MB)
- **Resumen**: Construcciones de ingeniería óptica: telémetros láser LiDAR de nanosegundos, enlaces ópticos de datos por aire libre, vibrómetros láser sin contacto y escáneres 3D.

### Proyectos Prácticos Incluidos:
1. **Optical Break-Beam Speed Trap** ($20, 1 día)
   - *Descripción*: Barrera láser de dos haces para medir la velocidad de proyectiles u objetos rápidos.
   - *Componentes Clave*: `Diodos láser 650nm, Fototransistores rápidos, Temporizador`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p1.svg`
1. **Laser Rangefinder (ToF LiDAR)** ($40, 1 fin de semana)
   - *Descripción*: Medición milimétrica de distancia midiendo el tiempo de vuelo de pulsos de luz.
   - *Componentes Clave*: `Sensor VL53L1X, Lente colimadora, ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p2.svg`
1. **Spinning LiDAR Room Scanner** ($55, 2 fines de semana)
   - *Descripción*: Torreta rotatoria que mapea habitaciones completas en 360 grados en 2D.
   - *Componentes Clave*: `Sensor ToF, Anillo rozante (slip ring), Motor DC paso`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p3.svg`
1. **Free-Space Optical (FSO) Laser Data Link** ($30, 1 fin de semana)
   - *Descripción*: Transmisión de audio y datos digitales por haz láser infrarrojo a través de una habitación.
   - *Componentes Clave*: `Láser modulable, Fotodiodo PIN, Amplificador transimpedancia`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p4.svg`
1. **Laser Doppler Vibrometer** ($45, 1 fin de semana)
   - *Descripción*: Lectura de vibraciones mecánicas y sonido apuntando un haz láser a una superficie.
   - *Componentes Clave*: `Divisor de haz óptico, Fotodiodo balanceado`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p5.svg`
1. **Structured-Light 3D Scanner** ($35, 1 fin de semana)
   - *Descripción*: Proyector de línea láser que barre objetos para reconstruir modelos 3D en malla.
   - *Componentes Clave*: `Láser con lente de línea, Cámara USB, Python OpenCV`
   - *Esquemático Vectorial*: `public/schematics/guide-009_p6.svg`

---

## [guide-010] 6 EE Projects That See With Radio
- **Disciplina**: Electronics & Hardware
- **Páginas**: 19 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $150 - $220
- **Archivo Original**: `6 EE Projects That See With Radio.pdf` (1.1 MB)
- **Resumen**: Construcción de sistemas de radar en bandas ISM de microondas (10 GHz y 24 GHz): pistolas cinemométricas, radar FMCW de distancia, signos vitales a distancia y radar pasivo.

### Proyectos Prácticos Incluidos:
1. **10.5 GHz Doppler Motion Radar** ($15, 1 día)
   - *Descripción*: Detección de velocidad y movimiento en microondas con módulo Gunn HB100.
   - *Componentes Clave*: `HB100 10.5GHz, Preamplificador operacional, Arduino`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p1.svg`
1. **Calibrated Radar Speed Gun** ($35, 1 fin de semana)
   - *Descripción*: Pistola de velocidad con lectura digital directa en km/h o mph para coches y pelotas.
   - *Componentes Clave*: `Sensor radar 24GHz, Display OLED, Batería 9V`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p2.svg`
1. **FMCW Ranging Radar (24 GHz)** ($60, 2 fines de semana)
   - *Descripción*: Radar de onda continua modulada en frecuencia para medir distancia exacta a obstáculos.
   - *Componentes Clave*: `Módulo FMCW 24GHz, ADC rápido, FFT en PC/ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p3.svg`
1. **Micro-Doppler Vital-Signs Radar** ($40, 1 fin de semana)
   - *Descripción*: Detección de frecuencia respiratoria y latidos cardíacos sin cables ni contacto físico.
   - *Componentes Clave*: `Módulo radar alta ganancia, Filtro paso bajo 2Hz, FFT`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p4.svg`
1. **Through-Wall WiFi Motion Detector** ($20, 1 fin de semana)
   - *Descripción*: Detección de personas a través de paredes analizando las perturbaciones CSI de Wi-Fi.
   - *Componentes Clave*: `2x Módulos ESP32 con firmware CSI, Python tool`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p5.svg`
1. **Passive Bistatic Radar** ($45, 2 fines de semana)
   - *Descripción*: Rastreo de aeronaves utilizando señales de transmisores de radio FM comerciales lejanos.
   - *Componentes Clave*: `Doble sintonizador RTL-SDR coherente, Antenas`
   - *Esquemático Vectorial*: `public/schematics/guide-010_p6.svg`

---

## [guide-011] 6 EE Projects That See The Invisible (Dark Ops)
- **Disciplina**: Electrical Engineering
- **Páginas**: 17 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $210 - $280
- **Archivo Original**: `6_EE_Projects_That_See_The_Invisible_dark_ops.pdf` (1.2 MB)
- **Resumen**: Seis construcciones de hardware táctico enfocadas en el espectro invisible: receptor GNSS inmune a jamming, radiogoniómetro RF Doppler, detector de anomalías magnéticas, sensor sísmico desatendido, receptor pasivo anti-UAS y enlace FHSS cifrado.

### Proyectos Prácticos Incluidos:
1. **GNSS Receiver & Resilience Analysis** ($25, 1 fin de semana)
   - *Descripción*: Recepción de constelaciones GPS/Galileo y análisis de correlación frente a ataques de jamming y spoofing.
   - *Componentes Clave*: `u-blox NEO-6M / M8N, RTL-SDR v4, Antena activa L1 1575MHz, ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p1.svg`
1. **RF Direction Finder (Pseudo-Doppler)** ($50, 2 fines de semana)
   - *Descripción*: Radiogoniómetro con conmutación circular de antenas que apunta automáticamente hacia cualquier emisor hostil.
   - *Componentes Clave*: `Arreglo 4x dipolos, Interruptor RF SP4T HMC241, RTL-SDR, ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p2.svg`
1. **Magnetic Anomaly Detector (Fluxgate)** ($30, 1 fin de semana)
   - *Descripción*: Gradiómetro magnético de ultra-precisión para detectar el paso de vehículos blindados por la distorsión del campo terrestre.
   - *Componentes Clave*: `Sensor fluxgate FGM-3, Amplificador de instrumentación, ADC 24-bit ADS1220, Filtro analógico`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p3.svg`
1. **Seismic Unattended Ground Sensor (UGS)** ($35, 1 fin de semana)
   - *Descripción*: Sensor sísmico geófono VLF con acondicionamiento analógico de señal y clasificación de pisadas humanas vs vehículos.
   - *Componentes Clave*: `Geófono SM-24 4.5Hz, Op-amp bajo ruido OPA227, ESP32 ADC, Filtro pasa-banda`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p4.svg`
1. **Passive Drone Detection Receiver** ($40, 1 fin de semana)
   - *Descripción*: Escáner espectral de banda ancha que detecta la presencia de drones interceptando sus paquetes de control y vídeo.
   - *Componentes Clave*: `Receptor SDR, Antena directiva 2.4/5.8GHz, Raspberry Pi Zero 2W, Filtro SAW`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p5.svg`
1. **Frequency-Hopping Encrypted Link (FHSS)** ($30, 1 fin de semana)
   - *Descripción*: Enlace de radioenlace que salta 50 veces por segundo de frecuencia con autenticación y cifrado AES-256 por paquete.
   - *Componentes Clave*: `2x Transceptores SX1262 LoRa, ESP32-S3, Antena helicoidal, TCXO`
   - *Esquemático Vectorial*: `public/schematics/guide-011_p6.svg`

---

## [guide-012] 6 EE Projects That See The Invisible (Revised Edition)
- **Disciplina**: Electrical Engineering
- **Páginas**: 23 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $210 - $280
- **Archivo Original**: `6_EE_Projects_That_See_The_Invisible_revised.pdf` (3.2 MB)
- **Resumen**: Edición revisada y expandida: seis construcciones completas de instrumentación de defensa para detectar señales ocultas, anomalías magnéticas en el subsuelo y emisiones de radio hostiles.

### Proyectos Prácticos Incluidos:
1. **GNSS Receiver & Resilience Analysis** ($25, 1 fin de semana)
   - *Descripción*: Recepción GNSS L1 y algoritmos de mitigación de interferencias intencionadas (Anti-Jamming).
   - *Componentes Clave*: `u-blox NEO-6M, RTL-SDR, Antena activa 1575MHz`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p1.svg`
1. **RF Direction Finder (Pseudo-Doppler)** ($50, 2 fines de semana)
   - *Descripción*: Radiogoniómetro Doppler con conmutación circular de antenas para localización de emisores.
   - *Componentes Clave*: `Arreglo 4x dipolos, Switch RF HMC241, RTL-SDR`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p2.svg`
1. **Magnetic Anomaly Detector (Fluxgate)** ($30, 1 fin de semana)
   - *Descripción*: Gradiómetro magnético de alta sensibilidad para detección de masas ferrosas en movimiento.
   - *Componentes Clave*: `Sensor fluxgate, Op-amp instrumentación, ADC 24-bit`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p3.svg`
1. **Seismic Unattended Ground Sensor (UGS)** ($35, 1 fin de semana)
   - *Descripción*: Sensor sísmico VLF con clasificación por frecuencia fundamental y cadencia de impacto.
   - *Componentes Clave*: `Geófono SM-24, Filtro analógico pasa-bajos, ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p4.svg`
1. **Passive Drone Detection Receiver** ($40, 1 fin de semana)
   - *Descripción*: Receptor pasivo que detecta firmas de radiofrecuencia de drones en bandas ISM.
   - *Componentes Clave*: `SDR Blog v4, Antena log-periódica, Raspberry Pi Zero`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p5.svg`
1. **Frequency-Hopping Encrypted Link (FHSS)** ($30, 1 fin de semana)
   - *Descripción*: Transceptor ágil en frecuencia con salto pseudoaleatorio sincronizado y cifrado AES.
   - *Componentes Clave*: `Semtech SX1262, ESP32-S3, Antena 868MHz`
   - *Esquemático Vectorial*: `public/schematics/guide-012_p6.svg`

---

## [guide-013] 6 EE Projects That Think For Themselves
- **Disciplina**: Robotics & Drones
- **Páginas**: 15 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $240 - $310
- **Archivo Original**: `6_EE_Projects_That_Think_For_Themselves.pdf` (1.4 MB)
- **Resumen**: Seis robots completos construidos desde cero que ejecutan el bucle robótico profesional 'sense, decide, act': rover reactivo, brazo cinemático inverso, cuadrúpedo caminante, rover SLAM, péndulo autoequilibrado y pórtico pick-and-place.

### Proyectos Prácticos Incluidos:
1. **Reactive Rover (Sense-Plan-Act)** ($35, 1 fin de semana)
   - *Descripción*: Rover diferencial con sensores ToF y algoritmos de campos potenciales repulsivos para navegación sin colisiones.
   - *Componentes Clave*: `Chasis 2WD, 2x Motores N20 reductora, 3x Sensores VL53L0X, ESP32`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p1.svg`
1. **Robot Arm with Inverse Kinematics** ($45, 2 fines de semana)
   - *Descripción*: Brazo robótico de 4 grados de libertad con cálculo trigonométrico inverso en tiempo real de ángulos articulares.
   - *Componentes Clave*: `4x Servos metálicos MG996R, Chasis acrílico/impreso, ESP32, Driver PCA9685`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p2.svg`
1. **Quadruped Walking Robot** ($65, 3 semanas)
   - *Descripción*: Robot caminante de cuatro patas con 8-12 servos y generador de marcha Trot/Crawl con cinemática de extremidades.
   - *Componentes Clave*: `8x Servos SG90/MG90S, Estructura ligera 3D, Batería 2S LiPo, IMU MPU6050`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p3.svg`
1. **SLAM Mapping Autonomous Rover** ($55, 2 fines de semana)
   - *Descripción*: Vehículo terrestre que explora un entorno desconocido y genera un plano 2D en vivo mediante escáner Lidar y odometría.
   - *Componentes Clave*: `Lidar 360° RPLIDAR A1, Encoders ópticos de rueda, Raspberry Pi, ESP32 Motor`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p4.svg`
1. **Self-Balancing Inverted Pendulum** ($40, 1 fin de semana)
   - *Descripción*: Robot de dos ruedas autoequilibrado con bucle de control PID y filtro complementario a 250 Hz sobre encoders y giroscopio.
   - *Componentes Clave*: `2x Motores paso a paso / DC, IMU BNO055 / MPU6050, Driver DRV8825, Batería 3S`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p5.svg`
1. **Vision-Guided Pick-and-Place Gantry** ($50, 2 fines de semana)
   - *Descripción*: Pórtico cartesiano con cámara cenital y pinza por vacío que clasifica piezas automáticamente según su forma y color.
   - *Componentes Clave*: `Pórtico aluminio V-Slot, Cámara OpenCV, Bomba de vacío miniatura, Arduino Mega RAMPS`
   - *Esquemático Vectorial*: `public/schematics/guide-013_p6.svg`

---

## [guide-014] 6 Engineering Projects That Survive The Field
- **Disciplina**: Electrical Engineering
- **Páginas**: 16 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $220 - $310
- **Archivo Original**: `6_Engineering_Projects_That_Survive_The_Field.pdf` (1.3 MB)
- **Resumen**: Seis proyectos completos desde la perspectiva de supervivencia y ensayos ambientales de defensa: caja de blindaje Faraday y EMC, túnel de viento subsónico con balanza de fuerzas, probeta de impacto para blindajes compuestos, arreglo hidrofonico pasivo TDOA, paracaídas autónomo guiado por GPS y laboratorio de choque térmico y vibración.

### Proyectos Prácticos Incluidos:
1. **Shielding & EMC Hardening (Faraday Box)** ($25, 1 fin de semana)
   - *Descripción*: Caja blindada de alta atenuación RF para medir profundidad de piel, fugas de junturas y apantallamiento en dB.
   - *Componentes Clave*: `Caja de aluminio fundido, Junta elastomérica conductora, Generador RF, Receptor SDR`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p1.svg`
1. **Subsonic Wind Tunnel & Flow Conditioning** ($55, 2 fines de semana)
   - *Descripción*: Túnel de viento para túnel aerodinámico con acondicionamiento en panal de abeja y balanza de sustentación/resistencia.
   - *Componentes Clave*: `Ventilador de alta presión, Panal laminar, Sección acrílica, Célula de carga 100g`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p2.svg`
1. **Composite Armor Instrumented Impact Tester** ($40, 2 fines de semana)
   - *Descripción*: Torre de impacto instrumentada con acelerómetro de choque para caracterizar la absorción de energía en paneles de fibra.
   - *Componentes Clave*: `Acelerómetro 500g, Guía lineal vertical, Masa de impacto, Paneles fibra de vidrio/carbono`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p3.svg`
1. **Underwater Hydrophone Array & Acoustic TDOA** ($45, 2 fines de semana)
   - *Descripción*: Matriz de hidrófonos piezeléctricos encapsulados para triangulación acústica submarina por diferencia temporal de llegada.
   - *Componentes Clave*: `2x Discos piezoeléctricos, Preamplificador bajo ruido, Resina marina PU, ADC 24-bit`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p4.svg`
1. **Autonomous Guided Airdrop Parafoil (GNC)** ($50, 2 fines de semana)
   - *Descripción*: Sistema de caída autónoma con ala ram-air y servomotores de línea de freno guiados por waypoint GPS y brújula.
   - *Componentes Clave*: `Ala de parapente RC, 2x Servos de alto torque, GPS u-blox, Controlador de vuelo`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p5.svg`
1. **Environmental Torture-Test Lab (Thermal/Vibe)** ($35, 1 fin de semana)
   - *Descripción*: Cámara de ciclado térmico con placa Peltier y actuador de vibración para certificar hardware antes del despliegue.
   - *Componentes Clave*: `Célula Peltier TEC1-12706, Transductor de vibración, Termopares Tipo K, Controlador PID`
   - *Esquemático Vectorial*: `public/schematics/guide-014_p6.svg`

---

## [guide-015] 6 Upgrades Your Drone Is Missing
- **Disciplina**: Robotics & Drones
- **Páginas**: 16 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $180 - $260
- **Archivo Original**: `6_Upgrades_Your_Drone_Is_Missing.pdf` (1.6 MB)
- **Resumen**: Seis sistemas de hardware crítico para convertir un dron comercial o artesanal en una aeronave autónoma de grado industrial con redundancia, navegación sin GPS y telemetría avanzada.

### Proyectos Prácticos Incluidos:
1. **Optical Flow & LiDAR Surface Tracker** ($35, 1 fin de semana)
   - *Descripción*: Posicionamiento ultra-estable en interiores sin señal GPS mediante sensor de flujo óptico PMW3901 y telémetro láser ToF.
   - *Componentes Clave*: `Sensor PMW3901, Sensor ToF VL53L1X, ESP32, Montaje impreso 3D`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p1.svg`
1. **Redundant Dual-IMU with Kalman Voting** ($30, 1 fin de semana)
   - *Descripción*: Placa de navegación con dos sensores inerciales desacoplados y algoritmo de votación Kalman para tolerancia a fallos por vibración.
   - *Componentes Clave*: `2x IMU BMI088, Aisladores de silicona, MCU STM32F4, Filtro paso bajo`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p2.svg`
1. **CAN Bus ESC Telemetry & Power Distribution** ($40, 2 fines de semana)
   - *Descripción*: Red de comunicaciones CAN bus para monitorizar en tiempo real RPM, temperatura, corriente y voltaje de cada variador.
   - *Componentes Clave*: `Transceptores MCP2562, Shunt de corriente INA226, Regulador Buck 5V 5A, Termistores NTC`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p3.svg`
1. **LoRa Backup Heartbeat & Emergency Parachute** ($35, 1 fin de semana)
   - *Descripción*: Enlace de emergencia independiente a 868MHz con despliegue pirotécnico o por muelle de paracaídas ante fallo de batería principal.
   - *Componentes Clave*: `Módulo LoRa SX1262, Batería 1S LiPo dedicada, Servo liberador / ignitor, Microcontrolador ATtiny`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p4.svg`
1. **Active Rotor Ice Detection & Thermal De-Icing** ($25, 1 fin de semana)
   - *Descripción*: Monitorización de congelación en borde de ataque por sensor capacitivo y activación de resistencias flexibles de calentamiento.
   - *Componentes Clave*: `Calefactor flexible de poliimida, Sensor capacitivo, MOSFET N de potencia, Termómetro digital`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p5.svg`
1. **AI Edge Companion Computer & Collision Avoidance** ($65, 2 fines de semana)
   - *Descripción*: Computador a bordo Jetson/Coral TPU conectado por UART/MAVLink al controlador de vuelo para detección y evasión de obstáculos en 3D.
   - *Componentes Clave*: `Raspberry Pi 4 / Coral TPU, Cámara estéreo, Convertidor DC-DC 5V 4A, Arnés MAVLink`
   - *Esquemático Vectorial*: `public/schematics/guide-015_p6.svg`

---

## [guide-016] 6 EE Projects Recruiters Actually Want To See
- **Disciplina**: Career & Portfolio
- **Páginas**: 21 págs | **Dificultad**: Intermedio a Avanzado | **Presupuesto Est.**: $90 - $140
- **Archivo Original**: `LATESTrecruiter_ee_portfolio.pdf` (1.2 MB)
- **Resumen**: Deja atrás los proyectos de parpadeo de LEDs. Desarrollos profesionales mapeados a descripciones de puesto reales: controlador de motor PID, PCB en KiCad fabricada en JLCPCB, multímetro digital, fuente conmutada buck y lógica FPGA en Verilog.

### Proyectos Prácticos Incluidos:
1. **PID Motor Speed Controller** ($18, 1-2 fines de semana)
   - *Descripción*: Control de velocidad en bucle cerrado con encoder en cuadratura y respuesta al escalón analizada.
   - *Componentes Clave*: `Motor DC con encoder, Driver L298N/TB6612, Arduino, Osciloscopio`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p1.svg`
1. **Custom PCB — Design to Manufactured Board** ($10, 2 fines de semana)
   - *Descripción*: Placa sensorial profesional con ESP32 ruteada en KiCad, fabricada en JLCPCB y soldada en SMD.
   - *Componentes Clave*: `KiCad, ESP32-WROOM, Pasivos 0805, JLCPCB`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p2.svg`
1. **DIY Digital Multimeter with Input Protection** ($12, 1-2 fines de semana)
   - *Descripción*: Voltímetro, amperímetro y ohmímetro digital con protección de entrada por diodos Zener y display OLED.
   - *Componentes Clave*: `ADC 16 bits ADS1115, Shunt, Zener 5.1V, OLED`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p3.svg`
1. **Synchronous Buck Converter (12V to 5V 3A)** ($16, 2-3 fines de semana)
   - *Descripción*: Fuente de alimentación conmutada de alta eficiencia (>85%) con simulación previa en LTspice.
   - *Componentes Clave*: `MOSFETs N-ch, Inductor de potencia, Controlador PWM, LTspice`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p4.svg`
1. **UART / SPI / I2C Protocol Analyzer** ($10, 2 fines de semana)
   - *Descripción*: Analizador lógico que decodifica tramas de buses serie a nivel de byte en tiempo real en una pantalla.
   - *Componentes Clave*: `Raspberry Pi Pico / ESP32, Display OLED, Firmware Sniffer`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p5.svg`
1. **FPGA LED Matrix Controller in Pure Verilog** ($25, 3-4 fines de semana)
   - *Descripción*: Controlador digital sin librerías escrito desde cero en Verilog para paneles RGB 32x32.
   - *Componentes Clave*: `Tang Nano 9K / Cyclone IV, Panel LED RGB, Verilog HDL`
   - *Esquemático Vectorial*: `public/schematics/guide-016_p6.svg`

---

## [guide-017] Ohmie Build Guide: Consola Portátil Arduino & OLED
- **Disciplina**: Robotics & Drones
- **Páginas**: 15 págs | **Dificultad**: Principiante a Intermedio | **Presupuesto Est.**: $35 - $45
- **Archivo Original**: `Ohmie-Build-Guide.pdf` (774.1 KB)
- **Resumen**: Guía de montaje paso a paso del Club Ohm: conexionado de bus SPI, soldadura, potenciómetro deslizante, buzzer y programación de dos videojuegos clásicos completos en C++.

### Proyectos Prácticos Incluidos:
1. **Conexionado de Pantalla OLED SPI 2.42"** ($18, 2 horas)
   - *Descripción*: Cableado de alta velocidad para display monocromo SSD1309 alcanzando más de 45 FPS.
   - *Componentes Clave*: `Display OLED 2.42" SPI, Arduino Uno`
   - *Esquemático Vectorial*: `public/schematics/guide-017_p1.svg`
1. **Control Analógico por Potenciómetro Slider** ($5, 1 hora)
   - *Descripción*: Acondicionamiento y filtrado por software de la lectura para control suave de paletas.
   - *Componentes Clave*: `Slider Pot 10k lineal, Condensador 100nF`
   - *Esquemático Vectorial*: `public/schematics/guide-017_p2.svg`
1. **Generador de Audio Retro por Buzzer** ($3, 1 hora)
   - *Descripción*: Sonidos chiptune por interrupciones de temporizador PWM sin congelar el renderizado.
   - *Componentes Clave*: `Buzzer pasivo, Resistencia 220Ω`
   - *Esquemático Vectorial*: `public/schematics/guide-017_p3.svg`
1. **Compilación y Flasheo de los 2 Juegos** ($0, 2 horas)
   - *Descripción*: Estructura del motor de juego y carga del firmware con PlatformIO en VS Code.
   - *Componentes Clave*: `PlatformIO, Juegos Pong y Runner`
   - *Esquemático Vectorial*: `public/schematics/guide-017_p4.svg`

---

## [guide-018] 6 Portfolio Projects Every CS Student Needs
- **Disciplina**: CS, AI & Machine Learning
- **Páginas**: 21 págs | **Dificultad**: Intermedio a Avanzado | **Presupuesto Est.**: $0 (Servicios Cloud Free-Tier)
- **Archivo Original**: `cs portfolio projects.pdf` (1.0 MB)
- **Resumen**: Olvídate de clones de Netflix o apps To-Do. Seis proyectos de software de alto impacto técnico: mensajería en tiempo real con WebSockets, RAG AI assistant, colas de tareas distribuidas y un intérprete de lenguaje propio.

### Proyectos Prácticos Incluidos:
1. **Real-Time Chat App with WebSockets** ($0, 2-3 fines de semana)
   - *Descripción*: Aplicación de mensajería con salas, typing indicators, historial paginado y cifrado.
   - *Componentes Clave*: `React, Node.js, Socket.io, PostgreSQL`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p1.svg`
1. **Personal AI Assistant with RAG** ($0, 2-3 fines de semana)
   - *Descripción*: Conversación con tus propios documentos mediante chunking, base de datos vectorial y citas.
   - *Componentes Clave*: `FastAPI, LangChain, ChromaDB, OpenAI API`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p2.svg`
1. **Distributed Task Queue & Worker System** ($0, 3-4 fines de semana)
   - *Descripción*: Sistema de cola de mensajes asíncrona con reintentos, idempotencia y métricas Prometheus.
   - *Componentes Clave*: `Go / Node.js, Redis Streams, PostgreSQL, Grafana`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p3.svg`
1. **Open Source Developer CLI Tool** ($0, 1-2 fines de semana)
   - *Descripción*: Herramienta de consola empaquetada en npm/pip con tests automáticos en GitHub Actions.
   - *Componentes Clave*: `TypeScript / Python, Commander, CI/CD Actions`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p4.svg`
1. **Full-Stack Multi-Tenant SaaS with Payments** ($0, 4-6 fines de semana)
   - *Descripción*: Aplicación SaaS con roles de usuario, suscripciones recurrentes con Stripe y webhooks.
   - *Componentes Clave*: `Next.js, Clerk / NextAuth, Stripe API, Supabase`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p5.svg`
1. **Custom Programming Language Interpreter** ($0, 3-5 fines de semana)
   - *Descripción*: Intérprete completo con lexer, parser de descenso recursivo, AST y evaluación de variables.
   - *Componentes Clave*: `Rust / Go / Python, Lexer / Parser, AST Engine`
   - *Esquemático Vectorial*: `public/schematics/guide-018_p6.svg`

---

## [guide-019] The Dangerously Overeducated Engineer Guide
- **Disciplina**: Career & Portfolio
- **Páginas**: 10 págs | **Dificultad**: Estratégico / Autodidacta | **Presupuesto Est.**: $50 - $150 (Libros & Banco de Pruebas)
- **Archivo Original**: `dangerously_overeducated_engineer_guide.pdf` (17.8 KB)
- **Resumen**: El plan de estudio y carrera para dominar materias avanzadas de ingeniería por tu cuenta, construir proyectos indiscutibles y destacar en los procesos de selección más exigentes.

### Proyectos Prácticos Incluidos:
1. **Audita los Mejores Cursos del Mundo (Stanford, MIT, CMU)** ($0, Semanas 1-4)
   - *Descripción*: Estudia los cursos de referencia: Stanford CS229 (ML), MIT 6.002 (Circuitos) y Berkeley CS61C.
   - *Componentes Clave*: `YouTube playlists oficiales, Lectures y exámenes libres`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p1.svg`
1. **Elige una Especialidad y Profundiza al Máximo** ($0, Semanas 2-6)
   - *Descripción*: Conviértete en el referente de un nicho de alto valor (FPGA, RF de potencia, sistemas embebidos en Rust).
   - *Componentes Clave*: `Stack tecnológico definido, Proyectos de nicho`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p2.svg`
1. **Construye Algo que Nadie te Pidió que Construyas** ($40, Semanas 4-8)
   - *Descripción*: Diseña un proyecto ambicioso desde cero que resuelva un problema real o demuestre maestría técnica.
   - *Componentes Clave*: `Hardware funcional, Repositorio GitHub impecable`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p3.svg`
1. **Lee Datasheets y Notas de Aplicación como Ficción** ($0, Continuo)
   - *Descripción*: Aprende los secretos de ingeniería que no están en libros leyendo las app notes de TI, ADI y Linear Tech.
   - *Componentes Clave*: `Application notes de Texas Instruments y ADI`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p4.svg`
1. **Ingeniería Inversa de Productos Comerciales Reales** ($25, Semanas 8-10)
   - *Descripción*: Desmonta productos comerciales rotos, traza los esquemáticos y analiza por qué tomaron cada decisión.
   - *Componentes Clave*: `Herramientas de desmontaje, Microscopio USB`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p5.svg`
1. **Haz de tu Presencia en Internet un Portafolio Indiscutible** ($0, Semanas 10-12)
   - *Descripción*: Publica artículos técnicos, vídeos de demostración y tus diseños para que los recruiters te contacten.
   - *Componentes Clave*: `GitHub Pages, LinkedIn técnico, Artículos en Substack`
   - *Esquemático Vectorial*: `public/schematics/guide-019_p6.svg`

---

## [guide-020] 6 AI-Era EE Projects
- **Disciplina**: CS, AI & Machine Learning
- **Páginas**: 20 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $170 - $250
- **Archivo Original**: `ee ai era projects.pdf` (358.2 KB)
- **Resumen**: Seis construcciones de hardware electrónico diseñadas específicamente para interactuar, proteger y auditar sistemas de inteligencia artificial: detector analógico de clones de voz, sniffer de fuga electromagnética en procesadores, interruptor físico de emergencia por perfil de consumo, credencial criptográfica anti-deepfake, fusionador neuromórfico y clasificador de huella espectral RF.

### Proyectos Prácticos Incluidos:
1. **AI Voice Cloning Detector** ($15, 1 fin de semana)
   - *Descripción*: Circuito analógico que detecta voces sintéticas analizando discontinuidades de fase y artefactos en el espectro audible sin requerir software pesado.
   - *Componentes Clave*: `Banco de filtros analógicos activos, Detector de picos, Comparadores ventana, Indicador LED`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p1.svg`
1. **EMI Side-Channel Sniffer** ($30, 1 fin de semana)
   - *Descripción*: Sonda electromagnética de campo cercano que captura las emisiones parásitas de una CPU para identificar qué algoritmo o red neuronal se está ejecutando.
   - *Componentes Clave*: `Sonda de bucle magnético H-Field, LNA 20dB bajo ruido, SDR RTL v4, Software de espectrograma`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p2.svg`
1. **Hardware AI Kill Switch** ($18, 1 fin de semana)
   - *Descripción*: Watchdog analógico que desconecta físicamente la alimentación de un acelerador de IA cuando el perfil transitorio de corriente excede límites seguros.
   - *Componentes Clave*: `Resistencia shunt 0.01Ω, Amplificador de corriente INA180, MOSFET canal P potencia, Relé enclavado`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p3.svg`
1. **Deepfake-Proof Identity Badge** ($25, 2 fines de semana)
   - *Descripción*: Dispositivo portátil con elemento seguro criptográfico ATECC608 que firma digitalmente cada captura de cámara con timestamp GPS inmutable.
   - *Componentes Clave*: `Criptochip ATECC608A, Módulo cámara OV2640, Módulo GNSS, ESP32-S3`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p4.svg`
1. **Neuromorphic Sensor Fuser** ($12, 1 fin de semana)
   - *Descripción*: Red de neuronas de picos implementada con amplificadores operacionales que procesa datos de sensores en tiempo real sin reloj ni conversor ADC.
   - *Componentes Clave*: `Op-Amps LM358, Integradores RC, Diodos de disparo, Matriz resistiva sináptica`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p5.svg`
1. **RF Fingerprinting Authenticator** ($35, 2 fines de semana)
   - *Descripción*: Identificador de transmisores inalámbricos mediante el análisis de las no-linealidades e imperfecciones microscópicas únicas de su amplificador de potencia.
   - *Componentes Clave*: `Receptor SDR HackRF / RTL-SDR, Procesador DSP ARM, Antena monopolo, Firmware de correlación`
   - *Esquemático Vectorial*: `public/schematics/guide-020_p6.svg`

---

## [guide-021] Defense Tech Part 2: Laser + Covert Systems
- **Disciplina**: Electrical Engineering
- **Páginas**: 22 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $190 - $270
- **Archivo Original**: `ee defense tech part2.pdf` (358.0 KB)
- **Resumen**: Seis subsistemas ópticos y encubiertos para aplicaciones de defensa e inteligencia: micrófono láser por reflexión en ventanas a 100m, enlace láser IR cifrado punto a punto, telémetro ToF de alta velocidad, transmisor de ráfagas ágil en frecuencia, visor nocturno de amplificación pasiva y sistema de medición de sección transversal radar (RCS).

### Proyectos Prácticos Incluidos:
1. **Laser Surveillance Microphone** ($15, 1 fin de semana)
   - *Descripción*: Vibrometría láser que intercepta el audio interior a través de la vibración microscópica del vidrio de una ventana a 100 metros.
   - *Componentes Clave*: `Diodo láser rojo colimado 5mW, Fotodiodo PIN BPW34, Preamplificador bajo ruido, Filtro pasa-banda`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p1.svg`
1. **Tap-Proof Laser Communication Link** ($12, 1 fin de semana)
   - *Descripción*: Enlace óptico invisible a 850nm que transmite datos cifrados punto a punto sin emitir radiación RF que pueda ser interceptada.
   - *Componentes Clave*: `LED/Láser infrarrojo 850nm, Receptor óptico rápido, ESP32, Lente colimadora`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p2.svg`
1. **High-Precision Laser Rangefinder** ($25, 2 fines de semana)
   - *Descripción*: Telémetro ToF con pulsos láser de 5ns y cronometría a nivel de picosegundos para cálculo milimétrico de distancias de tiro.
   - *Componentes Clave*: `Diodo láser pulsado 905nm, Fotodiodo de avalancha (APD), Comparador ultrarrápido, TDC-7200`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p3.svg`
1. **Encrypted Burst Transmitter** ($10, 1 fin de semana)
   - *Descripción*: Transmisor táctico de ráfaga de 50 ms con salto de frecuencia rápido, inmune a radiogoniometría convencional y cifrado AES.
   - *Componentes Clave*: `Transceptor RF CC1101, ESP32-S3, Antena helicoidal 433MHz, Batería LiPo`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p4.svg`
1. **Passive Night Vision Scope** ($30, 2 fines de semana)
   - *Descripción*: Visor nocturno pasivo con sensor CMOS de ultra-alta sensibilidad a luz estelar y amplificación analógica de ganancia extrema.
   - *Componentes Clave*: `Sensor CMOS Sony Starvis, Lente F/1.2 gran apertura, Pantalla micro OLED, Alimentación blindada`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p5.svg`
1. **Radar Cross-Section Measurement System** ($12, 1 fin de semana)
   - *Descripción*: Banco de ensayo de escritorio para medir el eco radar de maquetas furtivas y materiales absorbentes mediante señales de 10 GHz.
   - *Componentes Clave*: `Transceptor Doppler HB100 10.525GHz, Bocina de ganancia, Amplificador de eco, Osciloscopio USB`
   - *Esquemático Vectorial*: `public/schematics/guide-021_p6.svg`

---

## [guide-022] 6 Physical AI Embodiment Projects
- **Disciplina**: CS, AI & Machine Learning
- **Páginas**: 23 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $230 - $320
- **Archivo Original**: `ee physical ai embodiment.pdf` (593.1 KB)
- **Resumen**: Seis construcciones de frontera para conectar modelos de inteligencia artificial con la fisiología humana y el mundo físico: interfaz neural de habla silenciosa, prótesis de mano biónica con predicción de intención motora, brazalete de gestos para programación en realidad aumentada, colgante con biomarcadores emocionales, guante de sentido táctil predictivo y parche submandibular de comandos subvocalizados.

### Proyectos Prácticos Incluidos:
1. **Silent Speech Neural Interface** ($60, 2-4 fines de semana)
   - *Descripción*: Lectura electromiográfica sutil de la musculatura laríngea y submentoniana para transcribir texto sin emitir sonido audible.
   - *Componentes Clave*: `Frontend biopotencial ADS1299, 8x Electrodos Ag/AgCl dorados, ESP32-S3, Filtro analógico 50Hz`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p1.svg`
1. **EMG Prosthetic Hand with Intent Detection** ($80, 3-4 semanas)
   - *Descripción*: Mano robótica de 5 dedos accionada por servomotores con clasificación de intención neuromuscular previa al movimiento voluntario.
   - *Componentes Clave*: `5x Servos micro metálicos, Mano impresa en 3D SLS/PLA, Sensor MyoWare EMG, Batería 2S LiPo`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p2.svg`
1. **Gesture-Controlled AR Coding Interface** ($50, 2 fines de semana)
   - *Descripción*: Brazalete con matriz de 16 canales EMG de muñeca para mecanografía virtual y ejecución de atajos de teclado sin tocar una superficie.
   - *Componentes Clave*: `Anillo de electrodos flexibles, Multiplexor analógico 16:1, MCU Cortex-M4, Transmisor Bluetooth LE`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p3.svg`
1. **Emotion-Aware AI Companion Pendant** ($30, 1-2 fines de semana)
   - *Descripción*: Colgante biométrico de bajo consumo que fusiona variabilidad de la frecuencia cardíaca (VFC), conductancia dérmica y temperatura.
   - *Componentes Clave*: `Sensor fotopletismógrafo MAX30102, Sensor galvánico EDA, Termistor de contacto, Nordic nRF52840`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p4.svg`
1. **Tactile Sense Augmentation Glove** ($45, 2 fines de semana)
   - *Descripción*: Guante con actuadores resonantes lineales (LRA) que transmiten sensaciones táctiles anticipadas según la proximidad medida por sensores ToF.
   - *Componentes Clave*: `5x Actuadores LRA hápticos, Driver DRV2605L, Mini sensores láser ToF, Driver I2C PCA9685`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p5.svg`
1. **Subvocal AI Command Interface** ($35, 1-2 fines de semana)
   - *Descripción*: Parche submandibular de 4 electrodos capaz de clasificar 50 comandos de control discretos procesados localmente en Edge AI.
   - *Componentes Clave*: `Parche cutáneo flexible, Amplificador biopotencial INA128, MCU RP2040, Batería recargable botón`
   - *Esquemático Vectorial*: `public/schematics/guide-022_p6.svg`

---

## [guide-023] 6 Portfolio Projects Every EE Student Needs
- **Disciplina**: Career & Portfolio
- **Páginas**: 15 págs | **Dificultad**: Intermedio a Avanzado | **Presupuesto Est.**: $110 - $180
- **Archivo Original**: `ee_portfolio_projects.pdf` (27.5 KB)
- **Resumen**: Proyectos de electrónica pura con impacto directo en entrevistas de trabajo: monitor de energía IoT, brazo robótico mioeléctrico EMG, sintetizador analógico en PCB propia y controlador solar MPPT.

### Proyectos Prácticos Incluidos:
1. **Smart Energy Monitor IoT** ($25, 1 fin de semana)
   - *Descripción*: Pinza amperimétrica no invasiva y sensor de tensión que envían telemetría de consumo a la nube.
   - *Componentes Clave*: `ESP32, Sensor ACS712 / SCT-013, ZMPT101B, Dashboard Web`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p1.svg`
1. **Gesture-Controlled EMG Robot Arm** ($40, 2 fines de semana)
   - *Descripción*: Brazo robótico controlado en tiempo real con las contracciones musculares del antebrazo.
   - *Componentes Clave*: `MyoWare 2.0 EMG, Arduino Mega, 4 Servos MG996R`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p2.svg`
1. **Custom PCB Synthesizer** ($20, 2 fines de semana)
   - *Descripción*: Instrumento musical analógico diseñado en KiCad con osciladores operacionales TL072 y temporizador 555.
   - *Componentes Clave*: `KiCad EDA, Op-amps TL072, Timer 555, Potenciómetros`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p3.svg`
1. **MPPT Solar Charge Controller** ($30, 2 fines de semana)
   - *Descripción*: Controlador de carga solar dinámico con convertidor DC-DC Buck de alta eficiencia.
   - *Componentes Clave*: `Panel 10W, MOSFETs, Sensor INA219, Microcontrolador`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p4.svg`
1. **Software-Defined Radio Receiver** ($28, 1 fin de semana)
   - *Descripción*: Receptor de comunicaciones RF procesando señales analógicas en tiempo real con GNU Radio.
   - *Componentes Clave*: `Dongle RTL-SDR, Antena dipolo, GNU Radio`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p5.svg`
1. **PID Self-Balancing Robot** ($35, 2 fines de semana)
   - *Descripción*: Robot de dos ruedas que mantiene el equilibrio vertical mediante un bucle PID estricto.
   - *Componentes Clave*: `ESP32, Sensor IMU MPU6050, Motores DC con encoder`
   - *Esquemático Vectorial*: `public/schematics/guide-023_p6.svg`

---

## [guide-024] The Robot Framework: Patrocinio y Préstamo de Robots de $30.000
- **Disciplina**: Career & Portfolio
- **Páginas**: 11 págs | **Dificultad**: Estratégico / Negociación | **Presupuesto Est.**: $0 (Patrocinio)
- **Archivo Original**: `follow @1nska.pdf` (20.1 KB)
- **Resumen**: El caso real de cómo un estudiante universitario consiguió el préstamo gratuito de un robot industrial KUKA de 80 kg valorado en $30.000 para un proyecto de ingeniería y arte.

### Proyectos Prácticos Incluidos:
1. **El Gancho de la Reciprocidad y Visibilidad** ($0, 3 días)
   - *Descripción*: Cómo presentar tu proyecto para que la división de I+D de la empresa lo vea como marketing valioso.
   - *Componentes Clave*: `Dossier de proyecto, Propuesta de valor de marca`
   - *Esquemático Vectorial*: `public/schematics/guide-024_p1.svg`
1. **La Redacción del Correo Frío Irrechazable** ($0, 2 días)
   - *Descripción*: Plantilla exacta de contacto a directores técnicos: sin pedir dinero, con fechas y demostrando capacidad.
   - *Componentes Clave*: `Plantilla de correo, Vídeo de 30 segundos`
   - *Esquemático Vectorial*: `public/schematics/guide-024_p2.svg`
1. **La Presentación del Plan de Investigación** ($0, 1 semana)
   - *Descripción*: Documento técnico de viabilidad: cronograma de hitos, seguridad eléctrica y plan de transporte.
   - *Componentes Clave*: `Gantt técnico, Plan de riesgos`
   - *Esquemático Vectorial*: `public/schematics/guide-024_p3.svg`
1. **Logística, Seguros y Contratos de Comodato** ($0, 1 semana)
   - *Descripción*: Firma del acuerdo legal de cesión temporal, seguro de responsabilidad civil y recepción en muelle.
   - *Componentes Clave*: `Contrato de comodato, Póliza de seguro`
   - *Esquemático Vectorial*: `public/schematics/guide-024_p4.svg`
1. **Programación KRL, Puesta en Marcha y Retorno** ($0, 2 semanas)
   - *Descripción*: Programación del brazo robot en su lenguaje nativo, ejecución de la performance y difusión en redes.
   - *Componentes Clave*: `Lenguaje KRL, Controlador KUKA SmartPAD`
   - *Esquemático Vectorial*: `public/schematics/guide-024_p5.svg`

---

## [guide-025] How to Learn Electronics From Zero
- **Disciplina**: Electronics & Hardware
- **Páginas**: 5 págs | **Dificultad**: Principiante a Intermedio | **Presupuesto Est.**: $60 (Banco básico de trabajo)
- **Archivo Original**: `how-to-learn-electronics-from-zero.pdf` (57.6 KB)
- **Resumen**: El orden óptimo para dominar el hardware sin aburrirse con teoría vacía: construir primero, medir con instrumental, aprender a soldar, diseñar en KiCad y fabricar tus placas.

### Proyectos Prácticos Incluidos:
1. **Paso 1: Salta la teoría y compra un kit de Arduino** ($30, Día 1)
   - *Descripción*: Consigue una placa, protoboard, LEDs, resistencias y botones para hacer funcionar tu primer circuito.
   - *Componentes Clave*: `Kit Arduino Uno clone con componentes`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p1.svg`
1. **Paso 2: Hazte con un multímetro y mide voltajes reales** ($15, Día 3)
   - *Descripción*: Aprende a medir caídas de tensión, corrientes y continuidad con pitido sonoro.
   - *Componentes Clave*: `Multímetro digital, Cables con pinzas cocodrilo`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p2.svg`
1. **Paso 3: Construye tu primer circuito analógico sin código** ($5, Fin de semana 1)
   - *Descripción*: Monta un oscilador con temporizador 555 para entender cómo interactúan resistencias y condensadores.
   - *Componentes Clave*: `Chip 555, Condensadores electrolíticos`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p3.svg`
1. **Paso 4: Aprende a soldar temprano con un kit de práctica** ($20, Fin de semana 2)
   - *Descripción*: Domina la técnica de soldadura con estaño con plomo y flux en placas perforadas.
   - *Componentes Clave*: `Soldador regulable, Estaño 60/40 con resina, Kit de práctica`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p4.svg`
1. **Paso 5: Pasa de la protoboard a KiCad y diseña tu primera PCB** ($5, Fin de semana 3)
   - *Descripción*: Dibuja el esquemático, rutea las pistas con plano de masa y manda a fabricar 5 placas a JLCPCB.
   - *Componentes Clave*: `Software libre KiCad, Archivos Gerber`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p5.svg`
1. **Paso 6: Construye un proyecto físico que realmente quieras usar** ($20, Fin de semana 4)
   - *Descripción*: Integra todo en un dispositivo funcional con caja para resolver una necesidad personal.
   - *Componentes Clave*: `Caja impresa o plástico, Alimentación por batería`
   - *Esquemático Vectorial*: `public/schematics/guide-025_p6.svg`

---

## [guide-026] 6 Portfolio Projects Every ME Student Needs
- **Disciplina**: Career & Portfolio
- **Páginas**: 22 págs | **Dificultad**: Intermedio a Avanzado | **Presupuesto Est.**: $140 - $220
- **Archivo Original**: `me_portfolio_projects.pdf` (868.6 KB)
- **Resumen**: Diseño mecánico riguroso, prototipado CAD y control mecatrónico: pinza robótica con sensor de fuerza, túnel de viento instrumentado, seguidor solar biaxial y grabadora CNC de escritorio.

### Proyectos Prácticos Incluidos:
1. **3D-Printed Gripper with Force Feedback** ($30, 1-2 fines de semana)
   - *Descripción*: Pinza robótica que ajusta su presión mediante sensores de fuerza resistivos para no dañar objetos frágiles.
   - *Componentes Clave*: `Sensores FSR 402, Arduino Uno, Servo metálico, Piezas 3D`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p1.svg`
1. **Portable Wind Tunnel with Data Acquisition** ($55, 2-3 fines de semana)
   - *Descripción*: Túnel de viento de sobremesa con enderezador de flujo y sensor de presión diferencial para medir sustentación.
   - *Componentes Clave*: `Ventiladores 120mm, Tubo Pitot casero, Sensor MPXV7002DP`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p2.svg`
1. **Dual-Axis Solar Tracker** ($40, 1-2 fines de semana)
   - *Descripción*: Seguidor solar de 2 ejes mediante fotorresistencias LDR y servomotores que maximiza la generación eléctrica.
   - *Componentes Clave*: `Panel solar 10W, 4x LDRs, 2x Servos MG996R, Arduino`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p3.svg`
1. **PID Thermal Management System** ($35, 1 fin de semana)
   - *Descripción*: Sistema de refrigeración inteligente que mantiene la temperatura de un chip a ±0.5°C mediante control PID.
   - *Componentes Clave*: `Termistores NTC, Ventiladores PWM, Arduino Mega`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p4.svg`
1. **Desktop CNC Engraver Built From Scratch** ($80, 3-4 fines de semana)
   - *Descripción*: Grabadora CNC de 2/3 ejes con guías lineales, motores paso a paso y firmware GRBL con precisión de 0.1mm.
   - *Componentes Clave*: `NEMA 17, CNC Shield v3, Husillos T8, Estructura aluminio`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p5.svg`
1. **Wireless Strain Gauge Bridge Monitor** ($50, 2 fines de semana)
   - *Descripción*: Medición de deformación en vigas cargadas usando galgas extensométricas en puente de Wheatstone con ESP32.
   - *Componentes Clave*: `Galgas extensométricas 120Ω, ADC HX711, ESP32, FEA`
   - *Esquemático Vectorial*: `public/schematics/guide-026_p6.svg`

---

## [guide-027] The ML Guide For Every Engineer
- **Disciplina**: CS, AI & Machine Learning
- **Páginas**: 10 págs | **Dificultad**: Intermedio | **Presupuesto Est.**: $0 - $30 (Google Colab / ESP32)
- **Archivo Original**: `ml guide engineers.pdf` (19.2 KB)
- **Resumen**: Qué aprender de inteligencia artificial y dónde aplicarlo según tu rama: mantenimiento predictivo para mecánicos, clasificación de señales y TinyML para electrónicos, y modelos de procesos químicos.

### Proyectos Prácticos Incluidos:
1. **Fundamentos de ML: Clasificación y Regresión Práctica** ($0, Semanas 1-2)
   - *Descripción*: Entendimiento aplicado de entrenamiento, validación y métricas de error sin atascarse en la estadística pura.
   - *Componentes Clave*: `Google Colab, Scikit-Learn, Pandas`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p1.svg`
1. **Ingeniería Mecánica: Mantenimiento Predictivo por Vibraciones** ($0, Semanas 3-4)
   - *Descripción*: Modelo que predice el fallo inminente de rodamientos analizando la transformada FFT de acelerómetros.
   - *Componentes Clave*: `Dataset IMS Bearings, PyTorch, scipy.signal`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p2.svg`
1. **Ingeniería Electrónica: Clasificación de Señales de ECG en Tiempo Real** ($0, Semanas 4-5)
   - *Descripción*: Red convolucional 1D entrenada con el dataset MIT-BIH para detectar arritmias cardíacas.
   - *Componentes Clave*: `PhysioNet MIT-BIH, Redes 1D CNN`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p3.svg`
1. **Despliegue de Edge AI y TinyML en Microcontroladores** ($15, Semanas 5-6)
   - *Descripción*: Cuantización INT8 y ejecución de inferencia en tiempo real en un ESP32 o Arduino Nano BLE.
   - *Componentes Clave*: `TensorFlow Lite for Microcontrollers, ESP32, Edge Impulse`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p4.svg`
1. **Ingeniería Química: Modelado y Optimización de Reactores** ($0, Semanas 6-7)
   - *Descripción*: Modelado no lineal de rendimientos de reacción mediante procesos gaussianos y optimización bayesiana.
   - *Componentes Clave*: `Gaussian Processes, Optuna`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p5.svg`
1. **Proyecto Integrador para Portafolio de Ingeniería** ($15, Semanas 7-8)
   - *Descripción*: Sistema completo conectado con sensores físicos que realiza predicciones en vivo.
   - *Componentes Clave*: `Sensor físico, Inferencia Edge, Dashboard`
   - *Esquemático Vectorial*: `public/schematics/guide-027_p6.svg`

---

## [guide-028] The Summer EE Glow-Up (Vol. 1: Foundation)
- **Disciplina**: Electronics & Hardware
- **Páginas**: 10 págs | **Dificultad**: Principiante / Intermedio | **Presupuesto Est.**: $120 - $190
- **Archivo Original**: `summer-ee-glow-up-light.pdf` (60.6 KB)
- **Resumen**: Plan de entrenamiento estructurado de 12 semanas para dominar los fundamentos de diseño de circuitos, lógica digital, radiofrecuencia y sistemas embebidos mediante proyectos prácticos de laboratorio.

### Proyectos Prácticos Incluidos:
1. **Learning the Art of Electronics Lab** ($35, 2 semanas)
   - *Descripción*: Banco de ensayos con transistores discretos, amplificadores operacionales y osciladores montados sobre protoboard.
   - *Componentes Clave*: `Kit de componentes discretos, Amplificador LF356, Fuente simétrica ±15V, Multímetro`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p1.svg`
1. **Phil's Lab High-Speed Hardware Design** ($25, 2 semanas)
   - *Descripción*: Diseño y trazado en KiCad de una placa de circuito impreso de 4 capas para microcontrolador STM32 y filtros analógicos.
   - *Componentes Clave*: `Entorno KiCad, Plantillas JLCPCB, Librerías de footprint 0603`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p2.svg`
1. **Ben Eater 8-bit Discrete TTL Computer** ($60, 3 semanas)
   - *Descripción*: Construcción completa de una CPU de 8 bits con registros, ALU, contador de programa y RAM usando compuertas lógicas serie 74LS.
   - *Componentes Clave*: `Puertas lógicas 74LS, EEPROMs 28C16, Display 7 segmentos, Generador de reloj 555`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p3.svg`
1. **Contextual Electronics Board Bring-up** ($30, 1 semana)
   - *Descripción*: Protocolo de encendido inicial, verificación de voltajes sin chips, soldadura de paso fino SMD e inspección con microscopio.
   - *Componentes Clave*: `Estación de aire caliente, Flux no-clean, Soldadura estaño-plomo, Malla desoldadora`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p4.svg`
1. **MIT OCW Feedback Control Implementer** ($20, 2 semanas)
   - *Descripción*: Montaje de bucles de control retroalimentado analógico con amplificadores operacionales para estabilizar posición y corriente.
   - *Componentes Clave*: `Op-amps TL082, Potenciómetro multivuelta, Motor DC con tacómetro, Osciloscopio`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p5.svg`
1. **GNU Radio & RTL-SDR Spectrum Interceptor** ($28, 2 semanas)
   - *Descripción*: Recepción y decodificación de emisiones ADS-B de aviones, satélites meteorológicos NOAA y señales FM comerciales.
   - *Componentes Clave*: `Receptor RTL-SDR Blog v4, Antena dipolo telescópica, Filtro SAW 1090MHz, GNU Radio`
   - *Esquemático Vectorial*: `public/schematics/guide-028_p6.svg`

---

## [guide-029] The Summer EE Glow-Up (Vol. 2: Deeper Cuts)
- **Disciplina**: Electronics & Hardware
- **Páginas**: 10 págs | **Dificultad**: Intermedio / Avanzado | **Presupuesto Est.**: $140 - $210
- **Archivo Original**: `summer-ee-glow-up-vol2.pdf` (62.5 KB)
- **Resumen**: Segunda entrega del programa de aceleración técnica con diez recursos avanzados: diseño de circuitos integrados analógicos, simulación Monte Carlo en LTspice, emulación en tiempo real y DSP práctico.

### Proyectos Prácticos Incluidos:
1. **Practical Electronics for Inventors Bench** ($30, 1 semana)
   - *Descripción*: Laboratorio de componentes no ideales: comportamiento de inductores en saturación, ESR de capacitores y fuga de diodos.
   - *Componentes Clave*: `Medidor LCR, Variedad de inductores toroidales, Diodos Schottky, Generador de funciones`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p1.svg`
1. **Razavi CMOS Microelectronics Lab** ($25, 2 semanas)
   - *Descripción*: Diseño y caracterización de pares diferenciales CMOS, espejos de corriente cascode y etapas de salida clase AB.
   - *Componentes Clave*: `Pares emparejados de transistores, Simulador SPICE, Potenciómetros de polarización`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p2.svg`
1. **LTspice Worst-Case & Monte Carlo Simulator** ($0, 1 semana)
   - *Descripción*: Simulación estadística de variaciones de producción en circuitos analógicos críticos y análisis de estabilidad de margen de fase.
   - *Componentes Clave*: `Software LTspice XVII, Modelos SPICE de fabricantes, Directivas .step param`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p3.svg`
1. **Wokwi Virtual Hardware Simulator** ($0, 1 semana)
   - *Descripción*: Desarrollo y depuración de controladores de periféricos I2C y SPI en el navegador con lógica lógica conectada virtualmente.
   - *Componentes Clave*: `Simulador Wokwi, Compilador C++ para ESP32/Pico, Analizador lógico virtual`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p4.svg`
1. **Scientist & Engineer's Guide to DSP** ($35, 3 semanas)
   - *Descripción*: Implementación de algoritmos de transformada rápida de Fourier (FFT), filtrado FIR y correlación cruzada en microcontroladores.
   - *Componentes Clave*: `Placa Teensy 4.0 / STM32, Codec de audio I2S, Micrófono de condensador, Auriculares`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p5.svg`
1. **W2AEW RF Lab Techniques & Measurements** ($45, 2 semanas)
   - *Descripción*: Medición práctica de pérdidas de retorno, adaptación de impedancias con carta de Smith y atenuación de filtros con NanoVNA.
   - *Componentes Clave*: `Analizador de redes NanoVNA-H, Kit de calibración SOLT, Filtros coaxiales LC, Cargas de 50Ω`
   - *Esquemático Vectorial*: `public/schematics/guide-029_p6.svg`

---

## [guide-030] The Summer EE Glow-Up (Vol. 3: Specialist Picks)
- **Disciplina**: Electrical Engineering
- **Páginas**: 12 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $160 - $240
- **Archivo Original**: `summer-ee-glow-up-vol3.pdf` (67.7 KB)
- **Resumen**: Tercera fase de especialización que cubre las disciplinas más cotizadas de la ingeniería electrónica: diseño de pistas diferenciales para buses de alta velocidad, IoT de largo alcance con LoRaWAN, convertidores conmutados y control moderno.

### Proyectos Prácticos Incluidos:
1. **FEDEVEL High-Speed PCB Layout Masterclass** ($30, 2 semanas)
   - *Descripción*: Ruteo de buses de memoria DDR3/DDR4, cálculo de impedancia de líneas microstrip y control estricto de retardo y diafonía.
   - *Componentes Clave*: `KiCad / Altium, Calculadora de impedancias Polar, Stackup de 4/6 capas`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p1.svg`
1. **Steve Brunton Modern Control & Kalman Filters** ($25, 2 semanas)
   - *Descripción*: Diseño en espacio de estados, reguladores lineales cuadráticos (LQR) y filtro de Kalman extendido para fusión inercial.
   - *Componentes Clave*: `Simulador Python / MATLAB, Péndulo con encoder, Driver de motor puente H`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p2.svg`
1. **Andreas Spiess Deep IoT & LoRaWAN Node** ($35, 2 semanas)
   - *Descripción*: Nodo de telemetría exterior de consumo ultra-bajo alimentado por panel solar con autonomía superior a 5 años en la red LoRaWAN.
   - *Componentes Clave*: `Módulo LoRa Heltec ESP32, Panel solar 5V 1W, Supercondensador / LiFePO4, Sensor BME280`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p3.svg`
1. **GreatScott! Switching Converter Design** ($28, 2 semanas)
   - *Descripción*: Cálculo, bobinado de inductores y ensamblado de un convertidor reductor síncrono Buck de 12V a 5V con eficiencia superior al 94%.
   - *Componentes Clave*: `Controlador PWM síncrono, MOSFETs de baja RDS(on), Núcleo toroidal de ferrita, Osciloscopio`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p4.svg`
1. **Digital Design & RISC-V Architecture** ($40, 2 semanas)
   - *Descripción*: Implementación de una CPU RISC-V de 3 etapas de segmentación sintetizada sobre una placa de desarrollo FPGA económica.
   - *Componentes Clave*: `Placa FPGA Gowin Tang Nano 9K, Cable USB-JTAG, Entorno Verilog/Yosys`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p5.svg`
1. **Shawn Hymel TinyML Embedded Classifier** ($32, 2 semanas)
   - *Descripción*: Entrenamiento y cuantización INT8 de una red neuronal para detección de anomalías acústicas ejecutada en un microcontrolador Cortex-M4.
   - *Componentes Clave*: `Microcontrolador Seeed Xiao nRF52840, Micrófono PDM, Entorno Edge Impulse, Batería LiPo`
   - *Esquemático Vectorial*: `public/schematics/guide-030_p6.svg`

---

## [guide-031] The Summer EE Glow-Up (Vol. 4: Board-Level Track)
- **Disciplina**: Electronics & Hardware
- **Páginas**: 10 págs | **Dificultad**: Avanzado | **Presupuesto Est.**: $150 - $230
- **Archivo Original**: `summer-ee-glow-up-vol4.pdf` (3.2 MB)
- **Resumen**: El volumen final que une todos los conocimientos para convertirlos en placas de circuito impreso comerciales: reglas de diseño para manufactura (DFM), librerías de componentes atómicas, RTOS industrial y protección ESD.

### Proyectos Prácticos Incluidos:
1. **KiCad Production-Ready DFM Workflow** ($20, 1 semana)
   - *Descripción*: Configuración de reglas de diseño DRC según las capacidades del fabricante, generación de archivos Gerber X2, perforación y centroides Pick-and-Place.
   - *Componentes Clave*: `KiCad 8, Archivos de reglas DFM, Visor Gerber GerbView`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p1.svg`
1. **The Art of Electronics Ultra-Low Noise Supply** ($35, 2 semanas)
   - *Descripción*: Diseño de una fuente de alimentación lineal dual con referencia de voltaje buried-zener y rizado inferior a 1 µV RMS para instrumentación.
   - *Componentes Clave*: `Regulador de ultra-bajo ruido LT3042, Transformador toroidal, Capacitores de tantalio polímero`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p2.svg`
1. **Zephyr RTOS Industrial Node Deployment** ($25, 2 semanas)
   - *Descripción*: Desarrollo de un firmware profesional con particiones multihilo seguras, gestión de energía de bajo consumo y controladores DeviceTree.
   - *Componentes Clave*: `Placa STM32 Nucleo / ESP32-S3, Depurador J-Link / ST-Link, Terminal serial`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p3.svg`
1. **Microwaves101 Planar Filter & Coupler** ($30, 2 semanas)
   - *Descripción*: Diseño y fabricación en sustrato Rogers/FR4 de un acoplador direccional de microstrip y un filtro pasa-banda interdigital a 2.4 GHz.
   - *Componentes Clave*: `Sustrato PCB de alta frecuencia, Conectores SMA de borde de placa, Software Qucs-S`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p4.svg`
1. **JLCPCB SMT Panelization & Automated Assembly** ($40, 1 semana)
   - *Descripción*: Panelización de múltiples circuitos con ranuras de fresado (tab-routing), marcas fiduciales ópticas y optimización de lista BOM para componentes básicos.
   - *Componentes Clave*: `Herramienta de panelizado KiKit, Fiduciales 1mm, Pasta de estaño SAC305`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p5.svg`
1. **EEVblog Teardown Forensic & ESD Hardening** ($25, 1 semana)
   - *Descripción*: Análisis de fallos y diseño de protección integral frente a descargas electrostáticas (ESD) mediante diodos TVS, fusibles rearmables PPTC y filtrado EMI.
   - *Componentes Clave*: `Arreglo diodos TVS USBLC6-2, Fusibles PolySwitch, Pistola piezoeléctrica ESD de test`
   - *Esquemático Vectorial*: `public/schematics/guide-031_p6.svg`

---
