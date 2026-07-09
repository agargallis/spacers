import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminLogin from '../components/admin/AdminLogin';
import CrudEditor from '../components/admin/CrudEditor';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { collectionSchemas, COLLECTION_ORDER } from '../components/admin/collectionSchemas';
import { contentRepository } from '../services/contentRepository';
import { useAdminAuth } from '../store/useAdminAuth';

const TEAM_TABS = [
  { key: 'main', label: 'Main', color: '#2f6bff' },
  { key: 'beta', label: 'Beta', color: '#2fd662' },
];

export default function AdminPage() {
  const authed = useAdminAuth((s) => s.authed);
  const logout = useAdminAuth((s) => s.logout);
  const [team, setTeam] = useState('main');
  const [active, setActive] = useState('standings');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!authed) return <AdminLogin />;

  const doReset = () => {
    contentRepository.reset();
    setConfirmReset(false);
  };

  return (
    <div className="min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-[color:var(--border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white font-bold">S</span>
            <div>
              <div className="font-[var(--font-display)] text-sm font-bold">Admin Dashboard</div>
              <div className="text-[11px] text-[color:var(--text-faint)]">Spacers Content Manager</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Team switch */}
            <div className="inline-flex rounded-full glass p-1">
              {TEAM_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTeam(t.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    team === t.key ? 'text-white' : 'text-[color:var(--text-dim)]'
                  }`}
                  style={team === t.key ? { background: t.color } : undefined}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button to="/" variant="ghost" size="sm">
              Site
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              Έξοδος
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 py-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {COLLECTION_ORDER.map((key) => {
              const s = collectionSchemas[key];
              const isActive = key === active;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all lg:w-full ${
                    isActive
                      ? 'bg-[color:rgb(var(--accent-rgb)/0.14)] text-accent accent-ring'
                      : 'text-[color:var(--text-dim)] hover:bg-[color:var(--surface-2)]'
                  }`}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 hidden lg:block">
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-xs font-semibold text-[color:var(--text-faint)] hover:border-rose-500/50 hover:text-rose-300"
            >
              Επαναφορά δεδομένων
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${team}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CrudEditor collection={active} team={team} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Επαναφορά δεδομένων"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
              Ακύρωση
            </Button>
            <Button size="sm" className="!bg-rose-500 !text-white" onClick={doReset}>
              Επαναφορά
            </Button>
          </>
        }
      >
        <p className="text-sm text-[color:var(--text-dim)]">
          Όλα τα δεδομένα (και για τα δύο τμήματα) θα επανέλθουν στις αρχικές τιμές.
          Οι αλλαγές σου θα χαθούν.
        </p>
      </Modal>
    </div>
  );
}
