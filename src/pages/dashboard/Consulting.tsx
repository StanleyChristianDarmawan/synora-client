import { useQuery } from '@tanstack/react-query';
import { JournalService } from '@/services/journal.service';
import { psychologists, type Psychologist, getRecommendedPsychologist } from '@/data/psychologists';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar, MessageCircle, HeartPulse } from 'lucide-react';
import { useMemo } from 'react';
import { AILoadingIndicator } from '@/components/features/ai-loading';

export default function ConsultingPage() {
  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => JournalService.getJournals(1, 0),
  });

  const latestJournal = journals?.[0];
  const analysis = latestJournal?.analysis;

  const { recommended, others } = useMemo(() => {
    const recDoc = getRecommendedPsychologist(analysis);
    const rest = psychologists.filter(d => d.id !== recDoc.id);

    return { recommended: recDoc, others: rest };
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <AILoadingIndicator />
      </div>
    );
  }

  const renderDoctorCard = (doc: Psychologist, isRecommended = false) => (
    <Card key={doc.id} className={`overflow-hidden transition-all hover:shadow-md dark:bg-zinc-900 border ${isRecommended ? 'border-teal-200 dark:border-teal-900 shadow-md ring-1 ring-teal-100 dark:ring-teal-900' : 'border-zinc-100 dark:border-zinc-800'}`}>
      {isRecommended && (
        <div className="bg-teal-50 dark:bg-teal-900/40 px-4 py-2 flex items-center gap-2 border-b border-teal-100 dark:border-teal-900">
          <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Top Recommendation for You</span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={doc.avatar} alt={doc.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800" />
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{doc.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {doc.specialty.map(spec => (
                  <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {doc.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{doc.experience} Years Exp.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-start pt-2 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 md:pl-6 w-full md:w-48">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-teal-500" />
          Professional Consultation
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Connect with certified psychologists and counselors based on your specific needs and recent reflections.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Recommended Match</h2>
        {renderDoctorCard(recommended, true)}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Other Specialists</h2>
        <div className="grid grid-cols-1 gap-6">
          {others.map(doc => renderDoctorCard(doc, false))}
        </div>
      </div>
    </div>
  );
}
