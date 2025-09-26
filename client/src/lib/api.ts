import { apiRequest } from "./queryClient";

export const api = {
  // Sensor endpoints
  getLatestSensorReading: () => fetch('/api/sensors/latest').then(res => res.json()),
  getSensorHistory: (hours = 24) => fetch(`/api/sensors/history?hours=${hours}`).then(res => res.json()),
  
  // Control endpoints
  getControlSettings: () => fetch('/api/controls').then(res => res.json()),
  updateControlSettings: (settings: any) => apiRequest('PATCH', '/api/controls', settings).then(res => res.json()),
  
  // Plant health endpoints
  getPlantAnalyses: (limit = 10) => fetch(`/api/plants/analyses?limit=${limit}`).then(res => res.json()),
  analyzePlant: (formData: FormData) => apiRequest('POST', '/api/plants/analyze', formData).then(res => res.json()),
  
  // Configuration endpoints
  getConfiguration: () => fetch('/api/configuration').then(res => res.json()),
  updateConfiguration: (config: any) => apiRequest('PATCH', '/api/configuration', config).then(res => res.json()),
  
  // Activity endpoints
  getActivities: (limit = 20) => fetch(`/api/activities?limit=${limit}`).then(res => res.json()),
  
  // Alert endpoints
  getAlerts: (acknowledged?: boolean) => {
    const query = acknowledged !== undefined ? `?acknowledged=${acknowledged}` : '';
    return fetch(`/api/alerts${query}`).then(res => res.json());
  },
  acknowledgeAlert: (id: string) => apiRequest('PATCH', `/api/alerts/${id}/acknowledge`).then(res => res.json()),
  
  // System endpoints
  getSystemStatus: () => fetch('/api/system/status').then(res => res.json()),
};
