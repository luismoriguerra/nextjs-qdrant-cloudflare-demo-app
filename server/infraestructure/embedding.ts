export const runtime = "edge";

import { getRequestContext } from "@cloudflare/next-on-pages";
export async function generateEmbeddings(text: string) {
    const ai = getRequestContext().env.AI;
    const embeddings = await ai.run('@cf/baai/bge-base-en-v1.5', { text });
    console.log(embeddings);
    return {
        values: embeddings.data[0],
        dimensions: embeddings.data[0].length
    }
}