
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { AILoadingIndicator } from '@/components/features/ai-loading';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">AI Reflection</h1>
        <p className="text-zinc-500 mt-2">Deep insights generated from your recent journals and check-ins.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <p>Loading...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><TrendingUp className="w-5 h-5" /></div>
                <CardTitle className="text-lg text-indigo-950">Emotional Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-800 mb-2 capitalize">{analysis.emotion}</div>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {analysis.summary}
                </p>
                {analysis.topics && analysis.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.topics.map((topic: string) => (
                      <span key={topic} className="px-3 py-1 bg-indigo-100/50 text-indigo-700 rounded-full text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-700"><AlertTriangle className="w-5 h-5" /></div>
                <CardTitle className="text-lg text-orange-950">Risk Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 leading-relaxed">
                  <strong>Risk Level: {analysis.risk_level}</strong>
                  <br /><br />
                  {analysis.risk_reasoning || "No immediate signs of severe burnout detected. Keep maintaining your well-being."}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2 border-b border-zinc-50">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-700"><Lightbulb className="w-5 h-5" /></div>
              <CardTitle className="text-lg text-zinc-800">Supportive Reflection</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-zinc max-w-none text-zinc-700 whitespace-pre-wrap">
                {analysis.reflection}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : latestJournal && !analysis ? (
        <AILoadingIndicator className="py-20" />
      ) : (
        <Card className="border-0 shadow-sm flex items-center justify-center py-20">
          <p className="text-zinc-500">
            Please submit a check-in to get an AI reflection.
          </p>
        </Card>
      )}
    </div>
  );
}
