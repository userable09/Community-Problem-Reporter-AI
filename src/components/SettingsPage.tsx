import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Key,
  RotateCcw,
  Check,
  ShieldCheck,
  Database,
  Bell,
  Sparkles,
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (settings: Partial<AppSettings>) => void;
  onResetData: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  onResetData,
  darkMode,
  onToggleDarkMode,
}) => {
  const [groqKey, setGroqKey] = useState(settings.groqApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveGroqKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({ groqApiKey: groqKey.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all issues to default initial community sample dataset?')) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          <span>Application Settings & Preferences</span>
        </h2>
        <p className="text-xs text-slate-300">
          Configure display theme, AI processing preferences, and local storage data management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Engine Status */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI Processing Engine</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            All issue classification, priority scoring, grammar correction, and formal municipal letters are processed directly via secure backend AI credentials.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Server AI Pipeline Active</span>
              <span className="text-[11px] text-slate-400">Secure backend processing without client API key prompts.</span>
            </div>
          </div>
        </div>

        {/* Display & Theme Toggle */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Moon className="w-4 h-4 text-amber-300" />
            <span>Appearance & Theme</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Toggle between Frosted Glass Dark Mode and Clean Light Mode display modes.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Frosted Theme Interface</span>
            <button
              onClick={onToggleDarkMode}
              className={`px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-2 transition-all ${
                darkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? 'Frosted Active' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Storage & Data Reset */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
          <Database className="w-4 h-4 text-emerald-300" />
          <span>Local Storage & Zero-Backend Architecture</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Community Problem Reporter AI uses strictly local browser storage (<code className="text-emerald-300 font-mono">localStorage</code>). No external databases, user accounts, or login tokens are stored or shared.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
          <div>
            <div className="font-bold text-xs text-white">Reset Sample Community Data</div>
            <p className="text-[11px] text-slate-400">Restore default sample community issues and reset issue logs.</p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetSuccess ? 'Reset Done!' : 'Reset Initial Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
