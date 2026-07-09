import { useActiveTeamMeta } from '../../store/useTeamStore';

/** Minimal "no scheduled matches yet" state: floating logo + loading bar. */
export default function ComingSoon({ className = '' }) {
  const meta = useActiveTeamMeta();
  return (
    <div className={`grid min-h-[16rem] place-items-center rounded-3xl card p-8 ${className}`}>
      <div className="flex w-full max-w-[15rem] flex-col items-center gap-6">
        <img src={meta.logo} alt="" className="h-16 w-16 animate-float object-contain" />
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-2)]">
          <div className="loading-bar h-full w-1/3 rounded-full bg-accent" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[color:var(--text-faint)]">
          Σύντομα πρόγραμμα
        </span>
      </div>
    </div>
  );
}
