'use client';

import React from 'react';
import { X, MapPin, ShieldAlert, Crosshair, Ban, Calendar, TrendingUp, DollarSign, Building2, Tag, Compass, FileText } from 'lucide-react';
import { OSINTEntity } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';

interface EntityDetailModalProps {
  entity: OSINTEntity | null;
  onClose: () => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ entity, onClose }) => {
  if (!entity) return null;

  const gradeInfo = VPK_LABELS[entity.vpk_score];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${entity.lat},${entity.lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0d121f] text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60 relative">
          <div className="flex items-start space-x-3.5 pr-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shrink-0 shadow-lg border"
              style={{ backgroundColor: `${entity.color}25`, borderColor: entity.color, color: entity.color }}
            >
              G{entity.vpk_score}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  INN: {entity.id}
                </span>
                {entity.training_hub && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/50 rounded-full flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-blue-400" />
                    TRAINING HUB
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{entity.name}</h2>
              <div className="flex items-center text-xs text-slate-400 mt-1 space-x-2">
                <span className="flex items-center text-cyan-400">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {entity.city}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-slate-300">{entity.cluster}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-sans">
          
          {/* VPK Threat Classification Banner */}
          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{
              backgroundColor: `${entity.color}15`,
              borderColor: `${entity.color}50`
            }}
          >
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 shrink-0" style={{ color: entity.color }} />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  VPK Classification: {gradeInfo.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">{gradeInfo.description}</p>
              </div>
            </div>
            <span
              className="text-2xl font-black font-mono px-3 py-1 rounded-lg border bg-slate-900"
              style={{ color: entity.color, borderColor: `${entity.color}60` }}
            >
              SCORE {entity.vpk_score}/5
            </span>
          </div>

          {/* Financial & Corporate Metrics */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Corporate &amp; Financial Telemetry
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Revenue
                </span>
                <p className="text-lg font-bold font-mono text-white mt-1">
                  {entity.metrics.revenue || 'Undisclosed'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Profit
                </span>
                <p className={`text-lg font-bold font-mono mt-1 ${entity.metrics.profit?.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {entity.metrics.profit || 'Undisclosed'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Operational Age
                </span>
                <p className="text-lg font-bold font-mono text-white mt-1">
                  {entity.metrics.age ? `${entity.metrics.age} years` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Sanctions & Regulatory Restrictions */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-amber-400" />
              International Sanctions &amp; Sanctions Registry
            </h4>
            {entity.sanctions && entity.sanctions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {entity.sanctions.map((sanc, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {sanc}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                No active international sanctions recorded in public SDN/EU databases. Subcontracting risk present.
              </p>
            )}
          </div>

          {/* Tags & Product Capabilities */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-cyan-400" />
              Key Products, Hardware &amp; Military Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {entity.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Geolocation Coordinates */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs text-slate-400 block font-mono">Geographic Coordinates</span>
                <span className="text-sm font-mono text-white font-semibold">
                  {entity.lat.toFixed(4)}° N, {entity.lng.toFixed(4)}° E ({entity.city})
                </span>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-cyan-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>View Map</span>
              <Compass className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">OSINT-INTEL ID: {entity.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
