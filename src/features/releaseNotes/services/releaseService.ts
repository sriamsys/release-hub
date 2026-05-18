import { createBaseService } from '@/services/baseService';
import { ReleaseNote } from '../types';

const STORAGE_KEY = 'release_notes';
const base = createBaseService<ReleaseNote>(STORAGE_KEY);

export const releaseService = {
  getReleaseNotes: base.getAll,
  saveReleaseNotes: base.saveAll,
  addReleaseNote: (note: ReleaseNote) => base.add(note, true), // Prepend releases
  updateReleaseNote: base.update,
  deleteReleaseNote: base.delete
};
