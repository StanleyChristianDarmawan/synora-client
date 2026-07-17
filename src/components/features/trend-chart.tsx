"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  data: { day: string; mood: number; sleep: number }[];
}

const renderCustomAxisTick = ({ x, y, payload }: any) => {
  const getEmoji = (val: number) => {
    if (val === 1) return '😢';
    if (val === 2) return '😕';
    if (val === 3) return '😐';
    if (val === 4) return '🙂';
    if (val === 5) return '😄';
    return '';
  };
  return (
    <text x={x} y={y} dy={5} textAnchor="end" fill="#a1a1aa" fontSize={16}>
      {getEmoji(payload.value)}
    </text>
  );
};

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2 border-0 shadow-sm flex items-center justify-center min-h-[300px]">
        <p className="text-zinc-500">Not enough data to display trends yet.</p>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 border-0 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-zinc-700">Weekly Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} dy={10} />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              ticks={[1, 2, 3, 4, 5]}
              domain={[1, 5]} 
              dx={-10} 
              tick={renderCustomAxisTick}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
