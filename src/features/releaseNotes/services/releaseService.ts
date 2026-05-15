import { persistence } from '@/services/persistence';
import { ReleaseNote } from '../types';

const STORAGE_KEY = 'release_notes';

export const releaseService = {
  getReleaseNotes: (): ReleaseNote[] => {
    return persistence.get<ReleaseNote[]>(STORAGE_KEY, []);
  },

  saveReleaseNotes: (notes: ReleaseNote[]): void => {
    persistence.set(STORAGE_KEY, notes);
  },

  addReleaseNote: (note: ReleaseNote): void => {
    const notes = releaseService.getReleaseNotes();
    releaseService.saveReleaseNotes([note, ...notes]);
  },

  updateReleaseNote: (updatedNote: ReleaseNote): void => {
    const notes = releaseService.getReleaseNotes();
    const index = notes.findIndex(n => n.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = updatedNote;
      releaseService.saveReleaseNotes(notes);
    }
  },

  deleteReleaseNote: (id: string): void => {
    const notes = releaseService.getReleaseNotes();
    releaseService.saveReleaseNotes(notes.filter(n => n.id !== id));
  }
};
