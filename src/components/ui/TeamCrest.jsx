import { motion } from 'framer-motion';
import { teams } from '../../data/teams';

/**
 * Team logo with an animated conic-glow ring behind it. `spin` adds the
 * slow rotating sheen used in the hero.
 */
export default function TeamCrest({ team = 'main', size = 88, spin = false, className = '' }) {
  const meta = teams[team] ?? teams.main;
  return (
    <div
      className={`relative inline-grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className={`absolute inset-[-14%] rounded-full blur-xl ${spin ? 'animate-spin-slow' : ''}`}
        style={{
          background: `conic-gradient(from 0deg, ${meta.accent}, ${meta.accent2}, ${meta.accent}, transparent 75%)`,
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 40px -8px ${meta.accent}` }}
        aria-hidden="true"
      />
      <motion.img
        src={meta.logo}
        alt={`${meta.name} logo`}
        width={size}
        height={size}
        className="relative z-10 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
