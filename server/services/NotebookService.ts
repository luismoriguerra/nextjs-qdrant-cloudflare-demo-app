import { nanoid } from 'nanoid';

export interface Notebook {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export class NotebookService {
    constructor(private db: CloudflareEnv["DB"]) { }

    async createNotebook(title: string): Promise<Notebook> {
        const id = nanoid();
        const now = new Date().toISOString();

        await this.db.prepare(
            `INSERT INTO notebooks (id, title, created_at, updated_at)
            VALUES (?, ?, ?, ?)`
        ).bind(id, title, now, now)
            .run();

        return {
            id,
            title,
            created_at: now,
            updated_at: now,
        };
    }

    async getNotebook(id: string): Promise<Notebook | null> {
        const result = await this.db.prepare(
            `SELECT * FROM notebooks WHERE id = ?`
        ).bind(id)
            .first<Notebook>();
        
        return result || null;
    }

    async getAllNotebooks(): Promise<Notebook[]> {
        const result = await this.db.prepare(
            `SELECT * FROM notebooks ORDER BY created_at DESC`
        ).all<Notebook>();
        
        return result.results;
    }

    async updateNotebook(id: string, title: string): Promise<Notebook | null> {
        const now = new Date().toISOString();

        const result = await this.db.prepare(
            `UPDATE notebooks 
            SET title = ?, updated_at = ?
            WHERE id = ?
            RETURNING *`
        ).bind(title, now, id)
            .first<Notebook>();

        return result || null;
    }

    async deleteNotebook(id: string): Promise<boolean> {
        const result = await this.db.prepare(
            `DELETE FROM notebooks WHERE id = ?`
        ).bind(id)
            .run();

        return result.success;
    }
} 