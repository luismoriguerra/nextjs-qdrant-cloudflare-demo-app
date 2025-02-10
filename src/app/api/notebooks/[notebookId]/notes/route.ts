import { NextRequest } from "next/server";
import { getDb } from "../../../../../../server/infraestructure/d1";
import { NotesService } from "../../../../../../server/services/NotesService";
import { QdrantService } from "../../../../../../server/infraestructure/qdrant";
import { generateEmbeddings } from "../../../../../../server/infraestructure/embedding";

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ notebookId: string }> }
) {
    const { notebookId } = await params;
    const notesService = new NotesService(getDb());
    const notes = await notesService.getNotesByNotebook(notebookId);
    return Response.json(notes);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ notebookId: string }> }
) {
    const { title, content } = await request.json() as { title: string; content: string };

    if (!title || !content) {
        return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const { notebookId } = await params;
    const notesService = new NotesService(getDb());
    const note = await notesService.createNote(title, content, notebookId);

    console.log(JSON.stringify({
        message: "Note created",
        note
    }, null, 2));

    const qdrantService = new QdrantService();
    const { values } = await generateEmbeddings(content);

    console.log(JSON.stringify({
        message: "Upserting point",
        values
    }, null, 2));

    await qdrantService.upsertPoints([{
        id: note.id,
        vector: values,
        payload: { note_id: note.id, notebook_id: notebookId }
    }]);

    return Response.json(note, { status: 201 });
} 