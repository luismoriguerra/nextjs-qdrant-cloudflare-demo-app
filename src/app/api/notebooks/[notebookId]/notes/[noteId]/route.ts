import { NextRequest } from "next/server";
import { getDb } from "../../../../../../../server/infraestructure/d1";
import { NotesService } from "../../../../../../../server/services/NotesService";

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ notebookId: string; noteId: string }> }
) {
    const { notebookId, noteId } = await params;
    const notesService = new NotesService(getDb());
    const note = await notesService.getNote(noteId);

    if (!note) {
        return Response.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.notebook_id !== notebookId) {
        return Response.json({ error: "Note does not belong to this notebook" }, { status: 403 });
    }

    return Response.json(note);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ notebookId: string; noteId: string }> }
) {
    const { title, content } = await request.json() as { title: string; content: string };

    if (!title || !content) {
        return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const { notebookId, noteId } = await params;
    const notesService = new NotesService(getDb());
        
    // Verify note exists and belongs to the notebook
    const existingNote = await notesService.getNote(noteId);
    if (!existingNote) {
        return Response.json({ error: "Note not found" }, { status: 404 });
    }
    if (existingNote.notebook_id !== notebookId) {
        return Response.json({ error: "Note does not belong to this notebook" }, { status: 403 });
    }

    const updatedNote = await notesService.updateNote(noteId, title, content);
    return Response.json(updatedNote);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ notebookId: string; noteId: string }> }
) {
    const { notebookId, noteId } = await params;
    const notesService = new NotesService(getDb());
    
    // Verify note exists and belongs to the notebook
    const existingNote = await notesService.getNote(noteId);
    if (!existingNote) {
        return Response.json({ error: "Note not found" }, { status: 404 });
    }
    if (existingNote.notebook_id !== notebookId) {
        return Response.json({ error: "Note does not belong to this notebook" }, { status: 403 });
    }

    const success = await notesService.deleteNote(noteId);
    if (!success) {
        return Response.json({ error: "Failed to delete note" }, { status: 500 });
    }

    return new Response(null, { status: 204 });
} 