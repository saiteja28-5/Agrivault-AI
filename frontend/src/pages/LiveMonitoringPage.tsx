import React, { useState } from 'react';
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Layers,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Info,
  Radio
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area
} from 'recharts';
import { useAgrivault } from '../context/AgrivaultContext';

export const LiveMonitoringPage: React.FC = () => {
  const {
    storageUnits,
    selectedUnitId,
    setSelectedUnitId,
    selectedZoneId,
    setSelectedZoneId,
    currentSelectedZone,
    currentSelectedUnit,
    isLiveSimulating,
    toggleLiveSimulation,
    lastSimulatedTick
  } = useAgrivault();

  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'temperature' | 'humidity' | 'moisture' | 'co2'>('all');

  // Configurable demonstration reference ranges
  const [tempMax, setTempMax] = useState<number>(30.0);
  const [humidityMax, setHumidityMax] = useState<number>(65.0);
  const [moistureMax, setMoistureMax] = useState<number>(13.5);
  const [co2Max, setCo2Max] = useState<number>(850.0);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const zone = currentSelectedZone || storageUnits[0].zones[0];
  const unit = currentSelectedUnit || storageUnits[0];

  // Synthesize realistic historical timeline for selected zone based on timeRange
  const generateChartData = () => {
    const pointsCount = timeRange === '1h' ? 12 : timeRange === '6h' ? 18 : timeRange === '24h' ? 24 : 14;
    const data = [];
    const baseT = zone.temperature;
    const baseH = zone.humidity;
    const baseM = zone.moisture;
    const baseC = zone.co2;

    for (let i = pointsCount; i >= 0; i--) {
      const stepFactor = (pointsCount - i) / pointsCount;
      const noiseT = (Math.sin(i * 0.8) * 0.7);
      const noiseH = (Math.cos(i * 0.6) * 1.5);
      const noiseM = (Math.sin(i * 0.4) * 0.3);
      const noiseC = (Math.cos(i * 0.5) * 40);

      const label =
        timeRange === '1h'
          ? `${i * 5}m ago`
          : timeRange === '6h'
          ? `${(i * 20) / 60 >= 1 ? `${Math.floor((i * 20) / 60)}h ` : ''}${(i * 20) % 60}m ago`
          : timeRange === '24h'
          ? `${i}h ago`
          : `Day -${i}`;

      data.push({
        label: i === 0 ? 'Now' : label,
        temperature: Number((baseT - 2.5 + stepFactor * 2.5 + noiseT).toFixed(1)),
        humidity: Number((baseH - 6.0 + stepFactor * 6.0 + noiseH).toFixed(1)),
        moisture: Number((baseM - 1.2 + stepFactor * 1.2 + noiseM).toFixed(1)),
        co2: Number((baseC - 180 + stepFactor * 180 + noiseC).toFixed(0)),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Metric status evaluations
  const tempStatus = zone.temperature > tempMax ? 'critical' : zone.temperature > tempMax - 2 ? 'warning' : 'healthy';
  const humStatus = zone.humidity > humidityMax ? 'critical' : zone.humidity > humidityMax - 5 ? 'warning' : 'healthy';
  const moistStatus = zone.moisture > moistureMax ? 'critical' : zone.moisture > moistureMax - 0.8 ? 'warning' : 'healthy';
  const co2Status = zone.co2 > co2Max ? 'critical' : zone.co2 > co2Max - 150 ? 'warning' : 'healthy';

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">Normal</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">Warning</span>;
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">Threshold Breach</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Live Sensor Monitoring</h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-900">
              <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
              DEMO SIMULATION FEED
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Continuous environmental telemetry capturing multi-layer thermal, hygrometric and respiration variables.
          </p>
        </div>

        {/* Unit & Zone Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-agri-muted font-medium">Facility:</span>
            <select
              value={selectedUnitId}
              onChange={(e) => {
                setSelectedUnitId(e.target.value);
                const targetU = storageUnits.find((u) => u.id === e.target.value);
                if (targetU && targetU.zones.length > 0) {
                  setSelectedZoneId(targetU.zones[0].id);
                }
              }}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text font-semibold outline-hidden"
            >
              {storageUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} - {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-agri-muted font-medium">Zone:</span>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text font-semibold outline-hidden"
            >
              {unit.zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-xs border border-agri-border px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-agri-text font-medium"
          >
            <Settings2 className="w-3.5 h-3.5 text-agri-sage" />
            <span>Thresholds</span>
          </button>
        </div>
      </div>

      {/* Demonstration Thresholds Drawer */}
      {showConfig && (
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-xs animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-agri-text">Configurable Demonstration Safety Limits</h3>
              <p className="text-[11px] text-agri-muted">
                Reference ranges used for academic demonstration. Adjust thresholds to test automatic alert triggering.
              </p>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
              Configurable Demo Reference
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-agri-muted font-medium mb-1">Max Safe Temp (°C)</label>
              <input
                type="number"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-agri-border rounded-lg text-agri-text font-mono"
              />
            </div>
            <div>
              <label className="block text-agri-muted font-medium mb-1">Max Safe Humidity (%)</label>
              <input
                type="number"
                step="1"
                value={humidityMax}
                onChange={(e) => setHumidityMax(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-agri-border rounded-lg text-agri-text font-mono"
              />
            </div>
            <div>
              <label className="block text-agri-muted font-medium mb-1">Max Grain Moisture (%)</label>
              <input
                type="number"
                step="0.1"
                value={moistureMax}
                onChange={(e) => setMoistureMax(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-agri-border rounded-lg text-agri-text font-mono"
              />
            </div>
            <div>
              <label className="block text-agri-muted font-medium mb-1">Max CO2 Respiration (ppm)</label>
              <input
                type="number"
                step="50"
                value={co2Max}
                onChange={(e) => setCo2Max(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-agri-border rounded-lg text-agri-text font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sensor 1: Temperature */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs space-y-3 hover:border-agri-sage/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-agri-muted">Temperature</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-agri-text">
              {zone.temperature} <span className="text-base font-normal text-agri-muted">°C</span>
            </span>
            {getStatusBadge(tempStatus)}
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-agri-muted">
            <span>Normal: 20.0 – {tempMax.toFixed(1)} °C</span>
            <span className="flex items-center text-rose-600 font-semibold font-mono">
              <ArrowUp className="w-3 h-3" /> +1.4°C
            </span>
          </div>
          {/* Mini Sparkline */}
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.slice(-10)}>
                <Area type="monotone" dataKey="temperature" stroke="#EA580C" fill="#FFEDD5" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor 2: Humidity */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs space-y-3 hover:border-agri-sage/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-agri-muted">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-agri-text">
              {zone.humidity} <span className="text-base font-normal text-agri-muted">%</span>
            </span>
            {getStatusBadge(humStatus)}
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-agri-muted">
            <span>Normal: 45.0 – {humidityMax.toFixed(0)} %</span>
            <span className="flex items-center text-rose-600 font-semibold font-mono">
              <ArrowUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.slice(-10)}>
                <Area type="monotone" dataKey="humidity" stroke="#0284C7" fill="#E0F2FE" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor 3: Grain Moisture */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs space-y-3 hover:border-agri-sage/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-agri-muted">Grain Moisture</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-agri-text">
              {zone.moisture} <span className="text-base font-normal text-agri-muted">%</span>
            </span>
            {getStatusBadge(moistStatus)}
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-agri-muted">
            <span>Safe Limit: &lt; {moistureMax.toFixed(1)} %</span>
            <span className="flex items-center text-amber-600 font-semibold font-mono">
              <ArrowUp className="w-3 h-3" /> +0.6%
            </span>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.slice(-10)}>
                <Area type="monotone" dataKey="moisture" stroke="#4C8965" fill="#EAF3EE" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor 4: CO2 */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs space-y-3 hover:border-agri-sage/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-agri-muted">CO2 Concentration</span>
            <Wind className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-agri-text">
              {zone.co2} <span className="text-base font-normal text-agri-muted">ppm</span>
            </span>
            {getStatusBadge(co2Status)}
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-agri-muted">
            <span>Baseline: 400 – {co2Max.toFixed(0)} ppm</span>
            <span className="flex items-center text-rose-600 font-semibold font-mono">
              <ArrowUp className="w-3 h-3" /> +120 ppm
            </span>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.slice(-10)}>
                <Area type="monotone" dataKey="co2" stroke="#6366F1" fill="#EEF2FF" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Historical Chart Section */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-agri-text">
              Historical Telemetry Progression — {zone.name}
            </h2>
            <p className="text-[11px] text-agri-muted">
              Correlated multi-parameter trends over selected temporal resolution
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Filter Tabs */}
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
              {(['all', 'temperature', 'humidity', 'moisture', 'co2'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetricTab(m)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors ${
                    activeMetricTab === m ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Time Filter Tabs */}
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
              {(['1h', '6h', '24h', '7d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeRange === t ? 'bg-agri-forest text-white font-bold shadow-xs' : 'text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E3', borderRadius: '8px', fontSize: '12px' }}
              />

              {(activeMetricTab === 'all' || activeMetricTab === 'temperature') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#EA580C"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}

              {(activeMetricTab === 'all' || activeMetricTab === 'humidity') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  name="Relative Humidity (%)"
                  stroke="#0284C7"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}

              {(activeMetricTab === 'all' || activeMetricTab === 'moisture') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="moisture"
                  name="Grain Moisture (%)"
                  stroke="#4C8965"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}

              {(activeMetricTab === 'all' || activeMetricTab === 'co2') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="co2"
                  name="CO2 (ppm)"
                  stroke="#6366F1"
                  strokeWidth={2}
                  strokeDasharray={activeMetricTab === 'all' ? '4 4' : undefined}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Simulation Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100 text-xs text-agri-muted">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-orange-600 rounded-full" /> Temperature (°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-600 rounded-full" /> Humidity (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-600 rounded-full" /> Moisture (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-600 rounded-full border border-dashed border-indigo-400" /> CO2 (ppm, right axis)
            </span>
          </div>

          <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1 self-end sm:self-auto">
            <span>Sampling: 10s intervals</span>
            <span>•</span>
            <span>Last Packet: {lastSimulatedTick.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

