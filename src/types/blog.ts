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
	category?: string;
	isFeatured?: boolean;
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