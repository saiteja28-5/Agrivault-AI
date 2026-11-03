import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Scale,
  ShieldCheck,
  Bug,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAgrivault } from '../context/AgrivaultContext';

export const ReportsPage: React.FC = () => {
  const { kpis, storageUnits, alerts, pestDetections, interventions, facility, scenario } = useAgrivault();

  const [reportType, setReportType] = useState<'comprehensive' | 'environmental' | 'pest' | 'compliance'>('comprehensive');
  const [dateFilter, setDateFilter] = useState<'30d' | '90d' | 'year'>('30d');

  // Chart data for risk distribution across units
  const unitRiskData = storageUnits.map((u) => ({
    name: u.id,
    fullName: u.name,
    risk: u.risk_score,
    capacity: u.capacity_mt,
    stored: u.current_quantity_mt,
  }));

  // Alert frequency by category
  const alertCategories = Array.from(new Set(alerts.map((a) => a.category)));
  const alertFrequencyData = alertCategories.map((cat) => ({
    category: cat,
    count: alerts.filter((a) => a.category === cat).length,
  }));

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = [
      'Facility',
      'Storage_ID',
      'Storage_Name',
      'Grain_Type',
      'Zone_ID',
      'Zone_Name',
      'Temperature_C',
      'Humidity_Pct',
      'Grain_Moisture_Pct',
      'CO2_ppm',
      'Risk_Score',
      'Health_Status',
      'Pest_Detected',
      'Pest_Type',
    ];

    const rows: string[] = [];
    rows.push(headers.join(','));

    storageUnits.forEach((u) => {
      u.zones.forEach((z) => {
        const row = [
          `"${facility.name}"`,
          `"${u.id}"`,
          `"${u.name}"`,
          `"${z.grain_type}"`,
          `"${z.id}"`,
          `"${z.name}"`,
          z.temperature,
          z.humidity,
          z.moisture,
          z.co2,
          z.risk_score,
          `"${z.health_status}"`,
          z.pest_detected,
          `"${z.pest_type || 'None'}"`,
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Agrivault_Storage_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Reports & Facility Analytics</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              AUDIT READY
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Export official storage condition certificates, loss prevention audits and environmental records.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-agri-border bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-agri-text transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-agri-forest" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-agri-forest hover:bg-agri-deep text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
          {(['comprehensive', 'environmental', 'pest', 'compliance'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setReportType(t)}
              className={`px-3 py-1 rounded capitalize transition-all ${
                reportType === t ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              {t} Report
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-agri-muted">Historical Span:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1 text-xs text-agri-text outline-hidden"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90 Days)</option>
            <option value="year">Harvest Season 2026</option>
          </select>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-6 space-y-6">
        {/* Formal Header Banner */}
        <div className="border-b-2 border-agri-forest pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-agri-forest tracking-wider">
                AGRIVAULT AI
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                Post-Harvest Loss Prevention Report
              </span>
            </div>
            <h2 className="text-lg font-bold text-agri-text mt-1">{facility.name}</h2>
            <p className="text-xs text-agri-muted">{facility.location} • Operational Fleet Assessment</p>
          </div>

          <div className="text-right text-xs font-mono text-agri-muted">
            <span className="block font-bold text-agri-text">REF: AGRI-AUD-2026-1103</span>
            <span>Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-[10px] text-agri-muted block">Total Grain In Storage</span>
            <span className="text-lg font-bold text-agri-text">
              {kpis.total_grain_stored_mt.toLocaleString()} MT
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">81.5% Capacity</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-[10px] text-agri-muted block">Facility Health Index</span>
            <span className="text-lg font-bold text-emerald-700">
              {Math.round((kpis.healthy_zones / 15) * 100)}% Optimal
            </span>
            <span className="text-[10px] text-agri-muted block mt-0.5">
              {kpis.healthy_zones} of 15 zones compliant
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-[10px] text-agri-muted block">Active Bio-Acoustic Pests</span>
            <span className="text-lg font-bold text-rose-700">
              {kpis.active_pest_detections} Zones
            </span>
            <span className="text-[10px] text-agri-muted block mt-0.5">Targeted species identified</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-[10px] text-agri-muted block">Engineering Interventions</span>
            <span className="text-lg font-bold text-agri-forest">
              {interventions.length} Logged
            </span>
            <span className="text-[10px] text-agri-muted block mt-0.5">100% audited trail</span>
          </div>
        </div>

        {/* Comparative Charts: Risk Distribution & Alert Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Risk by Storage Unit */}
          <div className="border border-agri-border rounded-xl p-4 bg-gray-50/50">
            <h3 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider mb-2">
              Unit-Wise Multimodal Risk Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E3', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="risk" name="Risk Score" fill="#244A38" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alert Frequency by Category */}
          <div className="border border-agri-border rounded-xl p-4 bg-gray-50/50">
            <h3 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider mb-2">
              Incident Frequency by Category
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertFrequencyData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#78817B' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#78817B' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E3', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Incidents" fill="#829B82" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Storage Inventory Table */}
        <div>
          <h3 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider mb-3">
            Facility Inventory & Health Breakdown
          </h3>
          <div className="border border-agri-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-agri-border text-agri-muted uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Storage ID</th>
                  <th className="py-2.5 px-3">Facility Name</th>
                  <th className="py-2.5 px-3">Grain Type</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Stored</th>
                  <th className="py-2.5 px-3">Risk Index</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {storageUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-agri-text">{u.id}</td>
                    <td className="py-2.5 px-3 font-medium">{u.name}</td>
                    <td className="py-2.5 px-3 text-agri-muted">{u.grain_type}</td>
                    <td className="py-2.5 px-3 font-mono">{u.capacity_mt.toLocaleString()} MT</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {u.current_quantity_mt.toLocaleString()} MT
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">{u.risk_score}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold">
                      <span
                        className={
                          u.health_status === 'healthy'
                            ? 'text-emerald-700'
                            : u.health_status === 'warning'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }
                      >
                        {u.health_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formal Report Sign-Off Footer */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-agri-muted gap-4">
          <div>
            <p className="font-semibold text-agri-text">Prepared By: Lead Storage Quality Assurance</p>
            <p className="text-[11px]">Deccan Agro Storage Complex • Tel: +91 40 2345 6789</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px]">Document Security Hash: 0x89F4E7A2B0</p>
            <p className="text-[10px] text-gray-400">Agrivault AI Multimodal Engine v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

