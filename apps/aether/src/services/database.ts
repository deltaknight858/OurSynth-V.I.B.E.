
import { db } from "@/lib/firebase";
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import type { UserProfile, Workflow, FileMetadata } from "@/types/database";

export class DatabaseService<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async create(id: string, data: Omit<T, "id">): Promise<T> {
    const docRef = this.getDocRef(id);
    const timestamp = serverTimestamp();
    await setDoc(docRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  async get(id: string): Promise<T | null> {
    const docSnap = await getDoc(this.getDocRef(id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = this.getDocRef(id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocRef(id));
  }

  async list(options?: {
    filters?: QueryConstraint[];
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    pageSize?: number;
    startAfterDoc?: DocumentSnapshot<T>;
  }): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.filters) {
      constraints.push(...options.filters);
    }

    if (options?.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || "desc"));
    }

    if (options?.pageSize) {
      constraints.push(limit(options.pageSize));
    }

    if (options?.startAfterDoc) {
      constraints.push(startAfter(options.startAfterDoc));
    }

    const q = query(this.getCollection(), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
}

export const userProfileService = new DatabaseService<UserProfile>("users");
export const workflowService = new DatabaseService<Workflow>("workflows");
export const fileMetadataService = new DatabaseService<FileMetadata>("files");
