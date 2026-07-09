import { motion } from 'framer-motion';
import { scaleIn } from '../../utils/motion';

export default function SponsorCard({ sponsor }) {
  return (
    <motion.a
      variants={scaleIn}
      href={sponsor.url || '#'}
      target={sponsor.url?.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="group grid place-items-center gap-3 rounded-2xl card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
    >
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="h-16 w-auto object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-[color:var(--surface-2)] font-[var(--font-display)] text-2xl font-black text-accent">
          {sponsor.name.slice(0, 1)}
        </div>
      )}
      <div className="font-semibold leading-tight text-[color:var(--text-dim)] transition-colors group-hover:text-[color:var(--text)]">
        {sponsor.name}
      </div>
    </motion.a>
  );
}
