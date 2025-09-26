# EcoGardenHub – Smart IoT Greenhouse System

## Overview
EcoGardenHub is a fully automated, modular, IoT-powered greenhouse system designed to optimize plant growth using sensors, actuators, AI, and cloud integration. The system monitors temperature, humidity, soil moisture, light intensity, and CO2 levels, and automatically controls irrigation, ventilation, and lighting. With web and mobile dashboards, you can monitor and control your greenhouse from anywhere.

This project is ideal for developers, hobbyists, and students interested in **embedded systems, IoT, AI, and full-stack hardware/software integration**.

---

## Features
- **Real-time monitoring**: Temperature, humidity, soil moisture, light intensity, CO2, and plant health.  
- **Automated control**: Irrigation, lighting, ventilation, and environmental adjustments.  
- **AI plant health detection**: Camera-based detection of plant stress and diseases.  
- **Web dashboard**: Real-time monitoring, control panel, and data visualization.  
- **Mobile app (Android)**: Remote monitoring and alerts.  
- **Cloud integration**: MQTT and HTTP for remote data logging and control.  
- **Modular architecture**: Supports adding new sensors, actuators, or AI modules easily.  
- **Multi-language development**: C, C++, Assembly, Python, Java/Kotlin, HTML, CSS, JavaScript.  

---

## Architecture

### Hardware
- **Microcontroller**: ESP32  
- **Sensors**: DHT22 (Temp/Humidity), Capacitive Soil Moisture, BH1750 Light, MH-Z19 CO2  
- **Actuators**: Water Pump, Relay Lights, Fan, Servo Windows, LED Indicators  
- **Camera**: ESP32-CAM for plant health monitoring  

### Software Modules
| Module | Languages | Description |
|--------|-----------|-------------|
| Sensor Module | C, C++ | Reads real-time environmental data |
| Actuator Module | C, C++, Assembly | Controls devices based on logic and thresholds |
| Control Module | C++, Python | Decision-making logic for automation |
| Data Logging | Python, C++ | Stores sensor data locally and in cloud |
| AI Plant Health | Python | Processes camera images and detects plant stress |
| Web Dashboard | HTML, CSS, JavaScript | Real-time monitoring and control |
| Mobile App | Java, Kotlin | Remote monitoring on Android devices |
| Cloud Communication | C, Python | Handles MQTT/HTTP communication |
| Testing & Simulation | C++, Python | Simulate sensors and actuators for testing |
| Config & Docs | YAML, JSON, Markdown | Project configuration and documentation |

### Communication
- **Protocols**: MQTT, HTTP, WebSocket  
- **Cloud**: AWS IoT / Mosquitto Broker  
- **Local Network**: Wi-Fi for direct connection to dashboard/mobile app  

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/birukG09/EcoGrow.git
cd EcoGrow
2. Firmware / Embedded
Open the firmware/ folder in your IDE (VS Code, PlatformIO, Arduino IDE).

Compile and upload to ESP32 microcontroller.

3. Python Modules
bash
Copy code
cd data_logging_ai
pip install -r requirements.txt
python full_app.py
4. Web Dashboard
Open web_dashboard/index.html in your browser.

For dynamic updates, host via local server:

bash
Copy code
cd web_dashboard
python -m http.server 8000
5. Mobile App
Open mobile_app/ in Android Studio.

Build and run on Android device/emulator.

Usage
Connect sensors and actuators to ESP32 following the wiring diagram.

Power the microcontroller and start the firmware.

Access the web dashboard or mobile app to monitor real-time data.

The system will automatically control irrigation, lighting, and ventilation based on sensor readings.

Use the AI module to detect plant stress and generate alerts.

Contributing
We welcome contributions from developers interested in IoT, embedded systems, AI, and smart agriculture. To contribute:

Fork the repository.

Create a new branch: git checkout -b feature/your-feature-name.

Commit your changes: git commit -m "Add your feature".

Push to branch: git push origin feature/your-feature-name.

Open a Pull Request on GitHub.
