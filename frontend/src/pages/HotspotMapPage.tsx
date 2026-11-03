import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Bug,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  Info,
  Maximize2
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { StorageZone, HealthStatus } from '../types';

export const HotspotMapPage: React.FC = () => {
  const { storageUnits, setSelectedUnitId, setSelectedZoneId } = useAgrivault();
  const navigate = useNavigate();

  const [activeZone, setActiveZone] = useState<StorageZone | null>(() => {
    // Default to the highest risk zone
    const all = storageUnits.flatMap((u) => u.zones);
    return all.reduce((prev, curr) => (curr.risk_score > prev.risk_score ? curr : prev), all[0]);
  });

  const [selectedLayer, setSelectedLayer] = useState<'risk' | 'temp' | 'humidity' | 'pest'>('risk');

  // Zone color resolver based on active visual layer
  const getZoneColor = (z: StorageZone) => {
    if (selectedLayer === 'pest') {
      if (z.pest_detected) return '#C6534D'; // Red
      return '#4C8965'; // Green
    }
    if (selectedLayer === 'temp') {
      if (z.temperature > 32) return '#C6534D';
      if (z.temperature > 29) return '#D69A35';
      return '#4C8965';
    }
    if (selectedLayer === 'humidity') {
      if (z.humidity > 70) return '#C6534D';
      if (z.humidity > 62) return '#D69A35';
      return '#4C8965';
    }
    // Default: Overall Risk
    if (z.risk_score > 80) return '#C6534D'; // Critical red
    if (z.risk_score > 60) return '#E07A5F'; // Orange high risk
    if (z.risk_score > 35) return '#D69A35'; // Amber warning
    return '#4C8965'; // Green healthy
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Facility Spatial Hotspot Map</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              2D INDUSTRIAL BLUEPRINT
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Architectural schematic of Deccan Agro Storage Complex with interactive localized sensor telemetry.
          </p>
        </div>

        {/* Heatmap Layer Selector */}
        <div className="flex items-center gap-2 text-xs bg-gray-100 p-1 rounded-lg border border-agri-border">
          <span className="text-agri-muted font-medium px-2">Overlay:</span>
          {(['risk', 'temp', 'humidity', 'pest'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-3 py-1 rounded capitalize transition-all ${
                selectedLayer === layer
                  ? 'bg-agri-forest text-white font-bold shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {layer === 'temp' ? 'Temperature' : layer === 'pest' ? 'Acoustic Pest' : layer}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout Canvas & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Industrial Floor Plan */}
        <div className="bg-[#1C2621] rounded-xl border border-gray-700 shadow-xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          {/* Blueprint Grid Lines Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#829B82 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Blueprint Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                DECCAN AGRO STORAGE COMPLEX — PLAN LAYOUT
              </span>
              <p className="text-[11px] text-gray-400 font-mono">17,000 MT Nominal Facility Footprint</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-300 font-mono">
              <span>Scale: 1:250</span>
              <span>•</span>
              <span>Grid North: ↑</span>
            </div>
          </div>

          {/* Interactive Industrial Layout SVG / Interactive Floor Plan */}
          <div className="relative z-10 my-4 flex-1 flex flex-col justify-center space-y-6">
            {/* Top Row: Warehouses WH-001 & WH-002 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WH-001 Warehouse */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 relative">
                <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-2 border-b border-white/10 pb-1">
                  <span className="font-bold text-emerald-300">WH-001: Central Warehouse</span>
                  <span>Wheat (Durum)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {storageUnits
                    .find((u) => u.id === 'WH-001')
                    ?.zones.map((zone) => {
                      const color = getZoneColor(zone);
                      const isSelected = activeZone?.id === zone.id;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone)}
                          className={`h-24 rounded border p-2 flex flex-col justify-between text-left transition-all ${
                            isSelected ? 'ring-2 ring-white scale-102 shadow-lg' : 'hover:opacity-90'
                          }`}
                          style={{
                            backgroundColor: `${color}33`,
                            borderColor: color,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-white truncate">
                              {zone.id.split('-')[2]}
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>

                          <div className="text-[10px] text-gray-200">
                            <span className="block font-mono">{zone.temperature}°C</span>
                            <span className="block font-mono">{zone.humidity}% RH</span>
                          </div>

                          <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                            Risk {zone.risk_score}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* WH-002 Warehouse */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 relative">
                <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-2 border-b border-white/10 pb-1">
                  <span className="font-bold text-emerald-300">WH-002: Paddy Storage</span>
                  <span>Paddy (Rice)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {storageUnits
                    .find((u) => u.id === 'WH-002')
                    ?.zones.map((zone) => {
                      const color = getZoneColor(zone);
                      const isSelected = activeZone?.id === zone.id;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone)}
                          className={`h-24 rounded border p-2 flex flex-col justify-between text-left transition-all ${
                            isSelected ? 'ring-2 ring-white scale-102 shadow-lg' : 'hover:opacity-90'
                          }`}
                          style={{
                            backgroundColor: `${color}33`,
                            borderColor: color,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-white truncate">
                              {zone.id.split('-')[2]}
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>

                          <div className="text-[10px] text-gray-200">
                            <span className="block font-mono">{zone.temperature}°C</span>
                            <span className="block font-mono">{zone.humidity}% RH</span>
                          </div>

                          <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                            Risk {zone.risk_score}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Silos (SL-001, SL-002) and Multi-Grain Shed (WH-003) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* SL-001 Cylindrical Silo Vertical Stack */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 relative">
                <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-2 border-b border-white/10 pb-1">
                  <span className="font-bold text-emerald-300">SL-001: Wheat Silo</span>
                  <span>Sharbati</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {storageUnits
                    .find((u) => u.id === 'SL-001')
                    ?.zones.map((zone) => {
                      const color = getZoneColor(zone);
                      const isSelected = activeZone?.id === zone.id;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone)}
                          className={`h-11 rounded border px-3 py-1 flex items-center justify-between transition-all ${
                            isSelected ? 'ring-2 ring-white shadow-md' : 'hover:opacity-90'
                          }`}
                          style={{
                            backgroundColor: `${color}33`,
                            borderColor: color,
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {zone.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-mono text-gray-200">
                            {zone.temperature}°C | {zone.humidity}%
                          </span>
                          <span className="text-[10px] font-bold font-mono text-white">
                            R:{zone.risk_score}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* SL-002 Cylindrical Silo Vertical Stack */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 relative">
                <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-2 border-b border-white/10 pb-1">
                  <span className="font-bold text-emerald-300">SL-002: Maize Silo</span>
                  <span>Maize</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {storageUnits
                    .find((u) => u.id === 'SL-002')
                    ?.zones.map((zone) => {
                      const color = getZoneColor(zone);
                      const isSelected = activeZone?.id === zone.id;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone)}
                          className={`h-11 rounded border px-3 py-1 flex items-center justify-between transition-all ${
                            isSelected ? 'ring-2 ring-white shadow-md' : 'hover:opacity-90'
                          }`}
                          style={{
                            backgroundColor: `${color}33`,
                            borderColor: color,
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {zone.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-mono text-gray-200">
                            {zone.temperature}°C | {zone.humidity}%
                          </span>
                          <span className="text-[10px] font-bold font-mono text-white">
                            R:{zone.risk_score}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* WH-003 Multi-Grain Warehouse */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 relative">
                <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-2 border-b border-white/10 pb-1">
                  <span className="font-bold text-emerald-300">WH-003: Multi-Grain</span>
                  <span>Barley / Pulses</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {storageUnits
                    .find((u) => u.id === 'WH-003')
                    ?.zones.map((zone) => {
                      const color = getZoneColor(zone);
                      const isSelected = activeZone?.id === zone.id;

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setActiveZone(zone)}
                          className={`h-11 rounded border px-3 py-1 flex items-center justify-between transition-all ${
                            isSelected ? 'ring-2 ring-white shadow-md' : 'hover:opacity-90'
                          }`}
                          style={{
                            backgroundColor: `${color}33`,
                            borderColor: color,
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">
                            {zone.id.split('-')[2]}
                          </span>
                          <span className="text-[10px] font-mono text-gray-200">
                            {zone.temperature}°C | {zone.humidity}%
                          </span>
                          <span className="text-[10px] font-bold font-mono text-white">
                            R:{zone.risk_score}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Blueprint Footer Legend */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#4C8965] border border-white/30" /> Healthy (0-35)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#D69A35] border border-white/30" /> Warning (36-60)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#E07A5F] border border-white/30" /> High (61-80)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#C6534D] border border-white/30" /> Critical (&gt;80)
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Click any zone block to inspect telemetry</span>
          </div>
        </div>

        {/* Selected Zone Detail Panel */}
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 flex flex-col justify-between space-y-4">
          {activeZone ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {activeZone.storage_unit_id} • {activeZone.id}
                  </span>
                  <h3 className="text-base font-bold text-agri-text">{activeZone.name}</h3>
                  <p className="text-xs text-agri-muted">Grain: {activeZone.grain_type}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeZone.health_status === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeZone.health_status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activeZone.health_status}
                </span>
              </div>

              {/* Sensor Readings Breakdown */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-agri-text font-mono uppercase text-[10px] tracking-wider text-agri-muted">
                  Environmental Sensor Vector
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-agri-muted block">Temperature</span>
                    <span className="font-bold font-mono text-base text-agri-text">
                      {activeZone.temperature} °C
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-agri-muted block">Relative Humidity</span>
                    <span className="font-bold font-mono text-base text-agri-text">
                      {activeZone.humidity} %
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-agri-muted block">Grain Moisture</span>
                    <span className="font-bold font-mono text-base text-agri-text">
                      {activeZone.moisture} %
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-agri-muted block">CO2 Respiration</span>
                    <span className="font-bold font-mono text-base text-agri-text">
                      {activeZone.co2} ppm
                    </span>
                  </div>
                </div>
              </div>

              {/* Multimodal Risk Score */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-agri-muted">XGBoost Risk Index:</span>
                  <span
                    className={`font-mono font-bold text-base ${
                      activeZone.risk_score > 60
                        ? 'text-agri-red'
                        : activeZone.risk_score > 35
                        ? 'text-agri-amber'
                        : 'text-emerald-700'
                    }`}
                  >
                    {activeZone.risk_score} / 100
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-agri-forest"
                    style={{ width: `${activeZone.risk_score}%` }}
                  />
                </div>
              </div>

              {/* Acoustic Pest Status */}
              <div className="p-3 rounded-lg border text-xs space-y-1">
                <span className="font-bold text-agri-text block">Acoustic Insect Telemetry:</span>
                {activeZone.pest_detected ? (
                  <div className="text-red-700 space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <Bug className="w-3.5 h-3.5" />
                      <span>{activeZone.pest_type}</span>
                    </p>
                    <p className="text-[11px] text-red-600">
                      Detection Probability: {Math.round((activeZone.pest_probability || 0) * 100)}%
                    </p>
                  </div>
                ) : (
                  <p className="text-emerald-700 flex items-center gap-1 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No active acoustic pest signatures detected</span>
                  </p>
                )}
              </div>

              {/* Recommended Action */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-agri-forest block">Prescribed Action:</span>
                <p className="text-[11px] text-agri-text bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  {activeZone.recommended_action}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-agri-muted text-xs">
              Select any zone block on the facility blueprint to inspect its real-time sensor array.
            </div>
          )}

          {activeZone && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedUnitId(activeZone.storage_unit_id);
                  setSelectedZoneId(activeZone.id);
                  navigate('/monitoring');
                }}
                className="w-full bg-agri-forest hover:bg-agri-deep text-white py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Launch Live Waveform Telemetry →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

