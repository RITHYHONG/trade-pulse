import type { EconomicCalendarEvent } from "@/types";

const MOCK_EVENTS: EconomicCalendarEvent[] = [
	{
		id: "eco-1",
		time: "08:30",
		event: "Initial Jobless Claims",
		country: "US",
		consensus: "228K",
		previous: "232K",
		actual: null,
		impact: "medium",
	},
	{
		id: "eco-2",
		time: "10:00",
		event: "ISM Manufacturing PMI",
		country: "US",
		consensus: "49.8",
		previous: "48.6",
		actual: null,
		impact: "high",
	},
	{
		id: "eco-3",
		time: "14:00",
		event: "FOMC Member Speech",
		country: "US",
		consensus: "-",
		previous: "-",
		actual: null,
		impact: "high",
	},
];

export async function getEconomicCalendar(): Promise<EconomicCalendarEvent[]> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return MOCK_EVENTS;
}