import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { parseUTC } from '@/lib/utils';
import { Sparkles, Target } from 'lucide-react';
import { useThemeStore } from '@/stores/theme.store';

const getMoodDetails = (mood: number, theme: string) => {
  if (mood === 1) return { src: "/sad.png", label: "Sad" };
  if (mood === 2) return { src: "/no.png", label: "Annoyed" };
  if (mood === 3) return { src: theme === 'dark' ? "/neutral2.png" : "/neutral.png", label: "Neutral" };
  if (mood === 4) return { src: "/happy.png", label: "Happy" };
  return { src: "/amazing.png", label: "Amazing" };
};

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { theme } = useThemeStore();

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(50, 0)
  });

  const markedDates = journals?.map((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd')) || [];
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedJournals = journals?.filter((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd') === selectedDateStr) || [];

  const entry = selectedJournals.length > 0 ? selectedJournals[0] : null;
  const moodDetails = entry ? getMoodDetails(entry.checkin.mood, theme) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Journal</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Look back at your thoughts and see how you've grown.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="text-zinc-500 dark:text-zinc-400">Loading history...</div>
          ) : entry && moodDetails ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-5 py-1 mb-8">
                <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-widest text-xs">
                  <img src={moodDetails.src} className="w-5 h-5 object-contain" alt={moodDetails.label} />
                  <span>{moodDetails.label}</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif text-zinc-900 dark:text-zinc-50 mt-5 leading-tight tracking-tight">
                  {format(selectedDate, 'd MMMM yyyy')}
                </h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed md:leading-loose whitespace-pre-wrap font-serif">
                  {entry.journal}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="border-l-2 border-zinc-100 dark:border-zinc-800 pl-5 py-1 mb-8">
                <div className="flex items-center space-x-2 text-zinc-400 dark:text-zinc-600 font-semibold uppercase tracking-widest text-xs">
                  <img src={theme === 'dark' ? '/neutral2.png' : '/neutral.png'} className="w-5 h-5 object-contain opacity-50 grayscale" alt="No Entry" />
                  <span>No Entry</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif text-zinc-300 dark:text-zinc-700 mt-5 leading-tight tracking-tight">
                  {format(selectedDate, 'd MMMM yyyy')}
                </h2>
              </div>
              <p className="text-lg text-zinc-400 dark:text-zinc-600 leading-relaxed italic">
                You haven't written anything on this day.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="w-full">
            <Calendar
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              markedDates={markedDates}
            />
          </div>

          {entry?.analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-150 fill-mode-both">
              {entry.analysis.reflection && (
                <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-[#fafafa] dark:bg-zinc-900">
                  <CardContent className="p-6">
                    <h3 className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase flex items-center space-x-2 mb-3">
                      <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Thematic Echo</span>
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {entry.analysis.reflection}
                    </p>
                  </CardContent>
                </Card>
              )}

              {entry.analysis.recommendation && (
                <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-[#fafafa] dark:bg-zinc-900">
                  <CardContent className="p-6">
                    <h3 className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase flex items-center space-x-2 mb-3">
                      <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>Next Step</span>
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {entry.analysis.recommendation}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
