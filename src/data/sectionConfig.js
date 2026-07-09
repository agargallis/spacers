/**
 * Single-page section registry + per-team ordering.
 *
 * The site is one continuous page; the navbar scrolls to these anchors.
 * `sectionOrder` lets each team present its sections in its own order —
 * just reorder the arrays below (ids must exist in SECTION_META).
 */
export const SECTION_META = {
  roster: { id: 'roster', label: 'Ρόστερ' },
  standings: { id: 'standings', label: 'Βαθμολογία' },
  schedule: { id: 'schedule', label: 'Πρόγραμμα' },
  results: { id: 'results', label: 'Αποτελέσματα' },
  video: { id: 'video', label: 'Video' },
  sponsors: { id: 'sponsors', label: 'Χορηγοί' },
  contact: { id: 'contact', label: 'Επικοινωνία' },
};

export const sectionOrder = {
  main: ['standings', 'roster', 'schedule', 'results', 'video', 'sponsors', 'contact'],
  beta: ['standings', 'roster', 'schedule', 'results', 'video', 'sponsors', 'contact'],
};

/** Ordered [{id,label}] for a given team. */
export const getSectionsForTeam = (team) =>
  (sectionOrder[team] ?? sectionOrder.main).map((id) => SECTION_META[id]).filter(Boolean);
