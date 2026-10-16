import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { SkillGapDetail } from '../types';

interface Props {
  data: SkillGapDetail[];
}

export const SkillPriorityChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No skill priority distribution data.
      </div>
    );
  }

  // Filter skills with gaps
  const scatterData = data.filter((g) => g.gap > 0).map((g) => ({
    name: g.skill_name,
    gap: g.gap_percentage,
    importance: Math.round(g.importance_weight * 100),
    priority: g.priority_score,
    tier: g.priority_tier,
    color:
      g.priority_tier === 'Critical'
        ? '#ef4444'
        : g.priority_tier === 'High'
        ? '#f97316'
        : g.priority_tier === 'Medium'
        ? '#eab308'
        : '#3b82f6',
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="gap"
            name="Skill Gap"
            unit="%"
            domain={[0, 100]}
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Skill Gap %', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="importance"
            name="Role Importance"
            unit="%"
            domain={[40, 100]}
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Role Importance %', angle: -90, position: 'insideLeft', offset: 12, fill: '#64748b', fontSize: 11 }}
          />
          <ZAxis type="number" dataKey="priority" range={[60, 400]} name="Priority Score" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(value: any, name: any) => [
              `${value}${name === 'Priority Score' ? '/100' : '%'}`,
              name,
            ]}
          />
          <Scatter name="Skills" data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
