import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { api } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import SensorCard from "@/components/sensor-card";
import ControlPanel from "@/components/control-panel";
import HistoricalChart from "@/components/historical-chart";
import PlantHealth from "@/components/plant-health";
import ConfigurationSettings from "@/components/configuration-settings";
import ActivityLog from "@/components/activity-log";
import SystemStatus from "@/components/system-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { SensorReading, Alert as AlertType } from "@/types/greenhouse";

export default function Dashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const { isConnected, lastMessage } = useWebSocket();

  // Queries
  const { data: latestReading } = useQuery({
    queryKey: ['/api/sensors/latest'],
    queryFn: api.getLatestSensorReading,
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => api.getAlerts(false),
    refetchInterval: 60000,
  });

  const { data: configuration } = useQuery({
    queryKey: ['/api/configuration'],
    queryFn: api.getConfiguration,
  });

  // Handle real-time updates
  if (lastMessage?.type === 'sensorReading') {
    // Force re-fetch of sensor data
  }

  const currentReading = latestReading as SensorReading | undefined;
  const activeAlerts = (alerts as AlertType[] || []).filter(alert => 
    !alert.acknowledged && !dismissedAlerts.has(alert.id)
  );

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...Array.from(prev), alertId]));
  };

  const getSensorStatus = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return { status: "Normal", color: "bg-primary" };
    if (value < min * 0.9 || value > max * 1.1) return { status: "Critical", color: "bg-destructive" };
    return { status: "Warning", color: "bg-accent" };
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isConnected={isConnected}
          alertCount={activeAlerts.length}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6 space-y-6">
          {/* Alert Banners */}
          {activeAlerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} className="bg-accent/10 border-accent/20">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-accent-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  data-testid={`button-dismiss-alert-${alert.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          ))}

          {/* Sensor Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorCard
              title="Temperature"
              value={currentReading ? `${currentReading.temperature}°C` : "—"}
              optimal={configuration ? `${configuration.tempMin}-${configuration.tempMax}°C` : "20-25°C"}
              icon="thermometer-half"
              color="chart-1"
              status={currentReading && configuration ? 
                getSensorStatus(
                  parseFloat(currentReading.temperature), 
                  parseFloat(configuration.tempMin), 
                  parseFloat(configuration.tempMax)
                ).status : "Unknown"
              }
              statusColor={currentReading && configuration ? 
                getSensorStatus(
                  parseFloat(currentReading.temperature), 
                  parseFloat(configuration.tempMin), 
                  parseFloat(configuration.tempMax)
                ).color : "bg-muted"
              }
            />
            
            <SensorCard
              title="Humidity"
              value={currentReading ? `${currentReading.humidity}%` : "—"}
              optimal={configuration ? `${configuration.humidityMin}-${configuration.humidityMax}%` : "60-70%"}
              icon="tint"
              color="chart-2"
              status={currentReading && configuration ? 
                getSensorStatus(
                  parseFloat(currentReading.humidity), 
                  parseFloat(configuration.humidityMin), 
                  parseFloat(configuration.humidityMax)
                ).status : "Unknown"
              }
              statusColor={currentReading && configuration ? 
                getSensorStatus(
                  parseFloat(currentReading.humidity), 
                  parseFloat(configuration.humidityMin), 
                  parseFloat(configuration.humidityMax)
                ).color : "bg-muted"
              }
            />
            
            <SensorCard
              title="Soil Moisture"
              value={currentReading ? `${currentReading.soilMoisture}%` : "—"}
              optimal="40-60%"
              icon="seedling"
              color="chart-3"
              status={currentReading ? 
                getSensorStatus(parseFloat(currentReading.soilMoisture), 40, 60).status : "Unknown"
              }
              statusColor={currentReading ? 
                getSensorStatus(parseFloat(currentReading.soilMoisture), 40, 60).color : "bg-muted"
              }
            />
            
            <SensorCard
              title="Light Level"
              value={currentReading ? `${currentReading.lightLevel.toLocaleString()} lux` : "—"}
              optimal="3,000 lux"
              icon="sun"
              color="accent"
              status={currentReading ? 
                (currentReading.lightLevel >= 3000 ? "Normal" : "Below Target") : "Unknown"
              }
              statusColor={currentReading ? 
                (currentReading.lightLevel >= 3000 ? "bg-primary" : "bg-accent") : "bg-muted"
              }
            />
          </div>

          {/* Control Panel and Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ControlPanel />
            <div className="lg:col-span-2">
              <HistoricalChart />
            </div>
          </div>

          {/* Plant Health and Settings Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlantHealth />
            <ConfigurationSettings />
          </div>

          {/* Recent Activities and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLog />
            <SystemStatus />
          </div>
        </main>
      </div>
    </div>
  );
}
