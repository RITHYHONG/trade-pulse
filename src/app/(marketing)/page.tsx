import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { ProblemSolution } from "./components/ProblemSolution";
import { SocialProof } from "./components/SocialProof";

export default function MarketingHome() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <Hero />
      <ProblemSolution />
      <Features />
      <SocialProof />
      <Pricing />
      <Footer />
    </div>
  );
}