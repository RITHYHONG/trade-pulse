import { Metadata } from 'next';
import Image from 'next/image';
import {
  Quote,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Users,
  LineChart,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// import Right from "../"

export const metadata: Metadata = {
  title: 'About Us | Trader Pulse',
  description: 'We take pride in delivering exceptional market analysis results.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <div className='container mx-auto px-4 md:px-6 max-w-7xl'>
        {/* Hero Section */}
        <section className="pt-32 pb-20 container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-secondary mb-4">
              <span className="w-2 h-2 rounded-full bg-primary mx-2"></span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground pr-2">Who we are</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight animate-in slide-in-from-bottom-4 fade-in duration-700">
              We take pride in delivering <br />
              <span className="text-primary/90">Exceptional results</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-5 fade-in duration-700 delay-100">
              Our specialized team provides bespoke high-performance
              market analysis and technological trading intelligence.
            </p>
          </div>

          {/* Hero Image Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px] animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
            {/* Large Left Image */}
            <div className="md:col-span-7 h-full rounded-3xl bg-secondary/50 border border-border/50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <Image
                src="/images/about/strategic-vision.png"
                alt="Strategic Vision - Market Analysis Dashboard"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent dark:from-background/80 dark:via-background/40 p-8 flex flex-col justify-end group-hover:bg-black/70 dark:group-hover:bg-background/60 transition-colors duration-500">
                <Target className="w-16 h-16 text-primary/80 mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                <p className="text-sm font-medium text-foreground drop-shadow">Strategic Vision</p>
              </div>
            </div>

            {/* Right Column Images */}
            <div className="md:col-span-5 h-full flex flex-col gap-4">
              <div className="h-1/2 rounded-3xl bg-secondary/30 border border-border/50 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                <Image
                  src="/images/about/analytics.png"
                  alt="Analytics Dashboard"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent dark:from-background/80 dark:via-background/40 p-8 flex flex-col justify-end group-hover:bg-black/70 dark:group-hover:bg-background/60 transition-colors duration-500">
                  <LineChart className="w-12 h-12 text-primary/80 mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                  <p className="text-sm font-medium text-foreground drop-shadow">Analytics</p>
                </div>
              </div>
              <div className="h-1/2 rounded-3xl bg-secondary/30 border border-border/50 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                <Image
                  src="/images/about/network.png"
                  alt="Global Network"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent dark:from-background/80 dark:via-background/40 p-8 flex flex-col justify-end group-hover:bg-black/70 dark:group-hover:bg-background/60 transition-colors duration-500">
                  <Users className="w-12 h-12 text-primary/80 mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                  <p className="text-sm font-medium text-foreground drop-shadow">Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center relative">
            <Quote className="w-12 h-12 text-primary/30 dark:text-primary/20 absolute -top-8 left-0 md:-left-12 -z-10 animate-in fade-in duration-1000 delay-300" />
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 relative z-10">
              &quot;We believe great trading starts with empathy and ends with impact.
              Our approach is simple: listen closely, solve creatively, and build with purpose.&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">KK</div>
              <div className="text-left">
                <div className="font-semibold text-sm">Kakapo</div>
                <div className="text-xs text-muted-foreground">Founder & CEO</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-24 bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-2 block">Our Talent</span>
              <h2 className="text-3xl font-bold">Meet the team</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Kakapo", role: "CEO & Founder" },
                { name: "Michael Chen", role: "CTO" },
                { name: "Emily Rodriguez", role: "Head of Research" },
                { name: "David Kim", role: "Senior Analyst" }
              ].map((member, i) => (
                <div key={i} className="group rounded-2xl bg-background border border-border/50 p-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="aspect-[4/5] bg-secondary/50 rounded-xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 dark:text-muted-foreground/20 group-hover:scale-105 transition-transform duration-500 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
                      <Users className="w-16 h-16" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Awards Section */}
        <section className="py-24 container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-2 block">Recognition</span>
              <h2 className="text-3xl font-bold mb-6">Awards</h2>
              <p className="text-muted-foreground">
                We are honored to be recognized by industry leaders for our commitment to excellence and innovation.
              </p>
            </div>
            <div className="md:col-span-8 space-y-6">
              {[
                { year: "2024", title: "Top Market Intelligence Platform", org: "FinTech Global" },
                { year: "2024", title: "Best Analytics Solution", org: "Trading Weekly Innovation" },
                { year: "2023", title: "Excellence in AI Application", org: "Tech Finance Awards" },
                { year: "2023", title: "Startup of the Year", org: "Enterprise Hub" }
              ].map((award, i) => (
                <div key={i} className="flex items-center justify-between py-6 border-b border-border hover:bg-secondary/20 transition-colors px-4 rounded-lg group cursor-default">
                  <div className="space-y-1">
                    <div className="font-bold text-lg group-hover:text-primary transition-colors">{award.title}</div>
                    <div className="text-sm text-muted-foreground">{award.org}</div>
                  </div>
                  <div className="text-sm font-medium opacity-50">{award.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section (Why work with us) */}
        <section className="py-24 bg-card/30">
          <div className="container mx-auto px-4 md:px-6 text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-2 block">Value</span>
            <h2 className="text-3xl font-bold">Why work with us?</h2>
            <p className="text-muted-foreground mt-2">See how we stack up against the competition</p>
          </div>

          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Others */}
              <div className="rounded-3xl p-8 border border-border bg-background/70 dark:bg-background/50 opacity-80 dark:opacity-70 hover:opacity-100 transition-opacity">
                <h3 className="text-xl font-bold mb-8 text-muted-foreground flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Other Platforms
                </h3>
                <ul className="space-y-6">
                  {['Generalized Market Data', 'Delayed Signals (15m+)', 'Manual Formatting', 'Hidden Fees', 'Generic Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <XCircle className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Us */}
              <div className="rounded-3xl p-8 border border-primary/20 bg-background shadow-xl shadow-primary/5 hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trophy className="w-32 h-32 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-8 text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Trader Pulse
                </h3>
                <ul className="space-y-6">
                  {['Tailored Institutional Insights', 'Real-time Execution', 'AI-Driven Formatting', 'Transparent Pricing', '24/7 Expert Community'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 container mx-auto px-4 md:px-6 ">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-2 block">Support</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Have questions? <br />
                We got answers.
              </h2>
              <p className="text-muted-foreground mb-8">
                Can&apos;t find what you&apos;re looking for? Chat with our team directly.
              </p>
              <Button asChild variant="outline" className="gap-2 group">
                <Link href="/contact">
                  Contact Support <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="md:col-span-7">
              <Accordion type="single" collapsible className="w-full ">
                {[
                  { q: "How real-time is the data?", a: "Our data pipelines are directly connected to major exchanges with sub-millisecond latency." },
                  { q: "Can I upgrade my plan later?", a: "Absolutely. You can switch between plans at any time with prorated billing." },
                  { q: "Is there a mobile application?", a: "Yes, our fully native iOS and Android apps allow you to track markets on the go." },
                  { q: "Do you offer API access?", a: "Enterprise plans include full REST and WebSocket API access for custom integrations." }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-lg font-medium cursor-pointer">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 p-1 px-3 rounded-full dark:bg-primary/10 bg-primary/40 text-primary text-sm font-medium ">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Limited Time Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Join 1500+ professionals <br />
              elevating their brand
            </h2>
            <p className="text-xl text-muted-foreground">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105">
                <Link href="/signup">
                  Get Started Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}