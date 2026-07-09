import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/motion';

export default function StatTile({ label, value, sub, accent = false }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl card p-5 text-center lg:text-left"
    >
      {accent && (
        <span className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-[color:rgb(var(--accent-rgb)/0.12)]" />
      )}
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-faint)]">
        {label}
      </div>
      <div
        className={`mt-2 font-[var(--font-display)] text-3xl font-bold tabular-nums ${
          accent ? 'accent-gradient-text' : 'text-[color:var(--text)]'
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-[color:var(--text-dim)]">{sub}</div>}
    </motion.div>
  );
}
