import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TeamSwitcher from './TeamSwitcher';
import { useActiveTeamMeta, useTeamStore } from '../../store/useTeamStore';
import { getSectionsForTeam } from '../../data/sectionConfig';
import { useScrollSpy, scrollToSection } from '../../hooks/useScrollSpy';

export default function Navbar() {
  const meta = useActiveTeamMeta();
  const activeTeam = useTeamStore((s) => s.activeTeam);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const sections = getSectionsForTeam(activeTeam);
  const ids = sections.map((s) => s.id);
  const activeId = useScrollSpy(ids);
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigate to a section: if not on home, go home first, then scroll.
  const goToSection = (id) => {
    setOpen(false);
    if (onHome) {
      scrollToSection(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(id), 80);
    }
  };

  const goHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (onHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-[color:var(--border)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Brand */}
        <a href="/" onClick={goHome} className="group flex items-center gap-3">
          <img
            src={meta.logo}
            alt={meta.name}
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="leading-tight">
            <div className="font-[var(--font-display)] text-base font-bold tracking-tight">Spacers</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-accent">
              {meta.key === 'main' ? 'Athens' : 'Beta'}
            </div>
          </div>
        </a>

        {/* Desktop section links */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((s) => {
            const isActive = onHome && activeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-[color:var(--text)]' : 'text-[color:var(--text-dim)] hover:text-[color:var(--text)]'
                }`}
              >
                {s.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <TeamSwitcher />
          <button
            className="md:hidden inline-grid h-10 w-10 place-items-center rounded-lg glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Μενού"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden glass border-t border-[color:var(--border)]"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {sections.map((s) => {
                const isActive = onHome && activeId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSection(s.id)}
                    className={`rounded-lg px-4 py-3 text-center text-sm font-medium ${
                      isActive ? 'bg-[color:rgb(var(--accent-rgb)/0.14)] text-accent' : 'text-[color:var(--text-dim)]'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
