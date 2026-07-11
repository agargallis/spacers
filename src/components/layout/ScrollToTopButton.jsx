import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveTeamMeta } from '../../store/useTeamStore';

/**
 * Back-to-top button, fixed bottom-right. Colored by the active team's accent
 * (inline gradient) so it re-themes on toggle. Note: we style it inline rather
 * than via .btn-accent, because that class sets position:relative and would
 * override the `fixed` utility.
 */
export default function ScrollToTopButton() {
  const meta = useActiveTeamMeta();
  const [visible, setVisible] = useState(false);
  const [faded, setFaded] = useState(false); // over the footer → go transparent

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        // footer has scrolled up into the button's zone (bottom 24px)
        setFaded(rect.top < window.innerHeight - 24);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Κύλιση στην κορυφή"
          title="Πάνω"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: faded ? 0.12 : 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={faded ? undefined : { y: -3, scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          className="fixed bottom-6 right-6 z-50 grid place-items-center rounded-full text-white"
          style={{
            width: 52,
            height: 52,
            background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent2})`,
            boxShadow: `0 12px 30px -8px ${meta.accent}, 0 4px 12px rgba(0,0,0,0.45)`,
            pointerEvents: faded ? 'none' : 'auto',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
