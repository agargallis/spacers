import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import TeamCrest from '../components/ui/TeamCrest';
import { useActiveTeamMeta } from '../store/useTeamStore';

export default function NotFoundPage() {
  const meta = useActiveTeamMeta();

  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden px-4">
      {/* ambient team glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${meta.accent}, transparent 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center text-center"
      >
        <div className="animate-float">
          <TeamCrest team={meta.key} size={120} spin />
        </div>

        <h1 className="mt-8 font-[var(--font-display)] text-7xl font-black leading-none tracking-tight accent-gradient-text sm:text-8xl">
          404
        </h1>

        <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold">
          Άστοχη προσπάθεια!
        </h2>
        <p className="mt-3 max-w-md text-[color:var(--text-dim)]">
          Η σελίδα που ζητήσατε δεν βρέθηκε, έφυγε άουτ. Ας γυρίσουμε στο παρκέ.
        </p>

        <Button to="/" size="lg" className="mt-8">
          Επιστροφή στην αρχική
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </motion.div>
    </section>
  );
}
