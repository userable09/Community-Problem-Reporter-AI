import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit,
  Sparkles,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { Issue, ProblemCategory, PriorityLevel, IssueStatus } from '../types';
import { CATEGORIES_META } from '../constants/data';
import { printComplaintLetter, downloadAsPDF } from '../utils/export';

interface IssueHistoryProps {
  issues: Issue[];
  onUpdateStatus: (id: string, status: IssueStatus) => void;
  onDeleteIssue: (id: string) => void;
  onSaveIssue: (issue: Issue) => void;
  onNavigateToAnalyzer: (id: string) => void;
}

export const IssueHistory: React.FC<IssueHistoryProps> = ({
  issues,
  onUpdateStatus,
  onDeleteIssue,
  onSaveIssue,
  onNavigateToAnalyzer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Sorting
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'priority') {
      const rank: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return rank[b.priority] - rank[a.priority];
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Issue History & Management</h2>
        <p className="text-xs text-slate-400">
          Search, filter, update status, or export official complaint letters for locally reported community problems.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, location, ID..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              <option value="All">All Categories ({issues.length})</option>
              {Object.keys(CATEGORIES_META).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status & Sorting */}
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-1/2 bg-slate-900/80 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-1/2 bg-slate-900/80 border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Urgency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List Grid */}
      <div className="space-y-4">
        {sortedIssues.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-slate-400 text-sm">
            No community issues match your active search filters.
          </div>
        ) : (
          sortedIssues.map((issue) => {
            const meta = CATEGORIES_META[issue.category] || CATEGORIES_META['Other'];
            return (
              <div
                key={issue.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:border-emerald-500/30 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left Section: Details */}
                <div className="flex items-start gap-4">
                  {issue.imageUrl ? (
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400 text-xs font-medium shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-300">{issue.id}</span>
                      <h3 className="font-bold text-base text-white">{issue.title}</h3>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeBg} ${meta.textColor}`}>
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

                    <p className="text-xs text-slate-200 line-clamp-2 max-w-3xl">{issue.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {issue.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {issue.date}
                      </span>
                      {issue.aiAnalysis?.responsibleDepartment && (
                        <span className="text-purple-300 font-medium">
                          Dept: {issue.aiAnalysis.responsibleDepartment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Status Control & Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 w-full md:w-auto justify-between md:justify-end">
                  {/* Status Dropdown */}
                  <select
                    value={issue.status}
                    onChange={(e) => onUpdateStatus(issue.id, e.target.value as IssueStatus)}
                    className="bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {/* AI Analyzer button */}
                  <button
                    onClick={() => onNavigateToAnalyzer(issue.id)}
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Analysis</span>
                  </button>

                  {/* Print Complaint button */}
                  {issue.aiAnalysis?.complaintLetter && (
                    <button
                      onClick={() => printComplaintLetter(issue, issue.aiAnalysis!.complaintLetter)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/10 transition-colors"
                      title="Export/Print Complaint PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-300" />
                      <span>PDF</span>
                    </button>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => setEditingIssue(issue)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
                    title="Edit issue details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteConfirmId(issue.id)}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                    title="Delete issue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Delete Report?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <span className="font-mono text-white font-bold">{deleteConfirmId}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteIssue(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="w-1/2 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Issue Details Modal */}
      {editingIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Edit Issue Details ({editingIssue.id})</h3>
              <button onClick={() => setEditingIssue(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  value={editingIssue.title}
                  onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingIssue.description}
                  onChange={(e) => setEditingIssue({ ...editingIssue, description: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider block mb-1">Location</label>
                <input
                  type="text"
                  value={editingIssue.location}
                  onChange={(e) => setEditingIssue({ ...editingIssue, location: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingIssue(null)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveIssue(editingIssue);
                  setEditingIssue(null);
                }}
                className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
