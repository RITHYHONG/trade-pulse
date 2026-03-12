"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase">
          App Configuration
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform behavior and metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Trade Pulse" className="bg-slate-950 border-slate-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@tradepulse.ai" className="bg-slate-950 border-slate-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Security & Access</CardTitle>
            <CardDescription>Control authentication and user roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="space-y-0.5">
                <Label>Public Registrations</Label>
                <p className="text-[10px] text-slate-500">Allow new users to sign up.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="space-y-0.5">
                <Label>Admin Approval</Label>
                <p className="text-[10px] text-slate-500">Require approval for new accounts.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}
