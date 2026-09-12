"""
Technical Identity Normalization and Extraction Module (Prompt 02, 02.1 & 02.2).
Normalizes component nomenclature safely without destroying technical nuances
and strictly requires evidence for firmware, architecture, and power claims.
"""

import re
from typing import List, Optional, Dict, Any
from scripts.project_first.models import TechnicalIdentity


# Controller normalization mapping
MCU_PATTERNS = [
    (r"\b(esp32[-_ ]?s3|esp32s3)\b", "ESP32-S3", "ESP32"),
    (r"\b(esp32[-_ ]?c3|esp32c3)\b", "ESP32-C3", "ESP32"),
    (r"\b(esp32[-_ ]?c6|esp32c6)\b", "ESP32-C6", "ESP32"),
    (r"\b(esp32[-_ ]?cam)\b", "ESP32-CAM", "ESP32"),
    (r"\b(espressif\s+)?(esp-?32)\b", "ESP32", "ESP32"),
    (r"\b(esp-?8266)\b", "ESP8266", "ESP8266"),
    (r"\b(raspberry\s+pi\s+)?(rp-?2040|pi\s+pico)\b", "RP2040", "ARM Cortex-M0+"),
    (r"\b(rp-?2350)\b", "RP2350", "ARM Cortex-M33 / RISC-V"),
    (r"\b(stm32[-_ ]?f4\d{2}|stm32f4)\b", "STM32F4", "ARM Cortex-M4"),
    (r"\b(stm32[-_ ]?f1\d{2}|stm32f1|blue\s+pill)\b", "STM32F1", "ARM Cortex-M3"),
    (r"\b(stm32[-_ ]?h7\d{2}|stm32h7)\b", "STM32H7", "ARM Cortex-M7"),
    (r"\b(stm32[-_ ]?g4\d{2}|stm32g4)\b", "STM32G4", "ARM Cortex-M4"),
    (r"\b(atmega[-_ ]?328p?|arduino\s+uno|arduino\s+nano)\b", "ATmega328P", "AVR 8-bit"),
    (r"\b(atmega[-_ ]?2560|arduino\s+mega)\b", "ATmega2560", "AVR 8-bit"),
    (r"\b(attiny[-_ ]?85)\b", "ATtiny85", "AVR 8-bit"),
    (r"\b(nrf52840|nrf52)\b", "nRF52840", "ARM Cortex-M4"),
    (r"\b(samd21)\b", "SAMD21", "ARM Cortex-M0+"),
    (r"\b(teensy\s+4\.?\d?|imxrt1062)\b", "Teensy 4.x (i.MX RT1062)", "ARM Cortex-M7"),
]

SENSOR_PATTERNS = [
    (r"\b(bme[-_ ]?280)\b", "BME280 (Temp/Hum/Press)"),
    (r"\b(bmp[-_ ]?280)\b", "BMP280 (Temp/Press)"),
    (r"\b(mpu[-_ ]?6050)\b", "MPU6050 (6-DOF IMU)"),
    (r"\b(bno[-_ ]?055|bno[-_ ]?085)\b", "BNO085 (9-DOF Absolute IMU)"),
    (r"\b(vl53l1x|vl53l0x)\b", "VL53L1X (Time-of-Flight Laser)"),
    (r"\b(ina219|ina226)\b", "INA219 (High-Side Current/Power)"),
    (r"\b(max30102|max30100)\b", "MAX30102 (Pulse Oximeter/HR)"),
    (r"\b(ads1115)\b", "ADS1115 (16-bit ADC)"),
    (r"\b(ad8232)\b", "AD8232 (Single-Lead ECG Front-End)"),
    (r"\b(as5600)\b", "AS5600 (Magnetic Rotary Angle Sensor)"),
    (r"\b(mlx90614)\b", "MLX90614 (Contactless IR Temp)"),
    (r"\b(amg8833)\b", "AMG8833 (8x8 IR Thermal Camera Grid)"),
    (r"\b(rcwl[-_ ]?0516)\b", "RCWL-0516 (Microwave Radar Doppler)"),
    (r"\b(hc[-_ ]?sr04)\b", "HC-SR04 (Ultrasonic Ranging)"),
    (r"\b(neo[-_ ]?[6789]m|gps)\b", "u-blox GPS/GNSS Receiver"),
]

ACTUATOR_PATTERNS = [
    (r"\b(bldc|brushless)\b", "Motor BLDC"),
    (r"\b(stepper|paso a paso|nema)\b", "Motor Paso a Paso (Stepper)"),
    (r"\b(servo|sg90|mg996r)\b", "Servomotor PWM"),
    (r"\b(solenoid|solenoide)\b", "Solenoide Electromagnético"),
    (r"\b(relay|relé|rele)\b", "Relé de Potencia"),
    (r"\b(buzzer|zumbador)\b", "Buzzer Piezoeléctrico"),
    (r"\b(oled|ssd1306|sh1106)\b", "Pantalla OLED"),
    (r"\b(tft|ili9341|st7789)\b", "Pantalla TFT LCD"),
    (r"\b(e[-_ ]?paper|e[-_ ]?ink)\b", "Pantalla E-Paper"),
    (r"\b(vcsel|laser|diodo láser)\b", "Iluminador VCSEL / Láser"),
]

