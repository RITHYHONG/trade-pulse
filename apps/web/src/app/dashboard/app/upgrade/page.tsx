import Link from "next/link";
import { Card } from "@/components/ui/card";

const tiers = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Ideal for active swing traders exploring AI workflows.",
    features: [
      "Real-time watchlist sync",
      "Daily AI market summary",
      "3 automated alerts",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "Best for day traders who need automation and speed.",
    features: [
      "Unlimited alerts + broker API",
      "Intraday AI sentiment feed",
      "Options flow and volatility signals",
    ],
    highlighted: true,
  },
  {
    name: "Desk",
    price: "Custom",
    period: "",
    description: "Purpose-built analytics for multi-seat trading desks.",
    features: [
      "Team workspaces & role controls",
      "Streaming economic calendar",
      "Priority support + dedicated analyst",
    ],
  },
];

export default function UpgradePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-white">Choose your edge</h1>
        <p className="mt-2 text-sm text-slate-300/80">
          Scale your process with AI copilots, live data, and alerting built for modern trading teams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`border-slate-800/70 bg-slate-900/60 p-8 text-left ${
              tier.highlighted ? "border-sky-500/60 shadow-lg shadow-sky-500/20" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {tier.name}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{tier.price}</span>
              <span className="text-sm text-slate-400">{tier.period}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300/80">{tier.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-slate-200">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/app/settings/billing"
              className={`mt-8 inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${
                tier.highlighted
                  ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
                  : "border border-slate-700 text-slate-200 hover:border-slate-500"
              }`}
            >
              {tier.highlighted ? "Start 14-day trial" : "Contact sales"}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
