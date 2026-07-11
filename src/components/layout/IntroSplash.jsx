import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TeamCrest from '../ui/TeamCrest';
import { useActiveTeamMeta } from '../../store/useTeamStore';

/**
 * Full-screen intro overlay shown on every page load / refresh. Per-team:
 * the active team's crest + accent colors. Locks scroll while visible.
 */
export default function IntroSplash({ duration = 1700 }) {
  const meta = useActiveTeamMeta();
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setShow(false), duration);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [duration]);

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = '')}>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[color:var(--bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* ambient team glows */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl opacity-40"
            style={{ background: `radial-gradient(circle, ${meta.accent}, transparent 70%)` }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full blur-3xl opacity-25"
            style={{ background: `radial-gradient(circle, ${meta.accent2}, transparent 70%)` }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-8 px-6 text-center"
          >
            <div className="animate-float">
              <TeamCrest team={meta.key} size={168} spin />
            </div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="font-[var(--font-display)] text-5xl font-black tracking-[0.12em] accent-gradient-text sm:text-6xl"
              >
                SPACERS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--text-faint)]"
              >
                {meta.key === 'main' ? 'Athens' : 'Beta'}
              </motion.p>
            </div>

            {/* sweeping loader */}
            <div className="relative h-1.5 w-56 overflow-hidden rounded-full bg-[color:var(--surface-2)] sm:w-64">
              <span
                className="intro-sweep absolute inset-y-0 w-1/3 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, ${meta.accent2})` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
