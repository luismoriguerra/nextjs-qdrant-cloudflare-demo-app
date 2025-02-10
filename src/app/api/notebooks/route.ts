
import { NextRequest } from "next/server";
import { getDb } from "../../../../server/infraestructure/d1";
import { NotebookService } from "../../../../server/services/NotebookService";
export const runtime = 'edge';

export async function GET() {
    const notebookService = new NotebookService(getDb());
    const notebooks = await notebookService.getAllNotebooks();
    return Response.json(notebooks);
}

export async function POST(request: NextRequest) {
    const { title } = await request.json() as { title: string };

    if (!title) {
        return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const notebookService = new NotebookService(getDb());
    const notebook = await notebookService.createNotebook(title);

    return Response.json(notebook, { status: 201 });
} 