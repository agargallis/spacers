import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../utils/motion';

export default function LegalPage({ title, lead, sections }) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
      <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="text-center">
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Νομικά
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="mt-5 font-[var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl leading-relaxed text-[color:var(--text-dim)]">
          {lead}
        </motion.p>
      </motion.div>

      <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="mt-10 space-y-4">
        {sections.map((section) => (
          <motion.article key={section.heading} variants={fadeUp} className="card p-6 text-center">
            <h2 className="font-[var(--font-display)] text-lg font-bold text-accent">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-[color:var(--text-dim)]">{section.body}</p>
          </motion.article>
        ))}
      </motion.div>

      <p className="mt-10 text-center text-xs text-[color:var(--text-faint)]">
        Τελευταία ενημέρωση: 11 Ιουλίου 2026.
      </p>
    </main>
  );
}
