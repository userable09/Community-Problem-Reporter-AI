import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { Issue, ProblemCategory, PriorityLevel } from '../types';
import { CATEGORIES_META } from '../constants/data';

interface CommunityMapProps {
  issues: Issue[];
  onNavigateToAnalyzer: (issueId: string) => void;
  onNavigateToReport: () => void;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  issues,
  onNavigateToAnalyzer,
  onNavigateToReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [activeModalIssue, setActiveModalIssue] = useState<Issue | null>(null);

  // Filter issues
  const filteredIssues = issues.filter((i) => {
    const matchesCat = selectedCategory === 'All' || i.category === selectedCategory;
    const matchesPrio = selectedPriority === 'All' || i.priority === selectedPriority;
    return matchesCat && matchesPrio;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default centered near NYC / sample coords
      const defaultCenter: [number, number] = [40.7128, -74.006];
      const map = L.map(mapContainerRef.current).setView(defaultCenter, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    // Force map size update on render
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance alive across filter renders
    };
  }, []);

  // Update Markers when issues or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredIssues.forEach((issue) => {
      const lat = issue.latitude || 40.7128;
      const lng = issue.longitude || -74.006;

      bounds.extend([lat, lng]);

      const pinColor =
        issue.priority === 'Critical'
          ? '#ef4444'
          : issue.priority === 'High'
          ? '#f59e0b'
          : issue.priority === 'Medium'
          ? '#3b82f6'
          : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-size: 11px; font-weight: bold; color: ${pinColor}; text-transform: uppercase;">
            ${issue.priority} • ${issue.category}
          </div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px; color: #1e293b;">
            ${issue.title}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            📍 ${issue.location}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 6px; line-clamp: 2;">
            ${issue.description.slice(0, 80)}...
          </div>
          <button id="view-issue-${issue.id}" style="
            margin-top: 8px;
            width: 100%;
            padding: 6px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            View Details & AI Analysis
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-issue-${issue.id}`);
        if (btn) {
          btn.onclick = () => {
            setActiveModalIssue(issue);
          };
        }
      });

      markersGroupRef.current?.addLayer(marker);
    });

    if (filteredIssues.length > 0 && bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredIssues]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Interactive Community Map</span>
          </h2>
          <p className="text-xs text-slate-300">
            Real-time geospatial visualization of reported issues with priority pins.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/80 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          >
            <option value="All">All Categories ({issues.length})</option>
            {Object.keys(CATEGORIES_META).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-900/80 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          >
            <option value="All">All Urgency Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={onNavigateToReport}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pin New Issue</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[550px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl space-y-1.5 text-[11px] shadow-xl hidden sm:block">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] pb-1 border-b border-white/10">
            Priority Legend
          </div>
          <div className="flex items-center gap-2 text-rose-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (&lt;24h)
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High (48h)
          </div>
          <div className="flex items-center gap-2 text-blue-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Medium
          </div>
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
          </div>
        </div>
      </div>

      {/* Selected Issue Detail Modal */}
      {activeModalIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-300">{activeModalIssue.id}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                  {activeModalIssue.category}
                </span>
              </div>
              <button onClick={() => setActiveModalIssue(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModalIssue.imageUrl && (
              <img
                src={activeModalIssue.imageUrl}
                alt={activeModalIssue.title}
                className="w-full h-44 object-cover rounded-2xl border border-white/10"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
                }}
              />
            )}

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">{activeModalIssue.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeModalIssue.description}</p>

              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" /> {activeModalIssue.location}
                </span>
                <span>• Date: {activeModalIssue.date}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveModalIssue(null)}
                className="w-1/2 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold text-xs"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  const id = activeModalIssue.id;
                  setActiveModalIssue(null);
                  onNavigateToAnalyzer(id);
                }}
                className="w-1/2 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open AI Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
