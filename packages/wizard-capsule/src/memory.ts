import type { MemoryAPI, MemoryNote, CapsuleId } from './types.js';

const notes = new Map<CapsuleId, MemoryNote[]>();

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export const memory: MemoryAPI = {
  async add(note: Omit<MemoryNote, 'id' | 'timestamp'>) {
    const now = new Date().toISOString();
    const created: MemoryNote = {
      id: makeId(),
      timestamp: now,
      ...note,
    };
    const arr = notes.get(note.capsuleId) ?? [];
    arr.push(created);
    notes.set(note.capsuleId, arr);
    return created;
  },
  async list(capsuleId: CapsuleId) {
    return notes.get(capsuleId) ?? [];
  },
  async remove(id: string) {
    for (const [cid, arr] of notes.entries()) {
      const idx = arr.findIndex(n => n.id === id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        notes.set(cid, arr);
        return;
      }
    }
  },
};
