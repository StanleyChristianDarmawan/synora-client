import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, ShieldAlert, MapPin, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  useEffect(() => {
    document.body.style.backgroundColor = '#151719';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#151719] text-white font-sans selection:bg-[#1B7A7E]/30">

      <div className="min-h-screen flex flex-col">
        {/*navbar*/}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center">
            <img src="/images/synoraLogo.png" alt="Synora" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">Log In</Link>
            <Link to="/register">
              <Button className="bg-[#1B7A7E] hover:bg-[#1B7A7E]/80 text-white rounded-full px-6 text-sm h-9">
                Get started
              </Button>
            </Link>
          </div>
        </nav>

        {/*body*/}
        <section className="flex-1 flex flex-col items-center justify-center w-full pb-16">
          <div className="flex flex-col items-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/images/synoraLogo.png"
              alt="Synora"
              className="h-32 md:h-48 lg:h-56 w-auto mb-8"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="text-zinc-400 text-sm md:text-base tracking-[0.25em] uppercase font-small"
            >
              Every Emotion Tells a Story. We Help You Understand It.
            </motion.p>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            To Understand Your <span className="text-[#1B7A7E]">Emotions</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            A measurable preventive solution integrating Smart Daily Journals and telemetric monitoring to prevent burnout syndrome and clinical depression.
          </p>

          <div className="pt-4">
            <Link to="/register">
              <Button size="lg" className="bg-[#1B7A7E] hover:bg-[#1B7A7E]/80 text-white rounded-full px-8 h-12 text-base">
                Start to Create your Journal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div>
            <img src="/images/hero.png" alt="AI Mental Health Concept" className="w-full h-auto object-cover" />
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold inline-block relative">
            Why Is This App Needed?
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1B7A7E] rounded-full"></div>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <ShieldAlert className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100", text: "Mental health burdens are worsening in areas with high urbanization and intense industrial activity." },
            { icon: <MapPin className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100", text: "There are millions of absolute mental health cases, with West Java, Banten, and Jakarta being the main hotspot clusters." },
            { icon: <ShieldAlert className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100", text: "81% of adolescents (15-24 years) experiencing depression have manifested thoughts of ending their lives." },
            { icon: <FileText className="w-5 h-5 text-slate-500" />, bg: "bg-slate-100", text: "Long conventional mental surveys trigger respondent fatigue. A precise and lightweight self-reporting tool is needed." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2, ease: "easeOut", delay: 0 }
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-zinc-900 shadow-xl shadow-black/20 cursor-default"
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center pb-32">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#DED7CF] rounded-[2rem] p-8"
        >
          <img src="/images/tablet.png" alt="Smart Journal Tablet" className="w-full h-auto object-cover rounded-xl shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="text-zinc-300 text-xs md:text-sm font-bold tracking-widest uppercase">
            KEY FEATURE
          </div>

          <h3 className="text-3xl font-bold">Smart Daily Journal</h3>

          <ul className="space-y-4">
            {[
              "Digital transposition of Expressive Writing Therapy clinically proven to lower heart rate and stress hormones.",
              "Helps organize raw emotions into narratives for cognitive mastery over stress triggers.",
              "Autonomous screening instrument using Natural Language Processing (NLP) algorithms."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1B7A7E] shrink-0 mt-1.5" />
                <span className="text-sm text-zinc-400 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center pb-32">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 md:order-1 order-2"
        >
          <div className="text-zinc-300 text-xs md:text-sm font-bold tracking-widest uppercase">
            VISUAL MONITORING
          </div>

          <h3 className="text-3xl font-bold">Visual Dashboard Tracker</h3>

          <ul className="space-y-4">
            {[
              "Visual monitoring of three vital axes: sleep duration, energy levels, and mental load intensity.",
              "Detects threats of cognitive dysfunction due to lack of sleep.",
              "Provides predictive visual maps to neutralize hazards before mutating into chronic burnout."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                <span className="text-sm text-zinc-400 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:order-2 order-1"
        >
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2rem] p-4 shadow-2xl border border-zinc-800">
            <img src="/images/dashboard.png" alt="Dashboard Tracker" className="w-full h-auto object-cover rounded-xl" />
          </div>
        </motion.div>
      </section>

      {/*footer*/}
      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/synora.png" alt="Synora Icon" className="w-5 h-5 opacity-40 grayscale" />
            <span className="text-zinc-500 text-sm">© {new Date().getFullYear()} Synora. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-[#1B7A7E] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1B7A7E] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1B7A7E] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
