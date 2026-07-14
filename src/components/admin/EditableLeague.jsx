import EditableText from './EditableText';
import { useActiveTeamMeta } from '../../store/useTeamStore';

/**
 * League-name eyebrow (per team). Thin wrapper over <EditableText> whose default
 * is the team's league from teams.js. Shown in Standings / Schedule / Results.
 */
export default function EditableLeague() {
  const meta = useActiveTeamMeta();
  return <EditableText id="league" defaultText={meta.league} label="διοργάνωση" />;
}
