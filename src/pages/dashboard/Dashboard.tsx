import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Flame, Frown, Annoyed, Meh, Smile, Laugh, CheckCircle2, Edit3, Target } from 'lucide-react';
import { TrendChart } from '@/components/features/trend-chart';
import { AILoadingIndicator } from '@/components/features/ai-loading';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { format } from 'date-fns';
import { parseUTC } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(50, 0),
    refetchInterval: (query) => {
      const data = query.state.data as any[];
      if (data && data.length > 0 && !data[0].analysis) {
        return 3000;
      }
      return false;
    }
  });

  let streak = 0;
  let hasCheckedInToday = false;
  let todayJournal = null;

  if (journals && journals.length > 0) {
    const uniqueDays = Array.from(new Set(journals.map((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd'))))
      .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    if (uniqueDays.includes(todayStr)) {
      hasCheckedInToday = true;
      todayJournal = journals.find((j: any) => format(parseUTC(j.created_at), 'yyyy-MM-dd') === todayStr);
      streak = 1;
      let currentDay = new Date(todayStr);
      for (let i = 1; i < uniqueDays.length; i++) {
        const expectedNextDay = format(new Date(currentDay.getTime() - 86400000), 'yyyy-MM-dd');
        if (uniqueDays[i] === expectedNextDay) {
          streak++;
          currentDay = new Date(expectedNextDay);
        } else {
          break;
        }
      }
    } else if (uniqueDays.includes(yesterdayStr)) {
      streak = 1;
      let currentDay = new Date(yesterdayStr);
      for (let i = 1; i < uniqueDays.length; i++) {
        const expectedNextDay = format(new Date(currentDay.getTime() - 86400000), 'yyyy-MM-dd');
        if (uniqueDays[i] === expectedNextDay) {
          streak++;
          currentDay = new Date(expectedNextDay);
        } else {
          break;
        }
      }
    }
  }

  let mentalPercentage = 0;
  let MentalIcon = Meh;
  let mentalColor = 'text-zinc-400';
  let mentalBg = 'bg-zinc-100';

  if (todayJournal) {
    const { mood, stress, energy, sleep_hours } = todayJournal.checkin;
    let sleepScore = 1;
    if (sleep_hours >= 7) sleepScore = 5;
    else if (sleep_hours >= 6) sleepScore = 4;
    else if (sleep_hours >= 5) sleepScore = 3;
    else if (sleep_hours >= 4) sleepScore = 2;

    const stressScore = 6 - stress;
    const avgScore = (mood + stressScore + energy + sleepScore) / 4;
    mentalPercentage = Math.round((avgScore / 5) * 100);

    if (mentalPercentage >= 80) { MentalIcon = Laugh; mentalColor = 'text-green-500'; mentalBg = 'bg-green-50'; }
    else if (mentalPercentage >= 60) { MentalIcon = Smile; mentalColor = 'text-teal-500'; mentalBg = 'bg-teal-50'; }
    else if (mentalPercentage >= 40) { MentalIcon = Meh; mentalColor = 'text-zinc-500'; mentalBg = 'bg-zinc-50'; }
    else if (mentalPercentage >= 20) { MentalIcon = Annoyed; mentalColor = 'text-orange-500'; mentalBg = 'bg-orange-50'; }
    else { MentalIcon = Frown; mentalColor = 'text-rose-500'; mentalBg = 'bg-rose-50'; }
  }

  // Trend Chart Data (Group by day)
  const chartDataMap = new Map();
  if (journals) {
    [...journals].reverse().forEach((j: any) => {
      const dateStr = format(parseUTC(j.created_at), 'yyyy-MM-dd');
      chartDataMap.set(dateStr, {
        day: format(parseUTC(j.created_at), 'EEE'),
        mood: j.checkin.mood,
        sleep: j.checkin.sleep_hours
      });
    });
  }
  const chartData = Array.from(chartDataMap.values()).slice(-7);

  const latestJournal = journals?.[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div className="mb-2">
        <h1 className="text-3xl font-bold text-zinc-900">Good Morning, {user?.email?.split('@')[0] || 'User'}</h1>
        <p className="text-zinc-500 mt-2">Let's check in with yourself today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="border-0 shadow-sm h-full flex flex-col justify-center items-center py-6">
            <div className={`p-4 rounded-full ${streak > 0 ? 'bg-orange-50 text-orange-500' : 'bg-zinc-50 text-zinc-400'} mb-4`}>
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-zinc-800">{streak}</h3>
            <p className="text-zinc-500 text-sm mt-1">Day Streak</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="border-0 shadow-sm h-full flex flex-col justify-center items-center py-6">
            {hasCheckedInToday ? (
              <>
                <div className={`p-4 rounded-full ${mentalBg} ${mentalColor} mb-4`}>
                  <MentalIcon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-zinc-800">{mentalPercentage}%</h3>
                <p className="text-zinc-500 text-sm mt-1">Mental State Today</p>
              </>
            ) : (
              <div className="text-center px-4">
                <div className="p-4 rounded-full bg-zinc-50 text-zinc-400 mb-4 inline-block">
                  <Meh className="w-8 h-8" />
                </div>
                <p className="text-zinc-500 text-sm">Check in today to see your mental state.</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col space-y-4">
          <Card className={`border-0 shadow-sm transition-shadow ${hasCheckedInToday ? 'bg-zinc-50' : 'bg-gradient-to-br from-teal-500 to-teal-700 text-white hover:shadow-md'}`}>
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className={`p-3 rounded-2xl ${hasCheckedInToday ? 'bg-zinc-200 text-zinc-500' : 'bg-white/20 text-white'}`}>
                {hasCheckedInToday ? <CheckCircle2 className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${hasCheckedInToday ? 'text-zinc-700' : 'text-white'}`}>Daily Check-in</h3>
                <p className={`text-sm mt-1 ${hasCheckedInToday ? 'text-zinc-500' : 'text-teal-100'}`}>
                  {hasCheckedInToday ? "You've checked in today." : "Take 1 minute to reflect."}
                </p>
              </div>
              {!hasCheckedInToday && (
                <Link to="/checkin" className="w-full mt-2">
                  <Button className="w-full bg-white text-teal-700 hover:bg-zinc-50 rounded-xl">Start Check-in</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row: Trend Chart & Quick Chat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TrendChart data={chartData} />
        </div>

        <div className="flex flex-col space-y-6">
          <Card className="border-0 shadow-sm bg-zinc-900 text-zinc-50 flex-1">
            <CardHeader>
              <CardTitle className="text-zinc-100 font-medium">Latest Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4 text-zinc-400 text-sm">Loading...</div>
              ) : latestJournal?.analysis?.reflection ? (
                <>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    "{latestJournal.analysis.reflection}"
                  </p>
                  <p className="text-xs text-zinc-500 mt-6">- Synora AI</p>
                </>
              ) : latestJournal && !latestJournal.analysis ? (
                <AILoadingIndicator className="py-2 scale-90" />
              ) : (
                <div className="text-zinc-400 text-sm italic py-4">
                  "Complete a check-in today to receive your personalized reflection from Synora."
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-200 text-indigo-700 rounded-lg">
                  <Target className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm font-semibold text-indigo-900">Next Step For You</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4 text-indigo-400 text-sm">Loading...</div>
              ) : latestJournal?.analysis?.recommendation ? (
                <p className="text-indigo-800 text-sm font-medium leading-relaxed">
                  {latestJournal.analysis.recommendation}
                </p>
              ) : latestJournal && !latestJournal.analysis ? (
                <AILoadingIndicator className="py-0 scale-75" />
              ) : (
                <p className="text-indigo-400 text-xs italic">
                  Check-in to get a personalized suggestion.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm group hover:border-indigo-100 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-800">Quick Chat</h3>
                  <p className="text-zinc-500 text-xs mt-1">Talk to Synora about how you feel.</p>
                </div>
              </div>
              <Link to="/chat">
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-indigo-600 hover:bg-indigo-50">→</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
