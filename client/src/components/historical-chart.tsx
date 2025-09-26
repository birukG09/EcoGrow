import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { SensorReading } from "@/types/greenhouse";
import { useState } from "react";

export default function HistoricalChart() {
  const [timeRange, setTimeRange] = useState("24");

  const { data: sensorHistory, isLoading } = useQuery({
    queryKey: ['/api/sensors/history', timeRange],
    queryFn: () => api.getSensorHistory(parseInt(timeRange)),
  });

  const formatData = (readings: SensorReading[]) => {
    return readings?.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: parseFloat(reading.temperature),
      humidity: parseFloat(reading.humidity),
      soilMoisture: parseFloat(reading.soilMoisture),
    })) || [];
  };

  const chartData = formatData(sensorHistory || []);

  return (
    <Card data-testid="card-historical-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historical Data</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">Last 24 hours</SelectItem>
              <SelectItem value="168">Last 7 days</SelectItem>
              <SelectItem value="720">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] bg-muted/50 rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[200px] chart-container rounded-lg flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No historical data available</p>
            </div>
          </div>
        ) : (
          <div className="h-[200px]" data-testid="chart-sensor-history">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Soil Moisture (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-chart-1"></div>
            <span>Temperature</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-chart-2"></div>
            <span>Humidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-chart-3"></div>
            <span>Soil Moisture</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { TrendingUp } from "lucide-react";
