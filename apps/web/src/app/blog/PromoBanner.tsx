import { ArrowRight, Sparkles } from 'lucide-react';

export function PromoBanner() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 my-12">
      <a 
        href="https://www.binance.com" 
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-1 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/10 blur-3xl group-hover:bg-yellow-500/20 transition-all duration-500" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 w-full">


          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-slate-800/50 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-700/50 mb-3 uppercase tracking-wider">
              Exclusive Offer
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
              Start your <span className="text-yellow-500">trading journey</span> with the best
            </h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
              Join the world's most trusted exchange and enjoy the lowest fees. 
              Limited time bonus up to <span className="text-yellow-500 font-semibold">$100</span>.
            </p>
          </div>

          {/* Right Side: Button */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-8 text-sm font-bold text-slate-950 transition-all hover:bg-yellow-400 active:scale-95 shadow-[0_10px_20px_-10px_rgba(234,179,8,0.5)] group-hover:shadow-[0_15px_30px_-10px_rgba(234,179,8,0.6)] w-full md:w-auto">
              Trade on Binance
              <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
