'use client';

import React from 'react';
import { MapPin, ShieldAlert, Crosshair, Ban, Calendar, TrendingUp, DollarSign, ExternalLink, Activity } from 'lucide-react';
import { OSINTEntity } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';

interface GridViewProps {
  entities: OSINTEntity[];
  onSelectEntity: (entity: OSINTEntity) => void;
}

export const GridView: React.FC<GridViewProps> = ({ entities, onSelectEntity }) => {
  if (entities.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 my-8">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-200">No Intelligence Matches Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          No defense entities match your currently applied search query, VPK threat grade, or toggle filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {entities.map((entity) => {
        const gradeInfo = VPK_LABELS[entity.vpk_score];
        const isSanctioned = entity.sanctions && entity.sanctions.length > 0;

        return (
          <div
            key={entity.id}
            onClick={() => onSelectEntity(entity)}
            className="glass-panel rounded-xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative group flex flex-col justify-between"
            style={{
              borderColor: `${entity.color}40`,
              boxShadow: `0 4px 20px -5px ${entity.color}15`
            }}
          >
            {/* Top Bar: INN + VPK Score Badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: entity.color }}
                  />
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    INN: {entity.id}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {entity.training_hub && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-500/40 rounded-full flex items-center gap-1 shadow-glow-blue">
                      <Crosshair className="w-3 h-3 text-blue-400" />
                      HUB
                    </span>
                  )}
                  <span
                    className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md text-white border shadow-sm"
                    style={{
                      backgroundColor: `${entity.color}25`,
                      borderColor: `${entity.color}70`,
                      color: entity.color
                    }}
                  >
                    Grade {entity.vpk_score}
                  </span>
                </div>
              </div>

              {/* Company Title & Location */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{entity.name}</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </h3>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
                  <span>{entity.city}</span>
                  <span className="mx-1 text-slate-600">•</span>
                  <span className="text-slate-400 font-mono">{entity.cluster.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Metrics Summary Row */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs mb-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Revenue</span>
                  <span className="text-slate-200 font-medium truncate block">{entity.metrics.revenue || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Profit</span>
                  <span className={`font-medium truncate block ${entity.metrics.profit?.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {entity.metrics.profit || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Age</span>
                  <span className="text-slate-200 font-medium block">
                    {entity.metrics.age ? `${entity.metrics.age} yrs` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {entity.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium bg-slate-900 text-cyan-300/90 border border-slate-800 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Sanctions Badges */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1 overflow-x-auto max-w-[80%] scrollbar-none">
                {isSanctioned ? (
                  entity.sanctions.slice(0, 4).map((sanc, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-red-950/60 border border-red-500/40 text-red-300 rounded uppercase tracking-wider"
                    >
                      {sanc}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No Direct Sanctions Listed</span>
                )}
                {entity.sanctions && entity.sanctions.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-mono">+{entity.sanctions.length - 4}</span>
                )}
              </div>

              <span className="text-xs font-semibold text-cyan-400 opacity-80 group-hover:opacity-100 flex items-center gap-1">
                Intel <Activity className="w-3 h-3" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
