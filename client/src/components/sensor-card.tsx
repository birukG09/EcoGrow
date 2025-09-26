import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, Sprout, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string;
  optimal: string;
  icon: string;
  color: string;
  status: string;
  statusColor: string;
}

const iconMap = {
  "thermometer-half": Thermometer,
  "tint": Droplets,
  "seedling": Sprout,
  "sun": Sun,
};

export default function SensorCard({ 
  title, 
  value, 
  optimal, 
  icon, 
  color, 
  status, 
  statusColor 
}: SensorCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Thermometer;
  
  return (
    <Card className="sensor-card" data-testid={`card-sensor-${title.toLowerCase().replace(' ', '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(' ', '-')}-value`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground">Optimal: {optimal}</p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            `bg-${color}/10`
          )}>
            <IconComponent className={cn("text-xl", `text-${color}`)} />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <div className={cn("w-2 h-2 rounded-full", statusColor)} />
          <span className="text-xs text-muted-foreground" data-testid={`text-${title.toLowerCase().replace(' ', '-')}-status`}>
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
