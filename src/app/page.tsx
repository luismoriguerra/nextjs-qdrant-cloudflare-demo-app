import { NotebookService, type Notebook } from '../../server/services/NotebookService';
import { getDb } from '../../server/infraestructure/d1';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';

export const runtime = 'edge';

async function getNotebooks() {
  const notebookService = new NotebookService(getDb());
  return notebookService.getAllNotebooks();
}

export default async function Home() {
  const notebooks = await getNotebooks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">
          My Notebooks
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map((notebook: Notebook) => (
            <Link 
              href={`/notebooks/${notebook.id}`}
              key={notebook.id}
            >
              <Card 
                className="group transition-all duration-200 hover:shadow-lg hover:border-primary cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {notebook.title}
                  </CardTitle>
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
