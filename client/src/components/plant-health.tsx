import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PlantAnalysis } from "@/types/greenhouse";

export default function PlantHealth() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plantName, setPlantName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: analyses, isLoading } = useQuery({
    queryKey: ['/api/plants/analyses'],
    queryFn: () => api.getPlantAnalyses(5),
  });

  const analyzeMutation = useMutation({
    mutationFn: (formData: FormData) => api.analyzePlant(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plants/analyses'] });
      setSelectedFile(null);
      setPlantName("");
      toast({
        title: "Analysis Complete",
        description: "Plant health analysis has been completed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze plant image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile || !plantName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an image and enter a plant name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('plantName', plantName);
    
    analyzeMutation.mutate(formData);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'default';
      case 'attention': return 'secondary';
      case 'warning': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card data-testid="card-plant-health">
      <CardHeader>
        <CardTitle>Plant Health Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Image Upload Area */}
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            data-testid="area-image-upload"
          >
            <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {selectedFile ? selectedFile.name : "Upload plant image for AI analysis"}
            </p>
            <Button size="sm" disabled={analyzeMutation.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-upload"
            />
          </div>

          {selectedFile && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter plant name (e.g., Tomato Plant #1)"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-plant-name"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                className="w-full"
                data-testid="button-analyze-plant"
              >
                {analyzeMutation.isPending ? "Analyzing..." : "Analyze Plant Health"}
              </Button>
            </div>
          )}
        </div>

        {/* Recent Analysis */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-foreground">Recent Analysis</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : analyses && analyses.length > 0 ? (
            <div className="space-y-3">
              {(analyses as PlantAnalysis[]).map((analysis) => (
                <div 
                  key={analysis.id} 
                  className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                  data-testid={`analysis-result-${analysis.id}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{analysis.plantName}</span>
                      <Badge variant={getStatusVariant(analysis.healthStatus)}>
                        {analysis.healthStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analysis.analysis}
                    </p>
                    {analysis.confidence && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {analysis.confidence}%
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No plant analyses available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
