import { useState, useEffect, useCallback } from 'react';
import { ReleaseNote } from '../types';
import { releaseService } from '../services/releaseService';
import { SAMPLE_RELEASE_NOTES } from '../mock/sampleData';

export const useReleaseNotes = () => {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = releaseService.getReleaseNotes();
    if (existing.length === 0) {
      // Seed with sample data if empty
      releaseService.saveReleaseNotes(SAMPLE_RELEASE_NOTES);
      setNotes(SAMPLE_RELEASE_NOTES);
    } else {
      setNotes(existing);
    }
    setLoading(false);
  }, []);

  const refreshNotes = useCallback(() => {
    setNotes(releaseService.getReleaseNotes());
  }, []);

  const addNote = useCallback((note: ReleaseNote) => {
    releaseService.addReleaseNote(note);
    refreshNotes();
  }, [refreshNotes]);

  const updateNote = useCallback((note: ReleaseNote) => {
    releaseService.updateReleaseNote(note);
    refreshNotes();
  }, [refreshNotes]);

  const deleteNote = useCallback((id: string) => {
    releaseService.deleteReleaseNote(id);
    refreshNotes();
  }, [refreshNotes]);

  return {
    notes,
    loading,
    refreshNotes,
    addNote,
    updateNote,
    deleteNote
  };
};
