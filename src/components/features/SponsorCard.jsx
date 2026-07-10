import { motion } from 'framer-motion';
import { scaleIn } from '../../utils/motion';

/** Sponsor logo, transparent (no plaque). */
export default function SponsorCard({ sponsor }) {
  return (
    <motion.a
      variants={scaleIn}
      href={sponsor.url || '#'}
      target={sponsor.url?.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      title={sponsor.name}
      aria-label={sponsor.name}
      className="grid place-items-center px-6 py-4 transition-transform duration-300 hover:scale-105"
    >
      {sponsor.logo ? (
        <img src={sponsor.logo} alt={sponsor.name} className="h-16 w-auto object-contain sm:h-20" />
      ) : (
        <span className="font-[var(--font-display)] text-2xl font-black">{sponsor.name}</span>
      )}
    </motion.a>
  );
}
