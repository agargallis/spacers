/**
 * Declarative schema per content collection. Drives the generic CrudEditor:
 * `columns` render the table, `fields` render the add/edit form.
 *
 * field.type: 'text' | 'number' | 'datetime' | 'date' | 'select' | 'checkbox' | 'wl'
 *   'wl' → comma-separated W/L string in the form, stored as ['W','L',...].
 */
export const collectionSchemas = {
  standings: {
    label: 'Βαθμολογία',
    columns: [
      { key: 'pos', label: '#' },
      { key: 'team', label: 'Ομάδα' },
      { key: 'wins', label: 'Ν' },
      { key: 'losses', label: 'Η' },
      { key: 'points', label: 'Βαθ' },
    ],
    fields: [
      { key: 'pos', label: 'Θέση', type: 'number', required: true },
      { key: 'team', label: 'Ομάδα', type: 'text', required: true },
      { key: 'played', label: 'Αγώνες', type: 'number' },
      { key: 'wins', label: 'Νίκες', type: 'number' },
      { key: 'losses', label: 'Ήττες', type: 'number' },
      { key: 'pointsFor', label: 'Πόντοι υπέρ', type: 'number' },
      { key: 'pointsAgainst', label: 'Πόντοι κατά', type: 'number' },
      { key: 'points', label: 'Βαθμοί', type: 'number' },
      { key: 'logo', label: 'Λογότυπο ομάδας', type: 'image', folder: 'teams' },
      { key: 'form', label: 'Φόρμα (π.χ. W,W,L,W,L)', type: 'wl' },
      { key: 'isOurs', label: 'Είναι η ομάδα μας', type: 'checkbox' },
    ],
    defaults: { pos: 1, team: '', played: 0, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, points: 0, logo: null, form: [], isOurs: false },
  },

  upcoming: {
    label: 'Πρόγραμμα',
    columns: [
      { key: 'datetime', label: 'Ημ/νία', render: (v) => new Date(v).toLocaleString('el-GR', { dateStyle: 'short', timeStyle: 'short' }) },
      { key: 'opponent', label: 'Αντίπαλος' },
      { key: 'venue', label: 'Γήπεδο' },
      { key: 'home', label: 'Έδρα', render: (v) => (v ? 'Εντός' : 'Εκτός') },
    ],
    fields: [
      { key: 'opponent', label: 'Αντίπαλος', type: 'text', required: true },
      { key: 'datetime', label: 'Ημερομηνία & ώρα', type: 'datetime', required: true },
      { key: 'venue', label: 'Γήπεδο', type: 'text' },
      { key: 'mapUrl', label: 'Google Maps link (προαιρετικό)', type: 'text' },
      { key: 'home', label: 'Εντός έδρας', type: 'checkbox' },
      { key: 'status', label: 'Κατάσταση', type: 'select', options: [
        { value: 'scheduled', label: 'Προγραμματισμένος' },
        { value: 'live', label: 'Live' },
        { value: 'finished', label: 'Ολοκληρώθηκε' },
      ] },
    ],
    defaults: { opponent: '', datetime: new Date().toISOString(), venue: '', mapUrl: '', home: true, status: 'scheduled' },
  },

  results: {
    label: 'Αποτελέσματα',
    columns: [
      { key: 'datetime', label: 'Ημ/νία', render: (v) => new Date(v).toLocaleDateString('el-GR') },
      { key: 'opponent', label: 'Αντίπαλος' },
      { key: 'scoreFor', label: 'Σκορ', render: (_, row) => `${row.scoreFor}-${row.scoreAgainst}` },
    ],
    fields: [
      { key: 'opponent', label: 'Αντίπαλος', type: 'text', required: true },
      { key: 'category', label: 'Διοργάνωση (π.χ. S.Master)', type: 'text' },
      { key: 'datetime', label: 'Ημερομηνία', type: 'datetime', required: true },
      { key: 'home', label: 'Εντός έδρας', type: 'checkbox' },
      { key: 'scoreFor', label: 'Πόντοι Spacers', type: 'number', required: true },
      { key: 'scoreAgainst', label: 'Πόντοι αντιπάλου', type: 'number', required: true },
    ],
    defaults: { opponent: '', category: '', datetime: new Date().toISOString(), home: true, scoreFor: 0, scoreAgainst: 0 },
  },

  players: {
    label: 'Ρόστερ',
    columns: [
      { key: 'name', label: 'Όνομα' },
      { key: 'games', label: 'Αγ' },
      { key: 'points', label: 'Πόν' },
      { key: 'ppg', label: 'ΜΟ' },
    ],
    fields: [
      { key: 'name', label: 'Ονοματεπώνυμο', type: 'text', required: true },
      { key: 'photo', label: 'Φωτογραφία', type: 'image', folder: 'players' },
      { key: 'games', label: 'Αγώνες', type: 'number' },
      { key: 'points', label: 'Σύνολο πόντων', type: 'number' },
      { key: 'ppg', label: 'Πόντοι / αγώνα', type: 'number' },
    ],
    defaults: { name: '', photo: null, games: 0, points: 0, ppg: 0 },
  },

  sponsors: {
    label: 'Χορηγοί',
    columns: [
      { key: 'name', label: 'Όνομα' },
      { key: 'tier', label: 'Tier' },
    ],
    fields: [
      { key: 'name', label: 'Όνομα', type: 'text', required: true },
      { key: 'tier', label: 'Tier', type: 'select', options: [
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
        { value: 'bronze', label: 'Bronze' },
      ] },
      { key: 'url', label: 'Website URL', type: 'text' },
      { key: 'logo', label: 'Λογότυπο', type: 'image', folder: 'sponsors' },
    ],
    defaults: { name: '', tier: 'bronze', url: '', logo: null },
  },

  videos: {
    label: 'Video',
    columns: [
      { key: 'date', label: 'Ημ/νία', render: (v) => new Date(v).toLocaleDateString('el-GR') },
      { key: 'opponent', label: 'Αντίπαλος' },
      { key: 'scoreFor', label: 'Σκορ', render: (_, row) => `${row.scoreFor}-${row.scoreAgainst}` },
    ],
    fields: [
      { key: 'opponent', label: 'Αντίπαλος', type: 'text', required: true },
      { key: 'date', label: 'Ημερομηνία', type: 'datetime', required: true },
      { key: 'youtubeId', label: 'YouTube ID', type: 'text', required: true },
      { key: 'home', label: 'Εντός έδρας', type: 'checkbox' },
      { key: 'scoreFor', label: 'Πόντοι Spacers', type: 'number' },
      { key: 'scoreAgainst', label: 'Πόντοι αντιπάλου', type: 'number' },
      { key: 'won', label: 'Νίκη', type: 'checkbox' },
      { key: 'opponentLogo', label: 'Λογότυπο αντιπάλου', type: 'image', folder: 'teams' },
    ],
    defaults: { opponent: '', date: new Date().toISOString(), youtubeId: '', home: true, scoreFor: 0, scoreAgainst: 0, won: true, opponentLogo: '' },
  },
};

export const COLLECTION_ORDER = ['standings', 'upcoming', 'results', 'players', 'sponsors', 'videos'];
