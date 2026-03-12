export type NavItem = {
  label: string;
  href: string;
  isAnchor?: boolean;
  isComingSoon?: boolean;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', isAnchor: false },
  { label: 'Blog', href: '/blog', isAnchor: false },
  { label: 'Calendar', href: '/calendar', isAnchor: false },
  { label: 'About', href: '/about', isAnchor: false },
  { label: 'Contact', href: '/contact', isAnchor: false },
];

export default navItems;
