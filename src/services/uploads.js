import { supabase } from '../lib/supabaseClient';

/** Public Storage bucket that holds admin-uploaded images. */
const BUCKET = 'media';

/**
 * Upload an image file (chosen from the admin's device) to Supabase Storage and
 * return its public URL. The URL is then stored in the item's override so it
 * shows on the live site. Requires the `media` bucket (see SUPABASE_SETUP.md).
 */
export async function uploadImage(file, folder = 'uploads') {
  if (!supabase) return { error: 'Supabase δεν έχει ρυθμιστεί.' };
  if (!file) return { error: 'Δεν επιλέχθηκε αρχείο.' };
  if (!file.type?.startsWith('image/')) return { error: 'Επίλεξε αρχείο εικόνας.' };
  if (file.size > 5 * 1024 * 1024) return { error: 'Η εικόνα ξεπερνά τα 5MB.' };

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) return { error: error.message || 'Αποτυχία μεταφόρτωσης.' };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
