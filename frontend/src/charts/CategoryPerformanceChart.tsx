import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { CategoryScore } from '../types';

interface Props {
  data: CategoryScore[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Programming: '#3b82f6',
  Data: '#06b6d4',
  'AI / ML': '#8b5cf6',
  Tools: '#ec4899',
  'Soft Skills': '#10b981',
};

export const CategoryPerformanceChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No category scores available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="category_name"
            stroke="#94a3b8"
            tick={{ fontSize: 11, fill: '#cbd5e1' }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            domain={[0, 100]}
            unit="%"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(val: any, _name: any, item: any) => [
              `${val}% (${item.payload.satisfied_skills}/${item.payload.total_skills} skills met)`,
              'Alignment',
            ]}
          />
          <Bar dataKey="alignment_percentage" radius={[6, 6, 0, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={`cat-${index}`}
                fill={CATEGORY_COLORS[entry.category_name] || '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
