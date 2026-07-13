import { create } from 'zustand';

/**
 * When true, the site renders in admin "edit mode": the exact same frontend,
 * but every data item shows inline controls (custom / hidden). Set true only
 * inside the admin route.
 */
export const useEditMode = create((set) => ({
  editMode: false,
  setEditMode: (editMode) => set({ editMode }),
}));
