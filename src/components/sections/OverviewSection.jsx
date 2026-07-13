import { motion } from 'framer-motion';
import Section from './Section';
import NextMatchHero from '../features/NextMatchHero';
import SeasonDiagram from '../features/SeasonDiagram';
import ResultRow from '../features/ResultRow';
import Editable from '../admin/Editable';
import SectionHeading from '../ui/SectionHeading';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getNextMatch } from '../../services/matchesService';
import { getResults, getLatestResult } from '../../services/resultsService';
import { getSeasonStats } from '../../services/teamService';
import { getOurStanding } from '../../services/standingsService';
import { stagger } from '../../utils/motion';
import { scrollToSection } from '../../hooks/useScrollSpy';

/** "Quick glance" overview — not a nav target, sits right below the hero. */
export default function OverviewSection() {
  const { data: nextMatch, loading: loadingNext } = useTeamResource(getNextMatch);
  const { data: stats } = useTeamResource(getSeasonStats);
  const { data: results } = useTeamResource(getResults, { initialData: [] });
  const { data: latest } = useTeamResource(getLatestResult);
  const { data: our } = useTeamResource(getOurStanding);

  const recent = (results ?? []).slice(0, 3);

  return (
    <Section id="overview" className="pt-6 sm:pt-8">
      <div className="space-y-14">
        {/* Next match + real season stat tiles */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <NextMatchHero match={nextMatch} loading={loadingNext} />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <SeasonDiagram stats={stats} standing={our} />
          </motion.div>
        </section>

        {/* Recent results snapshot */}
        <section>
          <SectionHeading eyebrow="Πρόσφατα" title="Τελευταία αποτελέσματα." />
          <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-3">
            {recent.length ? (
              recent.map((r) => (
                <Editable key={r.id} collection="results" schema="results" item={r}>
                  <ResultRow result={r} />
                </Editable>
              ))
            ) : latest ? (
              <ResultRow result={latest} />
            ) : (
              <div className="card p-6 text-sm text-[color:var(--text-dim)]">-</div>
            )}
          </motion.div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => scrollToSection('results')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5"
            >
              Όλα τα αποτελέσματα
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </Section>
  );
}
