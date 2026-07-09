import { AnimatePresence, motion } from 'framer-motion';
import { useTeamStore } from '../../store/useTeamStore';
import { teams } from '../../data/teams';

/**
 * Single team-switch control. Shows the crest of the OTHER team (the one you'd
 * switch to) inside a ring that glows in that team's accent. Clicking swaps the
 * active team with a flip animation. No MAIN/BETA text — the logo is the label.
 */
export default function TeamSwitcher({ className = '' }) {
  const activeTeam = useTeamStore((s) => s.activeTeam);
  const toggleTeam = useTeamStore((s) => s.toggleTeam);
  const other = activeTeam === 'main' ? teams.beta : teams.main;

  return (
    <button
      onClick={toggleTeam}
      aria-label={`Εναλλαγή στην ομάδα ${other.name}`}
      title={`Μετάβαση: ${other.name}`}
      className={`group relative grid h-11 w-11 place-items-center rounded-full glass transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      {/* accent glow ring for the target team */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
        style={{ boxShadow: `0 0 0 1.5px ${other.accent}66, 0 0 22px -6px ${other.accent}` }}
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
        style={{ background: other.accent }}
        aria-hidden="true"
      />

      <span className="relative h-8 w-8 [perspective:600px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={other.key}
            src={other.logo}
            alt=""
            initial={{ rotateY: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          />
        </AnimatePresence>
      </span>

      {/* swap indicator badge */}
      <span
        className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-dim)] transition-colors group-hover:text-[color:var(--text)]"
        aria-hidden="true"
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
          <path d="M4 8h13l-3-3m6 11H7l3 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* hover tooltip (desktop) */}
      <span className="pointer-events-none absolute -bottom-9 right-0 whitespace-nowrap rounded-lg bg-[color:var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--text)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {other.name}
      </span>
    </button>
  );
}
