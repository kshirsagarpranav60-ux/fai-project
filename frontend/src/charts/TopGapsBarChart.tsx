import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import { SkillGapDetail } from '../types';

interface Props {
  data: SkillGapDetail[];
}

export const TopGapsBarChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No significant skill gaps found. You align well with requirements!
      </div>
    );
  }

  // Format data for chart
  const chartData = data.slice(0, 6).map((g) => ({
    name: g.skill_name,
    gap: g.gap_percentage,
    priority: g.priority_score,
    tier: g.priority_tier,
    color:
      g.gap_percentage > 70
        ? '#ef4444' // Red
        : g.gap_percentage > 40
        ? '#f97316' // Orange
        : g.gap_percentage > 20
        ? '#eab308' // Yellow
        : '#22c55e', // Green
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#94a3b8"
            width={110}
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(val: any, _name: any, item: any) => [
              `${val}% (Priority: ${item.payload.tier})`,
              'Gap Percentage',
            ]}
          />
          <Bar dataKey="gap" radius={[0, 6, 6, 0]} barSize={18}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
