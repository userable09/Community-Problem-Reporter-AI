import React from 'react';
import { Shield, ExternalLink, Linkedin, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 text-slate-400 mt-auto relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        {/* Brand & App Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm tracking-tight">
              Community Problem Reporter <span className="text-emerald-400">AI</span>
            </div>
            <p className="text-[11px] text-slate-400">Civic Empowerment & Public Infrastructure Management</p>
          </div>
        </div>

        {/* Developer Attribution & Social Links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 text-xs text-slate-200">
            Developed by{' '}
            <a
              href="https://www.maryamtahir.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              Maryam Tahir
              <ExternalLink className="w-3 h-3" />
            </a>
          </span>

          <span className="hidden sm:inline text-slate-600">•</span>

          <div className="flex items-center gap-2">
            <a
              href="https://www.maryamtahir.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portfolio</span>
            </a>

            <a
              href="https://www.linkedin.com/in/maryam-tahir-developer/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          {onNavigate ? (
            <>
              <button onClick={() => onNavigate('emergency')} className="hover:text-emerald-300 transition-colors">
                Emergency Contacts
              </button>
              <button onClick={() => onNavigate('map')} className="hover:text-emerald-300 transition-colors">
                Community Map
              </button>
              <button onClick={() => onNavigate('chatbot')} className="hover:text-emerald-300 transition-colors">
                AI Assistant
              </button>
            </>
          ) : (
            <span>© 2026 CivicPulse AI. All rights reserved.</span>
          )}
        </div>
      </div>
    </footer>
  );
};
