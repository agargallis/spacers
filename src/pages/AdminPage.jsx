import { useEffect } from 'react';
import { FiEdit2, FiEyeOff, FiRotateCcw, FiLogOut, FiExternalLink } from 'react-icons/fi';
import HomePage from './HomePage';
import Footer from '../components/layout/Footer';
import AdminLogin from '../components/admin/AdminLogin';
import TeamSwitcher from '../components/layout/TeamSwitcher';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAdminAuth } from '../store/useAdminAuth';
import { useEditMode } from '../store/useEditMode';

/**
 * Admin = the exact live frontend rendered in edit mode. Every data item shows
 * inline controls (custom · hide · reset-to-auto) via the <Editable> wrappers.
 */
export default function AdminPage() {
  const authed = useAdminAuth((s) => s.authed);
  const loading = useAdminAuth((s) => s.loading);
  const init = useAdminAuth((s) => s.init);
  const logout = useAdminAuth((s) => s.logout);
  const setEditMode = useEditMode((s) => s.setEditMode);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    setEditMode(true);
    return () => setEditMode(false);
  }, [setEditMode]);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner label="Έλεγχος σύνδεσης…" />
      </div>
    );
  }
  if (!authed) return <AdminLogin />;

  return (
    <div className="min-h-dvh">
      {/* Admin bar */}
      <header className="sticky top-0 z-[60] glass border-b border-[color:var(--border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
          {/* Left — premium Admin wordmark + hint */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #000))' }}
              >
                <FiEdit2 className="text-base" />
              </span>
              <span className="leading-tight">
                <span className="block font-[var(--font-display)] text-sm font-black tracking-wide">Admin</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-faint)]">
                  Live edit
                </span>
              </span>
            </div>

            <span className="hidden items-center gap-3 border-l border-[color:var(--border)] pl-3 text-[11px] text-[color:var(--text-faint)] lg:flex">
              <span className="inline-flex items-center gap-1"><FiEdit2 /> Custom</span>
              <span className="inline-flex items-center gap-1"><FiEyeOff /> Κρυφό</span>
              <span className="inline-flex items-center gap-1"><FiRotateCcw /> Auto</span>
            </span>
          </div>

          {/* Right — team switch (like the live site) + actions */}
          <div className="flex items-center gap-2.5">
            <TeamSwitcher className="!h-9 !w-9" />
            <Button to="/" variant="ghost" size="sm" className="gap-1.5">
              <FiExternalLink /> Site
            </Button>
            <button
              type="button"
              onClick={logout}
              title="Αποσύνδεση"
              aria-label="Αποσύνδεση"
              className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--text-dim)] ring-1 ring-[color:var(--border)] transition-colors hover:text-rose-400 hover:ring-rose-400/60"
            >
              <FiLogOut className="text-base" />
            </button>
          </div>
        </div>
      </header>

      {/* The real frontend, in edit mode */}
      <HomePage />
      <Footer />
    </div>
  );
}
