import { heroPartners } from '../../data/partners';

/**
 * Logo strip below the hero crest. With a single partner it renders as a
 * static centered plug (no point animating a loop of one); with 2+ it
 * becomes a seamless infinite marquee, edge-faded, pausing on hover.
 */
const MIN_SLOTS = 10;

export default function LogoMarquee({ items = heroPartners, speed }) {
  if (items.length <= 1) {
    const p = items[0];
    if (!p) return null;
    return (
      <a
        href={p.url}
        target={p.url?.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        title={p.name}
        aria-label={p.name}
        className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain sm:h-12" draggable="false" />
      </a>
    );
  }

  // Repeat the list enough times that the strip always fills (and overflows)
  // the viewport — with only 2-3 logos and wide gaps, a single pass is
  // narrower than the container, so a stretch of the loop shows no logo at
  // all. Duplicating a wide-enough "base" once more keeps the -50% shift
  // seamless while the visual pace (seconds per logo) stays constant.
  const repeats = Math.max(1, Math.ceil(MIN_SLOTS / items.length));
  const base = Array.from({ length: repeats }, () => items).flat();
  const loop = [...base, ...base];
  const duration = speed ?? base.length * 5;

  return (
    <div className="marquee-viewport relative w-full overflow-hidden">
      <div
        className="marquee-track flex w-max items-center gap-10 py-2"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {loop.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={p.url}
            target={p.url?.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            title={p.name}
            className="shrink-0 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            aria-label={p.name}
          >
            <img
              src={p.logo}
              alt={p.name}
              loading="lazy"
              className="h-12 w-auto object-contain sm:h-14"
              draggable="false"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
