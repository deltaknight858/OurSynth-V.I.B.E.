// De-Firebase: remove database services. Implement your data layer with your chosen backend.
export class RealtimeDatabaseService<T> {
  constructor(_basePath: string) {}
  async create(_data: any): Promise<T> { throw new Error("Firebase removed: implement RealtimeDatabaseService.create."); }
  async getById(_id: string): Promise<T | null> { throw new Error("Firebase removed: implement RealtimeDatabaseService.getById."); }
  async update(_id: string, _data: any): Promise<T> { throw new Error("Firebase removed: implement RealtimeDatabaseService.update."); }
  async delete(_id: string): Promise<void> { throw new Error("Firebase removed: implement RealtimeDatabaseService.delete."); }
  async queryByField(_field: string, _value: any): Promise<T[]> { throw new Error("Firebase removed: implement RealtimeDatabaseService.queryByField."); }
  subscribeToEntity(_id: string, _cb: (data: T | null) => void) { return () => {}; }
  subscribeToQuery(_field: string, _value: any, _cb: (data: T[]) => void) { return () => {}; }
}

export class FirestoreService<T> {
  constructor(_collectionName: string) {}
  async create(_id: string, _data: any): Promise<T> { throw new Error("Firebase removed: implement FirestoreService.create."); }
  async getById(_id: string): Promise<T | null> { throw new Error("Firebase removed: implement FirestoreService.getById."); }
  async update(_id: string, _data: any): Promise<T> { throw new Error("Firebase removed: implement FirestoreService.update."); }
  async delete(_id: string): Promise<void> { throw new Error("Firebase removed: implement FirestoreService.delete."); }
  async queryByField(_field: string, _value: any, _limitCount?: number): Promise<T[]> { throw new Error("Firebase removed: implement FirestoreService.queryByField."); }
  subscribeToDocument(_id: string, _cb: (data: T | null) => void) { return () => {}; }
  subscribeToQuery(_field: string, _value: any, _cb: (data: T[]) => void, _limitCount?: number) { return () => {}; }
}

// Factory function placeholder (optional)
export function createDatabaseService<T>(
  _type: "realtime" | "firestore",
  _path: string
): RealtimeDatabaseService<T> | FirestoreService<T> {
  throw new Error("Firebase removed: implement createDatabaseService with your backend");
}
