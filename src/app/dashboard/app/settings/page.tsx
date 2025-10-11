import Link from "next/link";
import { Card } from "@/components/ui/card";

const sections = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your account details and authentication preferences.",
    actions: [
      { label: "Update email", href: "/app/settings/profile" },
      { label: "Change password", href: "/app/settings/profile/password" },
    ],
  },
  {
    id: "alerts",
    title: "Alerts",
    description: "Adjust delivery channels, quiet hours, and escalation rules.",
    actions: [
      { label: "Alert routing", href: "/app/settings/alerts" },
      { label: "Quiet hours", href: "/app/settings/alerts/quiet-hours" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect brokers, calendar providers, and team workspaces.",
    actions: [
      { label: "Connect broker", href: "/app/settings/integrations" },
      { label: "Sync calendar", href: "/app/settings/integrations/calendar" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-300/80">
          Fine-tune notifications, sync broker data, and manage collaboration.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.id} className="border-slate-800/70 bg-slate-900/60">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-300/80">{section.description}</p>
            <div className="mt-4 space-y-2 text-sm font-semibold text-sky-400">
              {section.actions.map((action) => (
                <Link key={action.href} href={action.href} className="block transition hover:text-sky-300">
                  {action.label} →
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
