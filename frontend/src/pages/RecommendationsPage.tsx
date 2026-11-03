import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { Recommendation, RecommendationPriority, RecommendationStatus } from '../types';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, completeRecommendation, setSelectedUnitId, setSelectedZoneId } = useAgrivault();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRecs = recommendations.filter((r) => {
    if (priorityFilter !== 'all' && r.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;
    if (statusFilter !== 'all' && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.storage_unit_name.toLowerCase().includes(q) ||
        r.zone_id.toLowerCase().includes(q) ||
        r.recommended_action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Preventive Action Recommendations</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              AI DECISION SUPPORT
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Prescriptive preventive maintenance interventions to mitigate storage risks before irreversible grain loss.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-gray-50 border border-agri-border px-3 py-1.5 rounded-lg text-agri-muted">
          <Info className="w-3.5 h-3.5 text-agri-sage" />
          <span>Recommendations are risk-mitigation advisories; outcomes depend on environmental follow-through.</span>
        </div>
      </div>

      {/* Control Bar: Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-agri-border shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recommendations by title, zone, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-agri-border rounded-lg outline-hidden focus:border-agri-forest text-agri-text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Priority */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-agri-muted">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-agri-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-agri-border rounded-lg px-2.5 py-1.5 text-xs text-agri-text outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecs.map((rec) => {
          const isDone = rec.status === 'completed';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                isDone ? 'border-gray-200 opacity-80' : 'border-agri-border hover:border-agri-sage'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 block">
                      {rec.id} • {rec.storage_unit_id} ({rec.zone_id})
                    </span>
                    <h3 className="text-sm font-bold text-agri-text">{rec.title}</h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.priority === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : rec.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : rec.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>

                {/* Reason */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                  <span className="font-semibold text-agri-muted block mb-0.5">Underlying Reason:</span>
                  <p className="text-agri-text">{rec.reason}</p>
                </div>

                {/* Prescribed Action */}
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-xs space-y-1">
                  <span className="font-bold text-agri-forest block">Prescribed Action:</span>
                  <p className="text-agri-text leading-relaxed">{rec.recommended_action}</p>
                </div>

                {/* Expected Benefit */}
                <div className="text-xs">
                  <span className="font-semibold text-agri-muted">Projected Benefit: </span>
                  <span className="text-agri-text">{rec.expected_benefit}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                      rec.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : rec.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {rec.status.replace('_', ' ')}
                  </span>

                  {rec.related_alert_id && (
                    <button
                      onClick={() => navigate('/alerts')}
                      className="text-[11px] font-mono text-agri-forest hover:underline"
                    >
                      Ref: {rec.related_alert_id}
                    </button>
                  )}
                </div>

                {!isDone ? (
                  <button
                    onClick={() => completeRecommendation(rec.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-agri-forest text-white rounded-lg text-xs font-semibold hover:bg-agri-deep shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Action Logged</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

