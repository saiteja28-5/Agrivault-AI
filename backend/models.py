from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SensorReading(BaseModel):
    zone_id: str
    temperature: float = Field(..., description="Temperature in °C")
    humidity: float = Field(..., description="Relative humidity in %")
    moisture: float = Field(..., description="Grain moisture in %")
    co2: float = Field(..., description="CO2 concentration in ppm")
    timestamp: str

class StorageZone(BaseModel):
    id: str
    name: str
    storage_unit_id: str
    grain_type: str
    temperature: float
    humidity: float
    moisture: float
    co2: float
    risk_score: int
    health_status: str  # healthy, warning, critical
    pest_detected: bool
    pest_type: Optional[str] = None
    pest_probability: Optional[float] = None
    recommended_action: str

class StorageUnit(BaseModel):
    id: str
    name: str
    facility_name: str = "Deccan Agro Storage Complex"
    grain_type: str
    capacity_mt: float
    current_quantity_mt: float
    zone_count: int
    health_status: str  # healthy, warning, critical
    risk_score: int
    last_updated: str
    zones: List[StorageZone] = []

class PestDetection(BaseModel):
    id: str
    insect_name: str
    scientific_name: str
    storage_unit_id: str
    storage_unit_name: str
    zone_id: str
    probability: float
    timestamp: str
    severity: str  # low, medium, high, critical
    suggested_action: str
    frequency_rank: int
    acoustic_sensor_id: str

class RiskPrediction(BaseModel):
    storage_unit_id: str
    zone_id: str
    current_risk_score: int
    predicted_risk_24h: int
    risk_level: str  # Low, Moderate, High, Critical
    main_contributing_factor: str
    shap_contributions: Dict[str, float]
    action: str

class Alert(BaseModel):
    id: str
    title: str
    storage_unit_id: str
    storage_unit_name: str
    zone_id: str
    category: str  # Environmental, Acoustic/Pest, Moisture, Compound Risk
    severity: str  # Low, Medium, High, Critical
    description: str
    timestamp: str
    suggested_response: str
    status: str  # active, acknowledged, resolved

class Recommendation(BaseModel):
    id: str
    title: str
    storage_unit_id: str
    storage_unit_name: str
    zone_id: str
    reason: str
    priority: str  # Critical, High, Medium, Low
    recommended_action: str
    expected_benefit: str
    status: str  # pending, in_progress, completed
    related_alert_id: Optional[str] = None

class Intervention(BaseModel):
    id: str
    storage_unit_id: str
    storage_unit_name: str
    zone_id: str
    related_alert_id: Optional[str] = None
    action_taken: str
    assigned_operator: str
    start_date: str
    completion_date: Optional[str] = None
    status: str  # in_progress, completed, scheduled
    notes: Optional[str] = None

class OverviewKPIs(BaseModel):
    total_storage_units: int
    total_grain_stored_mt: float
    healthy_zones: int
    at_risk_zones: int
    active_pest_detections: int
    average_storage_risk: float
