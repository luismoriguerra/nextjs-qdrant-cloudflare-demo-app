import { v4 as uuidv4 } from 'uuid';

export interface Note {
    id: string;
    title: string;
    content: string;
    notebook_id: string;
    created_at: string;
    updated_at: string;
}

export class NotesService {
    constructor(private db: CloudflareEnv["DB"]) { }

    async createNote(title: string, content: string, notebook_id: string): Promise<Note> {
        const now = new Date().toISOString();
        const id = uuidv4();
        const result = await this.db.prepare(
            `INSERT INTO notes (id, title, content, notebook_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *`
        ).bind(id, title, content, notebook_id, now, now)
            .first<Note>();

        if (!result) {
            throw new Error('Failed to create note');
        }

        return result;
    }

    async getNote(id: string): Promise<Note | null> {
        const result = await this.db.prepare(
            `SELECT * FROM notes WHERE id = ?`
        ).bind(id)
            .first<Note>();

        return result || null;
    }

    async getNotesByNotebook(notebook_id: string): Promise<Note[]> {
        const result = await this.db.prepare(
            `SELECT * FROM notes 
            WHERE notebook_id = ? 
            ORDER BY created_at DESC`
        ).bind(notebook_id)
            .all<Note>();

        return result.results;
    }

    async getAllNotes(): Promise<Note[]> {
        const result = await this.db.prepare(
            `SELECT * FROM notes ORDER BY created_at DESC`
        ).all<Note>();

        return result.results;
    }

    async updateNote(id: string, title: string, content: string): Promise<Note | null> {
        const now = new Date().toISOString();

        const result = await this.db.prepare(
            `UPDATE notes 
            SET title = ?, content = ?, updated_at = ?
            WHERE id = ?
            RETURNING *`
        ).bind(title, content, now, id)
            .first<Note>();

        return result || null;
    }

    async deleteNote(id: string): Promise<boolean> {
        const result = await this.db.prepare(
            `DELETE FROM notes WHERE id = ?`
        ).bind(id)
            .run();

        return result.success;
    }

    async getNotesByIds(ids: string[]): Promise<Note[]> {
        const result = await this.db.prepare(
            `SELECT * FROM notes WHERE id IN (${ids.map(() => '?').join(',')})`
        ).bind(...ids)
            .all<Note>();

        return result.results;
    }
} 