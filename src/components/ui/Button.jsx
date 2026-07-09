import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight ' +
  'transition-all duration-200 focus:outline-none focus-visible:ring-2 ring-accent ring-offset-2 ' +
  'ring-offset-[color:var(--bg)] disabled:opacity-50 disabled:pointer-events-none';

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const variants = {
  primary: 'btn-accent',
  ghost:
    'text-[color:var(--text)] bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-accent hover:-translate-y-0.5',
  outline:
    'text-accent border border-accent/60 hover:bg-[color:rgb(var(--accent-rgb)/0.1)] hover:-translate-y-0.5',
};

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...props}>
        {children}
      </a>
    );
  }
  const Tag = as;
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}
