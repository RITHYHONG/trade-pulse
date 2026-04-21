export interface BlogAuthor {
	name: string;
	role?: string;
	avatarUrl?: string;
	avatar?: string;
	bio?: string;
}

export interface BlogPost {
	slug: string;
	id?: string;
	title: string;
	excerpt: string;
	summary?: string;
	content: string;
	publishedAt: string;
	publishDate?: string;
	updatedAt?: string;
	readingTime?: string;
	readTime?: string;
	tags: string[];
	coverImage?: string;
	featuredImage?: string;
	author: BlogAuthor;
	authorId?: string;
	category?: string;
	isFeatured?: boolean;
	views?: number;
	sentiment?: string;
	confidenceLevel?: number;
	primaryAsset?: string;
	relatedAssets?: string[];
	timeHorizon?: string;
	projectedPrice?: string;
	volatilityRisk?: string;
	alphaProbability?: string;
	activeSignalsCount?: number;
	correlatedTickers?: string[];
	analysisCards?: {
		title: string;
		content: string;
		icon?: string;
		color?: string;
	}[];
	isDraft?: boolean;
	helpfulCount?: number;
	_sparkline?: number[];
}

export interface AdItem {
	type: 'ad';
	id: string;
}

export type BlogItem = BlogPost | AdItem;

export interface BlogCategory {
	id: string;
	name: string;
	description?: string;
}