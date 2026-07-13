import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Input } from '../ui/Field';
import TeamCrest from '../ui/TeamCrest';
import { useAdminAuth } from '../../store/useAdminAuth';

export default function AdminLogin() {
  const login = useAdminAuth((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await login(email.trim(), password);
    setBusy(false);
    if (!res.ok) setError('Λάθος email ή κωδικός.');
  };

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm card p-8 text-center"
      >
        <div className="mx-auto mb-6 flex justify-center">
          <TeamCrest team="main" size={72} />
        </div>
        <h1 className="font-[var(--font-display)] text-xl font-bold">Admin Πίνακας</h1>
        <p className="mt-1 text-sm text-[color:var(--text-dim)]">Περιοχή διαχείρισης περιεχομένου</p>

        <Input
          id="email"
          type="email"
          label=""
          className="mt-6 text-left"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          autoFocus
          required
        />
        <Input
          id="password"
          type="password"
          label=""
          className="mt-3 text-left"
          placeholder="Κωδικός"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          required
        />
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

        <Button as="button" type="submit" size="lg" className="mt-4 w-full" disabled={busy}>
          {busy ? 'Σύνδεση…' : 'Είσοδος'}
        </Button>
      </motion.form>
    </div>
  );
}
