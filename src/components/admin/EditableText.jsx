import { useState } from 'react';
import { FiEdit2, FiRotateCcw } from 'react-icons/fi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useEditMode } from '../../store/useEditMode';
import { useContentRevision } from '../../store/useContentRevision';
import { useTeamStore } from '../../store/useTeamStore';
import { getSetting, setSetting, resetSetting } from '../../services/overrides';

/**
 * Any inline text (a section title, eyebrow, label…) made editable per team.
 * Public site: renders the resolved string (admin custom → default).
 * Edit mode: renders the text + a pencil that opens a rename modal.
 * The value is stored in the overrides table (collection `settings`, key = id),
 * so it updates live via realtime and needs no schema change.
 */
export default function EditableText({ id, defaultText, label = 'κείμενο' }) {
  const editMode = useEditMode((s) => s.editMode);
  useContentRevision((s) => s.revision);
  const team = useTeamStore((s) => s.activeTeam);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const custom = getSetting(team, id, null);
  const text = custom ?? defaultText;

  if (!editMode) return text;

  const save = (e) => {
    e.preventDefault();
    const v = draft.trim();
    if (v) setSetting(team, id, v);
    else resetSetting(team, id);
    setOpen(false);
  };

  return (
    <span className="inline-flex items-center gap-[0.4em]">
      {text}
      <button
        type="button"
        onClick={() => {
          setDraft(text);
          setOpen(true);
        }}
        title={`Άλλαξε ${label}`}
        aria-label={`Επεξεργασία: ${label}`}
        className="grid h-[1.5em] w-[1.5em] shrink-0 place-items-center rounded text-[0.62em] text-accent/80 ring-1 ring-accent/40 transition-colors hover:bg-[color:rgb(var(--accent-rgb)/0.12)] hover:text-accent"
      >
        <FiEdit2 />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Επεξεργασία ${label}`}
        footer={
          <>
            {custom && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="mr-auto gap-1.5"
                onClick={() => {
                  resetSetting(team, id);
                  setOpen(false);
                }}
              >
                <FiRotateCcw /> Auto
              </Button>
            )}
            <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
              Ακύρωση
            </Button>
            <Button size="sm" type="submit" form="editable-text-form">
              Αποθήκευση
            </Button>
          </>
        }
      >
        <form id="editable-text-form" onSubmit={save}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            placeholder={defaultText}
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3.5 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-faint)] focus:border-accent focus:outline-none focus:ring-1 ring-accent"
          />
          <p className="mt-2 text-xs text-[color:var(--text-faint)]">
            Άδειο πεδίο = επαναφορά στο προεπιλεγμένο «{defaultText}».
          </p>
        </form>
      </Modal>
    </span>
  );
}
