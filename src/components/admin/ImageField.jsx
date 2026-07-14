import { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { uploadImage } from '../../services/uploads';

/**
 * Image picker for the edit form. Shows a preview, an "upload from device"
 * button (Supabase Storage → public URL), and a URL fallback. `onChange`
 * receives the resolved value (a URL string) or '' when cleared.
 */
export default function ImageField({ field, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setErr('');
    setBusy(true);
    const { url, error } = await uploadImage(file, field.folder || 'uploads');
    setBusy(false);
    if (error) {
      setErr(error);
      return;
    }
    onChange(url);
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-[color:var(--text-dim)]">{field.label}</span>

      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)]">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <FiImage className="text-lg text-[color:var(--text-faint)]" />
          )}
        </div>

        <div className="flex flex-col items-start gap-1.5">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-accent/60 px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-[color:rgb(var(--accent-rgb)/0.1)] ${
              busy ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            <FiUpload />
            {busy ? 'Μεταφόρτωση…' : 'Επιλογή εικόνας'}
            <input type="file" accept="image/*" className="hidden" onChange={pick} disabled={busy} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 text-xs text-[color:var(--text-dim)] transition-colors hover:text-rose-400"
            >
              <FiX /> Αφαίρεση
            </button>
          )}
        </div>
      </div>

      {err && <p className="mt-1.5 text-xs text-rose-400">{err}</p>}

      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…ή επικόλλησε URL εικόνας"
        className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3.5 py-2 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] focus:border-accent focus:outline-none focus:ring-1 ring-accent"
      />
    </div>
  );
}
