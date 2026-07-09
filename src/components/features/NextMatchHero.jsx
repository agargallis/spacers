import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import CountdownTiles from './CountdownTiles';
import ComingSoon from './ComingSoon';
import { formatFullDate, formatTime } from '../../utils/format';
import { useActiveTeamMeta } from '../../store/useTeamStore';
import { scrollToSection } from '../../hooks/useScrollSpy';

/** The featured "next match" panel — countdown + VS block. */
export default function NextMatchHero({ match, loading }) {
  const meta = useActiveTeamMeta();

  if (loading) {
    return (
      <div className="card animate-pulse p-8 h-64" aria-hidden="true" />
    );
  }
  if (!match) {
    return <ComingSoon />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl card p-6 sm:p-8"
    >
      {/* ambient accent glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: `radial-gradient(circle, ${meta.accent}, transparent 70%)` }}
      />
      <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-2">
            <Badge tone="accent">{match.finished ? 'Τελευταίο ματς' : 'Επόμενος αγώνας'}</Badge>
            <Badge tone={match.home ? 'accent' : 'neutral'}>{match.home ? 'Εντός έδρας' : 'Εκτός έδρας'}</Badge>
          </div>

          <div className="mt-5 flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              <img src={meta.logo} alt={meta.name} className="h-16 w-16 sm:h-20 sm:w-20 object-contain animate-float" />
              <span className="text-sm font-semibold">Spacers</span>
            </div>
            <div className="font-[var(--font-display)] text-2xl font-black text-[color:var(--text-faint)]">
              VS
            </div>
            <div className="flex flex-col items-center gap-2">
              {match.opponentLogo ? (
                <img
                  src={match.opponentLogo}
                  alt={match.opponent}
                  onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              ) : (
                <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-2xl glass text-2xl font-black text-[color:var(--text-dim)]">
                  {match.opponent.slice(0, 1)}
                </div>
              )}
              <span className="max-w-[8rem] text-center text-sm font-semibold leading-tight">
                {match.opponent}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-1 text-sm text-[color:var(--text-dim)]">
            <div className="font-semibold text-[color:var(--text)]">
              {formatFullDate(match.datetime)} · {formatTime(match.datetime)}
            </div>
            {match.venue && <div>{match.venue}</div>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 lg:items-end">
          <CountdownTiles targetIso={match.datetime} />
          <Button as="button" onClick={() => scrollToSection('schedule')} variant="outline" size="sm">
            Όλο το πρόγραμμα
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
