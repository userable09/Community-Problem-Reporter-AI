import React, { useState } from 'react';
import {
  PlusCircle,
  Upload,
  MapPin,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Crosshair,
  X,
  FileText,
} from 'lucide-react';
import { Issue, ProblemCategory } from '../types';
import { CATEGORIES_META } from '../constants/data';
import { analyzeIssueWithAI } from '../services/ai';

interface ReportProblemFormProps {
  onSaveIssue: (issue: Omit<Issue, 'id' | 'updatedAt'>) => Issue;
  onNavigateToAnalyzer: (issueId: string) => void;
  userGroqKey?: string;
}

export const ReportProblemForm: React.FC<ReportProblemFormProps> = ({
  onSaveIssue,
  onNavigateToAnalyzer,
  userGroqKey,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ProblemCategory>('Road Damage');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // GPS Locator
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsGettingGps(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocation(`GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Current Location)`);
        setIsGettingGps(false);
      },
      (err) => {
        setIsGettingGps(false);
        setErrorMsg('Unable to retrieve GPS position. Please type address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Image File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter both a Problem Title and Description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    let aiResult;
    if (autoAnalyze) {
      const aiRes = await analyzeIssueWithAI({
        title,
        description,
        location,
        category,
        userGroqKey,
        hasImage: !!imagePreview,
      });
      aiResult = aiRes.data;
    }

    const newIssue = onSaveIssue({
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || 'General Community Zone',
      category,
      priority: aiResult?.priority || 'Medium',
      status: 'Pending',
      date,
      imageUrl: imagePreview || undefined,
      latitude: latitude || 40.7128,
      longitude: longitude || -74.006,
      aiAnalysis: aiResult,
    });

    setIsSubmitting(false);
    setSubmittedIssue(newIssue);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setCategory('Road Damage');
    setImagePreview(null);
    setSubmittedIssue(null);
    setErrorMsg('');
  };

  if (submittedIssue) {
    return (
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Issue Successfully Logged!</h2>
          <p className="text-xs text-slate-300">
            Reference ID: <span className="font-mono text-emerald-300 font-bold">{submittedIssue.id}</span>
          </p>
        </div>

        {submittedIssue.aiAnalysis && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AI Analysis Result Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{submittedIssue.aiAnalysis.summary}"
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] pt-2 border-t border-white/10">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                Urgency: {submittedIssue.aiAnalysis.priority} ({submittedIssue.aiAnalysis.urgencyScore}/100)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Dept: {submittedIssue.aiAnalysis.responsibleDepartment}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToAnalyzer(submittedIssue.id)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI Complaint & Breakdown</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-all"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          <span>Report a Community Problem</span>
        </h2>
        <p className="text-xs text-slate-300">
          Provide issue details and photos. Our AI will analyze urgency, fix grammar, and generate a formal municipal complaint.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Row 1: Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Pothole on Main St Crosswalk"
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Problem Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProblemCategory)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              {Object.keys(CATEGORIES_META).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Location & GPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Location / Address
            </label>
            <button
              type="button"
              onClick={handleGetGps}
              disabled={isGettingGps}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-medium flex items-center gap-1 focus:outline-none"
            >
              {isGettingGps ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Getting GPS...
                </>
              ) : (
                <>
                  <Crosshair className="w-3.5 h-3.5" /> Use Current GPS
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 742 Oak Lane, Near South Entrance"
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Problem Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is wrong, how long it has been present, and any safety hazards or inconvenience caused..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
          />
        </div>

        {/* Row 4: Image Upload & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Upload Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group h-40">
                <img src={imagePreview} alt="Issue preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-rose-400 hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-white/15 hover:border-emerald-400 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all h-40">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Click or drag image to upload</span>
                <span className="text-[11px] text-slate-400">PNG, JPG up to 8MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Date & AI Toggle */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Date Observed
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Auto AI Analysis Toggle */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAnalyze}
                  onChange={(e) => setAutoAnalyze(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-white/20"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Auto AI Analysis
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Instantly rewrite text, detect priority level, and draft complaint letter.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing & Saving Report...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Submit & Generate AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
