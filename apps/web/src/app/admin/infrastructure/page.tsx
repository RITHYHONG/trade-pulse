"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Server, 
  Cpu, 
  Database, 
  HardDrive, 
  RefreshCw,
  Globe,
  Wifi,
  CloudLightning
} from "lucide-react";
import { useEffect, useState } from "react";

export default function InfrastructurePage() {
  const [lastCheck, setLastCheck] = useState<string>("");

  useEffect(() => {
    setLastCheck(new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Shield className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase">
              System Infrastructure
            </h1>
            <p className="text-slate-400 mt-1 text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" /> Live Health Monitoring
            </p>
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Last Health Check</p>
          <p className="text-sm font-bold text-emerald-400">{lastCheck}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Firestore DB", status: "Healthy", latency: "42ms", icon: Database, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Gemini API", status: "Active", latency: "124ms", icon: CloudLightning, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Storage", status: "Operational", latency: "0.8s", icon: HardDrive, color: "text-purple-400", bg: "bg-purple-400/10" },
        ].map((service) => (
          <Card key={service.label} className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${service.bg} rounded-xl`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[10px]">
                  {service.status}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{service.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-50">{service.latency}</h3>
                  <p className="text-[10px] text-slate-600 font-bold uppercase">Latency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/40 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-slate-400" /> Server Resources
            </CardTitle>
            <CardDescription>Real-time compute utilization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "CPU Usage", value: 34 },
              { label: "Memory Usage", value: 68 },
              { label: "Concurrent Sessions", value: 12 },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{stat.label}</span>
                  <span className="text-slate-200">{stat.value}%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-primary" style={{ width: `${stat.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-slate-400" /> Network Flow
            </CardTitle>
            <CardDescription>Inbound and outbound data traffic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Requests / Min</p>
                  <p className="text-xl font-black text-white">412</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Bandwidth</p>
                  <p className="text-xl font-black text-white">2.4 GB</p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Server className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
