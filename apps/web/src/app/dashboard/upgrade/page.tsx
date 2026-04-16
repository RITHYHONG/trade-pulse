import { redirect } from "next/navigation";

export default function LegacyUpgradeRedirect() {
  redirect("/dashboard/app/upgrade");
}