const notes = new Map();
function makeId() {
    return Math.random().toString(36).slice(2, 10);
}
export const memory = {
    async add(note) {
        const now = new Date().toISOString();
        const created = {
            id: makeId(),
            timestamp: now,
            ...note,
        };
        const arr = notes.get(note.capsuleId) ?? [];
        arr.push(created);
        notes.set(note.capsuleId, arr);
        return created;
    },
    async list(capsuleId) {
        return notes.get(capsuleId) ?? [];
    },
    async remove(id) {
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
