import { contactRepository } from './contentRepository';
import { resolve } from './_client';

/**
 * Submit a contact request. Currently persists to a local inbox; in Phase 3
 * this becomes a Supabase insert / email webhook — signature stays the same.
 */
export async function submitContact(payload) {
  const record = contactRepository.submit(payload);
  return resolve(record, { latency: 500 });
}
