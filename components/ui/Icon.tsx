import { cn } from '@/lib/utils';

/**
 * Jeu d'icônes SVG inline — aucune dépendance externe, stylables via `className`.
 */
export type IconName =
  | 'wrench'
  | 'shop'
  | 'tag'
  | 'home'
  | 'briefcase'
  | 'graduation'
  | 'search'
  | 'map-pin'
  | 'phone'
  | 'whatsapp'
  | 'user'
  | 'menu'
  | 'x'
  | 'chevron-down'
  | 'chevron-right'
  | 'heart'
  | 'flag'
  | 'star'
  | 'clock'
  | 'shield'
  | 'zap'
  | 'users'
  | 'arrow-right'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'x-social'
  | 'box'
  | 'settings'
  | 'logout'
  | 'dashboard'
  | 'plus'
  | 'camera';

const PATHS: Record<IconName, React.ReactNode> = {
  wrench: (
    <path d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5L3 17.4a1.8 1.8 0 0 0 0 2.5l1.1 1.1a1.8 1.8 0 0 0 2.5 0l6.1-6.1a4.2 4.2 0 0 0 5-5.6l-2.6 2.6-2.8-.7-.7-2.8 2.6-2.6Z" />
  ),
  shop: (
    <path d="M4 7.5 5.2 4h13.6L20 7.5v1.2a2.4 2.4 0 0 1-4.5 1 2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 1-4.7 0A2.4 2.4 0 0 1 3 8.7V7.5Zm1 5.2V20h14v-7.3a3.9 3.9 0 0 1-1.5-.5 3.9 3.9 0 0 1-5.5 0 3.9 3.9 0 0 1-5.5 0 3.9 3.9 0 0 1-1.5.5Zm4 4.3v-3h6v3H9Z" />
  ),
  tag: <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7-7V6a2 2 0 0 1 2-2h7.6l7.4 7.4a2 2 0 0 1 0 2ZM8.5 8.5A1.5 1.5 0 1 0 10 7a1.5 1.5 0 0 0-1.5 1.5Z" />,
  home: (
    <path d="M12 3.5 2.8 10.5a1.2 1.2 0 0 0 .7 2.1H5V20a1 1 0 0 0 1 1h4v-5.5h4V21h4a1 1 0 0 0 1-1v-7.4h1.5a1.2 1.2 0 0 0 .75-2.15L12 3.5Z" />
  ),
  briefcase: (
    <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h3.5A1.5 1.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10A1.5 1.5 0 0 1 5.5 6H9Zm2 0h2V5h-2v1Zm9 6.5V8H4v4.5h6V14h4v-1.5h6Z" />
  ),
  graduation: (
    <path d="M12 4 1.5 9 12 14l9-4.25V14h2V9L12 4Zm-6 8.3V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.7l-6 3-6-3Z" />
  ),
  search: (
    <path d="M11 4a7 7 0 1 0 4.2 12.6l3.6 3.6a1 1 0 0 0 1.4-1.4l-3.6-3.6A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
  ),
  'map-pin': (
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 6 11.8 6.3 12.1a1 1 0 0 0 1.4 0C13 20.8 19 14.2 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
  ),
  phone: (
    <path d="M6.6 3.2 8.9 2a1 1 0 0 1 1.4.4l2 3.5a1 1 0 0 1-.2 1.3l-1.6 1.5a12.4 12.4 0 0 0 6.8 6.8l1.5-1.6a1 1 0 0 1 1.3-.2l3.5 2a1 1 0 0 1 .4 1.4l-1.2 2.3a1 1 0 0 1-1.1.5C11 18.2 5.8 13 4.5 4.3a1 1 0 0 1 .5-1.1H6.6Z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.5.6.6-2.4-.2-.3A8 8 0 0 1 12 4Zm-3 4.2c-.2 0-.5.1-.7.3-.6.6-1 1.6-.5 2.8a13.6 13.6 0 0 0 5.5 6c1.4.7 2.5.5 3.2.2.6-.3 1.2-.9 1.3-1.6.1-.4 0-.7-.2-.9l-1.8-1.1a.6.6 0 0 0-.7.1l-.8.8c-.2.2-.5.3-.8.1a10.6 10.6 0 0 1-3.4-3.4c-.1-.3 0-.6.2-.8l.7-.8a.6.6 0 0 0 .1-.8l-1.1-1.7a.6.6 0 0 0-.9-.2Z" />
  ),
  user: <path d="M12 11a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 11Zm0 2c-4 0-8 2-8 5.2V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.8c0-3.2-4-5.2-8-5.2Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  x: <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  'chevron-down': <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-right': <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  heart: <path d="M12 21s-7.5-4.6-9.8-9A5.4 5.4 0 0 1 12 6.7 5.4 5.4 0 0 1 21.8 12c-2.3 4.4-9.8 9-9.8 9Z" />,
  flag: <path d="M5 21V4a1 1 0 0 1 1-1h12l-2.5 4L18 11H6v10Z" />,
  star: <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" transform="translate(2 3) scale(.9)" />,
  clock: <path d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Zm1-10V6h-2v8l5.4 3.2 1.2-1.6-4.6-2.6Z" />,
  shield: <path d="M12 2 4 5.5V11c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5.5L12 2Zm-1 14-3.5-3.5 1.4-1.4L11 13.2l5-5L17.4 9.6 11 16Z" />,
  zap: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  users: <path d="M9 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9 11Zm7-.5a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-7 2c-3 0-6 1.4-6 4v2h12v-2c0-2.6-3-4-6-4Zm7 .3c2.7.3 5 1.5 5 3.8v1.9h3v-1.9c0-2.5-3.6-4-8-3.8Z" />,
  'arrow-right': <path d="M13.2 5.2 20 12l-6.8 6.8-1.4-1.4 4.4-4.4H4v-2h12.2l-4.4-4.4 1.4-1.4Z" />,
  facebook: <path d="M13.5 22v-8h2.7l.5-3h-3.2V9.1c0-.9.3-1.6 1.7-1.6H17V4.8a22 22 0 0 0-2.4-.1C12.2 4.7 11 6 11 8.7V11H8.5v3H11v8h2.5Z" />,
  instagram: (
    <path d="M12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Zm5.2-2.7a1.05 1.05 0 1 1-1.05-1.05 1.05 1.05 0 0 1 1.05 1.05ZM12 4.2c2.5 0 2.8 0 3.8.1a5.2 5.2 0 0 1 1.8.3 3 3 0 0 1 1.8 1.8 5.2 5.2 0 0 1 .3 1.8c.1 1 .1 1.3.1 3.8s0 2.8-.1 3.8a5.2 5.2 0 0 1-.3 1.8 3 3 0 0 1-1.8 1.8 5.2 5.2 0 0 1-1.8.3c-1 .1-1.3.1-3.8.1s-2.8 0-3.8-.1a5.2 5.2 0 0 1-1.8-.3 3 3 0 0 1-1.8-1.8 5.2 5.2 0 0 1-.3-1.8c-.1-1-.1-1.3-.1-3.8s0-2.8.1-3.8a5.2 5.2 0 0 1 .3-1.8 3 3 0 0 1 1.8-1.8 5.2 5.2 0 0 1 1.8-.3c1-.1 1.3-.1 3.8-.1M12 2.5c-2.6 0-2.9 0-3.9.1a6.9 6.9 0 0 0-2.3.4 4.7 4.7 0 0 0-2.8 2.8 6.9 6.9 0 0 0-.4 2.3c-.1 1-.1 1.3-.1 3.9s0 2.9.1 3.9a6.9 6.9 0 0 0 .4 2.3 4.7 4.7 0 0 0 2.8 2.8 6.9 6.9 0 0 0 2.3.4c1 .1 1.3.1 3.9.1s2.9 0 3.9-.1a6.9 6.9 0 0 0 2.3-.4 4.7 4.7 0 0 0 2.8-2.8 6.9 6.9 0 0 0 .4-2.3c.1-1 .1-1.3.1-3.9s0-2.9-.1-3.9a6.9 6.9 0 0 0-.4-2.3 4.7 4.7 0 0 0-2.8-2.8 6.9 6.9 0 0 0-2.3-.4c-1-.1-1.3-.1-3.9-.1Z" />
  ),
  linkedin: <path d="M6.5 8.8H3.7V21h2.8V8.8ZM5.1 3a1.9 1.9 0 1 0 1.9 1.9A1.9 1.9 0 0 0 5.1 3ZM9 8.8v12.2h2.8v-6.7c0-1.6 1-2.5 2.2-2.5 1.3 0 2.2.9 2.2 2.5V21h2.8v-7.1c0-3.2-1.7-4.7-4.2-4.7a4.5 4.5 0 0 0-4 2.2l-.2-1.9H9Z" />,
  'x-social': <path d="M17.2 3h3l-6.6 7.6L21.5 21h-6l-4.6-6.3L5.4 21H2.4l7.1-8.1L2.7 3h6.1l4.2 5.8L17.2 3Z" />,
  box: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.5 3.6L12 11.4 5.5 7.8 12 4.2ZM5 9.6l6 3.4v6.6l-6-3.4V9.6Zm8 10v-6.6l6-3.4v6.6l-6 3.4Z" />,
  settings: <path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z" />,
  logout: <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm7.6 8.6-3-3 1.4-1.4L21.4 12l-5.4 4.8-1.4-1.4 3-3H9v-2h8.6Z" />,
  dashboard: <path d="M3 3h8v10H3V3Zm10 0h8v6h-8V3ZM3 15h8v6H3v-6Zm10 0h8v6h-8v-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  camera: <path d="M12 16.5A3.5 3.5 0 1 0 8.5 13a3.5 3.5 0 0 0 3.5 3.5ZM4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
};

export function Icon({
  name,
  className,
  title,
}: {
  name: IconName;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 fill-current', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
