import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  History,
  MapPin,
  PhoneCall,
  Bot,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'report', label: 'Report Problem', icon: PlusCircle, badge: 'New' },
  { id: 'analyzer', label: 'AI Problem Analyzer', icon: Sparkles, badge: 'AI' },
  { id: 'history', label: 'Issue History', icon: History, badge: null },
  { id: 'map', label: 'Community Map', icon: MapPin, badge: 'Live' },
  { id: 'emergency', label: 'Emergency Contacts', icon: PhoneCall, badge: '24/7' },
  { id: 'chatbot', label: 'AI Citizen Bot', icon: Bot, badge: 'Ask' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Navigation Menu
          </div>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : item.badge === 'AI'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Quick Banner Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI Citizen Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Instant grammar correction, urgency scoring, and formal municipal complaint letters.
          </p>
          <button
            onClick={() => {
              onTabChange('report');
              onCloseMobile();
            }}
            className="w-full mt-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Report Issue Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
