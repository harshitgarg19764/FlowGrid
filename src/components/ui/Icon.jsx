/**
 * Icon
 * One consistent 24px stroke set used across FlowGrid.
 * Icons are decorative by default; pass a title for standalone meaning.
 */
const paths = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.75" cy="10.75" r="6.25" />
      <path d="m15.5 15.5 4.5 4.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
      <path d="M8 13h2M14 13h2M8 16.5h2M14 16.5h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.75" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V5.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" />
      <path d="M15 9.5h4a1 1 0 0 1 1 1v10M2.5 20.5h19" />
      <path d="M7.5 8h2M7.5 11.5h2M7.5 15h2M18 13h.01M18 16.5h.01" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3.5h6M10 3.5v6.2l-4.6 8.1a1.4 1.4 0 0 0 1.2 2.2h10.8a1.4 1.4 0 0 0 1.2-2.2L14 9.7V3.5" />
      <path d="M7.2 15h9.6" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2 2 0 0 1-2.8-2.8l6.9-6.9a6 6 0 0 1 7.9-7.9z" />
    </>
  ),
  car: (
    <>
      <path d="M5 17.5h14M6.5 17.5v2M17.5 17.5v2" />
      <path d="M4.5 17.5v-4l2-5.5a1.5 1.5 0 0 1 1.4-1h8.2a1.5 1.5 0 0 1 1.4 1l2 5.5v4" />
      <path d="M4.5 13.5h15M8 15.5h.01M16 15.5h.01" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.5 2.5 4.5 13.5h6l-1 8 9-11h-6z" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 6.5" />,
  circleCheck: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.25 12 2.5 2.5 5-5.5" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7M9 7h8v8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 5 6v5.2c0 4.2 2.8 7.6 7 9.6 4.2-2 7-5.4 7-9.6V6z" />
      <path d="m8.8 11.6 2.2 2.2 4.3-4.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16V11M12.5 16V7M17 16v-3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.2a3.2 3.2 0 0 1 0 6.1M17 14h.4a4 4 0 0 1 4 4v2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 20H5.5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4M15 8l4 4-4 4M19 12H9" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  mapPin: (
    <>
      <path d="M20 10.5c0 5-8 10.5-8 10.5S4 15.5 4 10.5a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20.5v-1.2A5.3 5.3 0 0 1 10.3 14h3.4a5.3 5.3 0 0 1 5.3 5.3v1.2" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" />
    </>
  ),
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9z" />
      <path d="M18.5 16.5 19 18l1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 18l1.5-.5z" />
    </>
  ),
  filter: <path d="M4 6h16l-6.4 7.2V19l-3.2 1.5v-7.3z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21.5 20h-19z" />
      <path d="M12 9v4.5M12 17h.01" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 5.5v5h-5" />
      <path d="M19.2 10.5A8 8 0 1 0 20 15" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  moon: (
    <>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </>
  ),
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
    </>
  ),
  zap: (
    <>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </>
  ),
  activity: (
    <>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </>
  ),
};

const Icon = ({ name, size = 20, strokeWidth = 1.5, className = '', title, ...props }) => {
  const content = paths[name];

  if (!content) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
};

export default Icon;
