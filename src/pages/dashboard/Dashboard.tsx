import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Flame, Frown, Annoyed, Meh, Smile, Laugh, CheckCircle2, Edit3, Target, Edit } from 'lucide-react';
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
  let MentalIconSrc = '/neutral.png';
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

    if (mentalPercentage >= 80) { MentalIconSrc = '/amazing.png'; mentalColor = 'text-green-500'; mentalBg = 'bg-green-50'; }
    else if (mentalPercentage >= 60) { MentalIconSrc = '/happy.png'; mentalColor = 'text-teal-500'; mentalBg = 'bg-teal-50'; }
    else if (mentalPercentage >= 40) { MentalIconSrc = '/neutral.png'; mentalColor = 'text-zinc-500'; mentalBg = 'bg-zinc-50'; }
    else if (mentalPercentage >= 20) { MentalIconSrc = '/no.png'; mentalColor = 'text-orange-500'; mentalBg = 'bg-orange-50'; }
    else { MentalIconSrc = '/sad.png'; mentalColor = 'text-rose-500'; mentalBg = 'bg-rose-50'; }
  }

  // Trend Chart Data (Group by day)
  const chartDataMap = new Map();
  if (journals) {
    [...journals].reverse().forEach((j: any) => {
      const dateStr = format(parseUTC(j.created_at), 'yyyy-MM-dd');
      chartDataMap.set(dateStr, {
        day: format(parseUTC(j.created_at), 'EEE'),
        date: dateStr,
        mood: j.checkin.mood,
        sleep: j.checkin.sleep_hours
      });
    });
  }
  const fullChartData = Array.from(chartDataMap.values());
  const latestJournal = journals?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-zinc-900">Good Morning, {user?.email?.split('@')[0] || 'User'}</h1>
        <p className="text-zinc-500 mt-2">Let's check in with yourself today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col space-y-6">

          {/* Next Step For You (Daily Affirmation replacement) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-0 shadow-sm h-[280px] bg-gradient-to-br from-[#e0f7f4] to-[#f4fcfa] overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-3xl mix-blend-overlay"></div>
              <CardContent className="p-10 relative z-10 flex flex-col justify-center h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="w-5 h-5 text-teal-700" />
                  <h2 className="text-sm font-semibold tracking-wider text-teal-800 uppercase">Next Step For You</h2>
                </div>
                {isLoading ? (
                  <div className="text-teal-700/50">Loading your next step...</div>
                ) : !hasCheckedInToday ? (
                  <p className="text-xl font-serif text-teal-800/60 leading-relaxed italic">
                    You haven't checked in today.
                  </p>
                ) : latestJournal?.analysis?.recommendation ? (
                  <p className="text-2xl font-serif text-teal-900 leading-relaxed max-w-xl">
                    {latestJournal.analysis.recommendation}
                  </p>
                ) : (
                  <AILoadingIndicator className="py-2 scale-90" />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="h-[320px]">
              <TrendChart data={fullChartData} />
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col space-y-6">

          {/* Daily Check-in Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            {hasCheckedInToday ? (
              <Card className="border border-green-100 shadow-sm bg-green-50/50 opacity-80 cursor-default">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-900">Daily Check-in</h3>
                    <p className="text-sm text-green-700/70 mt-1 font-medium">
                      Completed for today!
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Link to="/checkin" className="block">
                <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 group transform hover:-translate-y-1">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Daily Check-in</h3>
                      <p className="text-sm text-teal-50 mt-1 font-medium">
                        Reflect on your day now →
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-teal-600 transition-colors">
                      <Edit className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </motion.div>

          {/* Day Streak Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="border border-zinc-100 shadow-sm bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-zinc-900">Day Streak</h3>
                  <p className="text-sm text-zinc-500 mt-1">Keep up the consistency</p>
                </div>
                <div className="flex items-center space-x-1 px-4 py-2 rounded-full bg-[#fff4f0] text-orange-500 font-bold">
                  <span className="text-xl">{streak}</span>
                  <Flame className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mental State Today Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="border border-zinc-100 shadow-sm bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-zinc-900">Mental State</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {hasCheckedInToday ? "Your score today" : "You haven't checked in today."}
                  </p>
                </div>
                {hasCheckedInToday ? (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${mentalBg} ${mentalColor} font-bold`}>
                    <span className="text-xl">{mentalPercentage}%</span>
                    <img src={MentalIconSrc} alt="Mental State" className="w-8 h-8 object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center">
                    <img src="/neutral.png" alt="No data" className="w-8 h-8 opacity-50 grayscale object-contain" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Latest Reflection Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex-1">
            <Card className="border border-zinc-100 shadow-sm bg-[#fafafa] h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">Latest Reflection</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {isLoading ? (
                  <div className="text-zinc-400 text-sm">Loading...</div>
                ) : !hasCheckedInToday ? (
                  <div className="text-zinc-400 text-sm italic">
                    You haven't checked in today.
                  </div>
                ) : latestJournal?.analysis?.reflection ? (
                  <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap">
                    "{latestJournal.analysis.reflection}"
                  </p>
                ) : (
                  <AILoadingIndicator className="py-2 scale-90" />
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
