import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StorageUnit,
  StorageZone,
  Alert,
  Recommendation,
  Intervention,
  OverviewKPIs,
  DemoScenario
} from '../types';
import {
  INITIAL_STORAGE_UNITS,
  INITIAL_ALERTS,
  INITIAL_PEST_DETECTIONS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_INTERVENTIONS,
  computeScenarioData,
  FACILITY_NAME,
  FACILITY_LOCATION
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AgrivaultContextType {
  scenario: DemoScenario;
  setScenario: (scen: DemoScenario) => void;
  storageUnits: StorageUnit[];
  alerts: Alert[];
  recommendations: Recommendation[];
  interventions: Intervention[];
  pestDetections: typeof INITIAL_PEST_DETECTIONS;
  kpis: OverviewKPIs;
  facility: { name: string; location: string };
  selectedUnitId: string;
  setSelectedUnitId: (id: string) => void;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  currentSelectedZone: StorageZone | null;
  currentSelectedUnit: StorageUnit | null;
  // User Actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  completeRecommendation: (recId: string) => void;
  addIntervention: (intv: Omit<Intervention, 'id' | 'start_date'>) => void;
  addStorageUnit: (unit: Omit<StorageUnit, 'id' | 'zones' | 'facility_name' | 'last_updated'>) => void;
  resetToDefaults: () => void;
  // Simulation Controls
  isLiveSimulating: boolean;
  toggleLiveSimulation: () => void;
  lastSimulatedTick: Date;
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AgrivaultContext = createContext<AgrivaultContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'agrivault_state_v1';

export const AgrivaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenario, setScenarioState] = useState<DemoScenario>('pest');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('SL-001');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('SL-001-Z1');
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [lastSimulatedTick, setLastSimulatedTick] = useState<Date>(new Date());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent user overrides stored in localStorage
  const [userAlerts, setUserAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [userRecs, setUserRecs] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_recs`);
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [userInterventions, setUserInterventions] = useState<Intervention[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_intvs`);
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });

  const [customUnits, setCustomUnits] = useState<StorageUnit[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_units`);
    return saved ? JSON.parse(saved) : INITIAL_STORAGE_UNITS;
  });

  // Calculate scenario derived state
  const { units: scenarioUnits, alerts: scenarioAlerts, recs: scenarioRecs, pests: scenarioPests, intvs: scenarioIntvs, kpis } =
    computeScenarioData(scenario, customUnits, userAlerts, INITIAL_PEST_DETECTIONS, userRecs, userInterventions);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alerts`, JSON.stringify(userAlerts));
  }, [userAlerts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_recs`, JSON.stringify(userRecs));
  }, [userRecs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_intvs`, JSON.stringify(userInterventions));
  }, [userInterventions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_units`, JSON.stringify(customUnits));
  }, [customUnits]);

  // Periodic telemetry fluctuation simulation
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setLastSimulatedTick(new Date());
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setScenario = (newScenario: DemoScenario) => {
    setScenarioState(newScenario);
    const names = {
      normal: 'Normal Storage Conditions',
      humidity: 'Rising Humidity Incident',
      pest: 'Suspected Pest Infestation',
      critical: 'Critical Multi-Factor Storage Risk',
    };
    showToast({
      type: 'info',
      title: 'Demo Scenario Activated',
      message: `System updated to "${names[newScenario]}". Environmental readings, risk scores and alerts synced.`,
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setUserAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
    showToast({
      type: 'success',
      title: 'Alert Acknowledged',
      message: `Alert ${alertId} has been acknowledged and marked in audit trail.`,
    });
  };

  const resolveAlert = (alertId: string) => {
    setUserAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
    showToast({
      type: 'success',
      title: 'Alert Resolved',
      message: `Alert ${alertId} marked as resolved. Storage risk re-evaluated.`,
    });
  };

  const completeRecommendation = (recId: string) => {
    setUserRecs((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'completed' } : r))
    );
    showToast({
      type: 'success',
      title: 'Recommendation Completed',
      message: `Action ${recId} executed successfully. Prevention logged.`,
    });
  };

  const addIntervention = (intv: Omit<Intervention, 'id' | 'start_date'>) => {
    const newId = `INT-${String(userInterventions.length + 1).padStart(2, '0')}`;
    const newIntv: Intervention = {
      ...intv,
      id: newId,
      start_date: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };
    setUserInterventions((prev) => [newIntv, ...prev]);
    showToast({
      type: 'success',
      title: 'Intervention Logged',
      message: `New field action ${newId} assigned to ${intv.assigned_operator}.`,
    });
  };

  const addStorageUnit = (unit: Omit<StorageUnit, 'id' | 'zones' | 'facility_name' | 'last_updated'>) => {
    const newId = `WH-${String(customUnits.length + 1).padStart(3, '0')}`;
    const newUnit: StorageUnit = {
      ...unit,
      id: newId,
      facility_name: FACILITY_NAME,
      last_updated: 'Just now',
      zones: [
        {
          id: `${newId}-Z1`,
          name: 'Section 1 - Front Aeration',
          storage_unit_id: newId,
          grain_type: unit.grain_type,
          temperature: 26.5,
          humidity: 55.0,
          moisture: 12.0,
          co2: 500,
          risk_score: 20,
          health_status: 'healthy',
          pest_detected: false,
          pest_type: null,
          pest_probability: 0.03,
          recommended_action: 'Routine baseline monitoring',
        },
        {
          id: `${newId}-Z2`,
          name: 'Section 2 - Main Center Core',
          storage_unit_id: newId,
          grain_type: unit.grain_type,
          temperature: 27.2,
          humidity: 57.4,
          moisture: 12.4,
          co2: 520,
          risk_score: 24,
          health_status: 'healthy',
          pest_detected: false,
          pest_type: null,
          pest_probability: 0.05,
          recommended_action: 'Optimal storage parameters',
        },
        {
          id: `${newId}-Z3`,
          name: 'Section 3 - Discharge Plenum',
          storage_unit_id: newId,
          grain_type: unit.grain_type,
          temperature: 26.8,
          humidity: 56.1,
          moisture: 12.1,
          co2: 510,
          risk_score: 22,
          health_status: 'healthy',
          pest_detected: false,
          pest_type: null,
          pest_probability: 0.04,
          recommended_action: 'Maintain fan schedule',
        },
      ],
    };
    setCustomUnits((prev) => [...prev, newUnit]);
    showToast({
      type: 'success',
      title: 'Storage Unit Added',
      message: `${unit.name} (${newId}) initialized with 3 monitoring zones.`,
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_alerts`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_recs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_intvs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_units`);
    setUserAlerts(INITIAL_ALERTS);
    setUserRecs(INITIAL_RECOMMENDATIONS);
    setUserInterventions(INITIAL_INTERVENTIONS);
    setCustomUnits(INITIAL_STORAGE_UNITS);
    setScenarioState('pest');
    showToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'All mock databases restored to initial baseline demonstration state.',
    });
  };

  const toggleLiveSimulation = () => {
    setIsLiveSimulating((prev) => !prev);
    showToast({
      type: 'info',
      title: !isLiveSimulating ? 'Live Simulation Resumed' : 'Live Simulation Paused',
      message: !isLiveSimulating
        ? 'Periodic simulated telemetry updates are active.'
        : 'Telemetry data stream paused for inspection.',
    });
  };

  const currentSelectedUnit = scenarioUnits.find((u) => u.id === selectedUnitId) || scenarioUnits[0];
  const allZones = scenarioUnits.flatMap((u) => u.zones);
  const currentSelectedZone = allZones.find((z) => z.id === selectedZoneId) || allZones[0];

  return (
    <AgrivaultContext.Provider
      value={{
        scenario,
        setScenario,
        storageUnits: scenarioUnits,
        alerts: scenarioAlerts,
        recommendations: scenarioRecs,
        interventions: scenarioIntvs,
        pestDetections: scenarioPests,
        kpis,
        facility: { name: FACILITY_NAME, location: FACILITY_LOCATION },
        selectedUnitId,
        setSelectedUnitId,
        selectedZoneId,
        setSelectedZoneId,
        currentSelectedUnit,
        currentSelectedZone,
        acknowledgeAlert,
        resolveAlert,
        completeRecommendation,
        addIntervention,
        addStorageUnit,
        resetToDefaults,
        isLiveSimulating,
        toggleLiveSimulation,
        lastSimulatedTick,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AgrivaultContext.Provider>
  );
};

export const useAgrivault = () => {
  const context = useContext(AgrivaultContext);
  if (!context) {
    throw new Error('useAgrivault must be used within an AgrivaultProvider');
  }
  return context;
};

