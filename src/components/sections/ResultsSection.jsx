import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import ResultRow from '../features/ResultRow';
import ResultsStats from '../features/ResultsStats';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getResults, getResultsSummary } from '../../services/resultsService';
import { stagger } from '../../utils/motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';

const PREVIEW = 5;

export default function ResultsSection() {
  const { data: results, loading, activeTeam } = useTeamResource(getResults, { initialData: [] });
  const { data: summary } = useTeamResource(getResultsSummary);
  const meta = useActiveTeamMeta();
  const [showAll, setShowAll] = useState(false);

  const list = results ?? [];
  const preview = list.slice(0, PREVIEW);

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
                <ResultRow key={r.id} result={r} />
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
        </>
      )}

      {/* All results — modal with blurred backdrop */}
      <Modal open={showAll} onClose={() => setShowAll(false)} title={`Όλα τα αποτελέσματα · ${meta.shortName}`} size="lg">
        <motion.div variants={stagger(0.02)} initial="hidden" animate="show" className="space-y-3">
          {list.map((r) => (
            <ResultRow key={r.id} result={r} />
          ))}
        </motion.div>
      </Modal>
    </Section>
  );
}
