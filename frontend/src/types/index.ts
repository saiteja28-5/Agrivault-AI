export type HealthStatus = 'healthy' | 'warning' | 'critical';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type RecommendationPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type RecommendationStatus = 'pending' | 'in_progress' | 'completed';
export type InterventionStatus = 'in_progress' | 'completed' | 'scheduled';
export type DemoScenario = 'normal' | 'humidity' | 'pest' | 'critical';

export interface StorageZone {
  id: string;
  name: string;
  storage_unit_id: string;
  grain_type: string;
  temperature: number;
  humidity: number;
  moisture: number;
  co2: number;
  risk_score: number;
  health_status: HealthStatus;
  pest_detected: boolean;
  pest_type?: string | null;
  pest_probability?: number | null;
  recommended_action: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  facility_name: string;
  grain_type: string;
  capacity_mt: number;
  current_quantity_mt: number;
  zone_count: number;
  health_status: HealthStatus;
  risk_score: number;
  last_updated: string;
  zones: StorageZone[];
}

export interface PestDetection {
  id: string;
  insect_name: string;
  scientific_name: string;
  storage_unit_id: string;
  storage_unit_name: string;
  zone_id: string;
  probability: number;
  timestamp: string;
  severity: AlertSeverity;
  suggested_action: string;
  frequency_rank: number;
  acoustic_sensor_id: string;
}

export interface Alert {
  id: string;
  title: string;
  storage_unit_id: string;
  storage_unit_name: string;
  zone_id: string;
  category: string;
  severity: AlertSeverity;
  description: string;
  timestamp: string;
  suggested_response: string;
  status: AlertStatus;
}

export interface Recommendation {
  id: string;
  title: string;
  storage_unit_id: string;
  storage_unit_name: string;
  zone_id: string;
  reason: string;
  priority: RecommendationPriority;
  recommended_action: string;
  expected_benefit: string;
  status: RecommendationStatus;
  related_alert_id?: string | null;
}

export interface Intervention {
  id: string;
  storage_unit_id: string;
  storage_unit_name: string;
  zone_id: string;
  related_alert_id?: string | null;
  action_taken: string;
  assigned_operator: string;
  start_date: string;
  completion_date?: string | null;
  status: InterventionStatus;
  notes?: string | null;
}

export interface OverviewKPIs {
  total_storage_units: number;
  total_grain_stored_mt: number;
  healthy_zones: number;
  at_risk_zones: number;
  active_pest_detections: number;
  average_storage_risk: number;
}

