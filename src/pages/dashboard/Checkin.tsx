
import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { format } from 'date-fns';
import { useThemeStore } from '@/stores/theme.store';

import { parseUTC } from '@/lib/utils';

export default function CheckinPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [sleep, setSleep] = useState<string>('7');
  const [social] = useState<string>('Average');
  const [exercise] = useState<string>('None');
  const [journal, setJournal] = useState('');
  
  const queryClient = useQueryClient();
  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(10, 0)
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const hasCheckedInToday = journals?.some((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd') === todayStr);

  useEffect(() => {
    if (hasCheckedInToday && !isLoading) {
      navigate('/dashboard');
    }
  }, [hasCheckedInToday, isLoading, navigate]);

  const submitMutation = useMutation({
    mutationFn: JournalService.submitJournal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['journals'] });
      navigate('/dashboard');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      checkin: {
        mood,
        stress,
        energy,
        sleep_hours: parseFloat(sleep) || 0,
        social_interaction: social,
        exercise: exercise
      },
      journal
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Daily Check-in</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Take a moment to center yourself. How are you feeling?</p>
      </div>

      <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Overall Mood</label>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={`mood-${val}`}
                      type="button"
                      onClick={() => setMood(val)}
                      className={`flex-1 py-4 text-2xl transition-all rounded-xl ${mood === val ? (val === 1 ? 'bg-rose-100 dark:bg-rose-900/30 shadow-sm border-rose-200 dark:border-rose-800' : val === 2 ? 'bg-orange-100 dark:bg-orange-900/30 shadow-sm border-orange-200 dark:border-orange-800' : val === 3 ? 'bg-zinc-100 dark:bg-zinc-700/50 shadow-sm border-zinc-200 dark:border-zinc-600' : val === 4 ? 'bg-teal-100 dark:bg-teal-900/30 shadow-sm border-teal-200 dark:border-teal-800' : 'bg-green-100 dark:bg-green-900/30 shadow-sm border-green-200 dark:border-green-800') + ' border transform scale-105' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-50 hover:opacity-100'}`}
                    >
                      {val === 1 ? <img src="/sad.png" className={`w-10 h-10 mx-auto object-contain ${mood !== val && 'grayscale opacity-50'}`} alt="Sad" /> : 
                       val === 2 ? <img src="/no.png" className={`w-10 h-10 mx-auto object-contain ${mood !== val && 'grayscale opacity-50'}`} alt="No" /> : 
                       val === 3 ? <img src={theme === 'dark' ? '/neutral2.png' : '/neutral.png'} className={`w-10 h-10 mx-auto object-contain ${mood !== val && 'grayscale opacity-50'}`} alt="Neutral" /> : 
                       val === 4 ? <img src="/happy.png" className={`w-10 h-10 mx-auto object-contain ${mood !== val && 'grayscale opacity-50'}`} alt="Happy" /> : 
                       <img src="/amazing.png" className={`w-10 h-10 mx-auto object-contain ${mood !== val && 'grayscale opacity-50'}`} alt="Amazing" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Stress Level (1-Low, 5-High)</label>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={`stress-${val}`}
                      type="button"
                      onClick={() => setStress(val)}
                      className={`flex-1 py-4 text-lg font-bold transition-all rounded-xl ${stress === val ? 'bg-white dark:bg-zinc-900 shadow-sm border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 transform scale-105' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 opacity-50 hover:opacity-100 text-zinc-600 dark:text-zinc-400'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Energy Level (1-Low, 5-High)</label>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={`energy-${val}`}
                      type="button"
                      onClick={() => setEnergy(val)}
                      className={`flex-1 py-4 text-lg font-bold transition-all rounded-xl ${energy === val ? 'bg-white dark:bg-zinc-900 shadow-sm border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 transform scale-105' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 opacity-50 hover:opacity-100 text-zinc-600 dark:text-zinc-400'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Sleep (Hours)</label>
                <Input 
                  type="number" 
                  value={sleep} 
                  onChange={(e) => setSleep(e.target.value)} 
                  className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="e.g. 7.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Journal Entry</label>
              <textarea
                className="w-full h-48 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                placeholder="What's on your mind today? Write down your thoughts, worries, or wins..."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? 'Saving...' : 'Submit Check-in'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
