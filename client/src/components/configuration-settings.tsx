import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/greenhouse";

export default function ConfigurationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: configuration, isLoading } = useQuery({
    queryKey: ['/api/configuration'],
    queryFn: api.getConfiguration,
  });

  const [settings, setSettings] = useState<Partial<Configuration>>({});

  useEffect(() => {
    if (configuration) {
      setSettings(configuration);
    }
  }, [configuration]);

  const updateConfigMutation = useMutation({
    mutationFn: api.updateConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configuration'] });
      toast({
        title: "Settings Saved",
        description: "Configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save configuration settings.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateConfigMutation.mutate(settings);
  };

  const updateSetting = (key: keyof Configuration, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-configuration-settings">
      <CardHeader>
        <CardTitle>Quick Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plant Type Selection */}
        <div>
          <Label htmlFor="plant-type" className="text-sm font-medium">Plant Type</Label>
          <Select 
            value={settings.plantType || 'tomatoes'} 
            onValueChange={(value) => updateSetting('plantType', value)}
          >
            <SelectTrigger className="mt-1" data-testid="select-plant-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
              <SelectItem value="lettuce">Lettuce</SelectItem>
              <SelectItem value="peppers">Peppers</SelectItem>
              <SelectItem value="herbs">Herbs</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature Range */}
        <div>
          <Label className="text-sm font-medium">Temperature Range (°C)</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              type="number"
              min="10"
              max="40"
              value={settings.tempMin || ''}
              onChange={(e) => updateSetting('tempMin', e.target.value)}
              placeholder="Min"
              data-testid="input-temp-min"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              min="10"
              max="40"
              value={settings.tempMax || ''}
              onChange={(e) => updateSetting('tempMax', e.target.value)}
              placeholder="Max"
              data-testid="input-temp-max"
            />
          </div>
        </div>

        {/* Humidity Range */}
        <div>
          <Label className="text-sm font-medium">Humidity Range (%)</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              type="number"
              min="30"
              max="90"
              value={settings.humidityMin || ''}
              onChange={(e) => updateSetting('humidityMin', e.target.value)}
              placeholder="Min"
              data-testid="input-humidity-min"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              min="30"
              max="90"
              value={settings.humidityMax || ''}
              onChange={(e) => updateSetting('humidityMax', e.target.value)}
              placeholder="Max"
              data-testid="input-humidity-max"
            />
          </div>
        </div>

        {/* Alert Settings */}
        <div>
          <Label className="text-sm font-medium">Alert Preferences</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email-alerts"
                checked={settings.emailAlerts || false}
                onCheckedChange={(checked) => updateSetting('emailAlerts', checked)}
                data-testid="checkbox-email-alerts"
              />
              <Label htmlFor="email-alerts" className="text-sm">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="push-alerts"
                checked={settings.pushAlerts || false}
                onCheckedChange={(checked) => updateSetting('pushAlerts', checked)}
                data-testid="checkbox-push-alerts"
              />
              <Label htmlFor="push-alerts" className="text-sm">Push notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms-alerts"
                checked={settings.smsAlerts || false}
                onCheckedChange={(checked) => updateSetting('smsAlerts', checked)}
                data-testid="checkbox-sms-alerts"
              />
              <Label htmlFor="sms-alerts" className="text-sm">SMS alerts</Label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          disabled={updateConfigMutation.isPending}
          className="w-full"
          data-testid="button-save-settings"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateConfigMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
