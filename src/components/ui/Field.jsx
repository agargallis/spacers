const inputBase =
  'w-full rounded-xl bg-[color:var(--surface-2)] border border-[color:var(--border)] px-4 py-2.5 text-sm ' +
  'text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] transition-colors ' +
  'focus:outline-none focus:border-accent focus:ring-1 ring-accent';

export function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">
      {children}
      {required && <span className="ml-0.5 text-accent">*</span>}
    </label>
  );
}

export function Input({ label, id, required, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id} required={required}>{label}</Label>}
      <input id={id} required={required} className={inputBase} {...props} />
    </div>
  );
}

export function Textarea({ label, id, required, rows = 4, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id} required={required}>{label}</Label>}
      <textarea id={id} required={required} rows={rows} className={`${inputBase} resize-y`} {...props} />
    </div>
  );
}

export function Select({ label, id, required, options = [], className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id} required={required}>{label}</Label>}
      <select id={id} required={required} className={`${inputBase} appearance-none pr-9`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Checkbox({ label, id, checked, onChange, className = '' }) {
  return (
    <label htmlFor={id} className={`inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--text-dim)] ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--surface-2)] accent-[color:var(--accent)]"
      />
      {label}
    </label>
  );
}
