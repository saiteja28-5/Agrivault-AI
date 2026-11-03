import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  X
} from 'lucide-react';
import { useAgrivault } from '../../context/AgrivaultContext';
import { DemoScenario } from '../../types';

interface NavbarProps {
  collapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  const {
    scenario,
    setScenario,
    alerts,
    storageUnits,
    setSelectedUnitId,
    setSelectedZoneId,
    facility
  } = useAgrivault();

  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute page title & breadcrumbs
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Executive Storage Overview', section: 'Dashboard' };
      case '/storage-units':
        return { title: 'Storage Unit Fleet Management', section: 'Facilities' };
      case '/monitoring':
        return { title: 'Live Environmental Sensor Telemetry', section: 'Intelligence' };
      case '/pest-detection':
        return { title: 'Acoustic Pest Intelligence & Bio-Acoustics', section: 'Intelligence' };
      case '/risk-analysis':
        return { title: 'Predictive Risk & Explainability (SHAP)', section: 'Analytics' };
      case '/hotspot-map':
        return { title: 'Spatial Warehouse Hotspot Map', section: 'Facilities' };
      case '/alerts':
        return { title: 'Alerts & Incident Response', section: 'Operations' };
      case '/recommendations':
        return { title: 'Preventive Action Recommendations', section: 'Operations' };
      case '/interventions':
        return { title: 'Operational Intervention Tracking', section: 'Operations' };
      case '/reports':
        return { title: 'Reporting & Export Analytics', section: 'Analytics' };
      default:
        return { title: 'Agrivault AI Console', section: 'Platform' };
    }
  };

  const meta = getPageMeta();
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  const scenarioDescriptions: Record<DemoScenario, { label: string; icon: any; color: string }> = {
    normal: { label: '1. Normal Storage Conditions', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    humidity: { label: '2. Rising Humidity Incident', icon: AlertTriangle, color: 'text-amber-700 bg-amber-50 border-amber-300' },
    pest: { label: '3. Suspected Pest Activity', icon: Sparkles, color: 'text-rose-700 bg-rose-50 border-rose-300' },
    critical: { label: '4. Critical Compound Risk', icon: Flame, color: 'text-red-700 bg-red-100 border-red-400' },
  };

  // Search Results
  const filteredUnits = storageUnits.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.grain_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredZones = storageUnits.flatMap((u) => u.zones).filter((z) =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (z.pest_type && z.pest_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-agri-border transition-all duration-300 ease-in-out px-4 flex items-center justify-between ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-agri-muted">
          <span>{facility.name}</span>
          <span>/</span>
          <span>{meta.section}</span>
          <span>/</span>
          <span className="text-agri-forest font-semibold">{meta.title}</span>
        </div>
        <h1 className="text-sm font-bold text-agri-text truncate">{meta.title}</h1>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-3">
        {/* Transparent Demo Indicator Banner */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-semibold tracking-tight">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>DEMO ENVIRONMENT | SIMULATED DATA</span>
        </div>

        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-agri-border bg-gray-50 hover:bg-gray-100 text-agri-muted text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <span className="hidden sm:inline">Search units, zones, pests...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-white border border-gray-300 rounded shadow-xs">
            /
          </kbd>
        </button>

        {/* Scenario Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-all ${
              scenarioDescriptions[scenario].color
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Scenario:</span>
            <span className="truncate max-w-[150px]">{scenarioDescriptions[scenario].label.split('. ')[1]}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showScenarioMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-agri-border py-2 z-50">
              <div className="px-3 py-1.5 border-b border-gray-100">
                <p className="text-[10px] font-mono uppercase tracking-wider text-agri-muted font-bold">
                  Demonstration Scenarios
                </p>
                <p className="text-[11px] text-gray-500">
                  Switch active mock state for college presentation
                </p>
              </div>
              {(['normal', 'humidity', 'pest', 'critical'] as DemoScenario[]).map((scen) => {
                const item = scenarioDescriptions[scen];
                const Icon = item.icon;
                const isSelected = scenario === scen;
                return (
                  <button
                    key={scen}
                    onClick={() => {
                      setScenario(scen);
                      setShowScenarioMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-agri-forest/10 font-bold text-agri-forest' : 'text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-agri-forest' : 'text-gray-400'}`} />
                    <span className="flex-1">{item.label}</span>
                    {isSelected && <span className="text-[10px] text-agri-forest font-semibold">Active</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-agri-muted font-mono bg-gray-50 px-2.5 py-1.5 rounded-lg border border-agri-border">
          <Clock className="w-3.5 h-3.5 text-agri-sage" />
          <span>{currentDate}</span>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-agri-text">{currentTime}</span>
        </div>

        {/* Alerts Bell Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative p-2 text-gray-600 hover:text-agri-forest hover:bg-gray-100 rounded-lg transition-colors"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-agri-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-agri-border py-2 z-50">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-agri-text">
                  Active Alerts ({activeAlerts.length})
                </span>
                <button
                  onClick={() => {
                    setShowAlertsDropdown(false);
                    navigate('/alerts');
                  }}
                  className="text-[11px] text-agri-forest hover:underline font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {activeAlerts.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setShowAlertsDropdown(false);
                      navigate('/alerts');
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        {a.severity}
                      </span>
                      <span className="text-[10px] text-gray-400">{a.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-agri-text truncate">{a.title}</p>
                    <p className="text-[11px] text-agri-muted truncate">{a.storage_unit_name} • {a.zone_id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-2xl border border-agri-border w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-3 border-b border-agri-border flex items-center gap-3">
              <Search className="w-5 h-5 text-agri-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search storage units (WH-001), zones, grain types, pests..."
                autoFocus
                className="flex-1 bg-transparent border-none text-sm outline-hidden text-agri-text"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-agri-muted font-bold mb-2">
                  Storage Units ({filteredUnits.length})
                </p>
                <div className="space-y-1">
                  {filteredUnits.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUnitId(u.id);
                        setShowSearchModal(false);
                        navigate('/storage-units');
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-agri-forest" />
                        <span className="font-semibold text-agri-text">{u.name}</span>
                        <span className="text-gray-500 font-mono">({u.id})</span>
                      </div>
                      <span className="text-[11px] text-agri-muted">{u.grain_type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-agri-muted font-bold mb-2">
                  Storage Zones ({filteredZones.length})
                </p>
                <div className="space-y-1">
                  {filteredZones.slice(0, 6).map((z) => (
                    <div
                      key={z.id}
                      onClick={() => {
                        setSelectedUnitId(z.storage_unit_id);
                        setSelectedZoneId(z.id);
                        setShowSearchModal(false);
                        navigate('/monitoring');
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-agri-text">{z.name}</span>
                        <span className="text-gray-500 font-mono ml-2">[{z.id}]</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span>{z.temperature}°C</span>
                        <span>{z.humidity}% RH</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          z.health_status === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                          z.health_status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Risk {z.risk_score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

