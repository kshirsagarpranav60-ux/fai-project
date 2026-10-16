import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface Props {
  baselineScore?: number;
  currentScore?: number;
  baselineDate?: string;
  currentDate?: string;
}

export const ProgressTimeChart: React.FC<Props> = ({
  baselineScore = 64,
  currentScore = 71,
  baselineDate = 'Week 1',
  currentDate = 'Current'
}) => {
  // Compute synthetic progression milestones for smooth visualization
  const data = [
    { period: baselineDate, score: baselineScore, milestone: 'Initial Baseline' },
    { period: 'Week 2', score: Math.round(baselineScore + (currentScore - baselineScore) * 0.35), milestone: 'Phase 1 Study' },
    { period: 'Week 3', score: Math.round(baselineScore + (currentScore - baselineScore) * 0.70), milestone: 'ML & SQL Modules' },
    { period: currentDate, score: currentScore, milestone: 'Verified Reassessment' },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis domain={[40, 100]} unit="%" stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(val: any, _name: any, item: any) => [
              `${val}% (${item.payload.milestone})`,
              'Alignment Score',
            ]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
