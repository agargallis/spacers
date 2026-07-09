import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { submitContact } from '../../services/contactService';
import { fadeUp, stagger } from '../../utils/motion';

const IconBall = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" /><path d="M4.9 4.9a16 16 0 0 1 14.2 14.2" /><path d="M19.1 4.9A16 16 0 0 1 4.9 19.1" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);
const IconClipboard = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);
const IconHandshake = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20.4 4.6a5.4 5.4 0 0 0-7.6 0l-.8.8-.8-.8a5.4 5.4 0 0 0-7.6 0C1.5 6.7 1.3 10.3 4 13l8 8 8-8c2.7-2.7 2.5-6.3.4-8.4z" /><path d="M12 5.4 8.9 8.5a2.1 2.1 0 0 0 0 3 2.1 2.1 0 0 0 3 0l.1-.5.1.5a2.1 2.1 0 0 0 3 0 2.1 2.1 0 0 0 0-3z" />
  </svg>
);
const IconBulb = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.1 14c.2-1 .7-1.7 1.4-2.5A4.6 4.6 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5A4.6 4.6 0 0 1 8.9 14" />
  </svg>
);

const ROLES = [
  { value: 'player', label: 'Νέος παίκτης', Icon: IconBall },
  { value: 'coach', label: 'Προπονητής', Icon: IconClipboard },
  { value: 'sponsor', label: 'Χορηγός', Icon: IconHandshake },
  { value: 'other', label: 'Πρόταση / Άλλο', Icon: IconBulb },
];

const inputCls =
  'w-full rounded-xl bg-[color:var(--surface-2)] border border-[color:var(--border)] px-4 py-2.5 text-sm text-left ' +
  'text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] transition-colors ' +
  'focus:outline-none focus:border-accent focus:ring-1 ring-accent';

const emptyForm = { role: '', name: '', phone: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    await submitContact(form);
    setStatus('done');
  };

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Επικοινωνία"
        title="Έλα στην ομάδα!"
        description="Χορηγός, νέος παίκτης, προπονητής ή απλά μια πρόταση, διάλεξε και γράψε μας."
      />

      <div className="mx-auto max-w-xl">
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-5 font-[var(--font-display)] text-xl font-bold">Το μήνυμα στάλθηκε!</h3>
              <p className="mt-2 text-sm text-[color:var(--text-dim)]">Θα επικοινωνήσουμε σύντομα μαζί σου. Ευχαριστούμε!</p>
              <Button className="mt-6" variant="ghost" onClick={() => { setForm(emptyForm); setStatus('idle'); }}>
                Νέο μήνυμα
              </Button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} variants={stagger(0.05)} initial="hidden" whileInView="show" viewport={{ once: true }} className="card space-y-5 p-6 text-center sm:p-8">
              {/* Role chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5">
                {ROLES.map(({ value, label, Icon }) => {
                  const active = form.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: value }))}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                        active
                          ? 'border-accent bg-[color:rgb(var(--accent-rgb)/0.14)] text-accent'
                          : 'border-[color:var(--border)] text-[color:var(--text-dim)] hover:border-accent/50 hover:text-[color:var(--text)]'
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  );
                })}
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">Όνομα</label>
                  <input id="c-name" className={inputCls} required value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">Κινητό</label>
                  <input id="c-phone" type="tel" className={inputCls} required value={form.phone} onChange={set('phone')} />
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <label htmlFor="c-msg" className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">Μήνυμα</label>
                <textarea id="c-msg" rows={4} className={`${inputCls} resize-y`} required value={form.message} onChange={set('message')} />
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button as="button" type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Αποστολή…' : 'Αποστολή μηνύματος'}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
