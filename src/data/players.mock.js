/**
 * Real rosters mirrored from the official Basketaki The League profiles.
 * Player shape → future `players` table row:
 *   { id, team, name, slug, photo, games, points, ppg }
 * `photo` points at the league CDN; the UI falls back to an initials crest
 * if the image 404s. `slug` is the league's player id (stable join key).
 */
const CDN = 'https://basketaki-web.b-cdn.net/players';
const photo = (slug) => `${CDN}/${slug}.png`;

const build = (team, list) =>
  list.map((p) => ({
    id: `p-${team}-${p.slug}`,
    team,
    slug: p.slug,
    name: p.name,
    photo: photo(p.slug),
    games: p.games,
    points: p.points,
    ppg: p.ppg,
  }));

export const playersMock = {
  main: build('main', [
    { slug: 'ntrilizas-st-spyridon', name: 'Ντρίλιζας Στα. Σπυρίδων', games: 11, points: 223, ppg: 20.3 },
    { slug: 'xeirakis-fok-georgios', name: 'Χειράκης Φωκ. Γεώργιος', games: 10, points: 113, ppg: 11.3 },
    { slug: 'ntouras-iwa-dhmhtrios', name: 'Ντούρας Ιωά. Δημήτριος', games: 10, points: 99, ppg: 9.9 },
    { slug: 'mourelatos-apo-filippos', name: 'Μουρελάτος Από. Φίλιππος', games: 9, points: 83, ppg: 9.2 },
    { slug: 'vlaxopoulos-ore-dionusios', name: 'Βλαχόπουλος Ορε. Διονύσιος', games: 6, points: 55, ppg: 9.2 },
    { slug: 'ninios-ioa-spiridon', name: 'Νινιός Ιωά. Σπυρίδων', games: 1, points: 8, ppg: 8 },
    { slug: 'xeirakis-fok-spiridon', name: 'Χειράκης Φωκ. Σπυρίδων', games: 11, points: 78, ppg: 7.1 },
    { slug: 'xalkiopoulos-lew-spyridwn', name: 'Χαλκιόπουλος Λεω. Σπυρίδων', games: 7, points: 44, ppg: 6.3 },
    { slug: 'avramopoulos-ira-dimitrios', name: 'Αβραμόπουλος Ηρα. Δημήτριος', games: 7, points: 34, ppg: 4.9 },
    { slug: 'xatziaggelis-ioa-athanasios', name: 'Χατζηαγγελής Ιωά. Αθανάσιος', games: 6, points: 26, ppg: 4.3 },
    { slug: 'tourtouropoulos-emm-konnos', name: 'Τουρτουρόπουλος Εμμ. Κωνσταντίνος', games: 5, points: 17, ppg: 3.4 },
    { slug: 'antonopoulos-chr-emmanouil', name: 'Αντωνόπουλος Χρή. Εμμανουήλ', games: 2, points: 6, ppg: 3 },
    { slug: 'karkas-geo-andreas', name: 'Κάρκας Γεώ. Ανδρέας', games: 1, points: 2, ppg: 2 },
    { slug: 'fotitzogloy-athan-dimitrios', name: 'Φωτητζόγλου Αθα. Δημήτριος', games: 2, points: 2, ppg: 1 },
    { slug: 'markesinis-emm-anastasios', name: 'Μαρκεσίνης Εμμ. Αναστάσιος', games: 2, points: 0, ppg: 0 },
    { slug: 'klinis-kon-christosandreas', name: 'Κλίνης Κων. Χρήστος - Ανδρέας', games: 1, points: 0, ppg: 0 },
    { slug: 'papavasileioy-lam-rallis-stylianos', name: 'Παπαβασιλείου Λάμ. Ράλλης Στυλιανός', games: 2, points: 0, ppg: 0 },
  ]),
  beta: build('beta', [
    { slug: 'vazouras-lab-ioannis', name: 'Βαζούρας Λάμ. Ιωάννης', games: 10, points: 173, ppg: 17.3 },
    { slug: 'rigos-kwn-dhmhtrios', name: 'Ρήγος Κων. Δημήτριος', games: 2, points: 25, ppg: 12.5 },
    { slug: 'ventouris-kon-ioannis', name: 'Βεντούρης Κων. Ιωάννης', games: 4, points: 35, ppg: 8.8 },
    { slug: 'asimogiorgos-ioan-anastasios', name: 'Ασημογιώργος Ιωά. Αναστάσιος', games: 2, points: 17, ppg: 8.5 },
    { slug: 'stamatiadis-nik-aleksandros', name: 'Σταματιάδης Νικ. Αλέξανδρος', games: 8, points: 56, ppg: 7 },
    { slug: 'skikos-eva-isidoros', name: 'Σκίκος Ευά. Ισίδωρος', games: 6, points: 41, ppg: 6.8 },
    { slug: 'tammi-pat-nick', name: 'Tammi Pat. Nick', games: 7, points: 46, ppg: 6.6 },
    { slug: 'stavridis-efs-odisseas', name: 'Σταυρίδης Ευσ. Οδυσσέας', games: 9, points: 54, ppg: 6 },
    { slug: 'vasileiou-geo-fotios', name: 'Βασιλείου Γεώ. Φώτιος', games: 6, points: 27, ppg: 4.5 },
    { slug: 'chagias-ant-andreas', name: 'Χάγιας Αντ. Ανδρέας', games: 8, points: 35, ppg: 4.4 },
    { slug: 'kikilias-ili-panagiotis', name: 'Κικίλιας Ηλί. Παναγιώτης', games: 6, points: 24, ppg: 4 },
    { slug: 'tsigonias-thom-michail', name: 'Τσιγώνιας Θωμ. Μιχαήλ', games: 7, points: 17, ppg: 2.4 },
    { slug: 'stavropoulos-dim-dimitrios', name: 'Σταυρόπουλος Δημ. Δημήτριος', games: 2, points: 3, ppg: 1.5 },
    { slug: 'xatzimanolakis-geo-nikolas', name: 'Χατζημανωλάκης Γεώ. Νικόλας', games: 7, points: 7, ppg: 1 },
    { slug: 'kanellopoulos-geo-charalabos', name: 'Κανελλόπουλος Γεώ. Χαράλαμπος', games: 5, points: 2, ppg: 0.4 },
    { slug: 'visaritis-theo-christos', name: 'Βησαρίτης Θεο. Χρήστος', games: 0, points: 0, ppg: 0 },
    { slug: 'stamoulis-ili-ioannis', name: 'Σταμούλης Ηλί. Ιωάννης', games: 0, points: 0, ppg: 0 },
    { slug: 'peppes-dim-georgios', name: 'Πεππές Δημ. Γεώργιος', games: 1, points: 0, ppg: 0 },
  ]),
};
