import React, { useState } from 'react';
import {
  PhoneCall,
  Shield,
  Flame,
  Ambulance,
  Building2,
  Zap,
  Droplets,
  Copy,
  Check,
  Clock,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { EmergencyContact } from '../types';
import { EMERGENCY_CONTACTS } from '../constants/data';
import { copyToClipboard } from '../utils/export';

export const EmergencyContacts: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Police':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Fire Brigade':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Ambulance':
        return <Ambulance className="w-5 h-5 text-red-400" />;
      case 'Municipal Office':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'Electric Company':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Water Department':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      default:
        return <PhoneCall className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleCopyPhone = async (id: string, phone: string) => {
    const ok = await copyToClipboard(phone);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" /> 24/7 Civic Emergency Dispatch Directory
        </div>
        <h2 className="text-2xl font-bold text-white">Emergency Contacts & Rapid Helplines</h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          For active crime, fire, life-threatening medical trauma, power outages, or major flood breaks, use these direct telephone helplines immediately.
        </p>
      </div>

      {/* Emergency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMERGENCY_CONTACTS.map((contact) => (
          <div
            key={contact.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 hover:border-emerald-500/30 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                  {getCategoryIcon(contact.category)}
                </div>
                {contact.is24x7 && (
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 24/7 Dispatch
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{contact.name}</h3>
                <span className="text-[11px] font-semibold text-emerald-300">{contact.category}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{contact.description}</p>

              {contact.address && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.address}</span>
                </div>
              )}
            </div>

            {/* Phone & Call CTA */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-xl font-black text-white font-mono tracking-tight">{contact.phone}</div>

              <div className="flex gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="w-full py-2.5 px-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <button
                  onClick={() => handleCopyPhone(contact.id, contact.phone)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold shrink-0 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedId === contact.id ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
