import { NotebookService } from '../../../../server/services/NotebookService';
import { getDb } from '../../../../server/infraestructure/d1';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { NotesList } from '@/components/notes/notes-list';
import Link from 'next/link';

export const runtime = 'edge';

interface NotebookPageProps {
  params: {
    notebookId: string;
  };
}

async function getNotebook(notebookId: string) {
  const notebookService = new NotebookService(getDb());
  return notebookService.getNotebook(notebookId);
}

export default async function NotebookPage({ params }: NotebookPageProps) {
  const notebook = await getNotebook(params.notebookId);

  if (!notebook) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">
            Notebook not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      {/* breadcrumb */}
      <div className="max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">
          {notebook.title}
        </h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-between">
                <span>Created</span>
                <span>{new Date(notebook.created_at).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Updated</span>
                <span>{new Date(notebook.updated_at).toLocaleDateString()}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <NotesList notebookId={params.notebookId} />
            </TabsContent>
            <TabsContent value="chats">
              <Card>
                <CardHeader>
                  <CardTitle>Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Chat Thread 1</h3>
                      <p className="text-sm text-muted-foreground">Sample chat conversation thread. Chat feature will be implemented later.</p>
                      <div className="text-xs text-muted-foreground mt-2">3 messages • Last active: 2024-03-20</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Chat Thread 2</h3>
                      <p className="text-sm text-muted-foreground">Another sample chat thread to showcase the layout.</p>
                      <div className="text-xs text-muted-foreground mt-2">5 messages • Last active: 2024-03-19</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 