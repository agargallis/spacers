import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/motion';

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';
  const alignment = centered ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex flex-col ${alignment} max-w-2xl mb-8`}
    >
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          <span className="h-px w-6 bg-accent" />
          {eyebrow}
          {centered && <span className="h-px w-6 bg-accent" />}
        </span>
      )}
      <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[color:var(--text)]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[color:var(--text-dim)] leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
