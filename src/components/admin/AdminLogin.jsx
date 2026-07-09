import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Input } from '../ui/Field';
import TeamCrest from '../ui/TeamCrest';
import { useAdminAuth } from '../../store/useAdminAuth';

export default function AdminLogin() {
  const login = useAdminAuth((s) => s.login);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!login(password)) setError(true);
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
          id="password"
          type="password"
          label=""
          className="mt-6 text-left"
          placeholder="Κωδικός πρόσβασης"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          autoFocus
        />
        {error && <p className="mt-2 text-xs text-rose-400">Λάθος κωδικός. Δοκίμασε ξανά.</p>}

        <Button as="button" type="submit" size="lg" className="mt-4 w-full">
          Είσοδος
        </Button>
        <p className="mt-4 text-[11px] text-[color:var(--text-faint)]">
          Prototype gate · θα αντικατασταθεί με Supabase auth
        </p>
      </motion.form>
    </div>
  );
}
