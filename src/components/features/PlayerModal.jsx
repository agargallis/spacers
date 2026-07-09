import { useState } from 'react';
import Modal from '../ui/Modal';
import { initials } from '../../utils/format';
import { useActiveTeamMeta } from '../../store/useTeamStore';

const Stat = ({ label, value, accent }) => (
  <div className="rounded-xl bg-[color:var(--surface-2)] p-3 text-center">
    <div className={`font-[var(--font-display)] text-xl font-bold tabular-nums ${accent ? 'accent-gradient-text' : 'text-[color:var(--text)]'}`}>
      {value}
    </div>
    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[color:var(--text-faint)]">{label}</div>
  </div>
);

/** Roster player details in a blurred-backdrop modal. */
export default function PlayerModal({ player, onClose }) {
  const meta = useActiveTeamMeta();
  const [imgOk, setImgOk] = useState(true);

  return (
    <Modal open={!!player} onClose={onClose} title={player?.name ?? ''} size="md">
      {player && (
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-[color:var(--surface-2)]">
            {imgOk && player.photo ? (
              <img
                src={player.photo}
                alt={player.name}
                onError={() => setImgOk(false)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center font-[var(--font-display)] text-4xl font-black text-[color:var(--text-faint)]"
                style={{ background: `radial-gradient(circle at 50% 30%, ${meta.accent}22, transparent 70%)` }}
              >
                {initials(player.name)}
              </div>
            )}
          </div>

          <div className="mt-5 grid w-full grid-cols-3 gap-3">
            <Stat label="Αγώνες" value={player.games} />
            <Stat label="Πόντοι" value={player.points} />
            <Stat label="Π / αγώνα" value={player.ppg} accent />
          </div>

          <p className="mt-4 text-center text-xs text-[color:var(--text-faint)]">
            Στατιστικά σεζόν · {meta.name}
          </p>
        </div>
      )}
    </Modal>
  );
}
