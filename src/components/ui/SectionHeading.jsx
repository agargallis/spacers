import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/motion';
import EditableText from '../admin/EditableText';

export default function SectionHeading({ id, eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';
  const alignment = centered ? 'items-center text-center mx-auto' : 'items-start text-left';

  // When given an `id`, plain-string eyebrow/title become editable per team
  // (admin edit mode). Nodes (e.g. a custom <EditableLeague/>) pass through.
  const eyebrowNode =
    id && typeof eyebrow === 'string'
      ? <EditableText id={`${id}-eyebrow`} defaultText={eyebrow} label="υπότιτλο" />
      : eyebrow;
  const titleNode =
    id && typeof title === 'string'
      ? <EditableText id={`${id}-title`} defaultText={title} label="τίτλο" />
      : title;

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
          {eyebrowNode}
          {centered && <span className="h-px w-6 bg-accent" />}
        </span>
      )}
      <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-[color:var(--text)]">
        {titleNode}
      </h2>
      {description && (
        <p className="mt-3 text-[color:var(--text-dim)] leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
