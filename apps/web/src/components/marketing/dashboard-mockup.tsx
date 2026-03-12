import Image from "next/image";

export function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="relative rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-2xl">
        <Image
          src="/images/dashboard-preview.png"
          alt="Trade Pulse Dashboard Preview"
          width={1200}
          height={800}
          className="rounded-md"
        />
      </div>
    </div>
  );
}