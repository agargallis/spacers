import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import StandingsTable from '../features/StandingsTable';
import AddButton from '../admin/AddButton';
import EditableLeague from '../admin/EditableLeague';
import Dropdown from '../ui/Dropdown';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import { useEditMode } from '../../store/useEditMode';
import { useContentRevision } from '../../store/useContentRevision';
import {
  getStandings,
  getStandingsTournaments,
  getStandingsForTournament,
  seasonCollection,
  addCustomSeason,
  removeCustomSeason,
} from '../../services/standingsService';

export default function StandingsSection() {
  const { data: liveRows, loading: loadingLive, activeTeam } = useTeamResource(getStandings, { initialData: [] });
  const { data: tournaments } = useTeamResource(getStandingsTournaments, { initialData: [] });
  const editMode = useEditMode((s) => s.editMode);
  const revision = useContentRevision((s) => s.revision);

  const [selectedId, setSelectedId] = useState(null);
  const [pastRows, setPastRows] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [seasonLabel, setSeasonLabel] = useState('');

  const currentId = tournaments?.[0]?.id ?? null;
  const activeId = selectedId ?? currentId;
  const isCurrent = selectedId == null || selectedId === currentId;
  const selectedTournament = tournaments?.find((t) => t.id === activeId) ?? null;
  const isCustom = !!selectedTournament?.custom;

  // Which overrides collection backs the visible table (null = read-only scraped season).
  const collection = isCurrent ? 'standings' : isCustom ? seasonCollection(activeId) : null;
  const editable = editMode && !!collection;

  // Reset to the newest tournament whenever the team (or its list) changes.
  useEffect(() => {
    setSelectedId(null);
  }, [activeTeam]);

  useEffect(() => {
    if (isCurrent) return;
    let alive = true;
    setLoadingPast(true);
    getStandingsForTournament(activeTeam, activeId).then((rows) => {
      if (alive) {
        setPastRows(rows);
        setLoadingPast(false);
      }
    });
    return () => {
      alive = false;
    };
    // `revision` refetches admin-added season rows live after an edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam, activeId, isCurrent, revision]);

  const rows = isCurrent ? liveRows : pastRows;
  const loading = isCurrent ? loadingLive : loadingPast;

  const saveSeason = async (e) => {
    e.preventDefault();
    const created = await addCustomSeason(activeTeam, seasonLabel);
    setSeasonOpen(false);
    setSeasonLabel('');
    if (created) setSelectedId(created.id);
  };
  const handleRemoveSeason = async () => {
    const id = activeId;
    setSelectedId(null);
    await removeCustomSeason(activeTeam, id);
  };

  const showSelector = (tournaments?.length ?? 0) > 1 || editMode;

  return (
    <Section id="standings">
      <SectionHeading id="standings" eyebrow={<EditableLeague />} title="Βαθμολογία." />

      {/* Tournament selector (+ admin season controls) */}
      {showSelector && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {(tournaments?.length ?? 0) > 0 && (
            <Dropdown
              value={activeId}
              onChange={setSelectedId}
              options={(tournaments ?? []).map((t) => ({ value: t.id, label: t.custom ? `${t.label} (custom)` : t.label }))}
            />
          )}
          {editMode && (
            <button
              type="button"
              onClick={() => setSeasonOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-accent/60 px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-[color:rgb(var(--accent-rgb)/0.1)]"
            >
              <FiPlus /> Νέα σεζόν
            </button>
          )}
          {editMode && isCustom && (
            <button
              type="button"
              onClick={handleRemoveSeason}
              title="Διαγραφή σεζόν"
              aria-label="Διαγραφή σεζόν"
              className="grid h-9 w-9 place-items-center rounded-xl text-[color:var(--text-dim)] ring-1 ring-[color:var(--border)] transition-colors hover:text-rose-400 hover:ring-rose-400/60"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTeam}-${activeId ?? 'current'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <Spinner label="Φόρτωση βαθμολογίας…" />
          ) : (
            <StandingsTable rows={rows ?? []} collection={collection} />
          )}
        </motion.div>
      </AnimatePresence>

      {editable && <AddButton collection={collection} schema="standings" label="ομάδας" className="mt-6" />}

      <p className="mt-4 text-center text-xs text-[color:var(--text-faint)]">
        Αγ = Αγώνες · Ν = Νίκες · Η = Ήττες · Υπ/Κτ = Πόντοι υπέρ/κατά · ± = Διαφορά ·
        Βαθ = Βαθμοί. Η γραμμή μας είναι<span className="text-accent font-semibold"> τονισμένη</span>.
      </p>

      <Modal
        open={seasonOpen}
        onClose={() => setSeasonOpen(false)}
        title="Νέα σεζόν"
        footer={
          <>
            <Button variant="ghost" size="sm" type="button" onClick={() => setSeasonOpen(false)}>
              Ακύρωση
            </Button>
            <Button size="sm" type="submit" form="season-form">
              Δημιουργία
            </Button>
          </>
        }
      >
        <form id="season-form" onSubmit={saveSeason}>
          <label className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">Όνομα σεζόν / διοργάνωσης</label>
          <input
            type="text"
            value={seasonLabel}
            onChange={(e) => setSeasonLabel(e.target.value)}
            autoFocus
            placeholder="π.χ. Winter League 2027"
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3.5 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] focus:border-accent focus:outline-none focus:ring-1 ring-accent"
          />
          <p className="mt-2 text-xs text-[color:var(--text-faint)]">
            Θα εμφανιστεί στη λίστα σεζόν και θα προσθέσεις ομάδες με το «+ Προσθήκη ομάδας».
          </p>
        </form>
      </Modal>
    </Section>
  );
}
