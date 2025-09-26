import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Activity } from "@/types/greenhouse";
import { formatDistanceToNow } from "date-fns";

export default function ActivityLog() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: () => api.getActivities(10),
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-primary';
      case 'warning': return 'bg-accent';
      case 'error': return 'bg-destructive';
      default: return 'bg-chart-3';
    }
  };

  return (
    <Card data-testid="card-activity-log">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3 py-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(activities as Activity[]).map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 py-2"
                data-testid={`activity-${activity.id}`}
              >
                <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} mt-2`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
