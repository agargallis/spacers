import { useState } from 'react';
import { FiEdit2, FiEye, FiEyeOff, FiRotateCcw } from 'react-icons/fi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CrudField from './CrudForm';
import { collectionSchemas } from './collectionSchemas';
import { useTeamStore } from '../../store/useTeamStore';
import { getItemOverride, setItemHidden, setItemCustom, resetItem } from '../../services/overrides';

const btn =
  'grid h-7 w-7 place-items-center rounded-md bg-[color:var(--surface)] text-[13px] text-[color:var(--text-dim)] shadow ring-1 ring-[color:var(--border)] transition hover:text-accent hover:ring-accent';

/**
 * The custom · hide · reset control cluster for a single item, without the
 * positioned overlay wrapper — reusable inside table cells or overlays.
 */
export default function ItemControls({ collection, schema, item, className = '' }) {
  const team = useTeamStore((s) => s.activeTeam);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const ov = getItemOverride(team, collection, item.id);
  const hidden = ov?.mode === 'hidden' || item._hidden;
  const custom = ov?.mode === 'manual';
  const fields = collectionSchemas[schema]?.fields ?? [];

  const openEdit = () => {
    setDraft({ ...item });
    setEditing(true);
  };
  const saveEdit = (e) => {
    e.preventDefault();
    setItemCustom(team, collection, item.id, draft);
    setEditing(false);
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button type="button" onClick={openEdit} title="Custom τιμή" aria-label="Custom" className={btn}>
        <FiEdit2 />
      </button>
      <button
        type="button"
        onClick={() => setItemHidden(team, collection, item.id, !hidden)}
        title={hidden ? 'Εμφάνιση' : 'Κρύψιμο'}
        aria-label={hidden ? 'Εμφάνιση' : 'Κρύψιμο'}
        className={btn}
      >
        {hidden ? <FiEye /> : <FiEyeOff />}
      </button>
      {(custom || hidden) && (
        <button
          type="button"
          onClick={() => resetItem(team, collection, item.id)}
          title="Auto (live)"
          aria-label="Auto"
          className={btn}
        >
          <FiRotateCcw />
        </button>
      )}

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Custom τιμές"
        footer={
          <>
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditing(false)}>
              Ακύρωση
            </Button>
            <Button size="sm" type="submit" form="item-controls-form">
              Αποθήκευση
            </Button>
          </>
        }
      >
        <form id="item-controls-form" onSubmit={saveEdit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={['textarea', 'wl', 'image'].includes(f.type) ? 'sm:col-span-2' : ''}>
              <CrudField field={f} value={draft[f.key]} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))} />
            </div>
          ))}
        </form>
      </Modal>
    </span>
  );
}
