import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, Settings } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  isConnected: boolean;
  alertCount: number;
}

export default function Header({ onMenuClick, isConnected, alertCount }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={onMenuClick}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Greenhouse Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Greenhouse Zone A • Last updated: 2 min ago
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-primary status-indicator' : 'bg-destructive'}`} />
            <span className="text-sm text-muted-foreground" data-testid="text-connection-status">
              {isConnected ? 'System Online' : 'System Offline'}
            </span>
          </div>
          
          {/* Alerts Badge */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            data-testid="button-alerts"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            {alertCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                data-testid="badge-alert-count"
              >
                {alertCount > 9 ? '9+' : alertCount}
              </Badge>
            )}
          </Button>
          
          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