COMM_PATTERNS = [
    (r"\b(lora|sx1278|sx1262)\b", "LoRa"),
    (r"\b(ble|bluetooth\s+low\s+energy)\b", "BLE (Bluetooth Low Energy)"),
    (r"\b(bluetooth)\b", "Bluetooth"),
    (r"\b(wi-?fi|802\.11)\b", "Wi-Fi"),
    (r"\b(can\s+bus|mcp2515|twai)\b", "CAN Bus"),
    (r"\b(rs-?485|max485)\b", "RS-485"),
    (r"\b(i2c|iic)\b", "I2C"),
    (r"\b(spi)\b", "SPI"),
    (r"\b(uart|serial)\b", "UART"),
    (r"\b(usb)\b", "USB"),
    (r"\b(ethernet|w5500)\b", "Ethernet"),
]


def extract_technical_identity(text: str, components: List[str] = None) -> TechnicalIdentity:
    """Analyze project text and components to extract a normalized TechnicalIdentity strictly grounded in evidence."""
    combined_text = (text + " " + " ".join(components or [])).lower()
    
    # 1. Controller
    mcu = None
    mcu_family = None
    for pattern, normalized_mcu, family in MCU_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            mcu = normalized_mcu
            mcu_family = family
            break
            
    # 2. Sensors
    sensors = []
    for pattern, norm_sensor in SENSOR_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            sensors.append(norm_sensor)
            
    # 3. Actuators
    actuators = []
    for pattern, norm_actuator in ACTUATOR_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            actuators.append(norm_actuator)
            
    # 4. Communications
    comms = []
    for pattern, norm_comm in COMM_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            comms.append(norm_comm)
            
    # 5. Operating Voltage / Power
    power = None
    if re.search(r"\b(battery|batería|li-?ion|lipo|18650)\b", combined_text):
        power = "Alimentación por Batería Li-Ion / LiPo"
    elif re.search(r"\b(5v)\b", combined_text):
        power = "5V DC Regulado"
    elif re.search(r"\b(3\.3v)\b", combined_text):
        power = "3.3V DC Regulado"
        
    # 6. Major Components
    major = []
    for comp in (components or []):
        cleaned = comp.strip()
        if cleaned and len(cleaned) < 50 and cleaned not in major:
            major.append(cleaned)
            
    # 7. Function
    func = None
    if any(k in combined_text for k in ["radar", "rf", "radio", "sdr", "antena", "sniff"]):
        func = "RF & Radiofrecuencia / Procesamiento de Señales"
    elif any(k in combined_text for k in ["drone", "dron", "vuelo", "attitude", "motor", "foc", "stepper"]):
        func = "Control de Movimiento, Robótica y Actuadores"
    elif any(k in combined_text for k in ["satélite", "satellite", "space", "telemetría", "órbita"]):
        func = "Sistemas Aeroespaciales y Cargas Útiles"
    elif any(k in combined_text for k in ["ecg", "cardiaco", "body", "wearable", "biomed"]):
        func = "Bio-Instrumentación y Wearables Médicos"
    elif any(k in combined_text for k in ["sensor", "monitor", "iot", "clima", "estación"]):
        func = "Redes de Sensores Distribuidos / IoT"
    elif any(k in combined_text for k in ["visión", "cámara", "image", "night-vision", "thermal"]):
        func = "Sistemas de Visión Artificial y Espectroscopía"
        
    # 8. Firmware (Only if explicitly evidenced)
    firmware = None
    if re.search(r"\b(micropython)\b", combined_text):
        firmware = "MicroPython"
    elif re.search(r"\b(freertos)\b", combined_text):
        firmware = "FreeRTOS / C"
    elif re.search(r"\b(verilog|vhdl|fpga)\b", combined_text):
        firmware = "Verilog / VHDL (Hardware Description)"
    elif re.search(r"\b(arduino|esp-idf|bare-metal|c\+\+|firmware)\b", combined_text) and mcu:
        firmware = f"Firmware C/C++ ({mcu})"
        
    # 9. Architecture (Only if explicitly evidenced)
    arch = None
    if re.search(r"\b(mesh)\b", combined_text):
        arch = "Red Mesh Distribuida"
    elif re.search(r"\b(closed-loop|lazo cerrado)\b", combined_text):
        arch = "Control en Lazo Cerrado (Closed-Loop)"
    elif re.search(r"\b(edge[- ]ai|tinyml)\b", combined_text):
        arch = "Edge AI / TinyML"
    elif re.search(r"\b(differential drive)\b", combined_text):
        arch = "Tracción Diferencial (Differential Drive)"
    elif re.search(r"\b(client-server|websocket)\b", combined_text):
        arch = "Cliente-Servidor en Tiempo Real"
        
    return TechnicalIdentity(
        controller=mcu,
        controllerFamily=mcu_family,
        sensors=sorted(list(set(sensors))),
        actuators=sorted(list(set(actuators))),
        communications=sorted(list(set(comms))),
        power=power,
        firmware=firmware,
        majorComponents=major[:8],
        architecture=arch,
        function=func,
        constraints=[]
    )
