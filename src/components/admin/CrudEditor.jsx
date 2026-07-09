import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CrudField from './CrudForm';
import { contentRepository } from '../../services/contentRepository';
import { collectionSchemas } from './collectionSchemas';

/**
 * Generic table + add/edit/delete for one collection & team.
 * All persistence goes through contentRepository (localStorage), which bumps
 * the content revision so public pages update live.
 */
export default function CrudEditor({ collection, team }) {
  const schema = collectionSchemas[collection];
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null); // row being edited, or 'new'
  const [draft, setDraft] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refresh = () => setRows(contentRepository.getCollection(collection, team));

  useEffect(refresh, [collection, team]);

  const openNew = () => {
    setDraft({ ...schema.defaults });
    setEditing('new');
  };
  const openEdit = (row) => {
    setDraft({ ...row });
    setEditing(row);
  };
  const closeModal = () => setEditing(null);

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = (e) => {
    e.preventDefault();
    if (editing === 'new') {
      contentRepository.createItem(collection, team, draft);
    } else {
      contentRepository.updateItem(collection, team, editing.id, draft);
    }
    refresh();
    closeModal();
  };

  const doDelete = () => {
    contentRepository.deleteItem(collection, team, confirmDelete.id);
    refresh();
    setConfirmDelete(null);
  };

  const cell = (col, row) => (col.render ? col.render(row[col.key], row) : row[col.key] ?? '-');

  const title = useMemo(() => (editing === 'new' ? `Νέα εγγραφή · ${schema.label}` : `Επεξεργασία · ${schema.label}`), [editing, schema.label]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-[var(--font-display)] text-lg font-bold">
            {schema.icon} {schema.label}
          </h3>
          <p className="text-xs text-[color:var(--text-faint)]">
            {rows.length} εγγραφές · τμήμα {team === 'main' ? 'Main' : 'Beta'}
          </p>
        </div>
        <Button size="sm" onClick={openNew}>
          + Προσθήκη
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--surface-2)]">
              {schema.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--text-faint)]">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[color:var(--text-faint)]">
                Ενέργειες
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-[color:var(--border)] hover:bg-[color:var(--surface-2)]/50"
              >
                {schema.columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-[color:var(--text-dim)]">
                    {cell(c, row)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(row)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-[color:rgb(var(--accent-rgb)/0.12)]"
                    >
                      Επεξεργασία
                    </button>
                    <button
                      onClick={() => setConfirmDelete(row)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/12"
                    >
                      Διαγραφή
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={schema.columns.length + 1} className="px-4 py-10 text-center text-sm text-[color:var(--text-faint)]">
                  Δεν υπάρχουν εγγραφές. Πάτησε «Προσθήκη».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={!!editing}
        onClose={closeModal}
        title={title}
        footer={
          <>
            <Button variant="ghost" size="sm" type="button" onClick={closeModal}>
              Ακύρωση
            </Button>
            <Button size="sm" type="submit" form="crud-form">
              Αποθήκευση
            </Button>
          </>
        }
      >
        <form id="crud-form" onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {schema.fields.map((f) => (
            <div key={f.key} className={f.type === 'textarea' || f.type === 'wl' ? 'sm:col-span-2' : ''}>
              <CrudField field={f} value={draft[f.key]} onChange={setField} />
            </div>
          ))}
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Επιβεβαίωση διαγραφής"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
              Ακύρωση
            </Button>
            <Button size="sm" className="!bg-rose-500 !text-white" onClick={doDelete}>
              Διαγραφή
            </Button>
          </>
        }
      >
        <p className="text-sm text-[color:var(--text-dim)]">
          Σίγουρα θέλεις να διαγράψεις αυτή την εγγραφή; Η ενέργεια δεν αναιρείται.
        </p>
      </Modal>
    </div>
  );
}
