"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/stores/theme.store';

interface TrendChartProps {
  data: { date: string; day: string; mood: number; sleep: number }[];
}

const renderCustomAxisTick = ({ x, y, payload }: any) => {
  const getLabel = (val: number) => {
    if (val === 5) return 'High';
    if (val === 3) return 'Mid';
    if (val === 1) return 'Low';
    return '';
  };
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill={payload.fill || "#71717a"} fontSize={12} fontWeight={500}>
      {getLabel(payload.value)}
    </text>
  );
};

export function TrendChart({ data }: TrendChartProps) {
  const [range, setRange] = useState<'7days' | '30days'>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2 border-0 shadow-sm flex items-center justify-center min-h-[300px]">
        <p className="text-zinc-500">Not enough data to display trends yet.</p>
      </Card>
    );
  }

  // Slice data based on selected range
  const displayData = data.slice(range === '7days' ? -7 : -30);

  return (
    <Card className="col-span-1 md:col-span-2 border border-zinc-100 dark:border-zinc-800 shadow-sm h-full bg-white dark:bg-zinc-900 relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-20">
        <CardTitle className="text-sm font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">Mood Summary</CardTitle>
        <div className="relative">
          <div 
            className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 select-none px-2 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{range === '7days' ? 'Past 7 Days' : 'Past 30 Days'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div 
                  className={`px-3 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${range === '7days' ? 'bg-teal-50/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  onClick={() => { setRange('7days'); setIsDropdownOpen(false); }}
                >
                  Past 7 Days
                </div>
                <div 
                  className={`px-3 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${range === '30days' ? 'bg-teal-50/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                  onClick={() => { setRange('30days'); setIsDropdownOpen(false); }}
                >
                  Past 30 Days
                </div>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[280px] p-0 pr-6 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f4f4f5'} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              ticks={[1, 3, 5]}
              domain={[1, 5]} 
              dx={-15} 
              tick={(props) => renderCustomAxisTick({ ...props, fill: isDark ? '#a1a1aa' : '#71717a' })}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: `1px solid ${isDark ? '#27272a' : '#f4f4f5'}`, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '8px 12px', backgroundColor: isDark ? '#18181b' : '#ffffff' }}
              itemStyle={{ color: isDark ? '#2dd4bf' : '#0d9488', fontWeight: 600 }}
              labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a', fontSize: '12px', marginBottom: '4px' }}
            />
            <Area 
              yAxisId="left" 
              type="monotone" 
              dataKey="mood" 
              stroke={isDark ? '#2dd4bf' : '#4d7c73'} 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorMood)" 
              dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#115e59' : '#4d7c73', stroke: isDark ? '#09090b' : '#fff' }} 
              activeDot={{ r: 6, stroke: isDark ? '#09090b' : '#fff', strokeWidth: 2 }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
