'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { OSINTEntity } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';
import { ShieldAlert, TrendingUp, BarChart3, PieChart as PieIcon, Ban, Crosshair } from 'lucide-react';

interface AnalyticsViewProps {
  entities: OSINTEntity[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entities }) => {
  // 1. Grade Distribution Data
  const gradeDistribution = [5, 4, 3, 2, 1].map((grade) => {
    const count = entities.filter((e) => e.vpk_score === grade).length;
    return {
      grade: `Grade ${grade}`,
      count,
      name: VPK_LABELS[grade].name,
      color: VPK_LABELS[grade].color,
    };
  });

  // 2. Cluster Distribution Data
  const clusterCounts: Record<string, number> = {};
  entities.forEach((e) => {
    clusterCounts[e.cluster] = (clusterCounts[e.cluster] || 0) + 1;
  });
  const clusterData = Object.keys(clusterCounts).map((cluster) => ({
    name: cluster.replace(/_/g, ' '),
    value: clusterCounts[cluster],
  }));

  // 3. Sanctioned vs Non-Sanctioned ratio
  const sanctionedCount = entities.filter((e) => e.sanctions && e.sanctions.length > 0).length;
  const nonSanctionedCount = entities.length - sanctionedCount;
  const sanctionRatioData = [
    { name: 'Sanctioned', value: sanctionedCount, color: '#ef4444' },
    { name: 'Unsanctioned / Subcontractor', value: nonSanctionedCount, color: '#3b82f6' },
  ];

  // 4. Financial Telemetry Parsed Data (numerical conversion for chart rendering)
  const parseFinancialValue = (valStr?: string): number => {
    if (!valStr || valStr.includes('Засекречено') || valStr.includes('Приховано') || valStr.includes('New Entity')) {
      return 0;
    }
    const clean = valStr.replace(/[^0-9.-]/g, '');
    let num = parseFloat(clean);
    if (isNaN(num)) return 0;
    if (valStr.includes('B')) num = num * 1000; // normalize Billions to Millions
    if (valStr.includes('K')) num = num / 1000;
    return num;
  };

  const financialData = entities
    .filter(e => e.metrics.revenue && !e.metrics.revenue.includes('Засекречено'))
    .map((e) => ({
      name: e.name.length > 18 ? e.name.slice(0, 16) + '...' : e.name,
      revenueM: parseFinancialValue(e.metrics.revenue),
      profitM: parseFinancialValue(e.metrics.profit),
      vpk_score: e.vpk_score,
      color: e.color,
      age: e.metrics.age || 0,
    }))
    .slice(0, 12); // top financial reporting entities

  return (
    <div className="space-y-6">
      {/* Top Row: Grade Distribution Bar Chart + Sanction Ratio Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: VPK Score Distribution */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                VPK Threat Score Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Entity count categorized by defense threat grade (1 to 5)</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
              25 Monitored
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sanctions Coverage Ratio */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-amber-400" />
                Sanctions Coverage &amp; Evasion Target Ratio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sanctioned entities vs unsanctioned suppliers &amp; hubs</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-950 text-amber-300 rounded border border-amber-500/30">
              {sanctionedCount} Sanctioned
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sanctionRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sanctionRatioData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-slate-300 text-xs font-sans">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row: Financial Telemetry (Revenue vs Profit Comparison) */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Financial Telemetry &amp; Revenue vs Profit Breakdown (M ₽)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of reported revenue vs net profit across key defense contractors &amp; dual-use suppliers
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1 text-cyan-400 font-mono">
              <span className="w-3 h-3 bg-cyan-500 rounded"></span> Revenue
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-3 h-3 bg-emerald-500 rounded"></span> Profit
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                angle={-25}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value}M ₽`, 'Value']}
              />
              <Bar dataKey="revenueM" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Revenue (M ₽)" />
              <Bar dataKey="profitM" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit (M ₽)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
