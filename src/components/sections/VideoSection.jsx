import { useEffect, useState } from 'react';
import Section from './Section';
import SectionHeading from '../ui/SectionHeading';
import VideoCard from '../features/VideoCard';
import VideoPlayerModal from '../features/VideoPlayerModal';
import Editable from '../admin/Editable';
import AddButton from '../admin/AddButton';
import Spinner from '../ui/Spinner';
import { useTeamResource } from '../../hooks/useTeamResource';
import { getVideos } from '../../services/videosService';

function Arrow({ dir, ...props }) {
  return (
    <button
      {...props}
      className="grid h-11 w-11 place-items-center rounded-full glass text-[color:var(--text)] transition-all hover:border-accent hover:text-accent disabled:opacity-35 disabled:pointer-events-none"
      aria-label={dir === 'left' ? 'Προηγούμενο' : 'Επόμενο'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function VideoSection() {
  const { data: videos, loading, activeTeam } = useTeamResource(getVideos, { initialData: [] });
  const [playing, setPlaying] = useState(null);
  const [i, setI] = useState(0);

  const list = videos ?? [];
  const max = Math.max(0, list.length - 1);

  useEffect(() => setI(0), [activeTeam]);
  useEffect(() => setI((v) => Math.min(v, max)), [max]);

  const onPlay = (v) => setPlaying({ youtubeId: v.youtubeId, title: `Spacers vs ${v.opponent}` });

  return (
    <Section id="video">
      <SectionHeading id="video" eyebrow="Video" title="Δες τις αναμετρήσεις μας!" />

      {loading ? (
        <Spinner label="Φόρτωση video…" />
      ) : list.length ? (
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden pt-3">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${i * 100}%)` }}
            >
              {list.map((v) => (
                <div key={v.id} className="w-full shrink-0 px-0.5">
                  <Editable collection="videos" schema="videos" item={v}>
                    <VideoCard video={v} onPlay={onPlay} />
                  </Editable>
                </div>
              ))}
            </div>
          </div>

          {/* controls: ← dots → */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <Arrow dir="left" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} />
            <div className="flex items-center gap-2">
              {list.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setI(idx)}
                  aria-label={`Αγώνας ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? 'w-6 bg-accent' : 'w-2 bg-[color:var(--surface-2)] hover:bg-[color:var(--border)]'
                  }`}
                />
              ))}
            </div>
            <Arrow dir="right" onClick={() => setI((v) => Math.min(max, v + 1))} disabled={i >= max} />
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center text-[color:var(--text-dim)]">Δεν υπάρχουν διαθέσιμα video.</div>
      )}

      <AddButton collection="videos" schema="videos" label="video" className="mt-6" />

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </Section>
  );
}
