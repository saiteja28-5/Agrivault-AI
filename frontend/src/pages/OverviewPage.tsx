import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Warehouse,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Bug,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAgrivault } from '../context/AgrivaultContext';

export const OverviewPage: React.FC = () => {
  const {
    kpis,
    storageUnits,
    alerts,
    scenario,
    facility,
    setSelectedUnitId,
    acknowledgeAlert,
    lastSimulatedTick
  } = useAgrivault();

  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('7d');

  // Compute Doughnut Health Data
  const allZones = storageUnits.flatMap((u) => u.zones);
  const healthData = [
    { name: 'Healthy', value: allZones.filter((z) => z.health_status === 'healthy').length, color: '#4C8965' },
    { name: 'Warning', value: allZones.filter((z) => z.health_status === 'warning').length, color: '#D69A35' },
    { name: 'Critical', value: allZones.filter((z) => z.health_status === 'critical').length, color: '#C6534D' },
  ];

  // 7-day Risk Trend
  const trendData = [
    { day: 'Oct 28', risk: 36, targetLimit: 50 },
    { day: 'Oct 29', risk: 39, targetLimit: 50 },
    { day: 'Oct 30', risk: 42, targetLimit: 50 },
    { day: 'Oct 31', risk: 48, targetLimit: 50 },
    { day: 'Nov 01', risk: 53, targetLimit: 50 },
    { day: 'Nov 02', risk: 58, targetLimit: 50 },
    { day: 'Today', risk: kpis.average_storage_risk, targetLimit: 50 },
  ];

  const recentAlerts = alerts.slice(0, 5);

  const aiInsights = [
    {
      id: 'INS-1',
      title: 'Elevated Headspace Humidity in WH-001 (Center Stacks)',
      cause: 'Condensation gradient between floor duct and top stack; low cross-draft velocity during night cooling.',
      recommendation: 'Initiate auxiliary cross-ventilation blowers between 13:00 and 16:30 hrs to reduce relative humidity below 65%.',
      severity: 'high',
      unitId: 'WH-001',
    },
    {
      id: 'INS-2',
      title: 'Acoustic Stridulation Detected in Silo 01 Core',
      cause: 'INMP441 acoustic sensor recorded repeated 4.2 kHz frequency bursts matching Sitophilus oryzae (Rice Weevil) feeding patterns.',
      recommendation: 'Perform spear-probe core sampling in Middle Column Core and prepare localized modified atmosphere aeration.',
      severity: 'critical',
      unitId: 'SL-001',
    },
    {
      id: 'INS-3',
      title: 'CO2 Concentration Creep in Maize Silo 02',
      cause: 'CO2 concentration increased by 190 ppm over 12 hours (now 850 ppm), indicating early microbial respiration or kernel heating.',
      recommendation: 'Inspect lower plenum butterfly damper 3B and run head exhaust fan for 90 minutes.',
      severity: 'medium',
      unitId: 'SL-002',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-agri-border shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Storage Overview</h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest rounded">
              LIVE CONSOLE
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Monitor storage health, detect emerging risks and prevent post-harvest grain loss across facility zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Indicator */}
          <div className="text-xs bg-gray-50 border border-agri-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-agri-text">
            <Warehouse className="w-3.5 h-3.5 text-agri-forest" />
            <span className="font-semibold">{facility.name}</span>
          </div>

          {/* Date Filter */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                dateRange === 'today' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                dateRange === '7d' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                dateRange === '30d' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Timestamp */}
          <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-agri-border">
            <Clock className="w-3 h-3 text-agri-sage" />
            <span>Telemetry: {lastSimulatedTick.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">Storage Units</span>
            <Warehouse className="w-4 h-4 text-agri-forest" />
          </div>
          <div className="text-2xl font-bold text-agri-text">{kpis.total_storage_units}</div>
          <div className="flex items-center gap-1 text-[11px] text-agri-muted mt-2">
            <span className="font-mono text-gray-500">15 Zones Total</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">Grain Stored</span>
            <Scale className="w-4 h-4 text-agri-forest" />
          </div>
          <div className="text-2xl font-bold text-agri-text">
            {kpis.total_grain_stored_mt.toLocaleString()}{' '}
            <span className="text-xs font-normal text-agri-muted">MT</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            <span>81.5% Capacity</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">Healthy Zones</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800">{kpis.healthy_zones}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2">
            <span>Optimal envelope</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">At-Risk Zones</span>
            <AlertTriangle className="w-4 h-4 text-agri-amber" />
          </div>
          <div className="text-2xl font-bold text-agri-amber">{kpis.at_risk_zones}</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 mt-2">
            <span>Require ventilation</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">Pest Detections</span>
            <Bug className="w-4 h-4 text-agri-red" />
          </div>
          <div className="text-2xl font-bold text-agri-red">{kpis.active_pest_detections}</div>
          <div className="flex items-center gap-1 text-[11px] text-rose-700 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            <span>Acoustic triggers</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/60 transition-colors">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-medium">Average Risk</span>
            <Activity className="w-4 h-4 text-agri-forest" />
          </div>
          <div className={`text-2xl font-bold ${
            kpis.average_storage_risk > 60 ? 'text-agri-red' : kpis.average_storage_risk > 35 ? 'text-agri-amber' : 'text-emerald-700'
          }`}>
            {kpis.average_storage_risk}
            <span className="text-xs font-normal text-agri-muted"> / 100</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-agri-muted mt-2 font-mono">
            <span>Scale: 0–100</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Doughnut Health & 7-Day Risk Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-agri-text">Storage Health Overview</h2>
              <p className="text-[11px] text-agri-muted">Facility-wide zone condition distribution</p>
            </div>
            <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              15 Total
            </span>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Stat */}
            <div className="absolute text-center">
              <span className="text-2xl font-bold text-agri-text">{kpis.healthy_zones}</span>
              <span className="block text-[10px] text-agri-muted font-medium uppercase tracking-wider">
                Healthy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
            {healthData.map((item) => (
              <div key={item.name} className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-agri-text">{item.value} Zones</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-agri-text">Risk Trend Analysis (Last 7 Days)</h2>
              <p className="text-[11px] text-agri-muted">
                Multimodal storage risk trajectory vs. warning threshold
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                <span className="w-2.5 h-0.5 bg-agri-forest inline-block" /> Risk Index
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-600 font-mono">
                <span className="w-2.5 h-0.5 border-t border-dashed border-amber-500 inline-block" /> Safe Threshold (50)
              </span>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E3', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Facility Risk"
                  stroke="#244A38"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#244A38' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="targetLimit"
                  name="Threshold Limit"
                  stroke="#D69A35"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-agri-muted border-t border-gray-100">
            <span>Model: Multimodal XGBoost Ensemble</span>
            <span className="font-mono">Current 7-Day Velocity: +22 pts</span>
          </div>
        </div>
      </div>

      {/* Storage Unit Status Table */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-agri-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-agri-text">Storage Unit Status</h2>
            <p className="text-[11px] text-agri-muted">Condition and capacity summary of active storage facilities</p>
          </div>
          <button
            onClick={() => navigate('/storage-units')}
            className="text-xs text-agri-forest hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Fleet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-agri-border text-agri-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Storage ID</th>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">Grain Type</th>
                <th className="py-3 px-4">Capacity (MT)</th>
                <th className="py-3 px-4">Stored Quantity</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {storageUnits.map((u) => {
                const pct = Math.round((u.current_quantity_mt / u.capacity_mt) * 100);
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-agri-text">{u.id}</td>
                    <td className="py-3 px-4 font-medium text-agri-text">{u.name}</td>
                    <td className="py-3 px-4 text-agri-muted">{u.grain_type}</td>
                    <td className="py-3 px-4 font-mono">{u.capacity_mt.toLocaleString()} MT</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{u.current_quantity_mt.toLocaleString()} MT</span>
                        <span className="text-[10px] text-gray-400">({pct}%)</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span className={`w-2 h-2 rounded-full ${
                          u.risk_score > 60 ? 'bg-agri-red' : u.risk_score > 35 ? 'bg-agri-amber' : 'bg-agri-green'
                        }`} />
                        <span>{u.risk_score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.health_status === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                        u.health_status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.health_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUnitId(u.id);
                          navigate('/storage-units');
                        }}
                        className="text-xs text-agri-forest hover:text-agri-deep font-semibold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Recent Alerts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-agri-text">Recent Alerts & Triggers</h2>
              <p className="text-[11px] text-agri-muted">Latest anomalies detected across sensor networks</p>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs text-agri-forest font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage ({alerts.length})</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-gray-100 hover:border-agri-border bg-gray-50/50 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-semibold text-agri-text">{alert.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{alert.timestamp}</span>
                </div>
                <p className="text-[11px] text-agri-muted mb-2 line-clamp-2">{alert.description}</p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200/60">
                  <span className="font-mono text-gray-500">{alert.storage_unit_name} • {alert.zone_id}</span>
                  {alert.status === 'active' ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-agri-forest hover:text-agri-deep font-semibold"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-gray-400 capitalize font-medium">{alert.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-agri-forest" />
              <div>
                <h2 className="text-sm font-bold text-agri-text">AI Diagnostic Insights</h2>
                <p className="text-[11px] text-agri-muted">Causal inference and recommended prevention</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
              3 Active
            </span>
          </div>

          <div className="space-y-3.5">
            {aiInsights.map((ins) => (
              <div
                key={ins.id}
                className="p-3.5 rounded-lg border border-agri-border bg-white shadow-2xs space-y-2 hover:border-agri-sage transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-agri-text">{ins.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ins.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    ins.severity === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ins.severity}
                  </span>
                </div>

                <div className="text-[11px] bg-gray-50 p-2 rounded border border-gray-100 space-y-1">
                  <div>
                    <span className="font-semibold text-agri-text">Suspected Cause: </span>
                    <span className="text-agri-muted">{ins.cause}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-agri-forest">Recommended Action: </span>
                    <span className="text-agri-text">{ins.recommendation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-gray-400 font-mono">{ins.unitId}</span>
                  <button
                    onClick={() => {
                      setSelectedUnitId(ins.unitId);
                      navigate('/recommendations');
                    }}
                    className="text-agri-forest hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Prevention Task</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

