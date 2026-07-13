import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import ResultRow from '../features/ResultRow';
import ResultsStats from '../features/ResultsStats';
import Editable from '../admin/Editable';
import AddButton from '../admin/AddButton';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getResults } from '../../services/resultsService';
import { getSeasonStats } from '../../services/teamService';
import { stagger } from '../../utils/motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';

const PREVIEW = 5;

export default function ResultsSection() {
  const { data: results, loading, activeTeam } = useTeamResource(getResults, { initialData: [] });
  const { data: summary } = useTeamResource(getSeasonStats);
  const meta = useActiveTeamMeta();
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');

  const list = results ?? [];
  const preview = list.slice(0, PREVIEW);

  // Accent-insensitive search (Google-like): match opponent or category.
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const q = norm(query.trim());
  const filtered = q ? list.filter((r) => norm(r.opponent).includes(q) || norm(r.category).includes(q)) : list;

  const closeModal = () => {
    setShowAll(false);
    setQuery('');
  };

  return (
    <Section id="results">
      <SectionHeading
        eyebrow={meta.league}
        title="Αποτελέσματα."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <ResultsStats summary={summary} />
      </motion.div>

      {loading ? (
        <Spinner label="Φόρτωση αποτελεσμάτων…" />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="space-y-3"
            >
              {preview.map((r) => (
                <Editable key={r.id} collection="results" schema="results" item={r}>
                  <ResultRow result={r} />
                </Editable>
              ))}
            </motion.div>
          </AnimatePresence>

          {list.length > PREVIEW && (
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" onClick={() => setShowAll(true)}>
                Δες όλα τα αποτελέσματα ({list.length})
              </Button>
            </div>
          )}

          <AddButton collection="results" schema="results" label="αποτέλεσμα" className="mt-6" />
        </>
      )}

      {/* All results — modal with blurred backdrop + live search */}
      <Modal open={showAll} onClose={closeModal} title={`Όλα τα αποτελέσματα · ${meta.shortName}`} size="lg">
        {/* Search bar (sticky) */}
        <div className="sticky top-0 z-10 -mx-6 -mt-5 mb-4 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-6 pb-4 pt-5">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-faint)]">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Αναζήτηση αντιπάλου…"
              autoFocus
              className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] transition-colors focus:border-accent focus:outline-none focus:ring-1 ring-accent"
            />
          </div>
        </div>

        {filtered.length ? (
          <motion.div key={q} variants={stagger(0.02)} initial="hidden" animate="show" className="space-y-3">
            {filtered.map((r) => (
              <Editable key={r.id} collection="results" schema="results" item={r}>
                <ResultRow result={r} />
              </Editable>
            ))}
          </motion.div>
        ) : (
          <p className="py-10 text-center text-sm text-[color:var(--text-dim)]">
            Καμία αντιστοιχία για «{query}».
          </p>
        )}
      </Modal>
    </Section>
  );
}
