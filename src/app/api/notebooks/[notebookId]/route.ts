

import { NextRequest } from "next/server";
import { getDb } from "../../../../../server/infraestructure/d1";
import { NotebookService } from "../../../../../server/services/NotebookService";

export const runtime = 'edge'

export async function GET(
    request: Request,
    { params }: { params: { notebookId: string } }
) {
    const notebookService = new NotebookService(getDb());
    const notebook = await notebookService.getNotebook(params.notebookId);

    if (!notebook) {
        return Response.json({ error: "Notebook not found" }, { status: 404 });
    }

    return Response.json(notebook);
}

export async function PUT(
    request: Request,
    { params }: { params: { notebookId: string } }
) {
    const { title } = await request.json() as { title: string };

    if (!title) {
        return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const notebookService = new NotebookService(getDb());
    const notebook = await notebookService.updateNotebook(params.notebookId, title);

    if (!notebook) {
        return Response.json({ error: "Notebook not found" }, { status: 404 });
    }

    return Response.json(notebook);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { notebookId: string } }
) {
    const notebookService = new NotebookService(getDb());
    const success = await notebookService.deleteNotebook(params.notebookId);

    if (!success) {
        return Response.json({ error: "Notebook not found" }, { status: 404 });
    }

    return Response.json({ success: true });
} 