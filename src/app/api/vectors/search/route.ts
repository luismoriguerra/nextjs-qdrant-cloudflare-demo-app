import { NextResponse } from 'next/server';
import { generateEmbeddings } from '../../../../../server/infraestructure/embedding';
import { QdrantService } from '../../../../../server/infraestructure/qdrant';
import { NotesService } from '../../../../../server/services/NotesService';
import { getDb } from '../../../../../server/infraestructure/d1';

export const runtime = 'edge';

interface SearchRequest {
    question: string;
    limit?: number;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as SearchRequest;
        const { question, limit = 10 } = body;

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            );
        }

        // Generate embeddings for the question
        const embeddings = await generateEmbeddings(question);

        // Search for similar vectors
        const qdrantService = new QdrantService();
        const searchResults = await qdrantService.search(embeddings.values, limit);

        console.log(JSON.stringify({
            message: "Search results",
            searchResults
        }, null, 2));

        const ids = searchResults.map((result) => result.id);

        console.log(JSON.stringify({
            message: "Ids",
            ids
        }, null, 2));

        const notesService = new NotesService(getDb());
        const notes = await notesService.getNotesByIds(ids as string[]);

        const combinedResults = searchResults.map((result) => {
            const note = notes.find((note) => note.id === result.id);
            return {
                ...result,
                ...note
            };
        });

        console.log(JSON.stringify({
            message: "Combined results",
            combinedResults
        }, null, 2));

        return NextResponse.json({
            results: combinedResults
        });
    } catch (error) {
        console.error('Error in vector search:', error);
        return NextResponse.json(
            { error: 'Failed to perform vector search' },
            { status: 500 }
        );
    }
} 