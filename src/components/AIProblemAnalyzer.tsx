import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Printer,
  Download,
  Building2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Issue, AIAnalysisResult, ProblemCategory } from '../types';
import { analyzeIssueWithAI, generateRefinedComplaintLetter } from '../services/ai';
import { copyToClipboard, printComplaintLetter, downloadAsPDF, downloadAsDocx } from '../utils/export';

interface AIProblemAnalyzerProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  userGroqKey?: string;
  onUpdateIssueAnalysis?: (issueId: string, analysis: AIAnalysisResult) => void;
}

export const AIProblemAnalyzer: React.FC<AIProblemAnalyzerProps> = ({
  issues,
  selectedIssueId,
  userGroqKey,
  onUpdateIssueAnalysis,
}) => {
  const [activeIssueId, setActiveIssueId] = useState<string>(
    selectedIssueId || (issues.length > 0 ? issues[0].id : '')
  );

  const activeIssue = issues.find((i) => i.id === activeIssueId);

  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(
    activeIssue?.aiAnalysis || null
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAuthority, setCustomAuthority] = useState('');
  const [letterText, setLetterText] = useState(activeIssue?.aiAnalysis?.complaintLetter || '');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (selectedIssueId) {
      setActiveIssueId(selectedIssueId);
    }
  }, [selectedIssueId]);

  useEffect(() => {
    if (activeIssue) {
      if (activeIssue.aiAnalysis) {
        setAnalysis(activeIssue.aiAnalysis);
        setLetterText(activeIssue.aiAnalysis.complaintLetter);
      } else {
        handleRunAnalysis(activeIssue);
      }
    }
  }, [activeIssueId]);

  const handleRunAnalysis = async (issueToAnalyze: Issue) => {
    setIsAnalyzing(true);
    const result = await analyzeIssueWithAI({
      title: issueToAnalyze.title,
      description: issueToAnalyze.description,
      location: issueToAnalyze.location,
      category: issueToAnalyze.category,
      userGroqKey,
      hasImage: !!issueToAnalyze.imageUrl,
    });

    setIsAnalyzing(false);
    if (result.data) {
      setAnalysis(result.data);
      setLetterText(result.data.complaintLetter);
      if (onUpdateIssueAnalysis) {
        onUpdateIssueAnalysis(issueToAnalyze.id, result.data);
      }
    }
  };

  const handleCopyLetter = async () => {
    if (!letterText) return;
    const ok = await copyToClipboard(letterText);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleRefineLetterAuthority = async () => {
    if (!activeIssue) return;
    setIsAnalyzing(true);
    const refined = await generateRefinedComplaintLetter(activeIssue, customAuthority, userGroqKey);
    setLetterText(refined);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-white">AI Problem Analyzer</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-300" /> Groq Llama-3.3
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Intelligent grammar correction, urgency scoring, responsible department matching, and complaint letters.
          </p>
        </div>

        {/* Issue Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-slate-300 font-semibold hidden md:block">Select Report:</label>
          <select
            value={activeIssueId}
            onChange={(e) => setActiveIssueId(e.target.value)}
            className="bg-slate-900/80 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 max-w-xs"
          >
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id}: {i.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {!activeIssue ? (
        <div className="text-center py-12 text-slate-400 text-sm">No report selected for analysis.</div>
      ) : (
        <div className="space-y-8">
          {/* Active Issue Glance Box */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              {activeIssue.imageUrl && (
                <img
                  src={activeIssue.imageUrl}
                  alt={activeIssue.title}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-300">{activeIssue.id}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                    {activeIssue.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white">{activeIssue.title}</h3>
                <p className="text-xs text-slate-300 max-w-2xl">{activeIssue.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">Location: {activeIssue.location}</div>
              </div>
            </div>

            <button
              onClick={() => handleRunAnalysis(activeIssue)}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shrink-0 self-end md:self-center transition-all disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Re-run AI Analysis</span>
            </button>
          </div>

          {/* Analysis Results Display */}
          {isAnalyzing ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center space-y-4 shadow-xl">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-white">Analyzing Issue with Groq AI...</h4>
                <p className="text-xs text-slate-300">
                  Evaluating category, urgency score, grammar correction, and generating municipal complaint letter.
                </p>
              </div>
            </div>
          ) : analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: AI Metrics & Rewrite */}
              <div className="lg:col-span-2 space-y-6">
                {/* Executive Summary Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>AI Executive Summary</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100 leading-relaxed bg-white/5 border border-white/10 p-4 rounded-2xl">
                    "{analysis.summary}"
                  </p>
                </div>

                {/* Professional Rewrite & Grammar Corrected */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-bold text-base text-white">Professional Administrative Rewrite</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1">
                        Professional Description for Municipal Records:
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                        {analysis.professionalRewrite}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1">Grammar Corrected Input:</div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 italic">
                        "{analysis.correctedText}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Possible Solutions & Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Solutions */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
                    <h5 className="font-bold text-sm text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Suggested AI Solutions</span>
                    </h5>
                    <ul className="space-y-2">
                      {analysis.possibleSolutions.map((sol, idx) => (
                        <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
                    <h5 className="font-bold text-sm text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-300" />
                      <span>Key Risk Factors</span>
                    </h5>
                    <ul className="space-y-2">
                      {analysis.keyRiskFactors.map((risk, idx) => (
                        <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Urgency Badges & Complaint Generator */}
              <div className="space-y-6">
                {/* Priority & Urgency Score Box */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-bold text-base text-white">Urgency & Department Matrix</h4>

                  {/* Priority Badge */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-300 font-medium">Priority Level</span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        analysis.priority === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : analysis.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {analysis.priority} Priority
                    </span>
                  </div>

                  {/* Score Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">Urgency Score</span>
                      <span className="text-emerald-300 font-bold">{analysis.urgencyScore}/100</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-400 via-amber-400 to-rose-400 h-full rounded-full"
                        style={{ width: `${analysis.urgencyScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Resolution Days */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                    <span className="text-slate-300">Est. Resolution Time</span>
                    <span className="text-white font-bold">{analysis.estimatedResolutionDays} Days</span>
                  </div>

                  {/* Department */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Assigned Authority
                    </div>
                    <div className="font-bold text-xs text-white">{analysis.responsibleDepartment}</div>
                    <div className="text-[11px] text-slate-300">{analysis.departmentContact}</div>
                  </div>
                </div>

                {/* Complaint Letter Generator Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-300" />
                      <span>Official Complaint Letter</span>
                    </h4>
                  </div>

                  {/* Custom Authority Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                      Target Authority (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customAuthority}
                        onChange={(e) => setCustomAuthority(e.target.value)}
                        placeholder="e.g. City Mayor Office"
                        className="w-full bg-slate-900/80 border border-white/10 text-xs rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                      <button
                        onClick={handleRefineLetterAuthority}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 shrink-0 transition-colors"
                      >
                        Refine
                      </button>
                    </div>
                  </div>

                  {/* Letter Text Box */}
                  <textarea
                    rows={8}
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                  />

                  {/* Export Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      onClick={handleCopyLetter}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => activeIssue && printComplaintLetter(activeIssue, letterText)}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    <button
                      onClick={() => activeIssue && downloadAsPDF(activeIssue, letterText)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => activeIssue && downloadAsDocx(activeIssue, letterText)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>DOCX</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
