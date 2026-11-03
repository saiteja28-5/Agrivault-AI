import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  Activity,
  Bug,
  TrendingUp,
  MapPin,
  BellRing,
  Lightbulb,
  ClipboardList,
  FileBarChart,
  ShieldAlert,
  RotateCcw,
  Sliders,
  Radio,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAgrivault } from '../../context/AgrivaultContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { alerts, isLiveSimulating, toggleLiveSimulation, resetToDefaults } = useAgrivault();
  const location = useLocation();

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/storage-units', label: 'Storage Units', icon: Warehouse },
    { to: '/monitoring', label: 'Live Monitoring', icon: Activity },
    { to: '/pest-detection', label: 'Pest Detection', icon: Bug, highlight: true },
    { to: '/risk-analysis', label: 'Risk Analysis', icon: TrendingUp },
    { to: '/hotspot-map', label: 'Hotspot Map', icon: MapPin },
    { to: '/alerts', label: 'Alerts & Notifications', icon: BellRing, badge: activeAlertsCount },
    { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
    { to: '/interventions', label: 'Intervention Tracking', icon: ClipboardList },
    { to: '/reports', label: 'Reports & Analytics', icon: FileBarChart },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-agri-deep text-white border-r border-agri-deep/80 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-[#142e23]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-agri-forest border border-agri-sage/30 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-sm">
            <Radio className="w-5 h-5 text-agri-sage" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold tracking-wider text-sm text-white flex items-center gap-1.5">
                AGRIVAULT <span className="text-[10px] bg-agri-sage/30 text-white font-mono px-1.5 py-0.5 rounded">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">Grain Intelligence Platform</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Intelligence Workflow Indicator */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="bg-white/5 border border-white/10 rounded-md p-2">
            <p className="text-[9px] uppercase font-mono tracking-wider text-agri-sage mb-1 font-semibold">
              Continuous Loop
            </p>
            <div className="flex items-center text-[10px] text-gray-300 font-mono tracking-tighter justify-between">
              <span>Detect</span>
              <span className="text-gray-600">→</span>
              <span>Predict</span>
              <span className="text-gray-600">→</span>
              <span>Action</span>
              <span className="text-gray-600">→</span>
              <span>Verify</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-agri-forest text-white shadow-sm border border-agri-sage/20'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="bg-agri-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 bg-[#142e23] space-y-2">
        {/* Simulation Status Pill */}
        <div
          onClick={toggleLiveSimulation}
          className={`cursor-pointer flex items-center gap-2 p-2 rounded-md border text-[11px] transition-colors ${
            isLiveSimulating
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          } ${collapsed ? 'justify-center' : ''}`}
          title="Click to toggle live sensor telemetry simulation"
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isLiveSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          {!collapsed && (
            <div className="flex-1 truncate leading-tight">
              <span className="font-semibold block">
                {isLiveSimulating ? 'Simulated Telemetry' : 'Telemetry Paused'}
              </span>
              <span className="text-[9px] text-gray-400">Click to toggle feed</span>
            </div>
          )}
        </div>

        {/* Reset Mock State Button */}
        {!collapsed && (
          <button
            onClick={resetToDefaults}
            className="w-full flex items-center justify-center gap-2 text-[11px] text-gray-400 hover:text-white hover:bg-white/5 py-1.5 px-2 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}

        {/* User Card */}
        <div className={`flex items-center gap-2.5 pt-2 border-t border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-agri-sage text-agri-deep font-bold flex items-center justify-center text-xs flex-shrink-0">
            PK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Prashanth K.</p>
              <p className="text-[10px] text-gray-400 truncate">Lead Storage Architect</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
