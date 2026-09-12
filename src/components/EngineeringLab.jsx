import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FlaskConical, 
  Activity, 
  Calculator, 
  Cpu, 
  Zap, 
  Sliders, 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Clock, 
  HardDrive, 
  Compass, 
  Info, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export default function EngineeringLab({ 
  initialTab = 'analyzer',
  initialProject = null,
  allProjects = [],
  onSelectProject
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'analyzer' | 'calculators' | 'pinout' | 'telemetry'
  
  // Update active tab if initialTab prop changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0C1527] to-slate-950">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <FlaskConical className="h-3.5 w-3.5 text-cyan-400" />
              Engineering Workbench & Simulation Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Laboratorio <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Virtual de Ingeniería</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Entorno interactivo de validación de hardware: analizador lógico de buses (I2C, SPI, UART, PWM), calculadoras eléctricas de diseño, matriz de compatibilidad multi-MCU y banco de telemetría de sensores en vivo.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'analyzer'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Analizador Lógico</span>
            </button>

            <button
              onClick={() => setActiveTab('calculators')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'calculators'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Calculadoras</span>
            </button>

            <button
              onClick={() => setActiveTab('pinout')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pinout'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Matriz Pinout</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'telemetry'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Telemetría en Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Virtual Logic Analyzer */}
      {activeTab === 'analyzer' && <LogicAnalyzerWorkbench />}

      {/* Tab 2: Hardware Design Calculators */}
      {activeTab === 'calculators' && <HardwareCalculators />}

      {/* Tab 3: Pinout & Multi-MCU Matrix */}
      {activeTab === 'pinout' && <PinoutMatrixWorkbench />}

      {/* Tab 4: Telemetry Bench & Serial Terminal */}
      {activeTab === 'telemetry' && (
        <TelemetryBench 
          initialProject={initialProject} 
          allProjects={allProjects}
          onSelectProject={onSelectProject}
        />
      )}
    </div>
  );
}

/* =========================================================================
   TAB 1: LOGIC ANALYZER & BUS WAVEFORM WORKBENCH
   ========================================================================= */
function LogicAnalyzerWorkbench() {
  const [protocol, setProtocol] = useState('i2c'); // 'i2c' | 'spi' | 'uart' | 'pwm'
  const [frequencyKhz, setFrequencyKhz] = useState(100);
  const [dutyCycle, setDutyCycle] = useState(50);
  const [i2cAddress, setI2cAddress] = useState('0x3C');
  const [i2cDataByte, setI2cDataByte] = useState('0xA5');
  const [injectNack, setInjectNack] = useState(false);
  const [uartBaud, setUartBaud] = useState(115200);
  const [uartText, setUartText] = useState('OK');
  const [spiMode, setSpiMode] = useState(0); // 0, 1, 2, 3
  const [copiedVCD, setCopiedVCD] = useState(false);

  // Timing metrics
  const bitTimeUs = useMemo(() => {
    if (protocol === 'uart') return (1000000 / uartBaud).toFixed(2);
    if (protocol === 'pwm') return (1000 / frequencyKhz).toFixed(2);
    return (1000 / frequencyKhz).toFixed(2);
  }, [protocol, uartBaud, frequencyKhz]);

  const copyTimingVCD = () => {
    const vcd = `$date ${new Date().toISOString()} $end\n$timescale 1us $end\n$scope module logic_analyzer $end\n$var wire 1 ! CLK $end\n$var wire 1 " DATA $end\n$upscope $end\n$enddefinitions $end\n#0\n0!\n1"\n#10\n1!\n0"\n`;
    navigator.clipboard.writeText(vcd);
    setCopiedVCD(true);
    setTimeout(() => setCopiedVCD(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
      {/* Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Analizador Lógico & Decodificador de Protocolos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspecciona tramas a nivel de bit, calcula tiempos de muestreo y visualiza estados START, ACK/NACK y transiciones síncronas.
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setProtocol('i2c')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              protocol === 'i2c' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            I2C Bus
          </button>
          <button
            onClick={() => setProtocol('spi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              protocol === 'spi' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SPI 4-Wire
          </button>
          <button
            onClick={() => setProtocol('uart')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              protocol === 'uart' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            UART 8N1
          </button>
          <button
            onClick={() => setProtocol('pwm')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              protocol === 'pwm' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            PWM Timer
          </button>
        </div>
      </div>

      {/* Parameters Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
        {protocol === 'i2c' && (
          <>
            <div>
              <label className="text-slate-400 block mb-1">Velocidad del Bus:</label>
              <select
                value={frequencyKhz}
                onChange={(e) => setFrequencyKhz(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={100}>100 kHz (Standard-Mode)</option>
                <option value={400}>400 kHz (Fast-Mode)</option>
                <option value={1000}>1000 kHz (Fast-Mode Plus)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Dirección I2C (7-bit):</label>
              <select
                value={i2cAddress}
                onChange={(e) => setI2cAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value="0x3C">0x3C (Display OLED SSD1306)</option>
                <option value="0x68">0x68 (IMU MPU6050 / ICM20948)</option>
                <option value="0x76">0x76 (Sensor Presión BMP280)</option>
                <option value="0x48">0x48 (ADC 16-bit ADS1115)</option>
                <option value="0x50">0x50 (EEPROM AT24C32)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Byte de Datos (Hex):</label>
              <input
                type="text"
                value={i2cDataByte}
                onChange={(e) => setI2cDataByte(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 focus:outline-none"
                placeholder="0xA5"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={injectNack}
                  onChange={(e) => setInjectNack(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300">Inyectar NACK (Fallo Esclavo)</span>
              </label>
            </div>
          </>
        )}

        {protocol === 'spi' && (
          <>
            <div>
              <label className="text-slate-400 block mb-1">Modo SPI (CPOL / CPHA):</label>
              <select
                value={spiMode}
                onChange={(e) => setSpiMode(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={0}>Mode 0 (CPOL=0, CPHA=0) [Estándar]</option>
                <option value={1}>Mode 1 (CPOL=0, CPHA=1)</option>
                <option value={2}>Mode 2 (CPOL=1, CPHA=0)</option>
                <option value={3}>Mode 3 (CPOL=1, CPHA=1)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Frecuencia SCK:</label>
              <select
                value={frequencyKhz}
                onChange={(e) => setFrequencyKhz(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={1000}>1.0 MHz (SD Cards inicial)</option>
                <option value={4000}>4.0 MHz (Sensores RFM95)</option>
                <option value={10000}>10.0 MHz (Display TFT ST7789)</option>
                <option value={20000}>20.0 MHz (Flash W25Q128)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Chip Select (CS):</label>
              <div className="py-1.5 text-emerald-400">Active LOW (Nivel 0V)</div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Transmisión:</label>
              <div className="py-1.5 text-purple-400">Full-Duplex Simultáneo</div>
            </div>
          </>
        )}

        {protocol === 'uart' && (
          <>
            <div>
              <label className="text-slate-400 block mb-1">Baud Rate:</label>
              <select
                value={uartBaud}
                onChange={(e) => setUartBaud(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={9600}>9600 baud (GPS NMEA)</option>
                <option value={57600}>57600 baud (Módulos BT/HC-05)</option>
                <option value={115200}>115200 baud (ESP32 Serial Boot)</option>
                <option value={921600}>921600 baud (Firmware Flashing)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Formato de Trama:</label>
              <div className="py-1.5 text-cyan-300">8N1 (1 Start, 8 Data, 1 Stop)</div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Texto a Transmitir:</label>
              <input
                type="text"
                value={uartText}
                maxLength={4}
                onChange={(e) => setUartText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 focus:outline-none"
                placeholder="OK"
              />
            </div>
          </>
        )}

        {protocol === 'pwm' && (
          <>
            <div>
              <label className="text-slate-400 block mb-1">Frecuencia: {frequencyKhz} kHz</label>
              <input
                type="range"
                min="1"
                max="50"
                value={frequencyKhz}
                onChange={(e) => setFrequencyKhz(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Duty Cycle: {dutyCycle}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={dutyCycle}
                onChange={(e) => setDutyCycle(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Tensión Media (3.3V ref):</label>
              <div className="py-1.5 text-emerald-400 font-bold">
                {(3.3 * (dutyCycle / 100)).toFixed(2)} V
              </div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Ancho de Pulso ($T_{high}$):</label>
              <div className="py-1.5 text-amber-400 font-bold">
                {((1000 / frequencyKhz) * (dutyCycle / 100)).toFixed(2)} μs
              </div>
            </div>
          </>
        )}
      </div>

      {/* SVG Waveform Visualizer */}
      <div className="p-5 rounded-2xl bg-[#080D1A] border border-cyan-900/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Activity className="h-4 w-4" /> Oscilograma de Señal Digital Vectorial (Tiempo Base: {bitTimeUs} μs/div)
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden sm:inline">1 LSB = Tiempo Real</span>
            <button
              onClick={copyTimingVCD}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              {copiedVCD ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedVCD ? 'VCD Copiado' : 'Exportar VCD'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Waveform Renderer based on Protocol */}
        <div className="overflow-x-auto py-2">
          {protocol === 'i2c' && (
            <svg viewBox="0 0 800 200" className="w-full h-auto min-w-[700px] font-mono text-[11px]">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="200" fill="url(#grid)" />

              {/* SCL Clock Line */}
              <text x="15" y="65" fill="#A855F7" fontWeight="bold">SCL (Reloj)</text>
              <path
                d="M 120 70 L 160 70 L 160 30 L 200 30 L 200 70 L 240 70 L 240 30 L 280 30 L 280 70 L 320 70 L 320 30 L 360 30 L 360 70 L 400 70 L 400 30 L 440 30 L 440 70 L 480 70 L 480 30 L 520 30 L 520 70 L 560 70 L 560 30 L 600 30 L 600 70 L 640 70 L 640 30 L 680 30 L 680 70 L 720 70 L 720 30 L 760 30 L 760 70"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
              />

              {/* SDA Data Line */}
              <text x="15" y="145" fill="#06B6D4" fontWeight="bold">SDA (Datos)</text>
              <path
                d={injectNack 
                  ? "M 120 110 L 140 150 L 200 150 L 240 110 L 320 110 L 360 150 L 440 150 L 480 110 L 560 110 L 600 110 L 680 110 L 720 110 L 760 110"
                  : "M 120 110 L 140 150 L 200 150 L 240 110 L 320 110 L 360 150 L 440 150 L 480 110 L 560 110 L 600 150 L 680 150 L 720 150 L 760 110"
                }
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
              />

              {/* Annotations */}
              <g fill="#94A3B8" fontSize="10">
                <text x="130" y="20" fill="#EAB308" fontWeight="bold">START</text>
                <text x="240" y="20" fill="#38BDF8">ADDR: {i2cAddress}</text>
                <text x="490" y="20" fill="#F43F5E">W(0)</text>
                <text x="570" y="20" fill={injectNack ? "#EF4444" : "#10B981"} fontWeight="bold">
                  {injectNack ? "NACK (Error)" : "ACK"}
                </text>
                <text x="660" y="20" fill="#38BDF8">DATA: {i2cDataByte}</text>
                <text x="740" y="20" fill="#EAB308" fontWeight="bold">STOP</text>
              </g>
            </svg>
          )}

          {protocol === 'spi' && (
            <svg viewBox="0 0 800 220" className="w-full h-auto min-w-[700px] font-mono text-[11px]">
              {/* CS */}
              <text x="15" y="45" fill="#EF4444" fontWeight="bold">CS (Chip Select)</text>
              <path d="M 100 30 L 140 30 L 140 50 L 720 50 L 720 30 L 780 30" fill="none" stroke="#EF4444" strokeWidth="2" />

              {/* SCK */}
              <text x="15" y="95" fill="#A855F7" fontWeight="bold">SCK (Reloj Mode {spiMode})</text>
              <path d="M 140 90 L 180 90 L 180 70 L 220 70 L 220 90 L 260 90 L 260 70 L 300 70 L 300 90 L 340 90 L 340 70 L 380 70 L 380 90 L 420 90 L 420 70 L 460 70 L 460 90 L 500 90 L 500 70 L 540 70 L 540 90 L 580 90 L 580 70 L 620 70 L 620 90 L 660 90 L 660 70 L 700 70 L 700 90" fill="none" stroke="#A855F7" strokeWidth="2" />

              {/* MOSI */}
              <text x="15" y="145" fill="#06B6D4" fontWeight="bold">MOSI (Master Out)</text>
              <path d="M 140 130 L 220 150 L 300 130 L 380 130 L 460 150 L 540 150 L 620 130 L 700 150" fill="none" stroke="#06B6D4" strokeWidth="2" />

              {/* MISO */}
              <text x="15" y="195" fill="#10B981" fontWeight="bold">MISO (Slave Out)</text>
              <path d="M 140 190 L 220 190 L 300 170 L 380 190 L 460 170 L 540 190 L 620 170 L 700 170" fill="none" stroke="#10B981" strokeWidth="2" />
            </svg>
          )}

          {protocol === 'uart' && (
            <svg viewBox="0 0 800 160" className="w-full h-auto min-w-[700px] font-mono text-[11px]">
              <text x="15" y="75" fill="#10B981" fontWeight="bold">TX Line (3.3V)</text>
              {/* Idle High -> Start(0) -> 8 Data Bits -> Stop(1) */}
              <path
                d="M 100 40 L 160 40 L 160 100 L 220 100 L 220 40 L 280 40 L 280 100 L 340 100 L 340 40 L 400 40 L 400 40 L 460 100 L 520 100 L 580 40 L 640 40 L 700 40 L 700 40 L 760 40"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />
              <g fill="#94A3B8" fontSize="10">
                <text x="110" y="25" fill="#64748B">IDLE (1)</text>
                <text x="170" y="25" fill="#EF4444" fontWeight="bold">START(0)</text>
                <text x="235" y="25" fill="#38BDF8">D0(1)</text>
                <text x="295" y="25" fill="#38BDF8">D1(0)</text>
                <text x="355" y="25" fill="#38BDF8">D2(1)</text>
                <text x="415" y="25" fill="#38BDF8">D3(1)</text>
                <text x="475" y="25" fill="#38BDF8">D4(0)</text>
                <text x="535" y="25" fill="#38BDF8">D5(0)</text>
                <text x="595" y="25" fill="#38BDF8">D6(1)</text>
                <text x="655" y="25" fill="#38BDF8">D7(1)</text>
                <text x="715" y="25" fill="#10B981" fontWeight="bold">STOP(1)</text>
              </g>
            </svg>
          )}

          {protocol === 'pwm' && (
            <svg viewBox="0 0 800 160" className="w-full h-auto min-w-[700px] font-mono text-[11px]">
              <text x="15" y="75" fill="#F59E0B" fontWeight="bold">PWM Output</text>
              <path
                d={`M 100 110 L 100 40 L ${100 + (120 * dutyCycle) / 100} 40 L ${100 + (120 * dutyCycle) / 100} 110 L 220 110 L 220 40 L ${220 + (120 * dutyCycle) / 100} 40 L ${220 + (120 * dutyCycle) / 100} 110 L 340 110 L 340 40 L ${340 + (120 * dutyCycle) / 100} 40 L ${340 + (120 * dutyCycle) / 100} 110 L 460 110 L 460 40 L ${460 + (120 * dutyCycle) / 100} 40 L ${460 + (120 * dutyCycle) / 100} 110 L 580 110 L 580 40 L ${580 + (120 * dutyCycle) / 100} 40 L ${580 + (120 * dutyCycle) / 100} 110 L 700 110`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />
              <g fill="#94A3B8" fontSize="10">
                <text x="110" y="25" fill="#F59E0B">Ton: {((1000 / frequencyKhz) * (dutyCycle / 100)).toFixed(1)}μs</text>
                <text x="230" y="25" fill="#64748B">Period: {(1000 / frequencyKhz).toFixed(1)}μs</text>
              </g>
            </svg>
          )}
        </div>

        {/* Decoder Summary Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Protocolo: {protocol.toUpperCase()}
            </span>
            <span className="text-slate-400">
              Duración de Bit: <strong className="text-white">{bitTimeUs} μs</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Condición de bus libre (Idle High) verificada mediante resistencias pull-up</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TAB 2: HARDWARE DESIGN CALCULATORS
   ========================================================================= */
function HardwareCalculators() {
  const [calcType, setCalcType] = useState('pullup'); // 'pullup' | 'divider' | 'battery' | 'rcfilter'

  // Pull-up states
  const [vdd, setVdd] = useState(3.3);
  const [busCapacitance, setBusCapacitance] = useState(150); // pF
  const [speedMode, setSpeedMode] = useState(400); // kHz

  // Pull-up calculation
  const pullupResults = useMemo(() => {
    // tr_max for 100kHz = 1000ns, 400kHz = 300ns, 1000kHz = 120ns
    const tr_max = speedMode === 100 ? 1000 : speedMode === 400 ? 300 : 120;
    const vol_max = 0.4;
    const iol_min = 0.003; // 3mA
    const r_min = (vdd - vol_max) / iol_min; // ohms
    const r_max = (tr_max * 1e-9) / (0.8473 * (busCapacitance * 1e-12)); // ohms
    
    // Nearest E24 standard
    const standardValues = [1000, 1500, 2200, 3300, 4700, 6800, 10000];
    const rec = standardValues.find(v => v >= r_min && v <= r_max) || 4700;

    return {
      rMin: Math.round(r_min),
      rMax: Math.round(r_max),
      recommended: rec,
      status: r_min > r_max ? 'invalid' : 'valid'
    };
  }, [vdd, busCapacitance, speedMode]);

  // Voltage divider states
  const [vin, setVin] = useState(5.0);
  const [targetVout, setTargetVout] = useState(3.3);
  const [dividerCurrentMa, setDividerCurrentMa] = useState(1.0); // mA

  const dividerResults = useMemo(() => {
    // Vout = Vin * (R2 / (R1 + R2))
    const totalR = (vin / (dividerCurrentMa * 1e-3));
    const r2_calc = (targetVout / vin) * totalR;
    const r1_calc = totalR - r2_calc;
    
    // Standard approximations
    const r1_k = (r1_calc / 1000).toFixed(1);
    const r2_k = (r2_calc / 1000).toFixed(1);
    const actualVout = (vin * (r2_calc / (r1_calc + r2_calc))).toFixed(2);
    const powerMw = ((vin * vin) / totalR * 1000).toFixed(1);

    return { r1_k, r2_k, actualVout, powerMw };
  }, [vin, targetVout, dividerCurrentMa]);

  // Battery life states
  const [batteryMah, setBatteryMah] = useState(2500); // e.g. 18650
  const [activeMa, setActiveMa] = useState(80); // ESP32 TX
  const [activeTimeMs, setActiveTimeMs] = useState(200); // ms
  const [sleepUa, setSleepUa] = useState(15); // Deep sleep uA
  const [intervalSec, setIntervalSec] = useState(60); // 1 sample per min

  const batteryResults = useMemo(() => {
    const cycleTimeSec = intervalSec;
    const activeTimeSec = activeTimeMs / 1000;
    const sleepTimeSec = Math.max(0, cycleTimeSec - activeTimeSec);
    
    const activeMahPerCycle = (activeMa * (activeTimeSec / 3600));
    const sleepMahPerCycle = ((sleepUa / 1000) * (sleepTimeSec / 3600));
    const totalMahPerCycle = activeMahPerCycle + sleepMahPerCycle;
    
    const cyclesPerHour = 3600 / cycleTimeSec;
    const mahPerHour = totalMahPerCycle * cyclesPerHour;
    
    const totalHours = batteryMah / mahPerHour;
    const totalDays = (totalHours / 24).toFixed(1);
    const totalMonths = (totalDays / 30.4).toFixed(1);
    const avgCurrentMa = mahPerHour.toFixed(3);

    return { totalDays, totalMonths, avgCurrentMa };
  }, [batteryMah, activeMa, activeTimeMs, sleepUa, intervalSec]);

  // RC Filter states
  const [filterR, setFilterR] = useState(10); // kOhm
  const [filterC, setFilterC] = useState(100); // nF

  const filterResults = useMemo(() => {
    const r_ohms = filterR * 1000;
    const c_farads = filterC * 1e-9;
    const fc = 1 / (2 * Math.PI * r_ohms * c_farads);
    const tr = 2.2 * r_ohms * c_farads * 1e6; // in us
    return {
      fcHz: fc < 1000 ? fc.toFixed(1) + ' Hz' : (fc / 1000).toFixed(2) + ' kHz',
      trUs: tr.toFixed(1) + ' μs'
    };
  }, [filterR, filterC]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
      {/* Sub-Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-cyan-400" />
            Calculadoras de Diseño Eléctrico y Circuitos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ecuaciones de ingeniería validadas para garantizar márgenes seguros de tensión, integridad de bus y autonomía energética.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono flex-wrap">
          <button
            onClick={() => setCalcType('pullup')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calcType === 'pullup' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            I2C Pull-Up
          </button>
          <button
            onClick={() => setCalcType('divider')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calcType === 'divider' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Divisor 5V➔3.3V
          </button>
          <button
            onClick={() => setCalcType('battery')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calcType === 'battery' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Autonomía Batería
          </button>
          <button
            onClick={() => setCalcType('rcfilter')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calcType === 'rcfilter' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Filtro RC Sensores
          </button>
        </div>
      </div>

      {/* CALCULATOR 1: I2C PULL-UP */}
      {calcType === 'pullup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
            <h3 className="text-sm font-bold text-cyan-300 font-sans flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" /> Parámetros del Bus I2C
            </h3>
            
            <div>
              <label className="text-slate-400 block mb-1">Tensión de Alimentación ($V_{DD}$):</label>
              <div className="flex gap-2">
                {[3.3, 5.0].map(v => (
                  <button
                    key={v}
                    onClick={() => setVdd(v)}
                    className={`flex-1 py-1.5 rounded-lg border transition-all ${
                      vdd === v ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v}V
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Frecuencia de Operación:</label>
              <select
                value={speedMode}
                onChange={(e) => setSpeedMode(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={100}>100 kHz (Standard-Mode · tr &le; 1000 ns)</option>
                <option value={400}>400 kHz (Fast-Mode · tr &le; 300 ns)</option>
                <option value={1000}>1000 kHz (Fast-Mode Plus · tr &le; 120 ns)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Capacitancia Parásita Estimada (Cb): {busCapacitance} pF
              </label>
              <input
                type="range"
                min="20"
                max="400"
                value={busCapacitance}
                onChange={(e) => setBusCapacitance(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Regla empírica: ~10-15 pF por sensor + ~50 pF/metro de cableado.
              </p>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-6 rounded-2xl bg-[#080D1A] border-2 border-cyan-500/40 space-y-4 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Resultado de Dimensionamiento</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                Norma NXP UM10204
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">$R_{min}$ (Límite Corriente Sink):</span>
                <span className="text-base font-bold text-amber-300">{pullupResults.rMin} Ω</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">$R_{max}$ (Límite Tiempo Subida):</span>
                <span className="text-base font-bold text-purple-300">{pullupResults.rMax} Ω</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-600/50 space-y-1">
              <span className="text-[10px] text-cyan-300 uppercase font-semibold block">Resistencia Comercial E24 Recomendada:</span>
              <div className="text-2xl font-black text-cyan-200">
                {(pullupResults.recommended / 1000).toFixed(1)} kΩ ({pullupResults.recommended} Ω)
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1">
                Proporciona tiempo de subida óptimo sin sobrecargar los transistores open-drain de la MCU (ESP32/STM32).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: VOLTAGE DIVIDER */}
      {calcType === 'divider' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
            <h3 className="text-sm font-bold text-cyan-300 font-sans flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" /> Parámetros de Adaptación Lógica
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Tensión de Entrada (Vin):</label>
              <input
                type="number"
                step="0.1"
                value={vin}
                onChange={(e) => setVin(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tensión Deseada de Salida (Vout):</label>
              <input
                type="number"
                step="0.1"
                value={targetVout}
                onChange={(e) => setTargetVout(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Corriente de Carga Deseada:</label>
              <select
                value={dividerCurrentMa}
                onChange={(e) => setDividerCurrentMa(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              >
                <option value={0.5}>0.5 mA (Bajo Consumo / Baterías)</option>
                <option value={1.0}>1.0 mA (Estándar Señales Digitales)</option>
                <option value={5.0}>5.0 mA (Alta Inmunidad al Ruido)</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#080D1A] border-2 border-cyan-500/40 space-y-4 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Resistencias Calculadas</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                Protección GPIO 3.3V
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">R1 (Superior hacia Vin):</span>
                <span className="text-lg font-bold text-amber-300">{dividerResults.r1_k} kΩ</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">R2 (Inferior hacia GND):</span>
                <span className="text-lg font-bold text-emerald-300">{dividerResults.r2_k} kΩ</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-[11px]">Tensión Real Obtenida:</span>
                <span className="text-base font-bold text-emerald-300">{dividerResults.actualVout} V</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Potencia Total Disipada:</span>
                <span>{dividerResults.powerMw} mW</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: BATTERY RUNTIME */}
      {calcType === 'battery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
            <h3 className="text-sm font-bold text-cyan-300 font-sans flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-cyan-400" /> Parámetros de Ciclo de Trabajo
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Capacidad de Batería (mAh):</label>
              <input
                type="number"
                value={batteryMah}
                onChange={(e) => setBatteryMah(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Corriente Activa (mA):</label>
                <input
                  type="number"
                  value={activeMa}
                  onChange={(e) => setActiveMa(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tiempo Activo (ms):</label>
                <input
                  type="number"
                  value={activeTimeMs}
                  onChange={(e) => setActiveTimeMs(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Deep Sleep (μA):</label>
                <input
                  type="number"
                  value={sleepUa}
                  onChange={(e) => setSleepUa(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Intervalo (Segundos):</label>
                <input
                  type="number"
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#080D1A] border-2 border-emerald-500/40 space-y-4 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Estimación de Autonomía</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                IoT / Sensor Node
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Duración Estimada en Operación Continua:</span>
              <div className="text-3xl font-black text-emerald-200">
                {batteryResults.totalDays} Días
              </div>
              <div className="text-xs text-slate-300">
                Aproximadamente <strong className="text-white">{batteryResults.totalMonths} meses</strong> en campo.
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Consumo Promedio Efectivo:</span>
              <span className="text-sm font-bold text-cyan-300">{batteryResults.avgCurrentMa} mA</span>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 4: RC LOW-PASS FILTER */}
      {calcType === 'rcfilter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
            <h3 className="text-sm font-bold text-cyan-300 font-sans flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" /> Filtro Analógico de Entrada ADC
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Resistencia R ({filterR} kΩ):</label>
              <input
                type="range"
                min="1"
                max="100"
                value={filterR}
                onChange={(e) => setFilterR(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Capacidad C ({filterC} nF):</label>
              <input
                type="range"
                min="1"
                max="1000"
                value={filterC}
                onChange={(e) => setFilterC(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#080D1A] border-2 border-purple-500/40 space-y-4 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Respuesta en Frecuencia</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                Filtro Pasivo de 1er Orden
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-600/50 space-y-2">
              <span className="text-[10px] text-purple-300 uppercase font-semibold block">Frecuencia de Corte (-3dB):</span>
              <div className="text-3xl font-black text-purple-200">{filterResults.fcHz}</div>
              <p className="text-[11px] text-slate-300 font-sans">
                Frecuencias por encima de este umbral sufrirán una atenuación de -20 dB por década.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Tiempo de Subida ($t_r$ 10% a 90%):</span>
              <span className="text-sm font-bold text-cyan-300">{filterResults.trUs}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   TAB 3: MULTI-MCU PINOUT & HARDWARE COMPATIBILITY MATRIX
   ========================================================================= */
function PinoutMatrixWorkbench() {
  const [selectedMcu, setSelectedMcu] = useState('esp32s3');
  const [selectedBus, setSelectedBus] = useState('i2c');

  const MCU_DATA = {
    esp32s3: {
      name: 'ESP32-S3 (WROOM-1 / DevKitC)',
      arch: 'Xtensa Dual-Core LX7 @ 240MHz',
      flash: '8MB / 16MB Flash + 2MB/8MB PSRAM',
      voltage: '3.3V (NO 5V tolerante)',
      buses: {
        i2c: { pins: ['SDA: GPIO 21 (Defecto) / Cualquier GPIO', 'SCL: GPIO 22 (Defecto) / Cualquier GPIO'], notes: 'Matriz IO MUX permite mapear I2C a cualquier GPIO libre.' },
        spi: { pins: ['MOSI: GPIO 11', 'MISO: GPIO 13', 'SCK: GPIO 12', 'CS: GPIO 10'], notes: 'FSPI bus de alta velocidad (hasta 80 MHz).' },
        uart: { pins: ['TX: GPIO 43 (U0TXD)', 'RX: GPIO 44 (U0RXD)'], notes: 'UART0 dedicada a consola / programación USB.' },
        adc: { pins: ['ADC1: GPIO 1 a 10 (Recomendado con WiFi)', 'ADC2: GPIO 11 a 20 (Bloqueado con WiFi activo)'], notes: 'No usar ADC2 si el transceptor WiFi/BLE está transmitiendo.' }
      },
      warnings: ['GPIO 0, 45, 46 son strapping pins: un pull-up o pull-down externo puede impedir el arranque.', 'Alimentar con mínimo 500mA estables para evitar caídas (brownout).']
    },
    stm32f4: {
      name: 'STM32F401 / F411 (BlackPill)',
      arch: 'ARM Cortex-M4 con FPU @ 84/100MHz',
      flash: '256KB / 512KB Flash + 64KB/128KB SRAM',
      voltage: '3.3V (La mayoría de GPIOs son 5V tolerantes)',
      buses: {
        i2c: { pins: ['I2C1 SDA: PB7 / PB9', 'I2C1 SCL: PB6 / PB8'], notes: 'Requiere resistencias pull-up externas obligatorias de 4.7kΩ.' },
        spi: { pins: ['SPI1 MOSI: PA7', 'SPI1 MISO: PA6', 'SPI1 SCK: PA5', 'SPI1 CS: PA4'], notes: 'SPI1 conectado al bus APB2 de alta velocidad.' },
        uart: { pins: ['USART1 TX: PA9', 'USART1 RX: PA10'], notes: 'USART1 5V tolerante.' },
        adc: { pins: ['ADC 12-bit: PA0 a PA7, PB0, PB1'], notes: 'Conversor SAR de 12 bits ultrarrápido (2.4 MSPS).' }
      },
      warnings: ['Pines PC13, PC14, PC15 tienen corriente de salida limitada (3mA máx).', 'El pin BOOT0 debe mantenerse a 0V (GND) para arrancar desde memoria Flash.']
    },
    rp2040: {
      name: 'Raspberry Pi Pico (RP2040)',
      arch: 'Dual ARM Cortex-M0+ @ 133MHz',
      flash: '2MB QSPI Flash + 264KB SRAM',
      voltage: '3.3V (NO 5V tolerante)',
      buses: {
        i2c: { pins: ['I2C0 SDA: GP4', 'I2C0 SCL: GP5', 'I2C1 SDA: GP2', 'I2C1 SCL: GP3'], notes: 'Dos controladores hardware I2C independientes.' },
        spi: { pins: ['SPI0 TX(MOSI): GP19', 'SPI0 RX(MISO): GP16', 'SPI0 SCK: GP18', 'SPI0 CS: GP17'], notes: '8 máquinas de estado PIO programables.' },
        uart: { pins: ['UART0 TX: GP0', 'UART0 RX: GP1'], notes: 'Buffer FIFO de 32 bytes.' },
        adc: { pins: ['ADC0: GP26', 'ADC1: GP27', 'ADC2: GP28', 'ADC3: Temp Sensor Interno'], notes: 'ADC de 12 bits con ENOB aproximado de 8.7 bits.' }
      },
      warnings: ['Todas las entradas son de 3.3V estricto. Conectar señales de 5V destruirá el chip.', 'El pin 3V3_EN puede deshabilitar el regulador interno on-board.']
    }
  };

  const currentMcu = MCU_DATA[selectedMcu] || MCU_DATA.esp32s3;
  const currentBus = currentMcu.buses[selectedBus] || currentMcu.buses.i2c;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            Matriz de Asignación de Pines & Compatibilidad Multi-MCU
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifica conexiones recomendadas, compatibilidad de tensión (3.3V vs 5V) y strapping pins críticos.
          </p>
        </div>

        {/* MCU Selector */}
        <div className="flex items-center gap-2">
          {Object.keys(MCU_DATA).map((k) => (
            <button
              key={k}
              onClick={() => setSelectedMcu(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedMcu === k
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MCU Technical Specs Card */}
      <div className="p-5 rounded-2xl bg-[#080D1A] border border-cyan-900/50 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Controlador:</span>
          <span className="text-white font-bold">{currentMcu.name}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Arquitectura:</span>
          <span className="text-cyan-300">{currentMcu.arch}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Nivel Lógico:</span>
          <span className="text-emerald-300 font-bold">{currentMcu.voltage}</span>
        </div>
      </div>

      {/* Bus Selection Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
          {['i2c', 'spi', 'uart', 'adc'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBus(b)}
              className={`px-3 py-1 rounded-lg uppercase transition-all ${
                selectedBus === b ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bus {b.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Bus Pinout Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block text-[11px]">Asignación de Pines Recomendada:</span>
            <ul className="space-y-1.5 text-slate-200">
              {currentBus.pins.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 font-sans pt-1 leading-relaxed">
              {currentBus.notes}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-amber-200">
            <span className="text-amber-400 font-bold flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5" /> Consideraciones y Advertencias Críticas:
            </span>
            <ul className="space-y-1 text-[11px] font-sans">
              {currentMcu.warnings.map((w, idx) => (
                <li key={idx} className="leading-relaxed">
                  • {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TAB 4: TELEMETRY BENCH & VIRTUAL SERIAL CONSOLE
   ========================================================================= */
function TelemetryBench({ initialProject, allProjects = [], onSelectProject }) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProject?.projectId || (allProjects[0]?.projectId || '')
  );
  const [isRunning, setIsRunning] = useState(true);
  const [baudRate, setBaudRate] = useState(115200);
  const [logs, setLogs] = useState([]);
  const [packetCount, setPacketCount] = useState(0);
  const [commandInput, setCommandInput] = useState('');
  const logContainerRef = useRef(null);

  // Active project
  const activeProject = useMemo(() => {
    return allProjects.find(p => p.projectId === selectedProjectId) || allProjects[0] || null;
  }, [selectedProjectId, allProjects]);

  // Telemetry stream generator
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setPacketCount(prev => prev + 1);
      const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
      
      let telemetryMsg = '';
      const projTitle = (activeProject?.title || '').toLowerCase();

      if (projTitle.includes('satellite') || projTitle.includes('space') || projTitle.includes('orbit')) {
        telemetryMsg = `[${timestamp}] TELEMETRY_PKT #Batt: 8.24V | Temp: -12.4C | Roll: +0.14deg | Pitch: -0.82deg | RSSI: -84dBm | CRC: 0x5A [PASS]`;
      } else if (projTitle.includes('lidar') || projTitle.includes('drone') || projTitle.includes('flight')) {
        telemetryMsg = `[${timestamp}] SCAN_FRAME #Angle: ${(Math.random() * 360).toFixed(1)}deg | Dist: ${(800 + Math.random() * 200).toFixed(0)}mm | Quality: 98% | ESC_RPM: 14200`;
      } else if (projTitle.includes('night-vision') || projTitle.includes('thermal') || projTitle.includes('light')) {
        telemetryMsg = `[${timestamp}] OPTICAL_FRAME #IR_Lux: ${(0.04 + Math.random() * 0.02).toFixed(4)} | Sensor_Temp: 24.6C | AGC_Gain: +18dB | Shutter: 1/50s`;
      } else {
        telemetryMsg = `[${timestamp}] STATUS_OK #MCU_Load: 14% | Heap_Free: 284KB | Bus_I2C: ACK | Sensor_Raw: ${(1024 + Math.random() * 128).toFixed(0)} | VCC: 3.29V`;
      }

      setLogs(prev => [...prev.slice(-35), telemetryMsg]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, activeProject]);

  // Scroll to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSendCommand = (cmd) => {
    const toSend = cmd || commandInput;
    if (!toSend.trim()) return;
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs(prev => [
      ...prev,
      `> ${toSend}`,
      `[${timestamp}] RESPONSE: OK for command '${toSend}' (Execution Time: 1.4ms)`
    ]);
    setCommandInput('');
  };

  const downloadLogCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Timestamp,LogEntry\n' + logs.map(l => `"${l.replace(/"/g, '""')}"`).join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `telemetry_${activeProject?.slug || 'bench'}.csv`;
    a.click();
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-cyan-400" />
            Banco de Telemetría & Consola Serial Virtual (UART/USB)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulación de adquisición en tiempo real y transmisión de tramas de sensores para los 183 proyectos del catálogo.
          </p>
        </div>

        {/* Project Selector for Telemetry */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-slate-400">Proyecto:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded-xl px-3 py-1.5 focus:outline-none max-w-[260px] truncate"
          >
            {allProjects.slice(0, 40).map((p) => (
              <option key={p.projectId} value={p.projectId}>
                #{p.projectNumber} {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Tasa de Baudios:</span>
          <span className="text-cyan-300 font-bold">{baudRate} 8N1</span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Paquetes Recibidos:</span>
          <span className="text-emerald-400 font-bold">{packetCount} pkts</span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Estado del Stream:</span>
          <span className={`font-bold flex items-center gap-1.5 ${isRunning ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isRunning ? 'EN VIVO (ONLINE)' : 'PAUSADO'}
          </span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              isRunning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
          <button
            onClick={downloadLogCSV}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Descargar Log CSV"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="rounded-2xl border border-slate-800 bg-black overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-slate-300 font-semibold">ttyUSB0 · {activeProject?.title}</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title="Limpiar Consola"
          >
            Clear Screen
          </button>
        </div>

        {/* Logs Output */}
        <div 
          ref={logContainerRef}
          className="p-4 h-64 overflow-y-auto space-y-1.5 scrollbar-thin text-emerald-400 bg-black/95"
        >
          {logs.map((line, idx) => (
            <div 
              key={idx} 
              className={line.startsWith('>') ? 'text-cyan-300 font-bold' : line.includes('RESPONSE') ? 'text-amber-300' : 'text-emerald-400'}
            >
              {line}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-slate-600 italic py-8 text-center">
              Esperando paquetes de telemetría o comandos en ttyUSB0...
            </div>
          )}
        </div>

        {/* Quick Command Buttons & Input */}
        <div className="p-3 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {['STATUS', 'CALIBRATE', 'PING', 'RESET'].map(cmd => (
              <button
                key={cmd}
                onClick={() => handleSendCommand(cmd)}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-slate-800 hover:border-cyan-700 text-[10px] transition-all"
              >
                {cmd}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendCommand(commandInput); }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enviar comando UART (ej. AT+STATUS, READ_ALL)..."
              className="flex-1 bg-black border border-slate-800 rounded-lg px-3 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
