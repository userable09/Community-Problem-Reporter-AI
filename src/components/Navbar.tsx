import React from 'react';
import { Shield, PlusCircle, LayoutDashboard, Home, Moon, Sun, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isLandingPage,
  setIsLandingPage,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <button
          onClick={() => setIsLandingPage(true)}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                CivicPulse <span className="text-emerald-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5" /> Groq Powered
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Empowering Citizens to Report, Track & Resolve Issues
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Landing / Dashboard Navigation toggle */}
          {isLandingPage ? (
            <button
              onClick={() => setIsLandingPage(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open App Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLandingPage(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}

          {/* Quick Report Issue Button */}
          {!isLandingPage && currentTab !== 'report' && (
            <button
              onClick={() => onTabChange('report')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Issue</span>
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch Theme' : 'Switch Theme'}
            className="p-2 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
