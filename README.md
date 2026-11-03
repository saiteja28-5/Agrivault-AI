# Agrivault AI — Smart Grain Storage & Early Loss Prevention Platform

Agrivault AI is an AI-powered multimodal grain storage intelligence web application designed for grain warehouse operators, agricultural storage facilities, and bulk silo management.

It demonstrates post-harvest grain loss prevention through continuous environmental microclimate monitoring, subsurface acoustic insect detection, probabilistic deterioration modeling, and explainable AI insights.

---

## 1. Project Overview & Workflow

The platform follows a continuous six-stage closed-loop intelligence cycle:

```
Detect → Localize → Predict → Explain → Recommend → Verify
```

1. **Detect**: Continuously streams temperature (°C), relative humidity (RH %), grain moisture (%), CO2 respiration (ppm), and acoustic stridulation audio feeds.
2. **Localize**: Pinpoints emerging anomalies to specific warehouse storage zones or silo columns (15 monitoring zones).
3. **Predict**: Uses multimodal XGBoost risk estimation models to project 24-hour and 7-day grain deterioration trajectories.
4. **Explain**: Generates simulated TreeSHAP feature attributions showing positive and negative drivers of predicted storage risks.
5. **Recommend**: Prescribes specific, actionable engineering actions (aeration adjustments, targeted sampling, cleaning, gate inspections).
6. **Verify**: Tracks field interventions, assigned operators, completion logs, and resolution audits.

---

## 2. Technologies Used

### Frontend
- **Framework**: React 19 with Vite & TypeScript
- **Styling**: Tailwind CSS with custom agricultural industrial design tokens
  - Primary Forest Green: `#244A38`
  - Deep Green: `#183629`
  - Secondary Sage: `#829B82`
  - Neutral Background: `#F5F6F1`
  - Warning Amber: `#D69A35`
  - Critical Red: `#C6534D`
  - Success Green: `#4C8965`
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Pie/Doughnut charts, Area charts, Line charts, Bar charts)
- **Routing**: React Router v7
- **Persistence**: LocalStorage state synchronization with reactive Toast notifications

### Backend (REST API Service)
- **Runtime**: Python 3.11+
- **Framework**: FastAPI (Asynchronous REST API with automatic OpenAPI Swagger documentation)
- **Server**: Uvicorn ASGI
- **Data Validation**: Pydantic v2

### Planned AI/ML Hardware Integration Architecture
- **Bio-Acoustics**: INMP441 MEMS Omnidirectional Acoustic Sensor (44.1 kHz 24-bit I2S) → Spectral Subtraction Noise Reduction → 128-band Mel Spectrogram (Librosa) → 2D ResNet-18 CNN.
- **Environmental Anomaly Detection**: Scikit-Learn Isolation Forest on multi-sensor vectors.
- **Multimodal Risk Prediction**: XGBoost Regressor/Classifier for composite deterioration risk scoring.
- **Explainability**: TreeSHAP feature attributions for root-cause interpretability.
- **Database Architecture**: PostgreSQL for centralized multi-facility cloud storage; SQLite for offline edge gateways.

---

## 3. Project Folder Structure

```
Agrivault/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI endpoints, CORS, scenario handlers
│   ├── models.py            # Pydantic data schemas
│   ├── mock_data.py         # Seeded 15-zone dataset across 4 scenarios
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ToastContainer.tsx
│   │   │   └── layout/
│   │   │       ├── Layout.tsx
│   │   │       ├── Navbar.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── context/
│   │   │   └── AgrivaultContext.tsx   # Centralized state, scenario switcher, localStorage
│   │   ├── data/
│   │   │   └── mockData.ts            # Client mock database & scenario engine
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx        # Page 1: Executive Overview
│   │   │   ├── StorageUnitsPage.tsx    # Page 2: Storage Unit Fleet
│   │   │   ├── LiveMonitoringPage.tsx  # Page 3: Live Sensor Monitoring
│   │   │   ├── PestDetectionPage.tsx   # Page 4: Acoustic Pest Intelligence
│   │   │   ├── RiskAnalysisPage.tsx    # Page 5: Risk Analysis & SHAP
│   │   │   ├── HotspotMapPage.tsx      # Page 6: 2D Spatial Hotspot Blueprint
│   │   │   ├── AlertsPage.tsx          # Page 7: Alerts & Incident Response
│   │   │   ├── RecommendationsPage.tsx # Page 8: Preventive Recommendations
│   │   │   ├── InterventionsPage.tsx   # Page 9: Operational Intervention Tracking
│   │   │   └── ReportsPage.tsx         # Page 10: Reports & Analytics
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── App.tsx                     # React Router configurations
│   │   ├── index.css                   # Tailwind styles & print CSS
│   │   └── main.tsx                    # Application root entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   └── vite.config.ts
├── run_app.bat                         # Windows one-click dual launcher
└── README.md
```

