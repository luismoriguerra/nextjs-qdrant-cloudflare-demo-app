import { NextResponse, NextRequest } from 'next/server';
import { QdrantService } from '../../../../../server/infraestructure/qdrant';
import { generateEmbeddings } from '../../../../../server/infraestructure/embedding';
import { getDb } from '../../../../../server/infraestructure/d1';
import { NotesService } from '../../../../../server/services/NotesService';

interface FAQ {
    title: string;
    content: string;
}

export const runtime = 'edge';

export async function POST(
    request: NextRequest
) {
    try {
        // Read the FAQ data file using URL
        const faqData = await fetch(
            new URL('../../../../../training_data/faqs.json', import.meta.url)
        ).then(res => res.json()) as FAQ[];
        
        const { notebookId } = await request.json() as { notebookId: string };
        const qdrantService = new QdrantService();
        const notesService = new NotesService(getDb());

        const total = faqData.length;
        let index = 0;
        for await (const faq of faqData) {
            index++;
            const createdNote = await notesService.createNote(faq.title, faq.content, notebookId);

            const { values } = await generateEmbeddings(faq.content);
            const progress = (index + 1) / total;
            console.log(`Upserting point ${index + 1} of ${total} (${progress * 100}%)`);
            await qdrantService.upsertPoints([{
                id: createdNote.id,
                vector: values,
                payload: { note_id: createdNote.id, notebook_id: notebookId }
            }]);
        }

        return NextResponse.json({
            message: "Data ingested successfully",
            total,
        });
    } catch (error) {
        console.error('Error reading FAQ data:', error);
        return NextResponse.json(
            { error: 'Failed to read FAQ data' },
            { status: 500 }
        );
    }
} 