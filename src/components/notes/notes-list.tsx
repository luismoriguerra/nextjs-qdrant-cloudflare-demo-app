'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Note } from "../../../server/services/NotesService";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteFormInput {
  title: string;
  content: string;
}

export function NotesList({ notebookId }: { notebookId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<NoteFormInput>();

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/notebooks/${notebookId}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data as Note[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  const handleDeleteNote = async (note: Note) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`/api/notebooks/${notebookId}/notes/${note.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setIsSubmitting(false);
      setNoteToDelete(null);
    }
  };

  const onSubmit: SubmitHandler<NoteFormInput> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`/api/notebooks/${notebookId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      reset();
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {showForm ? 'Cancel' : 'Create Note'}
        </button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <div className="space-y-2">
              <input
                {...register("title", { required: true })}
                placeholder="Note title"
                className="w-full px-3 py-2 border rounded-md"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <textarea
                {...register("content", { required: true })}
                placeholder="Note content"
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No notes found. Create your first note!</p>
            ) : (
              notes.map((note) => (
                <div className="border rounded-lg p-4 relative" key={note.id}>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setNoteToDelete(note)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold mb-2 pr-8">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                  <div className="text-xs text-muted-foreground mt-2">Last updated: {note.updated_at}</div>
                </div>
              ))
            )}
          </div>
        )}

        <AlertDialog open={noteToDelete !== null} onOpenChange={() => setNoteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
} 