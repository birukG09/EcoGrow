import { 
  type SensorReading, type InsertSensorReading,
  type ControlSettings, type InsertControlSettings,
  type PlantAnalysis, type InsertPlantAnalysis,
  type Configuration, type InsertConfiguration,
  type Activity, type InsertActivity,
  type Alert, type InsertAlert,
  type User, type InsertUser 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Sensor methods
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getLatestSensorReading(): Promise<SensorReading | undefined>;
  getSensorReadings(limit?: number): Promise<SensorReading[]>;
  getSensorReadingsInRange(startDate: Date, endDate: Date): Promise<SensorReading[]>;

  // Control methods
  getControlSettings(): Promise<ControlSettings | undefined>;
  updateControlSettings(settings: Partial<InsertControlSettings>): Promise<ControlSettings>;

  // Plant analysis methods
  createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis>;
  getPlantAnalyses(limit?: number): Promise<PlantAnalysis[]>;

  // Configuration methods
  getConfiguration(): Promise<Configuration | undefined>;
  updateConfiguration(config: Partial<InsertConfiguration>): Promise<Configuration>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivities(limit?: number): Promise<Activity[]>;

  // Alert methods
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(acknowledged?: boolean): Promise<Alert[]>;
  acknowledgeAlert(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private sensorReadings: SensorReading[] = [];
  private controlSettings: ControlSettings | undefined = undefined;
  private plantAnalyses: PlantAnalysis[] = [];
  private configuration: Configuration | undefined = undefined;
  private activities: Activity[] = [];
  private alerts: Alert[] = [];

  constructor() {
    // Initialize with default settings
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Default control settings
    this.controlSettings = {
      id: randomUUID(),
      irrigation: true,
      lighting: true,
      ventilation: false,
      lightingIntensity: 85,
      ventilationSpeed: "medium",
      updatedAt: new Date(),
    };

    // Default configuration
    this.configuration = {
      id: randomUUID(),
      plantType: "tomatoes",
      tempMin: "20.0",
      tempMax: "25.0",
      humidityMin: "60.0",
      humidityMax: "70.0",
      emailAlerts: true,
      pushAlerts: true,
      smsAlerts: false,
      updatedAt: new Date(),
    };

    // Initial sensor reading
    this.sensorReadings.push({
      id: randomUUID(),
      temperature: "24.5",
      humidity: "68.0",
      soilMoisture: "45.0",
      lightLevel: 2850,
      timestamp: new Date(),
    });

    // Initial activities
    this.activities.push(
      {
        id: randomUUID(),
        message: "System initialized successfully",
        type: "success",
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: randomUUID(),
        message: "Irrigation system activated automatically",
        type: "info",
        timestamp: new Date(Date.now() - 120000),
      }
    );
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Sensor methods
  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const sensorReading: SensorReading = {
      id: randomUUID(),
      ...reading,
      timestamp: new Date(),
    };
    this.sensorReadings.push(sensorReading);
    
    // Keep only last 1000 readings
    if (this.sensorReadings.length > 1000) {
      this.sensorReadings = this.sensorReadings.slice(-1000);
    }
    
    return sensorReading;
  }

  async getLatestSensorReading(): Promise<SensorReading | undefined> {
    return this.sensorReadings[this.sensorReadings.length - 1];
  }

  async getSensorReadings(limit = 100): Promise<SensorReading[]> {
    return this.sensorReadings.slice(-limit).reverse();
  }

  async getSensorReadingsInRange(startDate: Date, endDate: Date): Promise<SensorReading[]> {
    return this.sensorReadings.filter(
      reading => reading.timestamp >= startDate && reading.timestamp <= endDate
    ).reverse();
  }

  // Control methods
  async getControlSettings(): Promise<ControlSettings | undefined> {
    return this.controlSettings;
  }

  async updateControlSettings(settings: Partial<InsertControlSettings>): Promise<ControlSettings> {
    if (!this.controlSettings) {
      this.controlSettings = {
        id: randomUUID(),
        irrigation: false,
        lighting: false,
        ventilation: false,
        lightingIntensity: 85,
        ventilationSpeed: "medium",
        updatedAt: new Date(),
      };
    }

    this.controlSettings = {
      ...this.controlSettings,
      ...settings,
      updatedAt: new Date(),
    };

    return this.controlSettings;
  }

  // Plant analysis methods
  async createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis> {
    const plantAnalysis: PlantAnalysis = {
      id: randomUUID(),
      ...analysis,
      imagePath: analysis.imagePath || null,
      analysis: analysis.analysis || null,
      confidence: analysis.confidence || null,
      timestamp: new Date(),
    };
    this.plantAnalyses.push(plantAnalysis);
    return plantAnalysis;
  }

  async getPlantAnalyses(limit = 10): Promise<PlantAnalysis[]> {
    return this.plantAnalyses.slice(-limit).reverse();
  }

  // Configuration methods
  async getConfiguration(): Promise<Configuration | undefined> {
    return this.configuration;
  }

  async updateConfiguration(config: Partial<InsertConfiguration>): Promise<Configuration> {
    if (!this.configuration) {
      this.configuration = {
        id: randomUUID(),
        plantType: "tomatoes",
        tempMin: "20.0",
        tempMax: "25.0",
        humidityMin: "60.0",
        humidityMax: "70.0",
        emailAlerts: true,
        pushAlerts: true,
        smsAlerts: false,
        updatedAt: new Date(),
      };
    }

    this.configuration = {
      ...this.configuration,
      ...config,
      updatedAt: new Date(),
    };

    return this.configuration;
  }

  // Activity methods
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const activityRecord: Activity = {
      id: randomUUID(),
      ...activity,
      timestamp: new Date(),
    };
    this.activities.push(activityRecord);
    
    // Keep only last 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(-100);
    }
    
    return activityRecord;
  }

  async getActivities(limit = 20): Promise<Activity[]> {
    return this.activities.slice(-limit).reverse();
  }

  // Alert methods
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const alertRecord: Alert = {
      id: randomUUID(),
      ...alert,
      acknowledged: false,
      timestamp: new Date(),
    };
    this.alerts.push(alertRecord);
    return alertRecord;
  }

  async getAlerts(acknowledged?: boolean): Promise<Alert[]> {
    if (acknowledged === undefined) {
      return this.alerts.slice().reverse();
    }
    return this.alerts.filter(alert => alert.acknowledged === acknowledged).reverse();
  }

  async acknowledgeAlert(id: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
    }
  }
}

export const storage = new MemStorage();
