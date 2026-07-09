import { useActiveTeamMeta } from '../../store/useTeamStore';

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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:px-6 py-5 text-xs text-[color:var(--text-faint)] sm:flex-row">
          <span>© {new Date().getFullYear()} Spacers Athens. Όλα τα δικαιώματα διατηρούνται.</span>
          <span>
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
