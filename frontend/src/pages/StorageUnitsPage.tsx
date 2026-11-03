import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Warehouse,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  X,
  Scale,
  Thermometer,
  Droplets,
  Activity,
  Bug,
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { StorageUnit, StorageZone, HealthStatus } from '../types';

export const StorageUnitsPage: React.FC = () => {
  const { storageUnits, addStorageUnit, setSelectedUnitId, setSelectedZoneId, alerts } = useAgrivault();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [grainFilter, setGrainFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [inspectUnit, setInspectUnit] = useState<StorageUnit | null>(null);

  // Form State for Add Unit
  const [newName, setNewName] = useState<string>('');
  const [newGrainType, setNewGrainType] = useState<string>('Wheat (Durum)');
  const [newCapacity, setNewCapacity] = useState<number>(3000);
  const [newQuantity, setNewQuantity] = useState<number>(2400);

  // Filtered list
  const filteredUnits = storageUnits.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.grain_type.toLowerCase().includes(search.toLowerCase());
    const matchesGrain = grainFilter === 'All' || u.grain_type.toLowerCase().includes(grainFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.health_status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesGrain && matchesStatus;
  });

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addStorageUnit({
      name: newName,
      grain_type: newGrainType,
      capacity_mt: Number(newCapacity),
      current_quantity_mt: Number(newQuantity),
      zone_count: 3,
      health_status: 'healthy',
      risk_score: 22,
    });

    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-agri-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-agri-text">Storage Unit Fleet</h1>
          <p className="text-xs text-agri-muted mt-0.5">
            Manage bulk warehouses and grain silos across Deccan Agro Storage Complex.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-agri-forest hover:bg-agri-deep text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Storage Unit</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name or grain type..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest text-agri-text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grain Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-agri-muted">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={grainFilter}
              onChange={(e) => setGrainFilter(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
            >
              <option value="All">All Grains</option>
              <option value="Wheat">Wheat</option>
              <option value="Paddy">Paddy / Rice</option>
              <option value="Maize">Maize</option>
              <option value="Barley">Barley / Pulses</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-agri-muted">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-agri-border text-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-agri-forest shadow-xs' : 'hover:text-black'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-agri-forest shadow-xs' : 'hover:text-black'}`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUnits.map((unit) => {
            const fillPct = Math.round((unit.current_quantity_mt / unit.capacity_mt) * 100);
            return (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-agri-border shadow-2xs hover:border-agri-sage/80 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-400 tracking-wider">
                        {unit.id}
                      </span>
                      <h3 className="text-base font-bold text-agri-text group-hover:text-agri-forest transition-colors">
                        {unit.name}
                      </h3>
                      <p className="text-xs text-agri-muted">{unit.grain_type}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        unit.health_status === 'healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : unit.health_status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {unit.health_status}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-agri-muted">Fill Level: {fillPct}%</span>
                      <span className="font-bold text-agri-text">
                        {unit.current_quantity_mt.toLocaleString()} / {unit.capacity_mt.toLocaleString()} MT
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-agri-forest transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Zones & Risk Index */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-agri-muted block">Monitoring Zones</span>
                      <span className="font-bold text-agri-text">{unit.zone_count} Active Zones</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-agri-muted block">Multimodal Risk</span>
                      <span
                        className={`font-bold font-mono ${
                          unit.risk_score > 60
                            ? 'text-agri-red'
                            : unit.risk_score > 35
                            ? 'text-agri-amber'
                            : 'text-emerald-700'
                        }`}
                      >
                        {unit.risk_score} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Updated {unit.last_updated}
                  </span>
                  <button
                    onClick={() => setInspectUnit(unit)}
                    className="font-semibold text-agri-forest hover:text-agri-deep flex items-center gap-1"
                  >
                    <span>Inspect Unit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-agri-border text-agri-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Storage ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Grain Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Quantity Stored</th>
                <th className="py-3 px-4">Zones</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-agri-text">{unit.id}</td>
                  <td className="py-3 px-4 font-semibold text-agri-text">{unit.name}</td>
                  <td className="py-3 px-4 text-agri-muted">{unit.grain_type}</td>
                  <td className="py-3 px-4 font-mono">{unit.capacity_mt.toLocaleString()} MT</td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {unit.current_quantity_mt.toLocaleString()} MT
                  </td>
                  <td className="py-3 px-4">{unit.zone_count} Zones</td>
                  <td className="py-3 px-4 font-mono font-bold">{unit.risk_score}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        unit.health_status === 'healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : unit.health_status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {unit.health_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectUnit(unit)}
                      className="font-semibold text-agri-forest hover:text-agri-deep"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unit Detail / Inspection Drawer Modal */}
      {inspectUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-agri-border w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-agri-border flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {inspectUnit.id}
                  </span>
                  <h2 className="text-lg font-bold text-agri-text">{inspectUnit.name}</h2>
                </div>
                <p className="text-xs text-agri-muted mt-0.5">
                  Grain Type: {inspectUnit.grain_type} • Total Capacity: {inspectUnit.capacity_mt.toLocaleString()} MT
                </p>
              </div>
              <button
                onClick={() => setInspectUnit(null)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Individual Zones Section */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider mb-3">
                  Sub-Divided Storage Zones ({inspectUnit.zones.length})
                </h3>
                <div className="space-y-3">
                  {inspectUnit.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-4 rounded-xl border border-agri-border bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-agri-text">{zone.name}</span>
                          <span className="font-mono text-[10px] text-gray-400 ml-2">[{zone.id}]</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            zone.health_status === 'healthy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : zone.health_status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {zone.health_status} • Risk {zone.risk_score}
                        </span>
                      </div>

                      {/* Sensor telemetry readings */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-agri-muted block">Temperature</span>
                          <span className="font-bold font-mono text-agri-text">{zone.temperature} °C</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-agri-muted block">Humidity (RH)</span>
                          <span className="font-bold font-mono text-agri-text">{zone.humidity} %</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-agri-muted block">Grain Moisture</span>
                          <span className="font-bold font-mono text-agri-text">{zone.moisture} %</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                          <span className="text-[10px] text-agri-muted block">CO2 Respiration</span>
                          <span className="font-bold font-mono text-agri-text">{zone.co2} ppm</span>
                        </div>
                      </div>

                      {/* Pest status and Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                        <div className="flex items-center gap-1.5">
                          {zone.pest_detected ? (
                            <span className="text-red-700 font-semibold flex items-center gap-1 text-[11px]">
                              <Bug className="w-3.5 h-3.5" />
                              <span>{zone.pest_type} ({Math.round((zone.pest_probability || 0) * 100)}% prob)</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>No acoustic pest signals</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedUnitId(inspectUnit.id);
                            setSelectedZoneId(zone.id);
                            setInspectUnit(null);
                            navigate('/monitoring');
                          }}
                          className="text-xs text-agri-forest font-semibold hover:underline self-end sm:self-auto"
                        >
                          View Live Telemetry →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Alerts */}
              <div>
                <h3 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider mb-2">
                  Unit Active Incidents
                </h3>
                {alerts.filter((a) => a.storage_unit_id === inspectUnit.id).length > 0 ? (
                  <div className="space-y-2">
                    {alerts
                      .filter((a) => a.storage_unit_id === inspectUnit.id)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="p-3 bg-red-50/50 border border-red-200/60 rounded-lg flex items-start justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-red-900">{a.title}</span>
                            <p className="text-[11px] text-red-700 mt-0.5">{a.description}</p>
                          </div>
                          <span className="text-[10px] font-mono text-red-600 font-bold uppercase">
                            {a.severity}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-agri-muted bg-gray-50 p-3 rounded-lg border border-gray-100">
                    No open alerts logged for this storage facility.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-agri-border flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectUnit(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedUnitId(inspectUnit.id);
                  setInspectUnit(null);
                  navigate('/hotspot-map');
                }}
                className="px-4 py-2 bg-agri-forest text-white rounded-lg text-xs font-semibold hover:bg-agri-deep"
              >
                Locate on Hotspot Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Storage Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-agri-border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-agri-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-agri-text">Add New Storage Unit</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-agri-text mb-1">Storage Unit Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Eastern Grain Shed 04"
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-agri-text mb-1">Grain Variety</label>
                <select
                  value={newGrainType}
                  onChange={(e) => setNewGrainType(e.target.value)}
                  className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest bg-white"
                >
                  <option value="Wheat (Durum)">Wheat (Durum)</option>
                  <option value="Wheat (Sharbati Premium)">Wheat (Sharbati Premium)</option>
                  <option value="Paddy (Sona Masoori)">Paddy (Sona Masoori)</option>
                  <option value="Yellow Maize (Feed Grade)">Yellow Maize (Feed Grade)</option>
                  <option value="Barley & Pulses">Barley & Pulses</option>
                  <option value="Soybeans (Standard)">Soybeans (Standard)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-agri-text mb-1">Capacity (MT)</label>
                  <input
                    type="number"
                    min="100"
                    max="20000"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-agri-text mb-1">Current Stored (MT)</label>
                  <input
                    type="number"
                    min="0"
                    max={newCapacity}
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
                <p className="font-semibold">Demo Fleet Initialization</p>
                <p className="mt-0.5">
                  Adding this unit automatically provisions 3 virtual zones equipped with simulated acoustic and environmental sensor streams.
                </p>
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
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

