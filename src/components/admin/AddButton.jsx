import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CrudField from './CrudForm';
import { collectionSchemas } from './collectionSchemas';
import { useEditMode } from '../../store/useEditMode';
import { useTeamStore } from '../../store/useTeamStore';
import { addItem } from '../../services/overrides';

/** "+ Add" affordance shown only in edit mode — creates a custom item. */
export default function AddButton({ collection, schema, label = 'στοιχείο', className = '' }) {
  const editMode = useEditMode((s) => s.editMode);
  const team = useTeamStore((s) => s.activeTeam);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({});

  if (!editMode) return null;

  const fields = collectionSchemas[schema]?.fields ?? [];
  const openNew = () => {
    setDraft({ ...(collectionSchemas[schema]?.defaults ?? {}) });
    setOpen(true);
  };
  const save = (e) => {
    e.preventDefault();
    addItem(team, collection, draft);
    setOpen(false);
  };

  return (
    <>
      <div className={`flex justify-center ${className}`}>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-accent/60 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-[color:rgb(var(--accent-rgb)/0.1)]"
        >
          <FiPlus className="text-base" />
          Προσθήκη {label}
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Νέο ${label}`}
        footer={
          <>
            <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
              Ακύρωση
            </Button>
            <Button size="sm" type="submit" form="add-form">
              Προσθήκη
            </Button>
          </>
        }
      >
        <form id="add-form" onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={['textarea', 'wl', 'image'].includes(f.type) ? 'sm:col-span-2' : ''}>
              <CrudField field={f} value={draft[f.key]} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))} />
            </div>
          ))}
        </form>
      </Modal>
    </>
  );
}
