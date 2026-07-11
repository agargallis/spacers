import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import PlayerCard from '../features/PlayerCard';
import PlayerModal from '../features/PlayerModal';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getRoster } from '../../services/teamService';
import { stagger, fadeUp } from '../../utils/motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';

function Arrow({ dir, className = '', ...props }) {
  return (
    <button
      {...props}
      aria-label={dir === 'left' ? 'Προηγούμενοι' : 'Επόμενοι'}
      className={`grid h-11 w-11 place-items-center rounded-full glass text-[color:var(--text)] shadow-lg transition-all hover:border-accent hover:text-accent disabled:opacity-0 disabled:pointer-events-none ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function RosterSection() {
  const { data: players, loading, activeTeam } = useTeamResource(getRoster, { initialData: [] });
  const meta = useActiveTeamMeta();
  const trackRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);
  const [selected, setSelected] = useState(null);

  const update = () => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setCanL(t.scrollLeft > 8);
    setCanR(t.scrollLeft < max - 8);
  };

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return undefined;
    update();
    t.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      t.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [players]);

  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
    update();
  }, [activeTeam]);

  const scroll = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector('[data-card]');
    const w = card ? card.getBoundingClientRect().width : 200;
    t.scrollBy({ left: dir * (w + 16) * 2, behavior: 'smooth' });
  };

  return (
    <Section id="roster">
      <SectionHeading
        eyebrow="Squad"
        title="Ρόστερ."
      />

      {loading ? (
        <Spinner label="Φόρτωση ρόστερ…" />
      ) : (
        <div className="relative sm:px-16">
          <Arrow dir="left" onClick={() => scroll(-1)} disabled={!canL} className="absolute left-1 top-[38%] z-10 hidden -translate-y-1/2 sm:grid" />
          <Arrow dir="right" onClick={() => scroll(1)} disabled={!canR} className="absolute right-1 top-[38%] z-10 hidden -translate-y-1/2 sm:grid" />

          <motion.div
            ref={trackRef}
            key={activeTeam}
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(players ?? []).map((p) => (
              <motion.div key={p.id} data-card variants={fadeUp} className="w-40 shrink-0 snap-start sm:w-48">
                <PlayerCard player={p} onClick={() => setSelected(p)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <PlayerModal player={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
