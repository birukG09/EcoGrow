import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Wifi, Thermometer, Database, Battery } from "lucide-react";
import { api } from "@/lib/api";
import { SystemStatus as SystemStatusType } from "@/types/greenhouse";

export default function SystemStatus() {
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['/api/system/status'],
    queryFn: api.getSystemStatus,
    refetchInterval: 60000, // Refresh every minute
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'healthy':
      case 'normal':
      case 'ready':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
      case 'offline':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const status = systemStatus as SystemStatusType;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-1" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-system-status">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Network Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wifi className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Network</p>
                <p className="text-xs text-muted-foreground">{status?.network.description}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(status?.network.status || '')} data-testid="badge-network-status">
              {status?.network.status}
            </Badge>
          </div>

          {/* Sensors Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <Thermometer className="text-chart-1" />
              </div>
              <div>
                <p className="font-medium text-foreground">Sensors</p>
                <p className="text-xs text-muted-foreground">{status?.sensors.description}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(status?.sensors.status || '')} data-testid="badge-sensors-status">
              {status?.sensors.status}
            </Badge>
          </div>

          {/* Data Storage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Database className="text-chart-3" />
              </div>
              <div>
                <p className="font-medium text-foreground">Storage</p>
                <p className="text-xs text-muted-foreground">{status?.storage.description}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(status?.storage.status || '')} data-testid="badge-storage-status">
              {status?.storage.status}
            </Badge>
          </div>

          {/* Battery Backup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Battery className="text-chart-2" />
              </div>
              <div>
                <p className="font-medium text-foreground">Backup Power</p>
                <p className="text-xs text-muted-foreground">{status?.backup.description}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(status?.backup.status || '')} data-testid="badge-backup-status">
              {status?.backup.status}
            </Badge>
          </div>

          {/* System Uptime */}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">System Uptime</span>
              <span className="font-medium text-foreground" data-testid="text-system-uptime">
                {status?.uptime}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Last Restart</span>
              <span className="font-medium text-foreground" data-testid="text-last-restart">
                {status?.lastRestart ? new Date(status.lastRestart).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
