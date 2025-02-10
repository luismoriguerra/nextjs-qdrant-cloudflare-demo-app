import { NextRequest } from "next/server";
import { getDb } from "../../../../../../server/infraestructure/d1";
import { NotesService } from "../../../../../../server/services/NotesService";

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { notebookId: string } }
) {
    const notesService = new NotesService(getDb());
    const notes = await notesService.getNotesByNotebook(params.notebookId);
    return Response.json(notes);
}

export async function POST(
    request: NextRequest,
    { params }: { params: { notebookId: string } }
) {
    const { title, content } = await request.json() as { title: string; content: string };

    if (!title || !content) {
        return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const notesService = new NotesService(getDb());
    const note = await notesService.createNote(title, content, params.notebookId);

    return Response.json(note, { status: 201 });
} 