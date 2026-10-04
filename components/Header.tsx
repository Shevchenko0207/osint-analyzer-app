'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, RefreshCw, Database, Terminal, FileSpreadsheet } from 'lucide-react';
import { OSINTEntity } from '@/types/entity';

interface HeaderProps {
  entities: OSINTEntity[];
  onResetFilters: () => void;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({ entities, onResetFilters, filteredCount }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const exportCSV = () => {
    const headers = ["ID (INN)", "Name", "City", "VPK Score", "Cluster", "Sanctions", "Revenue", "Profit", "Training Hub", "Tags"];
    const rows = entities.map(e => [
      `"${e.id}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.city}"`,
      e.vpk_score,
      `"${e.cluster}"`,
      `"${e.sanctions.join(', ')}"`,
      `"${e.metrics.revenue || ''}"`,
      `"${e.metrics.profit || ''}"`,
      e.training_hub ? 'YES' : 'NO',
      `"${e.tags.join(', ')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `osint_threat_intelligence_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#0d121f]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Status */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-400 shadow-glow-cyan">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                OSINT Threat &amp; Corporate Intelligence Platform
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold uppercase bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded">
                v2.4 SEC-INTEL
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Monitoring 25 High-Priority Defense Industrial &amp; Dual-Use Entities</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-400">{time || 'LIVE LOG'}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center space-x-2.5 self-end md:self-center">
          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>FILTERED: <strong className="text-cyan-300">{filteredCount}</strong> / {entities.length}</span>
          </div>

          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            title="Reset active filters"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-xs font-semibold text-cyan-300 border border-cyan-500/40 transition-colors shadow-sm"
            title="Export filtered dataset to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Intel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
