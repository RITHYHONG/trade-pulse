import { redirect } from "next/navigation";

export default function LegacyAlertsRedirect() {
  redirect("/app/alerts");
}