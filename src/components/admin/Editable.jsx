import ItemControls from './ItemControls';
import { useEditMode } from '../../store/useEditMode';
import { useContentRevision } from '../../store/useContentRevision';
import { useTeamStore } from '../../store/useTeamStore';
import { getItemOverride } from '../../services/overrides';

/**
 * Wraps a single data item. In edit mode it overlays inline controls
 * (custom · hide · reset-to-auto); otherwise it's a transparent passthrough,
 * so the public site is unaffected.
 */
export default function Editable({ collection, schema, item, children, className = '' }) {
  const editMode = useEditMode((s) => s.editMode);
  useContentRevision((s) => s.revision);
  const team = useTeamStore((s) => s.activeTeam);

  if (!editMode) return children;

  const ov = getItemOverride(team, collection, item.id);
  const hidden = ov?.mode === 'hidden' || item._hidden;
  const custom = ov?.mode === 'manual';

  return (
    <div className={`relative ${className}`}>
      <div className={hidden ? 'pointer-events-none opacity-40' : ''}>{children}</div>

      <div className="absolute right-1.5 top-1.5 z-30">
        <ItemControls collection={collection} schema={schema} item={item} />
      </div>

      {custom && !hidden && (
        <span className="absolute left-1.5 top-1.5 z-30 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
          Custom
        </span>
      )}
      {hidden && (
        <span className="absolute left-1.5 top-1.5 z-30 rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
          Κρυφό
        </span>
      )}
    </div>
  );
}
