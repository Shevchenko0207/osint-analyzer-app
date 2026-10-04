'use client';

import React from 'react';
import { Building2, ShieldAlert, Ban, Crosshair } from 'lucide-react';
import { OSINTEntity, FilterState } from '@/types/entity';

interface KPICardsProps {
  entities: OSINTEntity[];
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ entities, filters, onFilterChange }) => {
  const totalEntities = entities.length;
  const highVPKCount = entities.filter(e => e.vpk_score === 5).length;
  const sanctionedCount = entities.filter(e => e.sanctions && e.sanctions.length > 0).length;
  const trainingHubCount = entities.filter(e => e.training_hub).length;

  const isHighVPKActive = filters.selectedGrade === 5;
  const isSanctionedActive = filters.onlySanctioned;
  const isTrainingActive = filters.onlyTrainingHubs;
  const isAllActive = filters.selectedGrade === 'ALL' && !filters.onlySanctioned && !filters.onlyTrainingHubs;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Monitored */}
      <div
        onClick={() => onFilterChange({ selectedGrade: 'ALL', onlySanctioned: false, onlyTrainingHubs: false })}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border ${
          isAllActive ? 'border-cyan-500/60 bg-cyan-950/20 shadow-glow-cyan' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Entities Monitored</p>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1 font-mono">{totalEntities}</h3>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Russian VPK &amp; Dual-Use Registry</span>
          <span className="text-cyan-400 font-medium font-mono">100% Verified</span>
        </div>
      </div>

      {/* Card 2: High VPK Threat (10) */}
      <div
        onClick={() => onFilterChange({ selectedGrade: isHighVPKActive ? 'ALL' : 5 })}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border ${
          isHighVPKActive ? 'border-red-500 bg-red-950/30 shadow-glow-red' : 'border-slate-800 hover:border-red-900/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <span>High VPK Threat (Grade 5)</span>
            </p>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-red-500 mt-1 font-mono">{highVPKCount}</h3>
          </div>
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Direct Military &amp; Weapons Mfg</span>
          <span className="text-red-400 font-semibold font-mono">{(highVPKCount / totalEntities * 100).toFixed(0)}% of Total</span>
        </div>
      </div>

      {/* Card 3: Sanctioned Entities (18) */}
      <div
        onClick={() => onFilterChange({ onlySanctioned: !isSanctionedActive })}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border ${
          isSanctionedActive ? 'border-amber-500 bg-amber-950/30 shadow-glow-orange' : 'border-slate-800 hover:border-amber-900/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Sanctioned Entities</p>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-amber-400 mt-1 font-mono">{sanctionedCount}</h3>
          </div>
          <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-400">
            <Ban className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>OFAC / EU / UK / UA Lists</span>
          <span className="text-amber-400 font-semibold font-mono">{(sanctionedCount / totalEntities * 100).toFixed(0)}% Targeted</span>
        </div>
      </div>

      {/* Card 4: Active Training Hubs (7) */}
      <div
        onClick={() => onFilterChange({ onlyTrainingHubs: !isTrainingActive })}
        className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border ${
          isTrainingActive ? 'border-blue-500 bg-blue-950/30 shadow-glow-blue' : 'border-slate-800 hover:border-blue-900/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Active Training Hubs</p>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-blue-400 mt-1 font-mono">{trainingHubCount}</h3>
          </div>
          <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-500/40 text-blue-400">
            <Crosshair className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>FPV Pilot &amp; Military Training</span>
          <span className="text-blue-400 font-semibold font-mono">Active Infrastructure</span>
        </div>
      </div>
    </div>
  );
};
