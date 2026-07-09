import { standingsMock } from './standings.mock';
import { upcomingMatchesMock, resultsMock } from './matches.mock';
import { playersMock } from './players.mock';
import { sponsorsMock } from './sponsors.mock';
import { videosMock } from './videos.mock';

/**
 * The full initial content tree that seeds the localStorage repository.
 * Collections are keyed by team so the admin edits main/beta independently.
 */
export const seedContent = () => ({
  standings: structuredClone(standingsMock),
  upcoming: structuredClone(upcomingMatchesMock),
  results: structuredClone(resultsMock),
  players: structuredClone(playersMock),
  sponsors: structuredClone(sponsorsMock),
  videos: structuredClone(videosMock),
});

export const COLLECTIONS = ['standings', 'upcoming', 'results', 'players', 'sponsors', 'videos'];
