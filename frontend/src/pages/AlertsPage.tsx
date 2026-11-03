import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ChevronRight,
  X,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { Alert, AlertSeverity, AlertStatus } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, setSelectedUnitId, setSelectedZoneId } = useAgrivault();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'medium' | 'resolved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailModalAlert, setDetailModalAlert] = useState<Alert | null>(null);

  // Tab Filtering
  const filteredAlerts = alerts.filter((a) => {
    // Tab filter
    if (activeTab === 'critical' && a.severity !== 'Critical') return false;
    if (activeTab === 'high' && a.severity !== 'High') return false;
    if (activeTab === 'medium' && a.severity !== 'Medium') return false;
    if (activeTab === 'resolved' && a.status !== 'resolved') return false;
    if (activeTab !== 'resolved' && a.status === 'resolved' && activeTab !== 'all') return false;

    // Category filter
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.storage_unit_name.toLowerCase().includes(q) ||
        a.zone_id.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = Array.from(new Set(alerts.map((a) => a.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Alerts & Incident Response</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              {alerts.filter((a) => a.status === 'active').length} UNRESOLVED
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Operational alerts triggered by environmental threshold breaches and acoustic pest detections.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex flex-wrap items-center bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
          {(['all', 'critical', 'high', 'medium', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-agri-forest font-bold shadow-xs'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts by ID, title, zone, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest text-agri-text"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-agri-muted">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                alert.status === 'resolved'
                  ? 'border-gray-200 opacity-75'
                  : alert.severity === 'Critical'
                  ? 'border-red-200 hover:border-red-400'
                  : 'border-agri-border hover:border-agri-sage'
              }`}
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : alert.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : alert.severity === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <span className="font-mono text-xs font-bold text-gray-400">{alert.id}</span>
                  <span className="text-xs font-bold text-agri-text">{alert.title}</span>
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-50 border px-1.5 py-0.5 rounded">
                    {alert.category}
                  </span>
                </div>

                <p className="text-xs text-agri-muted leading-relaxed">{alert.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 font-mono pt-1">
                  <span>Facility: {alert.storage_unit_name}</span>
                  <span>•</span>
                  <span>Zone: {alert.zone_id}</span>
                  <span>•</span>
                  <span>Logged: {alert.timestamp}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setDetailModalAlert(alert)}
                  className="px-3 py-1.5 border border-agri-border rounded-lg text-xs font-semibold text-agri-text hover:bg-gray-50"
                >
                  Details
                </button>

                {alert.status === 'active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-agri-forest text-white hover:bg-agri-deep rounded-lg text-xs font-semibold"
                  >
                    Resolve
                  </button>
                )}

                {alert.status === 'resolved' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolved</span>
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-agri-border text-agri-muted text-xs">
            No alerts match the selected filter criteria.
          </div>
        )}
      </div>

      {/* Alert Detail & Incident Modal */}
      {detailModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-agri-border w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-agri-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 block">
                  {detailModalAlert.id} • {detailModalAlert.category}
                </span>
                <h2 className="text-base font-bold text-agri-text">{detailModalAlert.title}</h2>
              </div>
              <button
                onClick={() => setDetailModalAlert(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-agri-muted">Facility:</span>
                  <span className="font-bold text-agri-text">{detailModalAlert.storage_unit_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-muted">Zone ID:</span>
                  <span className="font-mono font-semibold text-agri-forest">{detailModalAlert.zone_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-muted">Severity:</span>
                  <span className="font-bold uppercase text-red-700">{detailModalAlert.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-muted">Logged Timestamp:</span>
                  <span className="font-mono text-gray-500">{detailModalAlert.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-muted">Status:</span>
                  <span className="capitalize font-semibold text-agri-text">{detailModalAlert.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-agri-text block mb-1">Diagnostic Incident Description:</span>
                <p className="text-agri-muted leading-relaxed bg-white p-3 rounded border border-gray-100">
                  {detailModalAlert.description}
                </p>
              </div>

              <div>
                <span className="font-bold text-agri-forest block mb-1">Recommended Response Protocol:</span>
                <p className="text-agri-text leading-relaxed bg-emerald-50/50 p-3 rounded border border-emerald-100">
                  {detailModalAlert.suggested_response}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-agri-border flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedUnitId(detailModalAlert.storage_unit_id);
                  setSelectedZoneId(detailModalAlert.zone_id);
                  setDetailModalAlert(null);
                  navigate('/interventions');
                }}
                className="text-xs text-agri-forest font-semibold flex items-center gap-1 hover:underline"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Log Operational Intervention</span>
              </button>

              <div className="flex items-center gap-2">
                {detailModalAlert.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      resolveAlert(detailModalAlert.id);
                      setDetailModalAlert(null);
                    }}
                    className="px-3.5 py-1.5 bg-agri-forest text-white rounded-lg text-xs font-semibold hover:bg-agri-deep"
                  >
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => setDetailModalAlert(null)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
