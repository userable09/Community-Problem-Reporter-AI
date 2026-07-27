import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  PlusCircle,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { Issue, ProblemCategory } from '../types';
import { CATEGORIES_META } from '../constants/data';

interface DashboardOverviewProps {
  issues: Issue[];
  onNavigate: (tab: string, issueId?: string) => void;
  onUpdateStatus: (id: string, status: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  issues,
  onNavigate,
  onUpdateStatus,
}) => {
  const totalReports = issues.length;
  const criticalCount = issues.filter((i) => i.priority === 'Critical').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const pendingCount = issues.filter((i) => i.status === 'Pending').length;
  const inProgressCount = issues.filter((i) => i.status === 'InProgress' || i.status === 'In Progress').length;

  // Category counts
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<ProblemCategory, number>);

  // Priority breakdown
  const priorityCounts = {
    Critical: issues.filter((i) => i.priority === 'Critical').length,
    High: issues.filter((i) => i.priority === 'High').length,
    Medium: issues.filter((i) => i.priority === 'Medium').length,
    Low: issues.filter((i) => i.priority === 'Low').length,
  };

  const recentIssues = [...issues].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-white">Community Analytics & Overview</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Storage
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Real-time civic statistics, urgency indicators, and recent citizen submittals.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 self-start sm:self-auto transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reports */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{totalReports}</span>
            <span className="text-xs text-emerald-300 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Logged
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">Critical Issues</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-300">{criticalCount}</span>
            <span className="text-xs text-rose-300 font-medium">Urgent Action</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-400 h-full rounded-full"
              style={{ width: `${totalReports ? (criticalCount / totalReports) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Pending Issues */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-300">{pendingCount}</span>
            <span className="text-xs text-amber-300 font-medium">Awaiting Inspection</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${totalReports ? (pendingCount / totalReports) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-300">{resolvedCount}</span>
            <span className="text-xs text-emerald-300 font-medium">
              {totalReports ? Math.round((resolvedCount / totalReports) * 100) : 0}% Success Rate
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${totalReports ? (resolvedCount / totalReports) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white">Category Distribution</h3>
              <p className="text-xs text-slate-300">Issues categorized across municipal services</p>
            </div>
            <span className="text-xs text-emerald-300 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              {Object.keys(categoryCounts).length} Active Categories
            </span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const meta = CATEGORIES_META[cat as ProblemCategory] || CATEGORIES_META['Other'];
              const countVal = Number(count) || 0;
              const percentage = Math.round((countVal / (totalReports || 1)) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {cat}
                    </span>
                    <span className="text-slate-300">
                      {count} {count === 1 ? 'report' : 'reports'} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white">Priority Level Matrix</h3>
              <p className="text-xs text-slate-300">AI-assessed urgency breakdown</p>
            </div>
            <span className="text-xs text-purple-300 font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Urgency
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Critical */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">Critical</div>
              <div className="text-2xl font-black text-rose-200">{priorityCounts.Critical}</div>
              <p className="text-[11px] text-rose-300/80">Requires &lt; 24h dispatch</p>
            </div>

            {/* High */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">High</div>
              <div className="text-2xl font-black text-amber-200">{priorityCounts.High}</div>
              <p className="text-[11px] text-amber-300/80">Requires 48h dispatch</p>
            </div>

            {/* Medium */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Medium</div>
              <div className="text-2xl font-black text-blue-200">{priorityCounts.Medium}</div>
              <p className="text-[11px] text-blue-300/80">Standard routine queue</p>
            </div>

            {/* Low */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Low</div>
              <div className="text-2xl font-black text-slate-200">{priorityCounts.Low}</div>
              <p className="text-[11px] text-slate-400">Scheduled maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reported Issues List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-bold text-lg text-white">Recent Community Reports</h3>
            <p className="text-xs text-slate-300">Latest issues submitted by local residents</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Issues ({issues.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentIssues.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No issues reported yet.</div>
          ) : (
            recentIssues.map((issue) => {
              const meta = CATEGORIES_META[issue.category] || CATEGORIES_META['Other'];
              return (
                <div
                  key={issue.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {issue.imageUrl ? (
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-slate-400 text-xs">
                        No Photo
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-white hover:text-emerald-300 transition-colors">
                          {issue.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg} ${meta.textColor}`}>
                          {issue.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            issue.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : issue.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-1">{issue.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {issue.location}
                        </span>
                        <span>• {issue.date}</span>
                        <span>• Ref: {issue.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <select
                      value={issue.status}
                      onChange={(e) => onUpdateStatus(issue.id, e.target.value)}
                      className="bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => onNavigate('analyzer', issue.id)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30 transition-colors"
                      title="Analyze with AI"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">AI Analysis</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
