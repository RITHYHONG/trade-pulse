import type { Metadata } from "next";
import { siteConfig } from "./site";

export const defaultMetadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: "%s | Trade Pulse",
	},
	description: siteConfig.description,
	keywords: [
		"stock market",
		"trading",
		"economic calendar",
		"financial news",
		"ai market analysis",
	],
	openGraph: {
		type: "website",
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: "Trade Pulse dashboard preview",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@tradepulse",
		creator: "@tradepulse",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	alternates: {
		canonical: siteConfig.url,
	},
};