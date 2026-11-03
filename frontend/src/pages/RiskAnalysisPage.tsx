import React, { useState } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Sliders,
  HelpCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  Info,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useAgrivault } from '../context/AgrivaultContext';
import { RiskLevel } from '../types';

export const RiskAnalysisPage: React.FC = () => {
  const { kpis, storageUnits, setSelectedUnitId, setSelectedZoneId } = useAgrivault();

  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');

  // 24-hour predictive risk projection
  const projection24h = [
    { hour: 'Now', risk: kpis.average_storage_risk, status: 'baseline' },
    { hour: '+4h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 4)), status: 'projected' },
    { hour: '+8h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 9)), status: 'projected' },
    { hour: '+12h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 14)), status: 'projected' },
    { hour: '+16h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 18)), status: 'projected' },
    { hour: '+20h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 22)), status: 'projected' },
    { hour: '+24h', risk: Math.min(100, Math.round(kpis.average_storage_risk + 25)), status: 'projected' },
  ];

  // Simulated SHAP feature contributions (TreeSHAP horizontal bar chart)
  const shapFeatures = [
    { feature: 'Relative Humidity (>68% threshold)', impact: +24.5, type: 'risk_push', value: '72.8% RH' },
    { feature: 'Grain Moisture Creep (>14.0%)', impact: +21.2, type: 'risk_push', value: '14.9%' },
    { feature: 'Acoustic Insect Stridulation', impact: +18.8, type: 'risk_push', value: '0.86 prob' },
    { feature: 'Grain Core Temperature (>30°C)', impact: +14.0, type: 'risk_push', value: '32.1°C' },
    { feature: 'CO2 Concentration (>800 ppm)', impact: +11.4, type: 'risk_push', value: '980 ppm' },
    { feature: 'Historical Zone Hotspot Recurrence', impact: +5.2, type: 'risk_push', value: '3 occurrences / 30d' },
    { feature: 'Active Aeration Damper Response', impact: -8.1, type: 'risk_pull', value: 'Active 100%' },
    { feature: 'Concrete Floor Moisture Barrier Integrity', impact: -4.5, type: 'risk_pull', value: 'Intact' },
  ];

  // Flatten all zones for analysis table
  const allZones = storageUnits.flatMap((u) =>
    u.zones.map((z) => {
      let riskLevel: RiskLevel = 'Low';
      if (z.risk_score > 80) riskLevel = 'Critical';
      else if (z.risk_score > 60) riskLevel = 'High';
      else if (z.risk_score > 30) riskLevel = 'Moderate';

      let mainFactor = 'Optimal parameters';
      if (z.pest_detected) mainFactor = `Insect Activity: ${z.pest_type?.split('(')[0]}`;
      else if (z.humidity > 68) mainFactor = `High Humidity (${z.humidity}%)`;
      else if (z.temperature > 30) mainFactor = `Elevated Temperature (${z.temperature}°C)`;
      else if (z.co2 > 800) mainFactor = `Respiration CO2 (${z.co2} ppm)`;

      return {
        unitId: u.id,
        unitName: u.name,
        zoneId: z.id,
        zoneName: z.name,
        grainType: z.grain_type,
        riskScore: z.risk_score,
        riskLevel,
        mainFactor,
        action: z.recommended_action,
      };
    })
  );

  const filteredZones = allZones.filter(
    (z) => selectedUnitFilter === 'all' || z.unitId === selectedUnitFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Multimodal Risk Analysis & SHAP</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              XGBOOST + TREESHAP
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Probabilistic storage deterioration modeling combining sensor telemetry, bio-acoustics and historical factors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Demonstration mode: Simulated SHAP feature attributions and XGBoost risk outputs for academic presentation.
          </span>
        </div>
      </div>

      {/* Top Cards: Classification Scale & Overall Facility Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Facility Gauge Card */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-agri-muted block mb-1">
              Overall Facility Risk Index
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-extrabold font-mono ${
                  kpis.average_storage_risk > 60
                    ? 'text-agri-red'
                    : kpis.average_storage_risk > 35
                    ? 'text-agri-amber'
                    : 'text-emerald-700'
                }`}
              >
                {kpis.average_storage_risk}
              </span>
              <span className="text-xs font-normal text-agri-muted">/ 100</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-agri-muted">Risk Category:</span>
              <span className="font-bold text-agri-text">
                {kpis.average_storage_risk > 60 ? 'HIGH' : kpis.average_storage_risk > 30 ? 'MODERATE' : 'LOW'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: '30%' }} />
              <div className="h-full bg-amber-400" style={{ width: '30%' }} />
              <div className="h-full bg-orange-500" style={{ width: '20%' }} />
              <div className="h-full bg-rose-600" style={{ width: '20%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>0 Low</span>
              <span>30 Mod</span>
              <span>60 High</span>
              <span>100 Crit</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Projected Risk Progression */}
        <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs lg:col-span-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-agri-text">24-Hour Risk Projection (Without Intervention)</h2>
              <p className="text-[11px] text-agri-muted">
                Modeled trajectory if ventilation blowers and aeration remain unchanged
              </p>
            </div>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">
              +25 pts Projected Increase
            </span>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection24h} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6534D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6534D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E3" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E3', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#C6534D" strokeWidth={2.5} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-agri-muted">
            <span>Model: Autoregressive XGBoost Predictor</span>
            <span className="font-mono text-agri-forest font-semibold">Immediate Aeration Action Recommended</span>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Panel */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-agri-forest" />
              <h2 className="text-sm font-bold text-agri-text">
                Simulated SHAP Explainability (TreeSHAP Attributions)
              </h2>
            </div>
            <p className="text-[11px] text-agri-muted">
              Quantified impact of individual environmental and bio-acoustic variables on elevated risk predictions
            </p>
          </div>
          <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
            Target: Zone A2 (WH-001) Risk = 74
          </span>
        </div>

        {/* Horizontal Contribution Bars */}
        <div className="space-y-3 pt-1">
          {shapFeatures.map((item, index) => {
            const isPush = item.type === 'risk_push';
            const widthPct = Math.min(100, Math.abs(item.impact) * 3.5);

            return (
              <div key={index} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-agri-text">{item.feature}</span>
                    <span className="font-mono text-[10px] text-gray-400">[{item.value}]</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      isPush ? 'text-agri-red' : 'text-emerald-700'
                    }`}
                  >
                    {item.impact > 0 ? `+${item.impact}` : item.impact} SHAP value
                  </span>
                </div>

                {/* Contribution bar */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex items-center">
                  {isPush ? (
                    <div
                      className="h-full bg-agri-red rounded-full transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  ) : (
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-agri-muted gap-2">
          <span>
            Red bars push risk upward (vulnerabilities); Green bars pull risk downward (protective factors).
          </span>
          <span className="font-mono font-semibold text-agri-text">
            Baseline Base Value (E[f(x)]): 32.0
          </span>
        </div>
      </div>

      {/* Risk Analysis Table */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-agri-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-agri-text">Zone-by-Zone Risk Attribution Table</h2>
            <p className="text-[11px] text-agri-muted">Detailed contributing factor and prescribed action per zone</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-agri-muted">Filter Storage:</span>
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1 text-xs text-agri-text outline-hidden"
            >
              <option value="all">All Storage Units</option>
              {storageUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} - {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-agri-border text-agri-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Storage ID</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Grain</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Main Contributing Factor</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredZones.map((z) => (
                <tr key={`${z.unitId}-${z.zoneId}`} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-agri-text">{z.unitId}</td>
                  <td className="py-3 px-4 font-semibold text-agri-text">{z.zoneName}</td>
                  <td className="py-3 px-4 text-agri-muted">{z.grainType}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        z.riskScore > 80
                          ? 'bg-red-100 text-red-800'
                          : z.riskScore > 60
                          ? 'bg-amber-100 text-amber-800'
                          : z.riskScore > 30
                          ? 'bg-yellow-50 text-yellow-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {z.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold">{z.riskLevel}</span>
                  </td>
                  <td className="py-3 px-4 text-agri-text font-medium">{z.mainFactor}</td>
                  <td className="py-3 px-4 text-agri-muted text-[11px] max-w-xs">{z.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

