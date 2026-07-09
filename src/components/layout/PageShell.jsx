import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/motion';

/** Wraps each routed page: consistent max width + entrance transition. */
export default function PageShell({ children, wide = false, className = '' }) {
  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-6xl'} px-4 sm:px-6 py-10 sm:py-14 ${className}`}
    >
      {children}
    </motion.main>
  );
}
