import { Input, Textarea, Select, Checkbox } from '../ui/Field';
import ImageField from './ImageField';

const pad = (n) => String(n).padStart(2, '0');
const toDatetimeInput = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Renders a single schema field bound to the draft object. */
export default function CrudField({ field, value, onChange }) {
  const set = (v) => onChange(field.key, v);

  switch (field.type) {
    case 'number':
      return (
        <Input
          id={field.key}
          label={field.label}
          required={field.required}
          type="number"
          step="any"
          value={value ?? ''}
          onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );
    case 'datetime':
      return (
        <Input
          id={field.key}
          label={field.label}
          required={field.required}
          type="datetime-local"
          value={toDatetimeInput(value)}
          onChange={(e) => set(new Date(e.target.value).toISOString())}
        />
      );
    case 'date':
      return (
        <Input
          id={field.key}
          label={field.label}
          required={field.required}
          type="date"
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
        />
      );
    case 'select':
      return (
        <Select
          id={field.key}
          label={field.label}
          required={field.required}
          options={field.options}
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
        />
      );
    case 'checkbox':
      return (
        <div className="pt-6">
          <Checkbox id={field.key} label={field.label} checked={!!value} onChange={(e) => set(e.target.checked)} />
        </div>
      );
    case 'wl':
      return (
        <Input
          id={field.key}
          label={field.label}
          value={Array.isArray(value) ? value.join(',') : value ?? ''}
          onChange={(e) =>
            set(
              e.target.value
                .split(',')
                .map((s) => s.trim().toUpperCase())
                .filter((s) => s === 'W' || s === 'L')
            )
          }
        />
      );
    case 'image':
      return <ImageField field={field} value={value} onChange={set} />;
    case 'textarea':
      return <Textarea id={field.key} label={field.label} value={value ?? ''} onChange={(e) => set(e.target.value)} />;
    default:
      return (
        <Input
          id={field.key}
          label={field.label}
          required={field.required}
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
        />
      );
  }
}
