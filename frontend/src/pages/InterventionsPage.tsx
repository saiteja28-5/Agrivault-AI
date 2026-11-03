import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  X,
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { Intervention, InterventionStatus } from '../types';

export const InterventionsPage: React.FC = () => {
  const { interventions, addIntervention, storageUnits, alerts } = useAgrivault();

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [unitId, setUnitId] = useState<string>(storageUnits[0]?.id || 'WH-001');
  const [zoneId, setZoneId] = useState<string>(storageUnits[0]?.zones[0]?.id || 'WH-001-Z1');
  const [relatedAlertId, setRelatedAlertId] = useState<string>('none');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [assignedOperator, setAssignedOperator] = useState<string>('Ramesh Kumar (Lead Warehouse Engineer)');
  const [notes, setNotes] = useState<string>('');

  const currentUnit = storageUnits.find((u) => u.id === unitId) || storageUnits[0];

  const filteredInterventions = interventions.filter((intv) => {
    if (statusFilter !== 'all' && intv.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        intv.id.toLowerCase().includes(q) ||
        intv.storage_unit_name.toLowerCase().includes(q) ||
        intv.action_taken.toLowerCase().includes(q) ||
        intv.assigned_operator.toLowerCase().includes(q) ||
        intv.zone_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTaken.trim()) return;

    addIntervention({
      storage_unit_id: unitId,
      storage_unit_name: currentUnit.name,
      zone_id: zoneId,
      related_alert_id: relatedAlertId === 'none' ? null : relatedAlertId,
      action_taken: actionTaken,
      assigned_operator: assignedOperator,
      completion_date: null,
      status: 'in_progress',
      notes: notes || 'Operator dispatched via Agrivault AI Console',
    });

    setActionTaken('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Operational Intervention Tracking</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              {interventions.filter((i) => i.status === 'in_progress').length} IN PROGRESS
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Log, assign and audit manual and automated engineering actions taken to remediate storage risks.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-agri-forest hover:bg-agri-deep text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Intervention</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interventions by ID, operator, action..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest text-agri-text"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-agri-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
          >
            <option value="all">All Interventions</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Interventions Table */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-agri-border text-agri-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Intervention ID</th>
                <th className="py-3 px-4">Storage Unit</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Related Alert</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Assigned Operator</th>
                <th className="py-3 px-4">Logged Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInterventions.map((intv) => (
                <tr key={intv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-agri-text">{intv.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-agri-text">{intv.storage_unit_name}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">{intv.zone_id}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {intv.related_alert_id ? (
                      <span className="text-agri-forest font-semibold">{intv.related_alert_id}</span>
                    ) : (
                      <span className="text-gray-400">Routine Action</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-agri-text font-medium leading-snug">{intv.action_taken}</p>
                    {intv.notes && <p className="text-[11px] text-gray-400 mt-0.5">{intv.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-agri-muted font-medium">{intv.assigned_operator}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {intv.start_date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        intv.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {intv.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Timeline Section */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-agri-text">Operational Audit Timeline</h2>
          <p className="text-[11px] text-agri-muted">Chronological record of recent warehouse operator activities</p>
        </div>

        <div className="relative border-l-2 border-agri-border ml-3 space-y-6 pt-2">
          {interventions.slice(0, 5).map((intv) => (
            <div key={`timeline-${intv.id}`} className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-agri-forest border-2 border-white" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-bold text-agri-text">{intv.action_taken}</span>
                <span className="font-mono text-[11px] text-gray-400">{intv.start_date}</span>
              </div>
              <p className="text-[11px] text-agri-muted mt-0.5">
                Operator: <span className="text-agri-text font-medium">{intv.assigned_operator}</span> •{' '}
                {intv.storage_unit_name} ({intv.zone_id})
              </p>
              {intv.notes && (
                <p className="text-[11px] italic text-gray-500 bg-gray-50 p-2 rounded mt-1 border border-gray-100">
                  Notes: {intv.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Intervention Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-agri-border w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-agri-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-agri-text">Log Operator Intervention</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-agri-text mb-1">Storage Unit</label>
                  <select
                    value={unitId}
                    onChange={(e) => {
                      setUnitId(e.target.value);
                      const target = storageUnits.find((u) => u.id === e.target.value);
                      if (target && target.zones.length > 0) {
                        setZoneId(target.zones[0].id);
                      }
                    }}
                    className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest bg-white"
                  >
                    {storageUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.id} - {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-agri-text mb-1">Target Zone</label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest bg-white"
                  >
                    {currentUnit.zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-agri-text mb-1">Link to Active Alert</label>
                <select
                  value={relatedAlertId}
                  onChange={(e) => setRelatedAlertId(e.target.value)}
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest bg-white"
                >
                  <option value="none">None (Routine Maintenance)</option>
                  {alerts
                    .filter((a) => a.status !== 'resolved')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id}: {a.title} ({a.storage_unit_id})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-agri-text mb-1">Remediation Action Taken</label>
                <textarea
                  required
                  rows={3}
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g. Engaged mobile dehumidifier unit DH-04 in central aisle and cleared air louver grates."
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-agri-text mb-1">Assigned Lead Operator</label>
                <select
                  value={assignedOperator}
                  onChange={(e) => setAssignedOperator(e.target.value)}
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest bg-white"
                >
                  <option value="Ramesh Kumar (Lead Warehouse Engineer)">Ramesh Kumar (Lead Warehouse Engineer)</option>
                  <option value="Suresh Reddy (Facility Technician)">Suresh Reddy (Facility Technician)</option>
                  <option value="Priya Nair (Quality Control Officer)">Priya Nair (Quality Control Officer)</option>
                  <option value="Vikram Patel (Facilities Crew)">Vikram Patel (Facilities Crew)</option>
                  <option value="Anil Sharma (Maintenance Specialist)">Anil Sharma (Maintenance Specialist)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-agri-text mb-1">Operational Observations / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Initial moisture dropped by 0.3% after 15 min."
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-agri-forest text-white rounded-lg font-semibold hover:bg-agri-deep shadow-xs"
                >
                  Log & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

