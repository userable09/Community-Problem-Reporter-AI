import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Sparkles,
  PlusCircle,
  MapPin,
  Bot,
  FileText,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Zap,
  Users,
  Building2,
  Activity,
  Star,
} from 'lucide-react';
import { FAQS, STATS, TESTIMONIALS } from '../constants/data';
import { Footer } from './Footer';

interface LandingPageProps {
  onOpenDashboard: (tab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDashboard }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen text-slate-100 overflow-hidden relative">
      {/* Background Animated Gradient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-teal-500/20 via-emerald-500/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI-POWERED CIVIC ENGAGEMENT PLATFORM</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Empowering Citizens to <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              Report, Track & Resolve
            </span>{' '}
            Community Issues.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
          >
            Turn potholes, water leaks, garbage, and public safety concerns into professional municipal complaint letters with AI analysis and real-time community mapping.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => onOpenDashboard('report')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report a Problem Now</span>
            </button>
            <button
              onClick={() => onOpenDashboard('map')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <MapPin className="w-5 h-5 text-emerald-300" />
              <span>Explore Interactive Map</span>
            </button>
          </motion.div>

          {/* Hero Illustration / Preview Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-10 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Sample Card 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      CRITICAL • Road Damage
                    </span>
                    <span className="text-[11px] text-slate-400">2 mins ago</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100">Main St Pothole Repair</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Deep asphalt collapse impacting crosswalk traffic safety.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Urgency Score: 92/100</span>
                  </div>
                </div>

                {/* Sample Card 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      HIGH • Water Leak
                    </span>
                    <span className="text-[11px] text-slate-400">1 hour ago</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100">Burst Pipe on Oak Lane</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    High volume drinking water wasting on street surface.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-blue-300">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Assigned: Water Dept</span>
                  </div>
                </div>

                {/* Sample Card 3 */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      RESOLVED • Sanitation
                    </span>
                    <span className="text-[11px] text-slate-400">Yesterday</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100">Park Waste Cleaned</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Garbage bins cleared after community alert dispatch.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolution Time: 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-y border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-slate-300 text-base">
            From reporting an issue on your phone to receiving an official municipal letter in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Snap & Report',
              desc: 'Enter title, description, location, and upload photo of the issue.',
              icon: PlusCircle,
            },
            {
              step: '02',
              title: 'Smart AI Analysis',
              desc: 'AI rewrites formally, fixes grammar, detects category & priority score.',
              icon: Sparkles,
            },
            {
              step: '03',
              title: 'Generate Complaint',
              desc: 'Export formal complaint letter as PDF or DOCX addressed to city hall.',
              icon: FileText,
            },
            {
              step: '04',
              title: 'Track Resolution',
              desc: 'Monitor repair progress on live interactive community map.',
              icon: MapPin,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-500">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Comprehensive Civic Intelligence Features
            </h2>
            <p className="text-slate-300 text-base">
              Built for citizens, community leaders, and neighborhood groups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Problem Analyzer',
                desc: 'Deep AI evaluation with grammar correction, category detection, and urgency assessment.',
                icon: Sparkles,
                tab: 'analyzer',
              },
              {
                title: 'Smart Priority Detection',
                desc: 'Automatic classification into Low, Medium, High, or Critical urgency badges.',
                icon: Zap,
                tab: 'history',
              },
              {
                title: 'Community Map',
                desc: 'Interactive Leaflet map showing localized pins, status badges, and nearby issues.',
                icon: MapPin,
                tab: 'map',
              },
              {
                title: 'Complaint Generator',
                desc: 'Instant PDF and DOCX export addressed to relevant municipal agencies.',
                icon: FileText,
                tab: 'report',
              },
              {
                title: 'AI Citizen Chatbot',
                desc: '24/7 AI assistant answering civic questions, authority contacts, and guidance.',
                icon: Bot,
                tab: 'chatbot',
              },
              {
                title: 'Emergency Contacts',
                desc: 'Direct quick-call directory for Police, Fire Brigade, Ambulance, Power & Water.',
                icon: PhoneCall,
                tab: 'emergency',
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onOpenDashboard(f.tab)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3 cursor-pointer hover:border-emerald-500/40 hover:bg-white/10 transition-all group shadow-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Trusted by Neighbors & Local Advocates</h2>
          <p className="text-slate-300 text-base">Real stories from citizens improving their neighborhoods.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-300">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="font-bold text-xs text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-300 text-sm">Everything you need to know about Community Problem Reporter AI.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-sm text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-300 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-300' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-200 leading-relaxed border-t border-white/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-12 text-center text-white space-y-6 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Resolve Issues in Your Community?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base">
              No registration or account needed. Submit your first issue in under 60 seconds with instant AI analysis.
            </p>
            <button
              onClick={() => onOpenDashboard('report')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl transition-all transform hover:scale-105"
            >
              <span>Submit A Community Report</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onOpenDashboard} />
    </div>
  );
};
