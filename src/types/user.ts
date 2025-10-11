export type SubscriptionPlan = "starter" | "pro" | "desk";

export interface User {
	id: string;
	email: string;
	name?: string;
	plan: SubscriptionPlan;
	avatarUrl?: string | null;
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string | null;
}