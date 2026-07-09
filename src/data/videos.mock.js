/**
 * Game videos — a recent result paired with its YouTube link.
 * Shape → future `game_videos` table row:
 *   { id, team, date(ISO), opponent, opponentLogo, home, scoreFor, scoreAgainst, won, youtubeId }
 * youtubeId extracted from the youtube.com/live/<id> links.
 */
const T = 'https://basketaki-web.b-cdn.net/teams';

export const videosMock = {
  main: [
    { id: 'v-main-1', team: 'main', date: '2026-07-01T17:00:00.000Z', opponent: 'Couvaliers', opponentLogo: `${T}/rbd-couvaliers.png`, home: true, scoreFor: 70, scoreAgainst: 68, won: true, youtubeId: '0rrCN4ps89I' },
    { id: 'v-main-2', team: 'main', date: '2026-06-25T17:00:00.000Z', opponent: 'Βελούδινα Σφυριά', opponentLogo: `${T}/veloudina-sfiria.png`, home: false, scoreFor: 76, scoreAgainst: 71, won: true, youtubeId: '6R5BXyxEchc' },
    { id: 'v-main-3', team: 'main', date: '2026-06-14T17:00:00.000Z', opponent: 'Dionysos Escorts', opponentLogo: `${T}/dionysos-escorts.png`, home: false, scoreFor: 98, scoreAgainst: 69, won: true, youtubeId: 'vTUjWOG2JlM' },
  ],
  beta: [
    { id: 'v-beta-1', team: 'beta', date: '2026-07-05T17:00:00.000Z', opponent: 'Bricklaykers', opponentLogo: `${T}/bricklaykers.png`, home: false, scoreFor: 70, scoreAgainst: 41, won: true, youtubeId: 'MGs8o6PcYG4' },
    { id: 'v-beta-2', team: 'beta', date: '2026-06-19T17:00:00.000Z', opponent: 'Ρέμπελοι', opponentLogo: `${T}/rebeloi.png`, home: true, scoreFor: 83, scoreAgainst: 49, won: true, youtubeId: '76sxURVaRMA' },
    { id: 'v-beta-3', team: 'beta', date: '2026-05-14T17:00:00.000Z', opponent: 'Los Angeles Pit-Bulls', opponentLogo: `${T}/los-angeles-pitbulls.png`, home: false, scoreFor: 67, scoreAgainst: 48, won: true, youtubeId: 'YVBydRMynkc' },
  ],
};
