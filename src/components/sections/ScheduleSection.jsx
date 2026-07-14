import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import MatchCard from '../features/MatchCard';
import Editable from '../admin/Editable';
import AddButton from '../admin/AddButton';
import EditableLeague from '../admin/EditableLeague';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getUpcomingMatches } from '../../services/matchesService';
import { getResults } from '../../services/resultsService';
import { stagger } from '../../utils/motion';
import { useEditMode } from '../../store/useEditMode';

export default function ScheduleSection() {
  const { data: matches, loading, activeTeam } = useTeamResource(getUpcomingMatches, { initialData: [] });
  const { data: results } = useTeamResource(getResults, { initialData: [] });
  const editMode = useEditMode((s) => s.editMode);

  // No venue in the results feed → show a plain "Έδρα" placeholder.
  const recent = (results ?? []).slice(0, 3).map((r) => ({ ...r, venue: r.venue || 'Έδρα' }));
  const hasUpcoming = !!matches?.length;

  return (
    <Section id="schedule">
      <SectionHeading id="schedule" eyebrow={<EditableLeague />} title="Πρόγραμμα αγώνων." />
      {loading ? (
        <Spinner label="Φόρτωση προγράμματος…" />
      ) : hasUpcoming ? (
        <>
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
                <Editable key={m.id} collection="upcoming" schema="upcoming" item={m}>
                  <MatchCard match={m} />
                </Editable>
              ))}
            </motion.div>
          </AnimatePresence>
          <AddButton collection="upcoming" schema="upcoming" label="αγώνα" className="mt-6" />
        </>
      ) : (
        <>
          {/* No upcoming fixtures → show recent games (both on the public site and
              in the admin, so the schedule is never empty in edit mode). */}
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-faint)]">
            Τελευταίοι αγώνες
          </p>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <MatchCard key={r.id} match={r} />
            ))}
          </motion.div>
          {editMode && <AddButton collection="upcoming" schema="upcoming" label="αγώνα" className="mt-6" />}
        </>
      )}
    </Section>
  );
}
