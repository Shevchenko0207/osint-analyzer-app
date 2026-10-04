'use client';

import React, { useEffect, useState } from 'react';
import { OSINTEntity } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';
import dynamic from 'next/dynamic';

interface MapViewProps {
  entities: OSINTEntity[];
  onSelectEntity: (entity: OSINTEntity) => void;
}

// Inner Leaflet component dynamically loaded to prevent SSR window reference issues
const MapInner = dynamic(
  () => import('./MapInner').then((mod) => mod.MapInnerComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 font-mono text-sm">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Initializing Geospatial Threat Canvas...</span>
        </div>
      </div>
    ),
  }
);

export const MapView: React.FC<MapViewProps> = ({ entities, onSelectEntity }) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 shadow-2xl relative">
      {/* Legend overlay */}
      <div className="absolute top-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs shadow-xl space-y-2 hidden md:block">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1">Geospatial Legend</h4>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-glow-blue animate-pulse"></span>
          <span className="text-slate-300 font-medium">Drone Training Hub</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span className="text-slate-300 font-medium">Grade 5 Direct Defense</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
          <span className="text-slate-300 font-medium">Grade 4 Dual-Use R&amp;D</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-400 border border-white"></span>
          <span className="text-slate-300 font-medium">Grade 3 EdTech / Pilot Hub</span>
        </div>
      </div>

      <div className="w-full h-[620px] rounded-lg overflow-hidden">
        <MapInner entities={entities} onSelectEntity={onSelectEntity} />
      </div>
    </div>
  );
};
