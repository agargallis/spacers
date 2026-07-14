import { useEffect, useState } from 'react';
import { initials } from '../../utils/format';
import { useActiveTeamMeta } from '../../store/useTeamStore';

/** Compact roster card: photo + name only. Click opens the details modal. */
export default function PlayerCard({ player, onClick }) {
  const meta = useActiveTeamMeta();
  const [imgOk, setImgOk] = useState(true);

  // Retry the image whenever the photo changes (e.g. admin uploads a new one),
  // otherwise a previously-broken CDN photo would keep the card on initials.
  useEffect(() => setImgOk(true), [player.photo]);

  return (
    <button
      onClick={onClick}
      className="group block w-full overflow-hidden rounded-2xl card text-left transition-all duration-300 hover:-translate-y-1 hover:accent-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--surface-2)]">
        {imgOk && player.photo ? (
          <img
            src={player.photo}
            alt={player.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center font-[var(--font-display)] text-4xl font-black text-[color:var(--text-faint)]"
            style={{ background: `radial-gradient(circle at 50% 30%, ${meta.accent}22, transparent 70%)` }}
          >
            {initials(player.name)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--surface)] via-transparent to-transparent" />
      </div>

      <div className="p-3">
        <div className="flex min-h-[3.75rem] items-center justify-center">
          <h3
            className="line-clamp-3 text-center text-sm font-semibold leading-tight text-balance"
            title={player.name}
          >
            {player.name}
          </h3>
        </div>
      </div>
    </button>
  );
}
