const ICON_PATHS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  x: <path d="m4 4 7.2 9.6L4.3 20H6l6-5.6 4.2 5.6H20l-7.5-10L19 4h-1.7l-5.6 5.2L7.8 4H4Z" />,
};

const LABELS = { instagram: 'Instagram', facebook: 'Facebook', x: 'X (Twitter)' };

const SocialIcons = ({ links, className = '' }) => (
  <ul className={`flex items-center gap-2 ${className}`}>
    {Object.entries(links).map(([network, href]) => (
      <li key={network}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Brew & Bean on ${LABELS[network]}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition hover:border-caramel hover:bg-caramel hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICON_PATHS[network]}
          </svg>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialIcons;
