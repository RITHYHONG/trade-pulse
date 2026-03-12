"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  Settings, 
  Shield, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Lock,
  Globe,
  Zap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Suspense } from "react";

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  recentUsers: any[];
  recentPosts: any[];
  systemStatus: string;
  lastUpdate: string;
}

function AdminDashboardContent() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/detailed-stats");
      const result = await response.json();
      if (result.success) {
        setData({
          ...result.stats,
          systemStatus: "healthy",
          lastUpdate: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      toast.error("Failed to load admin stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (val: string) => {
    router.push(`/admin?tab=${val}`);
  };

  const runCronJob = async (force = false) => {
    setIsGenerating(true);
    const id = toast.loading(force ? "Super-Admin override: Force generating post..." : "Searching global markets for new news...");
    
    try {
      const url = `/api/cron/generate-blog${force ? "?force=true" : ""}`;
      const response = await fetch(url);
      const dataRes = await response.json();
      
      if (dataRes.success) {
        toast.success(`Success: ${dataRes.title}`, { id });
        fetchDetailedStats(); // Refresh table
      } else {
        toast.info(dataRes.message || "Markets are clean. No duplicates found.", { id });
      }
    } catch (error) {
      toast.error("Generation failed. Check system logs.", { id });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPosts = data?.recentPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase">
              {activeTab === 'overview' ? 'Super Admin Portal' : 
               activeTab === 'blog' ? 'Blog Analytics' :
               activeTab === 'automation' ? 'System Automations' :
               activeTab === 'users' ? 'User Base' : 'Admin Portal'}
            </h1>
          </div>
          <p className="text-slate-400 mt-2 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" /> Global Control & Automation Hub
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchDetailedStats} className="border-slate-800 bg-slate-900 hover:bg-slate-800">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync System
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl hidden">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Users", value: data?.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Total Articles", value: data?.totalPosts, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
              { label: "API Health", value: data?.systemStatus, icon: Shield, color: "text-orange-400", bg: "bg-orange-400/10" },
            ].map((card, i) => (
              <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
                      <h3 className="text-3xl font-black mt-1 text-slate-50">{card.value ?? "..."}</h3>
                    </div>
                    <div className={`p-3 ${card.bg} rounded-xl`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="bg-slate-900/40 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events from across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.recentPosts?.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                      <div className="p-2 bg-emerald-400/10 rounded-lg">
                        <FileText className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold truncate">{post.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase">New Post Published</p>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">{new Date().toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current infrastructure status and alerts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Public Registrations", status: "Active", color: "text-emerald-500" },
                    { label: "AI Chat Widget", status: "Active", color: "text-emerald-500" },
                    { label: "Market Data Feeds", status: "Healthy", color: "text-emerald-500" },
                    { label: "Premium Mode", status: "Disabled", color: "text-slate-500" },
                  ].map((flag, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                      <span className="text-sm font-medium text-slate-300">{flag.label}</span>
                      <Badge variant="outline" className={`${flag.color} border-current/20 text-[10px]`}>{flag.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          <Card className="bg-slate-900/40 border-slate-800 shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-bold">Published Content</CardTitle>
                <CardDescription>Monitor performance and edit all platform articles.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Filter posts..." 
                  className="pl-9 bg-slate-950 border-slate-800 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-900/80">
                    <TableRow className="hover:bg-transparent border-slate-800">
                      <TableHead className="w-[400px] text-slate-400">Article Title</TableHead>
                      <TableHead className="text-slate-400">Category</TableHead>
                      <TableHead className="text-slate-400">Views</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts?.map((post) => (
                      <TableRow key={post.id} className="border-slate-800 hover:bg-slate-900/40 group transition-colors">
                        <TableCell className="font-semibold text-slate-200">
                          <div className="flex flex-col">
                            <span>{post.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{new Date(post.createdAt).toLocaleDateString()} • {post.authorName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2">
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 font-mono text-xs">{post.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-medium text-[10px]">
                            {post.isDraft ? (
                              <><div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Draft</>
                            ) : (
                              <><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Live</>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                              <DropdownMenuLabel>Article Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> View Live
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" /> Edit Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
          {/* AI Generator Card */}
          <Card className="bg-slate-900/40 border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/20 rounded">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                Gemini AI Autopilot
              </CardTitle>
              <CardDescription>Manage your 24/7 automated market news generation system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unique Check</p>
                  <p className="text-lg font-bold text-emerald-400">ENABLED</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cron Frequency</p>
                  <p className="text-lg font-bold">6hrs</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => runCronJob(false)} 
                  disabled={isGenerating}
                  className="w-full bg-primary hover:bg-primary/90 font-bold h-12 shadow-lg shadow-primary/20"
                >
                  {isGenerating ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                  Trigger Global Sync
                </Button>
                <Button 
                  variant="outline" 
                   onClick={() => runCronJob(true)} 
                  disabled={isGenerating}
                  className="w-full border-red-900/30 bg-red-950/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold h-12"
                >
                  Super-Admin Force Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings Mini Card */}
           <Card className="bg-slate-900/40 border-slate-800 shadow-2xl h-fit">
            <CardHeader>
              <CardTitle>System Flags</CardTitle>
              <CardDescription>Toggle global platform features instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Public Registrations", status: "Active", color: "text-emerald-500" },
                { label: "AI Chat Widget", status: "Active", color: "text-emerald-500" },
                { label: "Market Data Feeds", status: "Healthy", color: "text-emerald-500" },
                { label: "Premium Mode", status: "Disabled", color: "text-slate-500" },
              ].map((flag, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-sm font-medium text-slate-300">{flag.label}</span>
                  <Badge variant="outline" className={`${flag.color} border-current/20 text-[10px]`}>{flag.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          <Card className="bg-slate-900/40 border-slate-800 shadow-2xl overflow-hidden min-h-[400px]">
            <CardHeader>
              <CardTitle>Global User Directory</CardTitle>
              <CardDescription>Search and modify entire platform user base across all tiers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
                <Table>
                   <TableHeader className="bg-slate-900/80">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">User Identification</TableHead>
                      <TableHead className="text-slate-400">Authority Role</TableHead>
                      <TableHead className="text-slate-400">Join Date</TableHead>
                      <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentUsers?.map((user: any) => (
                      <TableRow key={user.id} className="border-slate-800 hover:bg-slate-900/40">
                        <TableCell className="font-semibold text-slate-200">
                           <div className="flex flex-col">
                            <span>{user.name || user.displayName || "Unknown"}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-slate-700/20 text-slate-400'}`}>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="hover:bg-slate-800 text-slate-400">
                            Edit Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 animate-pulse text-slate-400">Loading Control Center...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
