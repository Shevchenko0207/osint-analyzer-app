'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FilterBar } from '@/components/FilterBar';
import { GridView } from '@/components/GridView';
import { MapView } from '@/components/MapView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { EntityDetailModal } from '@/components/EntityDetailModal';
import { INITIAL_ENTITIES } from '@/data/entities';
import { OSINTEntity, FilterState } from '@/types/entity';
import { LayoutGrid, Map as MapIcon, BarChart2, Shield, Activity, Terminal } from 'lucide-react';

export default function Home() {
  const [entities] = useState<OSINTEntity[]>(INITIAL_ENTITIES);
  const [activeTab, setActiveTab] = useState<'grid' | 'map' | 'analytics'>('grid');
  const [selectedEntity, setSelectedEntity] = useState<OSINTEntity | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedGrade: 'ALL',
    onlyTrainingHubs: false,
    onlySanctioned: false,
    selectedCluster: 'ALL',
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedGrade: 'ALL',
      onlyTrainingHubs: false,
      onlySanctioned: false,
      selectedCluster: 'ALL',
    });
  };

  // Filter entities according to user selections
  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      // 1. Search Query filter (matches name, city, INN/id, or tags)
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = entity.name.toLowerCase().includes(q);
        const matchCity = entity.city.toLowerCase().includes(q);
        const matchId = entity.id.includes(q);
        const matchTags = entity.tags.some((t) => t.toLowerCase().includes(q));
        const matchCluster = entity.cluster.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchId && !matchTags && !matchCluster) {
          return false;
        }
      }

      // 2. VPK Grade filter
      if (filters.selectedGrade !== 'ALL' && entity.vpk_score !== filters.selectedGrade) {
        return false;
      }

      // 3. Training Hub toggle
      if (filters.onlyTrainingHubs && !entity.training_hub) {
        return false;
      }

      // 4. Sanctions toggle
      if (filters.onlySanctioned && (!entity.sanctions || entity.sanctions.length === 0)) {
        return false;
      }

      // 5. Cluster filter
      if (filters.selectedCluster !== 'ALL' && entity.cluster !== filters.selectedCluster) {
        return false;
      }

      return true;
    });
  }, [entities, filters]);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Platform Header */}
      <Header
        entities={entities}
        filteredCount={filteredEntities.length}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* KPI Summary Cards */}
        <KPICards
          entities={entities}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Filter Controls Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          resultCount={filteredEntities.length}
        />

        {/* Multi-View Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
          <div className="flex items-center space-x-2">
            
            {/* Tab 1: Grid View */}
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'grid'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid / Card View</span>
              <span className="ml-1.5 px-2 py-0.5 text-xs font-mono rounded bg-slate-900 text-slate-300 border border-slate-800">
                {filteredEntities.length}
              </span>
            </button>

            {/* Tab 2: Map View */}
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Interactive Map View</span>
            </button>

            {/* Tab 3: Analytics View */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics &amp; Cluster View</span>
            </button>

          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>SYSTEM READY</span>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'grid' && (
          <GridView
            entities={filteredEntities}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            entities={filteredEntities}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            entities={filteredEntities}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#07090f] py-4 text-center text-xs text-slate-400 mt-12 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OSINT Threat &amp; Corporate Intelligence Platform • Defense Industrial Sector</span>
          <span className="text-slate-400">Classification Level: PUBLIC INTEL / OPEN DATA</span>
        </div>
      </footer>

      {/* Intelligence Detail Modal */}
      <EntityDetailModal
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />
    </div>
  );
}
