/** Anchor-able section wrapper with consistent rhythm + navbar scroll offset. */
export default function Section({ id, children, className = '', container = true }) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${className}`}>
      {container ? <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div> : children}
    </section>
  );
}
