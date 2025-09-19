export class OpenAIEmbeddingsProvider {
    constructor(client, model = 'text-embedding-3-small') {
        this.client = client;
        this.model = model;
    }
    async embed(text) {
        const res = await this.client.embeddings.create({ model: this.model, input: text });
        const first = res.data[0];
        if (!first)
            throw new Error('No embedding returned');
        return first.embedding;
    }
}
