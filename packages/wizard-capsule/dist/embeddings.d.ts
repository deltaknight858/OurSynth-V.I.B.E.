export interface OpenAIClientLike {
    embeddings: {
        create(input: {
            model: string;
            input: string | string[];
        }): Promise<{
            data: Array<{
                embedding: number[];
            }>;
        }>;
    };
}
export declare class OpenAIEmbeddingsProvider {
    private client;
    private model;
    constructor(client: OpenAIClientLike, model?: string);
    embed(text: string): Promise<number[]>;
}
export type { OpenAIClientLike as EmbeddingsClientLike };
