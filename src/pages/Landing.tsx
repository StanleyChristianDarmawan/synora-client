import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-100">
          <Sparkles className="w-4 h-4" />
          <span>Your personal AI Mental Wellness Companion</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight">
          Synora.
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Helping you notice yourself before it's too late. A calm space for daily reflection and deep insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/register">
            <Button size="lg" className="rounded-full h-14 px-8 text-base w-full sm:w-auto">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base w-full sm:w-auto">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
