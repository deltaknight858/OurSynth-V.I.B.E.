import type { GraphAPI, MemoryAPI } from '../types.js';
export interface EmbeddingsProvider {
    embed(text: string): Promise<number[]>;
}
type SelectResult<T> = {
    data: T[] | null;
    error: any;
};
type SupabaseTable<T> = {
    insert(values: Partial<T> | Partial<T>[]): SupabaseTable<T> & {
        select: (columns: string) => Promise<SelectResult<T>>;
    };
    delete(): SupabaseTable<T> & {
        eq: (col: keyof T & string, value: any) => SupabaseTable<T> & {
            select: (columns: string) => Promise<SelectResult<T>>;
        };
    };
    eq(col: keyof T & string, value: any): SupabaseTable<T> & {
        select: (columns: string) => Promise<SelectResult<T>>;
    };
    ['in'](col: keyof T & string, values: any[]): SupabaseTable<T> & {
        select: (columns: string) => Promise<SelectResult<T>>;
    };
    select(columns: string): Promise<SelectResult<T>>;
};
type SupabaseClientLike = {
    from<T = any>(table: string): SupabaseTable<T>;
    rpc?<T = any>(fn: string, args: Record<string, any>): Promise<SelectResult<T>>;
};
export declare function createSupabaseGraphAPI(client: SupabaseClientLike): {
    graph: GraphAPI;
    memory: MemoryAPI;
};
export declare function createSupabaseMemoryAPI(client: SupabaseClientLike, embeddings: EmbeddingsProvider): MemoryAPI;
export {};
