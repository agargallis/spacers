/**
 * Resolve a venue to a maps link: an explicit `mapUrl` wins, otherwise we
 * build a Google Maps search on the venue name.
 */
export function venueMapUrl(venue, mapUrl) {
  if (mapUrl) return mapUrl;
  if (!venue) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
}
