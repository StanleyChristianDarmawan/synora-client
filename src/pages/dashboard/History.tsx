import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { parseUTC } from '@/lib/utils';

const getMoodEmoji = (mood: number) => {
  if (mood === 1) return <img src="/sad.png" className="w-7 h-7 object-contain" alt="Sad" />;
  if (mood === 2) return <img src="/no.png" className="w-7 h-7 object-contain" alt="No" />;
  if (mood === 3) return <img src="/neutral.png" className="w-7 h-7 object-contain" alt="Neutral" />;
  if (mood === 4) return <img src="/happy.png" className="w-7 h-7 object-contain" alt="Happy" />;
  return <img src="/amazing.png" className="w-7 h-7 object-contain" alt="Amazing" />;
};

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(50, 0)
  });

  const markedDates = journals?.map((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd')) || [];
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedJournals = journals?.filter((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd') === selectedDateStr) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Journal History</h1>
        <p className="text-zinc-500 mt-2">Look back at your thoughts and see how you've grown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            markedDates={markedDates}
          />
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-800 mb-6">
            Entries for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {isLoading ? (
            <div className="text-zinc-500">Loading history...</div>
          ) : (
            <div className="relative border-l border-zinc-200 ml-4 space-y-8 pb-4">
              {selectedJournals.length > 0 ? (
                selectedJournals.map((item: any) => (
                  <div key={item._id || item.id} className="relative pl-8 group">
                    <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-sm shadow-sm group-hover:border-teal-500 group-hover:scale-110 transition-all">
                      {getMoodEmoji(item.checkin.mood)}
                    </div>
                    <Card className="border-0 shadow-sm group-hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <p className="text-xs font-semibold text-teal-600 mb-2">
                          {format(parseUTC(item.created_at), 'HH:mm')}
                        </p>
                        <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{item.journal}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 pl-8">No journal entries found. Start by doing a daily check-in!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
