export interface SensorReading {
  id: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
  lightLevel: number;
  timestamp: string;
}

export interface ControlSettings {
  id: string;
  irrigation: boolean;
  lighting: boolean;
  ventilation: boolean;
  lightingIntensity: number;
  ventilationSpeed: string;
  updatedAt: string;
}

export interface PlantAnalysis {
  id: string;
  plantName: string;
  imagePath?: string;
  healthStatus: string;
  analysis?: string;
  confidence?: string;
  timestamp: string;
}

export interface Configuration {
  id: string;
  plantType: string;
  tempMin: string;
  tempMax: string;
  humidityMin: string;
  humidityMax: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  smsAlerts: boolean;
  updatedAt: string;
}

export interface Activity {
  id: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  acknowledged: boolean;
  timestamp: string;
}

export interface SystemStatus {
  network: {
    status: string;
    description: string;
  };
  sensors: {
    status: string;
    description: string;
  };
  storage: {
    status: string;
    description: string;
  };
  backup: {
    status: string;
    description: string;
  };
  uptime: string;
  lastRestart: string;
}

export interface WebSocketMessage {
  type: 'sensorReading' | 'controlSettings' | 'plantAnalysis' | 'configuration' | 'alert' | 'alertAcknowledged';
  data: any;
}
