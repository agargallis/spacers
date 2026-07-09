import { AnimatePresence, motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

const cell = (value, label) => (
  <div className="flex flex-col items-center">
    <div className="relative w-14 sm:w-16 overflow-hidden rounded-xl card px-0 py-3 text-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="block font-[var(--font-display)] text-2xl sm:text-3xl font-bold tabular-nums text-[color:var(--text)]"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-faint)]">
      {label}
    </span>
  </div>
);

export default function CountdownTiles({ targetIso }) {
  const c = useCountdown(targetIso);
  if (!c) return null;
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      {cell(c.days, 'Μέρες')}
      {cell(c.hours, 'Ώρες')}
      {cell(c.minutes, 'Λεπτά')}
      {cell(c.seconds, 'Δευτ.')}
    </div>
  );
}
