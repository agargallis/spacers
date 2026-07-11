import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import MatchCard from '../features/MatchCard';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getUpcomingMatches } from '../../services/matchesService';
import { getResults } from '../../services/resultsService';
import { stagger } from '../../utils/motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';

export default function ScheduleSection() {
  const { data: matches, loading, activeTeam } = useTeamResource(getUpcomingMatches, { initialData: [] });
  const { data: results } = useTeamResource(getResults, { initialData: [] });
  const meta = useActiveTeamMeta();

  // No venue in the results feed → show a plain "Έδρα" placeholder.
  const recent = (results ?? []).slice(0, 3).map((r) => ({ ...r, venue: r.venue || 'Έδρα' }));

  return (
    <Section id="schedule">
      <SectionHeading
        eyebrow={meta.league}
        title="Πρόγραμμα αγώνων."
      />
      {loading ? (
        <Spinner label="Φόρτωση προγράμματος…" />
      ) : matches?.length ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTeam}
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">
            Τελευταίοι αγώνες
          </p>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <MatchCard key={r.id} match={r} />
            ))}
          </motion.div>
        </div>
      )}
    </Section>
  );
}
