"""
Agrivault AI - FastAPI Application Server
Smart Grain Storage & Early Loss Prevention Platform
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

from .models import (
    StorageUnit,
    StorageZone,
    SensorReading,
    PestDetection,
    RiskPrediction,
    Alert,
    Recommendation,
    Intervention,
    OverviewKPIs,
)
from .mock_data import (
    FACILITY_INFO,
    BASE_STORAGE_UNITS,
    BASE_PEST_DETECTIONS,
    BASE_ALERTS,
    BASE_RECOMMENDATIONS,
    BASE_INTERVENTIONS,
    get_scenario_data,
)

app = FastAPI(
    title="Agrivault AI API",
    description="Multimodal Grain Storage Intelligence Platform REST API",
    version="1.0.0",
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active scenario state (in-memory for demo phase)
CURRENT_SCENARIO = "pest"  # default demonstrates multimodal detection

class ScenarioUpdate(BaseModel):
    scenario: str  # 'normal', 'humidity', 'pest', 'critical'

class AlertStatusUpdate(BaseModel):
    status: str  # 'acknowledged', 'resolved'

class InterventionCreate(BaseModel):
    storage_unit_id: str
    storage_unit_name: str
    zone_id: str
    related_alert_id: Optional[str] = None
    action_taken: str
    assigned_operator: str
    notes: Optional[str] = None

@app.get("/")
def root():
    return {
        "platform": "Agrivault AI",
        "tagline": "Smart Grain Storage & Early Loss Prevention",
        "facility": FACILITY_INFO["name"],
        "status": "operational",
        "mode": "DEMO ENVIRONMENT | SIMULATED DATA",
        "version": "1.0.0",
    }

@app.get("/api/dashboard/overview")
def get_dashboard_overview(scenario: Optional[str] = None):
    scen = scenario or CURRENT_SCENARIO
    data = get_scenario_data(scen)
    
    # 7-day risk trend
    risk_trend = [
        {"day": "Day -6 (Oct 28)", "risk_score": 38, "humidity_avg": 56.4, "temp_avg": 26.8},
        {"day": "Day -5 (Oct 29)", "risk_score": 42, "humidity_avg": 58.1, "temp_avg": 27.2},
        {"day": "Day -4 (Oct 30)", "risk_score": 45, "humidity_avg": 61.0, "temp_avg": 28.0},
        {"day": "Day -3 (Oct 31)", "risk_score": 52, "humidity_avg": 64.5, "temp_avg": 28.9},
        {"day": "Day -2 (Nov 01)", "risk_score": 58, "humidity_avg": 67.2, "temp_avg": 29.5},
        {"day": "Day -1 (Nov 02)", "risk_score": 64, "humidity_avg": 69.8, "temp_avg": 30.4},
        {"day": "Today (Nov 03)", "risk_score": data["kpis"]["average_storage_risk"], "humidity_avg": 71.5, "temp_avg": 31.2},
    ]

    # Health distribution for doughnut chart
    all_zones = [z for u in data["storage_units"] for z in u["zones"]]
    health_dist = [
        {"name": "Healthy", "count": sum(1 for z in all_zones if z["health_status"] == "healthy"), "color": "#4C8965"},
        {"name": "Warning", "count": sum(1 for z in all_zones if z["health_status"] == "warning"), "color": "#D69A35"},
        {"name": "Critical", "count": sum(1 for z in all_zones if z["health_status"] == "critical"), "color": "#C6534D"},
    ]

    # AI Insights
    ai_insights = [
        {
            "id": "INS-01",
            "title": "Rising Microclimate Humidity in WH-001 (Center Stacks)",
            "suspected_cause": "Condensation pooling near center floor duct combined with reduced cross-air exchange during night cool down.",
            "recommended_action": "Engage dry-air auxiliary aeration blowers and verify bottom damper seals.",
            "severity": "high",
            "storage_unit": "WH-001",
            "zone": "Zone A2",
        },
        {
            "id": "INS-02",
            "title": "Acoustic Detection of Suspected Rice Weevil in Silo 01",
            "suspected_cause": "Acoustic sensor INMP441-S01-A registered recurring 4.2 kHz stridulation bursts indicating insect boring within the upper 2m wheat core.",
            "recommended_action": "Perform spear-probe core sampling and prepare targeted CO2/phosphine modified atmosphere treatment.",
            "severity": "critical",
            "storage_unit": "SL-001",
            "zone": "SL-001-Z1",
        },
        {
            "id": "INS-03",
            "title": "Elevated CO2 Respiration Concentration in Silo 02",
            "suspected_cause": "Biological respiration rate increased from 560 ppm to 850 ppm, pointing to early fungal germination or localized kernel heating.",
            "recommended_action": "Check lower plenum differential pressure and increase head fan rotation frequency.",
            "severity": "warning",
            "storage_unit": "SL-002",
            "zone": "SL-002-Z2",
        },
    ]

    return {
        "kpis": data["kpis"],
        "facility": data["facility"],
        "scenario": scen,
        "health_distribution": health_dist,
        "risk_trend": risk_trend,
        "storage_units": data["storage_units"],
        "recent_alerts": data["alerts"][:5],
        "ai_insights": ai_insights,
    }

@app.get("/api/storage-units")
def get_storage_units(grain_type: Optional[str] = None, status: Optional[str] = None, scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    units = data["storage_units"]
    if grain_type:
        units = [u for u in units if grain_type.lower() in u["grain_type"].lower()]
    if status:
        units = [u for u in units if u["health_status"].lower() == status.lower()]
    return units

@app.get("/api/storage-units/{unit_id}")
def get_storage_unit(unit_id: str, scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    for u in data["storage_units"]:
        if u["id"].lower() == unit_id.lower():
            return u
    raise HTTPException(status_code=404, detail="Storage unit not found")

@app.get("/api/sensors/readings")
def get_sensor_readings(unit_id: Optional[str] = "WH-001", zone_id: Optional[str] = "WH-001-Z2", scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    
    # Target zone
    target_zone = None
    for u in data["storage_units"]:
        for z in u["zones"]:
            if z["id"] == zone_id:
                target_zone = z
                break
    if not target_zone:
        target_zone = data["storage_units"][0]["zones"][0]

    # Reference bounds (demonstration thresholds)
    bounds = {
        "temperature": {"normal_min": 20.0, "normal_max": 28.0, "unit": "°C"},
        "humidity": {"normal_min": 45.0, "normal_max": 65.0, "unit": "%"},
        "moisture": {"normal_min": 10.0, "normal_max": 13.5, "unit": "%"},
        "co2": {"normal_min": 400.0, "normal_max": 800.0, "unit": "ppm"},
    }

    # Generate realistic historical timeline for selected zone
    now = datetime.now()
    history_24h = []
    base_t = target_zone["temperature"]
    base_h = target_zone["humidity"]
    base_m = target_zone["moisture"]
    base_c = target_zone["co2"]

    for i in range(24, -1, -2):
        factor = (24 - i) / 24.0
        history_24h.append({
            "time": f"{i:02d}h ago",
            "temperature": round(base_t - 2.5 + (factor * 2.5), 1),
            "humidity": round(base_h - 6.0 + (factor * 6.0), 1),
            "moisture": round(base_m - 1.2 + (factor * 1.2), 1),
            "co2": round(base_c - 180 + (factor * 180), 0),
        })

    return {
        "target_zone": target_zone,
        "operating_bounds": bounds,
        "simulation_label": "DEMO SIMULATION | Illustrative Sensor Feed",
        "history_24h": history_24h,
    }

@app.get("/api/pest-detections")
def get_pest_detections(scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    return {
        "total_acoustic_scans": 1420,
        "suspected_detections_count": len(data["pest_detections"]),
        "average_probability": 0.74,
        "most_frequent_category": "Lesser Grain Borer (Rhyzopertha dominica)",
        "hardware_pipeline_info": {
            "sensor": "INMP441 MEMS Omnidirectional Acoustic Sensor",
            "sampling_rate": "44.1 kHz 24-bit I2S",
            "feature_pipeline": "Noise Reduction (Wiener) -> 128-band Mel Spectrogram (Librosa)",
            "classification_model": "Planned 2D ResNet-18 Acoustic CNN Classifier",
        },
        "detections": data["pest_detections"],
    }

@app.get("/api/risk-analysis")
def get_risk_analysis(scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    
    # SHAP simulated explainability features
    shap_contributions = [
        {"feature": "Relative Humidity (>68%)", "impact": "+24.5", "category": "Environmental", "raw_value": "72.8 %"},
        {"feature": "Grain Moisture (>14.0%)", "impact": "+21.2", "category": "Grain State", "raw_value": "14.9 %"},
        {"feature": "Acoustic Insect Stridulation", "impact": "+18.8", "category": "Bio-Acoustic", "raw_value": "86% confidence"},
        {"feature": "Grain Core Temperature (>30°C)", "impact": "+14.0", "category": "Thermal", "raw_value": "32.1 °C"},
        {"feature": "CO2 Concentration (>800 ppm)", "impact": "+11.4", "category": "Respiration", "raw_value": "980 ppm"},
        {"feature": "Historical Hotspot Frequency", "impact": "+5.2", "category": "Prior Events", "raw_value": "3 occurrences / 30d"},
        {"feature": "Airflow Damper Clearance", "impact": "-8.1", "category": "Ventilation", "raw_value": "Operational 100%"},
    ]

    # Projections
    projection_24h = [
        {"hour": "+0h (Now)", "risk": 48},
        {"hour": "+4h", "risk": 53},
        {"hour": "+8h", "risk": 59},
        {"hour": "+12h", "risk": 64},
        {"hour": "+16h", "risk": 68},
        {"hour": "+20h", "risk": 71},
        {"hour": "+24h", "risk": 74},
    ]

    return {
        "overall_facility_risk": data["kpis"]["average_storage_risk"],
        "classification_scale": {
            "0-30": "Low",
            "31-60": "Moderate",
            "61-80": "High",
            "81-100": "Critical",
        },
        "model_architecture": "Planned Multimodal XGBoost Classifier + TreeSHAP Explainer",
        "simulation_disclaimer": "Simulated explainability results for academic demonstration, not actual SHAP values.",
        "shap_contributions": shap_contributions,
        "projection_24h": projection_24h,
        "units_risk": [
            {"unit_id": u["id"], "name": u["name"], "risk_score": u["risk_score"], "health_status": u["health_status"]}
            for u in data["storage_units"]
        ],
    }

@app.get("/api/alerts")
def get_alerts(severity: Optional[str] = None, status: Optional[str] = None, scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    alerts = data["alerts"]
    if severity and severity.lower() != "all":
        alerts = [a for a in alerts if a["severity"].lower() == severity.lower()]
    if status and status.lower() != "all":
        alerts = [a for a in alerts if a["status"].lower() == status.lower()]
    return alerts

@app.patch("/api/alerts/{alert_id}")
def update_alert(alert_id: str, update: AlertStatusUpdate):
    for a in BASE_ALERTS:
        if a["id"].lower() == alert_id.lower():
            a["status"] = update.status
            return {"message": f"Alert {alert_id} updated to {update.status}", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/api/recommendations")
def get_recommendations(priority: Optional[str] = None, status: Optional[str] = None, scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    recs = data["recommendations"]
    if priority and priority.lower() != "all":
        recs = [r for r in recs if r["priority"].lower() == priority.lower()]
    if status and status.lower() != "all":
        recs = [r for r in recs if r["status"].lower() == status.lower()]
    return recs

@app.get("/api/interventions")
def get_interventions(scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    return data["interventions"]

@app.post("/api/interventions")
def create_intervention(intv: InterventionCreate):
    new_id = f"INT-{len(BASE_INTERVENTIONS) + 1:02d}"
    record = {
        "id": new_id,
        "storage_unit_id": intv.storage_unit_id,
        "storage_unit_name": intv.storage_unit_name,
        "zone_id": intv.zone_id,
        "related_alert_id": intv.related_alert_id,
        "action_taken": intv.action_taken,
        "assigned_operator": intv.assigned_operator,
        "start_date": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
        "completion_date": None,
        "status": "in_progress",
        "notes": intv.notes or "Intervention logged via Agrivault AI Console",
    }
    BASE_INTERVENTIONS.insert(0, record)
    return {"message": "Intervention created successfully", "intervention": record}

@app.post("/api/scenarios/{scenario}")
def switch_scenario(scenario: str):
    global CURRENT_SCENARIO
    if scenario not in ["normal", "humidity", "pest", "critical"]:
        raise HTTPException(status_code=400, detail="Invalid scenario name")
    CURRENT_SCENARIO = scenario
    return {"message": f"Switched to scenario: {scenario}", "current_scenario": scenario}

@app.get("/api/reports")
def get_reports(scenario: Optional[str] = None):
    data = get_scenario_data(scenario or CURRENT_SCENARIO)
    return {
        "facility": data["facility"],
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "kpis": data["kpis"],
        "storage_summary": [
            {
                "id": u["id"],
                "name": u["name"],
                "grain_type": u["grain_type"],
                "capacity_mt": u["capacity_mt"],
                "current_mt": u["current_quantity_mt"],
                "utilization_pct": round((u["current_quantity_mt"] / u["capacity_mt"]) * 100, 1),
                "risk_score": u["risk_score"],
                "health_status": u["health_status"],
            }
            for u in data["storage_units"]
        ],
        "alerts_count": len(data["alerts"]),
        "pest_detections_count": len(data["pest_detections"]),
        "interventions_count": len(data["interventions"]),
    }

