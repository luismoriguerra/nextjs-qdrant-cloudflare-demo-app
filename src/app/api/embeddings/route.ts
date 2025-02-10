import { NextResponse } from "next/server";
import { generateEmbeddings } from "../../../../server/infraestructure/embedding";
export const runtime = "edge";

interface EmbeddingRequest {
    content: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as EmbeddingRequest;
        const { content } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content is required and must be a string' },
                { status: 400 }
            );
        }

        const embeddings = await generateEmbeddings(content);
        
        return NextResponse.json(embeddings);
    } catch (error) {
        console.error('Error generating embeddings:', error);
        return NextResponse.json(
            { error: 'Failed to generate embeddings' },
            { status: 500 }
        );
    }
} 