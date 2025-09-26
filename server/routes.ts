import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertSensorReadingSchema, 
  insertControlSettingsSchema,
  insertPlantAnalysisSchema,
  insertConfigurationSchema,
  insertActivitySchema,
  insertAlertSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast to all connected clients
  function broadcast(message: any) {
    const data = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Simulate sensor data generation
  function generateSensorData() {
    const baseTemp = 24.5;
    const baseHumidity = 68;
    const baseSoilMoisture = 45;
    const baseLightLevel = 2850;
    
    return {
      temperature: (baseTemp + (Math.random() - 0.5) * 4).toFixed(1),
      humidity: (baseHumidity + (Math.random() - 0.5) * 10).toFixed(1),
      soilMoisture: (baseSoilMoisture + (Math.random() - 0.5) * 8).toFixed(1),
      lightLevel: Math.floor(baseLightLevel + (Math.random() - 0.5) * 500),
    };
  }

  // Generate sensor readings every 30 seconds
  setInterval(async () => {
    try {
      const sensorData = generateSensorData();
      const reading = await storage.createSensorReading(sensorData);
      
      // Check for alerts
      const config = await storage.getConfiguration();
      if (config) {
        const temp = parseFloat(reading.temperature);
        const humidity = parseFloat(reading.humidity);
        
        if (temp > parseFloat(config.tempMax)) {
          const alert = await storage.createAlert({
            title: "High Temperature Alert",
            message: `Temperature is ${temp}°C, above maximum of ${config.tempMax}°C`,
            type: "temperature",
            severity: "high"
          });
          broadcast({ type: 'alert', data: alert });
          
          await storage.createActivity({
            message: `High temperature alert triggered: ${temp}°C`,
            type: "warning"
          });
        }
        
        if (humidity > parseFloat(config.humidityMax)) {
          const alert = await storage.createAlert({
            title: "High Humidity Alert",
            message: `Humidity is ${humidity}%, above maximum of ${config.humidityMax}%`,
            type: "humidity",
            severity: "medium"
          });
          broadcast({ type: 'alert', data: alert });
        }
      }
      
      // Broadcast sensor reading
      broadcast({ type: 'sensorReading', data: reading });
    } catch (error) {
      console.error('Error generating sensor data:', error);
    }
  }, 30000);

  // Sensor routes
  app.get('/api/sensors/latest', async (req, res) => {
    try {
      const reading = await storage.getLatestSensorReading();
      res.json(reading);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get sensor reading' });
    }
  });

  app.get('/api/sensors/history', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const hours = parseInt(req.query.hours as string) || 24;
      
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000);
      
      const readings = await storage.getSensorReadingsInRange(startDate, endDate);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get sensor history' });
    }
  });

  app.post('/api/sensors', async (req, res) => {
    try {
      const data = insertSensorReadingSchema.parse(req.body);
      const reading = await storage.createSensorReading(data);
      broadcast({ type: 'sensorReading', data: reading });
      res.json(reading);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid sensor data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create sensor reading' });
      }
    }
  });

  // Control routes
  app.get('/api/controls', async (req, res) => {
    try {
      const settings = await storage.getControlSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get control settings' });
    }
  });

  app.patch('/api/controls', async (req, res) => {
    try {
      const data = insertControlSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateControlSettings(data);
      
      // Log activity
      const changes = Object.keys(data).join(', ');
      await storage.createActivity({
        message: `Control settings updated: ${changes}`,
        type: "info"
      });
      
      broadcast({ type: 'controlSettings', data: settings });
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid control data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update control settings' });
      }
    }
  });

  // Plant health routes
  app.get('/api/plants/analyses', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getPlantAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get plant analyses' });
    }
  });

  app.post('/api/plants/analyze', upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const { plantName } = req.body;
      if (!plantName) {
        return res.status(400).json({ message: 'Plant name is required' });
      }

      // Simulate AI analysis (in real implementation, this would call an AI service)
      const mockAnalyses = [
        { status: "Healthy", analysis: "No diseases detected. Growth rate: Normal", confidence: "95.5" },
        { status: "Attention", analysis: "Possible nutrient deficiency detected", confidence: "87.2" },
        { status: "Healthy", analysis: "Excellent leaf color and structure", confidence: "92.8" },
        { status: "Warning", analysis: "Early signs of pest damage visible", confidence: "89.1" }
      ];
      
      const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];

      const analysis = await storage.createPlantAnalysis({
        plantName,
        imagePath: req.file.path,
        healthStatus: randomAnalysis.status,
        analysis: randomAnalysis.analysis,
        confidence: randomAnalysis.confidence
      });

      await storage.createActivity({
        message: `Plant health analysis completed for ${plantName}`,
        type: "info"
      });

      broadcast({ type: 'plantAnalysis', data: analysis });
      res.json(analysis);
    } catch (error) {
      console.error('Plant analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze plant image' });
    }
  });

  // Configuration routes
  app.get('/api/configuration', async (req, res) => {
    try {
      const config = await storage.getConfiguration();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get configuration' });
    }
  });

  app.patch('/api/configuration', async (req, res) => {
    try {
      const data = insertConfigurationSchema.partial().parse(req.body);
      const config = await storage.updateConfiguration(data);
      
      await storage.createActivity({
        message: "System configuration updated",
        type: "info"
      });
      
      broadcast({ type: 'configuration', data: config });
      res.json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid configuration data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update configuration' });
      }
    }
  });

  // Activity routes
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get activities' });
    }
  });

  // Alert routes
  app.get('/api/alerts', async (req, res) => {
    try {
      const acknowledged = req.query.acknowledged === 'true' ? true : 
                          req.query.acknowledged === 'false' ? false : undefined;
      const alerts = await storage.getAlerts(acknowledged);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get alerts' });
    }
  });

  app.patch('/api/alerts/:id/acknowledge', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.acknowledgeAlert(id);
      
      await storage.createActivity({
        message: "Alert acknowledged",
        type: "info"
      });
      
      broadcast({ type: 'alertAcknowledged', data: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to acknowledge alert' });
    }
  });

  // System status route
  app.get('/api/system/status', async (req, res) => {
    try {
      const status = {
        network: { status: 'online', description: 'Connected to WiFi' },
        sensors: { status: 'healthy', description: '4/4 active' },
        storage: { status: 'normal', description: '75% used' },
        backup: { status: 'ready', description: '85% charged' },
        uptime: '7 days, 14 hours',
        lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get system status' });
    }
  });

  return httpServer;
}