---

## 4. Features Implemented (All 10 Application Pages)

### Page 1 — Executive Storage Overview
- 6 Key Performance Indicator (KPI) cards: Total Storage Units, Total Grain Stored (MT), Healthy Zones, At-Risk Zones, Pest Detections, and Average Storage Risk (0–100 scale).
- Storage Health Doughnut chart (Healthy, Warning, Critical zones).
- 7-day Risk Trend line chart comparing facility risk trajectory against safe threshold limits.
- Storage Unit Status fleet table with fill percentages and drill-down links.
- Recent 5 Alerts with severity tags, timestamps, and direct acknowledgment actions.
- 3 AI Diagnostic Insights detailing suspected root causes and recommended physical actions.

### Page 2 — Storage Units Fleet Management
- Comprehensive fleet cards & table covering all demo storage structures:
  - `WH-001`: Central Grain Warehouse (Wheat Durum, 5000 MT)
  - `WH-002`: Paddy Storage Facility (Paddy Sona Masoori, 4000 MT)
  - `SL-001`: Wheat Silo 01 (Wheat Sharbati, 2500 MT)
  - `SL-002`: Maize Silo 02 (Yellow Maize, 2000 MT)
  - `WH-003`: Multi-Grain Warehouse (Barley & Chickpeas, 3500 MT)
- Real-time search, grain-variety filter, health-status filter, and Grid/List view toggle.
- "Add Storage Unit" modal with automatic 3-zone sensor allocation saved directly to browser storage.
- Detailed Inspection modal displaying sub-divided zones, readings, and related alerts.

### Page 3 — Live Environmental Monitoring
- Interactive selector for facility unit and individual monitoring zone.
- 4 real-time sensor cards:
  1. Temperature (°C)
  2. Relative Humidity (RH %)
  3. Grain Moisture (%)
  4. CO2 Respiration (ppm)
- Configurable demonstration safety thresholds drawer allowing interactive threshold adjustments to trigger warning conditions.
- Multi-metric historical line charts with 1-hour, 6-hour, 24-hour, and 7-day temporal filters.
- Live telemetry pulse indicator simulating periodic sensor packet updates.

### Page 4 — Acoustic Pest Intelligence
- Architectural flowchart of the planned acoustic CNN pipeline (INMP441 → Noise Filter → Mel Spectrogram → ResNet-18 → Classification).
- Live simulated Mel Spectrogram matrix with animated frequency spectrum bars.
- Demo audio probe sample selector (Lesser Grain Borer stridulation, Rice Weevil locomotion clicks, Ambient blower baseline) with interactive playback simulation.
- Pest species classification cards for Rice Weevil, Lesser Grain Borer, Red Flour Beetle, and Angoumois Grain Moth.

### Page 5 — Risk Analysis & SHAP Explainability
- Multimodal XGBoost risk prediction score gauge (0–30 Low, 31–60 Moderate, 61–80 High, 81–100 Critical).
- 24-hour predictive risk progression curve showing worsening risk if no aeration action is taken.
- TreeSHAP-style horizontal feature attribution bars showing individual factors pushing risk higher (red) or pulling risk lower (green).
- Zone-by-zone risk attribution table with primary contributing factors and prescribed interventions.

### Page 6 — 2D Facility Hotspot Map
- Industrial warehouse floor plan and silo array blueprint.
- Color-coded zone thermal/risk overlays (Green = Healthy, Amber = Warning, Orange = High, Red = Critical).
- Clickable zone blocks on the floor plan that immediately open an interactive detail inspector with live sensor readings, risk score, pest status, and recommended actions.
- Overlay filter toggle (Overall Risk, Temperature, Relative Humidity, Bio-Acoustic Pest).

