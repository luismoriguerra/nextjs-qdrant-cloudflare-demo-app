import { QdrantClient } from '@qdrant/js-client-rest';

export class QdrantService {
    private client: QdrantClient;
    private collectionName: string;

    constructor(collectionName: string = "next_qdrant_768") {
        this.client = new QdrantClient({
            url: process.env.QDRANT_URL_HTTP,
            apiKey: process.env.QDRANT_API_KEY,
        });
        this.collectionName = collectionName;
    }

    async getCollections() {
        try {
            const result = await this.client.getCollections();
            return result.collections;
        } catch (err) {
            console.error('Could not get collections:', err);
            throw new Error('Failed to get collections');
        }
    }

    async createCollection(collectionName: string, vectorSize: number) {
        try {
            await this.client.createCollection(collectionName, { vectors: { size: vectorSize, distance: 'Cosine' } });
            return true;
        } catch (err) {
            console.error('Could not create collection:', err);
            throw new Error('Failed to create collection');
        }
    }

    async upsertPoints(points: Array<{ id: string, vector: number[], payload?: Record<string, string | number | boolean> }>) {
        try {
            await this.client.upsert(this.collectionName, {
                points: points
            });
            return true;
        } catch (err) {
            console.error('Could not upsert points:', err);
            throw new Error('Failed to upsert points');
        }
    }

    async search(vector: number[], limit: number = 10) {
        try {
            const result = await this.client.search(this.collectionName, {
                vector: vector,
                limit: limit
            });
            return result;
        } catch (err) {
            console.error('Could not perform search:', err);
            throw new Error('Failed to perform search');
        }
    }

    async deletePoint(id: string) {
        try {
            await this.client.delete(this.collectionName, {
                points: [id]
            });
            return true;
        } catch (err) {
            console.error('Could not delete point:', err);
            throw new Error('Failed to delete point');
        }
    }
} 