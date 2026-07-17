
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { AILoadingIndicator } from '@/components/features/ai-loading';
import { getRecommendedPsychologist } from '@/data/psychologists';
import { Link } from 'react-router-dom';

export default function ReflectionPage() {
  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(1, 0),
    refetchInterval: (query) => {
      const data = query.state.data as any[];
      if (data && data.length > 0 && !data[0].analysis) {
        return 3000;
      }
      return false;
    }
  });

  const latestJournal = journals?.[0];
  const analysis = latestJournal?.analysis;

  const isHighRisk = analysis?.risk_level?.toLowerCase().includes('high') || analysis?.risk_level?.toLowerCase().includes('severe');
  const recommendedDoctor = isHighRisk ? getRecommendedPsychologist(analysis) : null;

  const getRiskColors = (level: string = '') => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('high') || lowerLevel.includes('severe')) {
      return {
        bg: 'from-rose-50 to-white dark:from-rose-950/40 dark:to-zinc-900',
        iconBg: 'bg-rose-100 dark:bg-rose-900/40',
        iconText: 'text-rose-700 dark:text-rose-400',
        title: 'text-rose-950 dark:text-rose-50',
        levelText: 'text-rose-600 dark:text-rose-400'
      };
    } else if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
      return {
        bg: 'from-orange-50 to-white dark:from-orange-950/40 dark:to-zinc-900',
        iconBg: 'bg-orange-100 dark:bg-orange-900/40',
        iconText: 'text-orange-700 dark:text-orange-400',
        title: 'text-orange-950 dark:text-orange-50',
        levelText: 'text-orange-600 dark:text-orange-400'
      };
    } else {
      return {
        bg: 'from-green-50 to-white dark:from-green-950/40 dark:to-zinc-900',
        iconBg: 'bg-green-100 dark:bg-green-900/40',
        iconText: 'text-green-700 dark:text-green-400',
        title: 'text-green-950 dark:text-green-50',
        levelText: 'text-green-600 dark:text-green-400'
      };
    }
  };

  const riskColors = getRiskColors(analysis?.risk_level);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">AI Reflection</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Deep insights generated from your recent journals and check-ins.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
          <p>Loading...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-zinc-900">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-700 dark:text-indigo-400"><TrendingUp className="w-5 h-5" /></div>
                <CardTitle className="text-lg text-indigo-950 dark:text-indigo-50">Emotional Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 capitalize">{analysis.emotion}</div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
                  {analysis.summary}
                </p>
                {analysis.topics && analysis.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.topics.map((topic: string) => (
                      <span key={topic} className="px-3 py-1 bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-sm bg-gradient-to-br ${riskColors.bg}`}>
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className={`p-2 rounded-lg ${riskColors.iconBg} ${riskColors.iconText}`}><AlertTriangle className="w-5 h-5" /></div>
                <CardTitle className={`text-lg ${riskColors.title}`}>Risk Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Risk Level: <span className={`${riskColors.levelText} font-bold uppercase tracking-wider`}>{analysis.risk_level}</span></strong>
                  <br /><br />
                  {analysis.risk_reasoning || "No immediate signs of severe burnout detected. Keep maintaining your well-being."}
                </p>

                {recommendedDoctor && (
                  <div className="mt-4 p-4 bg-white/60 dark:bg-zinc-950/40 rounded-xl border border-rose-100 dark:border-rose-900/30 shadow-sm">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                      Based on the analysis of your current condition, we highly recommend consulting with a professional:
                    </p>
                    <div className="flex items-center gap-3">
                      <img src={recommendedDoctor.avatar} alt={recommendedDoctor.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-100 dark:ring-rose-900/50" />
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{recommendedDoctor.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Specializes in {recommendedDoctor.specialty[0]}</p>
                      </div>
                      <Link to="/consulting" className="ml-auto">
                        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2 border-b border-zinc-50 dark:border-zinc-800/50">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg text-teal-700 dark:text-teal-400"><Lightbulb className="w-5 h-5" /></div>
              <CardTitle className="text-lg text-zinc-800 dark:text-zinc-100">Supportive Reflection</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {analysis.reflection}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : latestJournal && !analysis ? (
        <AILoadingIndicator className="py-20" />
      ) : (
        <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center py-20 bg-white dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Please submit a check-in to get an AI reflection.
          </p>
        </Card>
      )}
    </div>
  );
}
