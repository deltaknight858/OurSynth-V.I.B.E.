export interface OpenAIClientLike {
  embeddings: {
    create(input: { model: string; input: string | string[] }): Promise<{ data: Array<{ embedding: number[] }> }>;
  };
}

export class OpenAIEmbeddingsProvider {
  private client: OpenAIClientLike;
  private model: string;
  constructor(client: OpenAIClientLike, model = 'text-embedding-3-small') {
    this.client = client;
    this.model = model;
  }
  async embed(text: string): Promise<number[]> {
    const res = await this.client.embeddings.create({ model: this.model, input: text });
    const first = res.data[0];
    if (!first) throw new Error('No embedding returned');
    return first.embedding;
  }
}

export type { OpenAIClientLike as EmbeddingsClientLike };