### Page 7 — Alerts & Incident Response
- Multi-category alert management system (Environmental, Acoustic/Pest, Moisture, Compound Risk, Equipment).
- Filter tabs for All, Critical, High, Medium, and Resolved incidents.
- Interactive "Acknowledge" and "Resolve" status updates that persist in browser storage.
- Detailed Incident modal with root-cause analysis and direct link to operational intervention logs.

### Page 8 — Preventive Action Recommendations
- Actionable preventive measure cards prioritizing airflow optimization, grain inspection, dehumidification, and cleaning.
- Priority filters (Critical, High, Medium, Low) and Status filters (Pending, In Progress, Completed).
- Interactive "Mark Completed" actions that log completion events and show real-time notifications.
- Direct reference links to originating alerts.

### Page 9 — Operational Intervention Tracking
- Full operational audit table tracking field engineering activities.
- "Log Intervention" modal allowing selection of unit, zone, linked alert, action taken, notes, and assigned lead operator (Ramesh Kumar, Suresh Reddy, Priya Nair, Vikram Patel, Anil Sharma).
- Interactive audit timeline illustrating chronological operator actions.

### Page 10 — Reports & Analytics
- Official post-harvest grain condition assessment document layout.
- Comparative analytics charts (Unit-wise risk distribution bar chart, incident frequency by category).
- Functional "Download CSV" feature generating a complete CSV dataset of all storage units, zones, sensor readings, and pest statuses.
- Formatted printable report trigger (`window.print()`) with print-optimized CSS.

---

## 5. Demonstration Mode & Scenario Switcher

For academic evaluations and presentations, the platform includes a **Demo Scenario Switcher** located in the top navigation bar:

1. **Normal Storage Conditions**: All 5 units and 15 zones are within optimal environmental limits; risk scores remain low (<30).
2. **Rising Humidity Incident**: Central Warehouse (WH-001) and Paddy Facility (WH-002) experience humidity and moisture creep, raising warning alerts.
3. **Suspected Pest Infestation**: Silo 01 and Warehouse 01 trigger acoustic sensors with high confidence scores for Lesser Grain Borer and Rice Weevil.
4. **Critical Compound Risk**: Silo 01 and Warehouse 01 reach critical status (risk > 85) due to combined thermal hotspots, moisture pooling, elevated CO2, and active insect stridulation.

Switching scenarios immediately updates readings, charts, alerts, and recommendations consistently across all pages without requiring a page refresh.

---

## 6. How to Run the Application

### Option A: One-Click Windows Launcher (Recommended)
Double-click `run_app.bat` in the project root directory. This starts both the FastAPI backend on port 8000 and the Vite React frontend on port 5173.

### Option B: Manual Command Line Execution

#### 1. Start the Backend API (FastAPI)
```bash
# In the project root directory
python -m uvicorn backend.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

#### 2. Start the Frontend (Vite + React)
```bash
# In a new terminal window, navigate to frontend:
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 7. Current Limitations & Future Roadmap

### Current Version (Academic Presentation Phase)
- Environmental sensor readings and acoustic stridulation audio feeds are simulated using realistic domain reference ranges.
- SHAP feature attributions and XGBoost risk projections are generated via seeded scenario models to illustrate intended model behavior.
- Changes made by the operator (acknowledging alerts, resolving alerts, logging interventions, adding storage units) are saved in browser `localStorage`.

### Future Integration Roadmap (Phase 2 Hardware & AI Deployment)
1. **Hardware Deployment**:
   - Fabricate probe arrays with INMP441 MEMS acoustic microphones and SHT31/DHT22 temperature & humidity sensors.
   - Deploy ESP32 microcontrollers communicating over LoRaWAN or MQTT to edge gateways.
2. **Model Training**:
   - Train 2D ResNet-18 audio classification CNN on public acoustic insect datasets (USDA ARS, Grain Insect Sound Database).
   - Train XGBoost risk regression on collected multi-sensor time-series logs.
3. **Database Integration**:
   - Transition from mock state to PostgreSQL database with TimescaleDB extension for high-frequency sensor telemetry.

