'use client';

import React from 'react';
import { Search, Filter, Crosshair, Ban, X, ShieldAlert } from 'lucide-react';
import { FilterState, VPKGrade, EntityCluster } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount
}) => {
  const vpkGrades: (VPKGrade | 'ALL')[] = ['ALL', 5, 4, 3, 2, 1];

  const clusters: { key: EntityCluster | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'All Clusters' },
    { key: 'DIRECT_DEFENSE', label: 'Direct Defense' },
    { key: 'HYPER_GROWTH_SATELLITE', label: 'Hyper Growth Satellite' },
    { key: 'OCCUPIED_TERRITORY_HUB', label: 'Occupied Territory Hub' },
    { key: 'DUAL_USE_RD', label: 'Dual-Use R&D' },
    { key: 'FINANCIAL_HUB', label: 'Financial Hub' },
    { key: 'MILITARY_EDTECH', label: 'Military EdTech' },
    { key: 'CIVIL_SECURITY', label: 'Civil Security' },
    { key: 'CIVILIAN', label: 'Civilian' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedGrade !== 'ALL' ||
    filters.onlyTrainingHubs ||
    filters.onlySanctioned ||
    filters.selectedCluster !== 'ALL';

  return (
    <div className="glass-panel p-4 rounded-xl mb-6 shadow-xl border border-slate-800 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by company name, city (e.g. Москва, Іжевськ), or product tags (e.g. БПЛА, FPV, РЕБ)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* VPK Grade Selector Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-mono mr-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Grade:
          </span>
          {vpkGrades.map((grade) => {
            const isActive = filters.selectedGrade === grade;
            const badgeColor = grade === 'ALL' ? '#38bdf8' : VPK_LABELS[grade].color;

            return (
              <button
                key={String(grade)}
                onClick={() => onFilterChange({ selectedGrade: grade })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800'
                }`}
                style={isActive && grade !== 'ALL' ? { borderColor: badgeColor, boxShadow: `0 0 10px ${badgeColor}40` } : {}}
              >
                {grade !== 'ALL' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: badgeColor }}
                  />
                )}
                <span>{grade === 'ALL' ? 'All Grades' : `Grade ${grade}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles & Cluster Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle: Training Hubs */}
          <button
            onClick={() => onFilterChange({ onlyTrainingHubs: !filters.onlyTrainingHubs })}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-2 transition-all ${
              filters.onlyTrainingHubs
                ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-glow-blue'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Crosshair className={`w-3.5 h-3.5 ${filters.onlyTrainingHubs ? 'text-blue-400' : ''}`} />
            <span>Only Active Training Hubs</span>
            {filters.onlyTrainingHubs && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
          </button>

          {/* Toggle: Sanctioned Entities */}
          <button
            onClick={() => onFilterChange({ onlySanctioned: !filters.onlySanctioned })}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-2 transition-all ${
              filters.onlySanctioned
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-glow-orange'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Ban className={`w-3.5 h-3.5 ${filters.onlySanctioned ? 'text-amber-400' : ''}`} />
            <span>Only Sanctioned Entities</span>
            {filters.onlySanctioned && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
          </button>

          {/* Cluster Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.selectedCluster}
              onChange={(e) => onFilterChange({ selectedCluster: e.target.value as EntityCluster | 'ALL' })}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              {clusters.map((c) => (
                <option key={c.key} value={c.key} className="bg-slate-900 text-slate-200">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter and Clear Filters button */}
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-mono text-xs">
            Showing <strong className="text-cyan-400">{resultCount}</strong> entities
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 underline underline-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
