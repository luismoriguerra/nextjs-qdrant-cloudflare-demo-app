import { NextResponse } from 'next/server';
import { QdrantService } from '../../../../../server/infraestructure/qdrant';

export async function GET() {
    try {
        const qdrantService = new QdrantService();
        const collections = await qdrantService.getCollections();

        return NextResponse.json({ collections }, { status: 200 });
    } catch (error) {
        console.error('Error fetching collections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch collections' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name, vectorSize } = await request.json() as { name: string, vectorSize: number };

        if (!name || !vectorSize) {
            return NextResponse.json(
                { error: 'Name and vectorSize are required' },
                { status: 400 }
            );
        }

        const qdrantService = new QdrantService();
        await qdrantService.createCollection(name, vectorSize);

        return NextResponse.json(
            { message: 'Collection created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating collection:', error);
        return NextResponse.json(
            { error: 'Failed to create collection' },
            { status: 500 }
        );
    }
} 