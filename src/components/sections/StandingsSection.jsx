import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import StandingsTable from '../features/StandingsTable';
import AddButton from '../admin/AddButton';
import Dropdown from '../ui/Dropdown';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import {
  getStandings,
  getStandingsTournaments,
  getStandingsForTournament,
} from '../../services/standingsService';
import { useActiveTeamMeta } from '../../store/useTeamStore';

export default function StandingsSection() {
  const { data: liveRows, loading: loadingLive, activeTeam } = useTeamResource(getStandings, { initialData: [] });
  const { data: tournaments } = useTeamResource(getStandingsTournaments, { initialData: [] });
  const meta = useActiveTeamMeta();

  const [selectedId, setSelectedId] = useState(null);
  const [pastRows, setPastRows] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);

  const currentId = tournaments?.[0]?.id ?? null;
  const isCurrent = selectedId == null || selectedId === currentId;

  // Reset to the newest tournament whenever the team (or its list) changes.
  useEffect(() => {
    setSelectedId(null);
  }, [activeTeam]);

  useEffect(() => {
    if (isCurrent) return;
    let alive = true;
    setLoadingPast(true);
    getStandingsForTournament(activeTeam, selectedId).then((rows) => {
      if (alive) {
        setPastRows(rows);
        setLoadingPast(false);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam, selectedId, isCurrent]);

  const rows = isCurrent ? liveRows : pastRows;
  const loading = isCurrent ? loadingLive : loadingPast;

  return (
    <Section id="standings">
      <SectionHeading
        eyebrow={meta.league}
        title="Βαθμολογία."
      />

      {/* Tournament selector — a single dropdown, newest first & default */}
      {tournaments?.length > 1 && (
        <div className="mb-6 flex justify-center">
          <Dropdown
            value={selectedId ?? currentId}
            onChange={setSelectedId}
            options={tournaments.map((t) => ({ value: t.id, label: t.label }))}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTeam}-${selectedId ?? 'current'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? <Spinner label="Φόρτωση βαθμολογίας…" /> : <StandingsTable rows={rows ?? []} />}
        </motion.div>
      </AnimatePresence>

      {isCurrent && <AddButton collection="standings" schema="standings" label="ομάδα" className="mt-6" />}

      <p className="mt-4 text-center text-xs text-[color:var(--text-faint)]">
        Αγ = Αγώνες · Ν = Νίκες · Η = Ήττες · Υπ/Κτ = Πόντοι υπέρ/κατά · ± = Διαφορά ·
        Βαθ = Βαθμοί. Η γραμμή μας είναι<span className="text-accent font-semibold"> τονισμένη</span>.
      </p>
    </Section>
  );
}
