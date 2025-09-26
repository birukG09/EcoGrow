import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Lightbulb, Fan, Settings } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ControlSettings } from "@/types/greenhouse";

export default function ControlPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: controlSettings, isLoading } = useQuery({
    queryKey: ['/api/controls'],
    queryFn: api.getControlSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: api.updateControlSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/controls'] });
      toast({
        title: "Settings Updated",
        description: "Control settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update control settings.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (setting: keyof ControlSettings, value: boolean) => {
    updateSettingsMutation.mutate({ [setting]: value });
  };

  if (isLoading || !controlSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-control-panel">
      <CardHeader>
        <CardTitle>System Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Irrigation Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Droplets className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Irrigation</p>
                <p className="text-xs text-muted-foreground">Auto mode</p>
              </div>
            </div>
            <Switch
              checked={controlSettings.irrigation}
              onCheckedChange={(checked) => handleToggle('irrigation', checked)}
              disabled={updateSettingsMutation.isPending}
              data-testid="switch-irrigation"
            />
          </div>

          {/* Lighting Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Lightbulb className="text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Grow Lights</p>
                <p className="text-xs text-muted-foreground">
                  {controlSettings.lightingIntensity}% intensity
                </p>
              </div>
            </div>
            <Switch
              checked={controlSettings.lighting}
              onCheckedChange={(checked) => handleToggle('lighting', checked)}
              disabled={updateSettingsMutation.isPending}
              data-testid="switch-lighting"
            />
          </div>

          {/* Ventilation Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Fan className="text-chart-3" />
              </div>
              <div>
                <p className="font-medium text-foreground">Ventilation</p>
                <p className="text-xs text-muted-foreground">
                  {controlSettings.ventilationSpeed} speed
                </p>
              </div>
            </div>
            <Switch
              checked={controlSettings.ventilation}
              onCheckedChange={(checked) => handleToggle('ventilation', checked)}
              disabled={updateSettingsMutation.isPending}
              data-testid="switch-ventilation"
            />
          </div>

          {/* Manual Override */}
          <div className="pt-4 border-t border-border">
            <Button 
              className="w-full" 
              variant="secondary"
              data-testid="button-manual-override"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manual Override
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
