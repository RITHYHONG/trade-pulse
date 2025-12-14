import { Metadata } from 'next';
import { TrendingUp, Target, Users, Zap, Award, Shield, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Trader Pulse',
  description: 'Learn about Trader Pulse - Your trusted partner in pre-market trading intelligence and market analysis.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-2 mb-8">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">About Trader Pulse</span>
            </div>v

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Empowering Traders with
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Market Intelligence
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              We&apos;re on a mission to democratize trading intelligence, providing retail traders with 
              institutional-grade market analysis and pre-market insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Traders', value: '50K+', icon: Users },
              { label: 'Daily Analyses', value: '1000+', icon: BarChart3 },
              { label: 'Success Rate', value: '94%', icon: Award },
              { label: 'Markets Covered', value: '20+', icon: Globe },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 mb-4">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Founded in 2023, Trader Pulse was born from a simple observation: retail traders 
                    deserve the same quality of market intelligence that institutional investors have 
                    enjoyed for decades.
                  </p>
                  <p>
                    Our founders, seasoned traders and technologists, experienced firsthand the 
                    information gap that exists in the market. They set out to bridge that gap by 
                    creating a platform that combines cutting-edge AI technology with deep market 
                    expertise.
                  </p>
                  <p>
                    Today, Trader Pulse serves thousands of traders worldwide, helping them make 
                    informed decisions with confidence and precision.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <TrendingUp className="w-24 h-24 text-cyan-400 mx-auto" />
                      <p className="text-2xl font-bold text-white">Excellence in Trading</p>
                      <p className="text-gray-400">Powered by Innovation</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 blur"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Mission & Values</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Guided by principles that put our traders first
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  description: 'To empower every trader with institutional-grade market intelligence, making professional trading accessible to all.',
                  gradient: 'from-cyan-500 to-blue-500',
                },
                {
                  icon: Zap,
                  title: 'Innovation First',
                  description: 'We leverage cutting-edge AI and machine learning to deliver real-time insights that give you an edge in the market.',
                  gradient: 'from-blue-500 to-purple-500',
                },
                {
                  icon: Shield,
                  title: 'Trust & Transparency',
                  description: 'We believe in honest, transparent analysis. Our track record speaks for itself, and we stand behind every insight.',
                  gradient: 'from-purple-500 to-pink-500',
                },
              ].map((value, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition duration-300 blur-xl from-cyan-500 to-blue-500"></div>
                  <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition duration-300">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} bg-opacity-20 mb-6`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Traders Choose Us</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                More than just data - we provide actionable intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Real-Time Market Analysis',
                  description: 'Get instant insights on market movements, pre-market trends, and breaking news that impacts your trades.',
                },
                {
                  title: 'AI-Powered Predictions',
                  description: 'Our advanced algorithms analyze millions of data points to identify high-probability trading opportunities.',
                },
                {
                  title: 'Expert Community',
                  description: 'Join thousands of successful traders sharing strategies, insights, and support in our vibrant community.',
                },
                {
                  title: 'Risk Management Tools',
                  description: 'Built-in risk assessment and position sizing calculators help you protect your capital and maximize returns.',
                },
                {
                  title: 'Multi-Asset Coverage',
                  description: 'From stocks to forex, crypto to commodities - we cover all major markets in one unified platform.',
                },
                {
                  title: 'Mobile-First Design',
                  description: 'Trade on the go with our responsive platform that works seamlessly across all your devices.',
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Experienced traders and technologists working together
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Founder & CEO',
                  bio: '15+ years in algorithmic trading',
                },
                {
                  name: 'Michael Chen',
                  role: 'CTO',
                  bio: 'Former quantitative analyst at Goldman Sachs',
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Head of Research',
                  bio: 'PhD in Financial Economics from MIT',
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50 blur"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-400 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-400">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Trading?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of successful traders who trust Trader Pulse for their market intelligence
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button className="bg-primary px-8 py-6 text-lg">
                      Start Your Free Trial
                    </Button>
                  </Link>
                  <Link href="/blog">
                    <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-lg">
                      Read Our Blog
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}