export const routes = {
  // Public routes
  home: '/',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
  features: '/features',
  
  // Auth routes
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  
  // Protected routes
  dashboard: '/dashboard',
  settings: '/settings',
  createPost: '/create-post',
  
  // Admin routes
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminPosts: '/admin/posts',
  
  // API routes
  api: {
    auth: '/api/auth',
    dashboard: '/api/dashboard',
    blog: '/api/blog',
    admin: '/api/admin',
  }
} as const;

export const siteMetadata = {
  title: 'Trader Pulse - Pre-Market Intelligence',
  description: 'Stay ahead of the markets with AI summaries, actionable alerts, and real-time economic data.',
  keywords: 'trading, pre-market, market analysis, financial data, trading signals',
  author: 'Trader Pulse',
  siteUrl: 'https://traderpulse.com',
  image: '/images/og-image.png',
  twitterHandle: '@traderpulse',
};

export const navigationConfig = {
  main: [
    { label: 'Demo', href: '#demo', isAnchor: true },
    { label: 'Features', href: '#features', isAnchor: true },
    { label: 'Testimonials', href: '#testimonials', isAnchor: true },
    { label: 'Pricing', href: routes.pricing, isAnchor: false },
    { label: 'Blog', href: routes.blog, isAnchor: false },
    { label: 'About', href: routes.about, isAnchor: false },
    { label: 'Contact', href: routes.contact, isAnchor: false },
  ],
  
  footer: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: routes.features },
        { label: 'Pricing', href: routes.pricing },
        { label: 'Demo', href: '/#demo' },
        { label: 'Dashboard', href: routes.dashboard },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: routes.blog },
        { label: 'About', href: routes.about },
        { label: 'Contact', href: routes.contact },
        { label: 'Support', href: '/support' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Disclaimer', href: '/disclaimer' },
        { label: 'Cookie Policy', href: '/cookies' },
      ]
    },
  ],
  
  dashboard: [
    { label: 'Overview', href: routes.dashboard, icon: 'dashboard' },
    { label: 'Watchlist', href: '/dashboard/watchlist', icon: 'list' },
    { label: 'Alerts', href: '/dashboard/alerts', icon: 'bell' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: 'chart' },
    { label: 'Settings', href: routes.settings, icon: 'settings' },
  ]
};

export const blogConfig = {
  postsPerPage: 9,
  featuredPostsCount: 5,
  relatedPostsCount: 3,
  categories: [
    'All Posts',
    'Daily Recaps', 
    'Market Analysis',
    'Trading Strategies',
    'Economic Reports',
    'Company News',
    'Sector Analysis'
  ]
};