import { Link } from 'react-router-dom';
import { useActiveTeamMeta } from '../../store/useTeamStore';

const iconCls = 'h-4 w-4';

function PrivacyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M12 3 5 6v5c0 5 3.4 8.5 7 10 3.6-1.5 7-5 7-10V6l-7-3Z" />
      <path d="M9.5 12.5 11 14l3.5-4" />
    </svg>
  );
}
function CookiesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M14.5 4.5a3 3 0 0 0 4 4 7.5 7.5 0 1 1-8-3.5 3 3 0 0 0 4-.5Z" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TermsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M8 3h7l4 4v14H8z" />
      <path d="M15 3v4h4" />
      <path d="M11 12h5" />
      <path d="M11 16h5" />
      <path d="M11 8h1" />
    </svg>
  );
}

const legalLinks = [
  { to: '/privacy', label: 'Απόρρητο', Icon: PrivacyIcon },
  { to: '/cookies', label: 'Cookies', Icon: CookiesIcon },
  { to: '/terms', label: 'Όροι', Icon: TermsIcon },
];

export default function Footer() {
  const meta = useActiveTeamMeta();

  return (
    <footer className="mt-20 border-t border-[color:var(--border)]">
      {/* pre-footer note (like noobs) */}
      <div className="px-4 py-6 text-center text-sm text-[color:var(--text-dim)]">
        Για περισσότερες λεπτομέρειες επισκεφθείτε το{' '}
        <a
          href={meta.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-accent transition-opacity hover:opacity-80"
        >
          basketaki.com
        </a>
        !
      </div>

      {/* minimal footer row */}
      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 py-5 text-xs text-[color:var(--text-faint)] sm:grid sm:grid-cols-3 sm:items-center">
          <span className="text-center sm:justify-self-start sm:text-left">
            © {new Date().getFullYear()} Spacers Athens. Όλα τα δικαιώματα διατηρούνται.
          </span>

          {/* legal icon links — exactly centered (middle grid column) */}
          <div className="flex items-center gap-2 sm:justify-self-center">
            {legalLinks.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                aria-label={label}
                title={label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--border)] text-[color:var(--text-dim)] transition-colors hover:border-accent hover:text-accent"
              >
                <Icon />
              </Link>
            ))}
          </div>

          <span className="text-center sm:justify-self-end sm:text-right">
            Υλοποιήθηκε από την{' '}
            <a href="https://ubd.gr" target="_blank" rel="noreferrer" className="font-bold text-accent transition-opacity hover:opacity-80">
              UBD
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
