'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface SearchResult {
    id: string;
    score: number;
    title: string;
    content: string;
}

interface VectorSearchProps {
    notebookId: string;
}

export function VectorSearch({ notebookId }: VectorSearchProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        setError(null)
        try {
            const response = await fetch('/api/vectors/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: searchQuery,
                    limit: 5,
                    notebookId
                }),
            })

            if (!response.ok) {
                throw new Error('Search failed')
            }

            const data = await response.json()
            setResults(data.results || [])
        } catch (error) {
            console.error("Search error:", error)
            setError("Failed to perform search. Please try again.")
        } finally {
            setIsSearching(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSearching && searchQuery.trim()) {
            handleSearch()
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter your search query..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500 p-2 rounded bg-red-50">
                                {error}
                            </div>
                        )}
                        {results.map((result, index) => (
                            <Card key={result.id || index} className="bg-muted/50">
                                <CardContent className="pt-4">
                                    {result.title && (
                                        <h3 className="font-semibold mb-2">{result.title}</h3>
                                    )}
                                    <p className="text-sm text-muted-foreground">{result.content}</p>
                                    <div className="text-xs text-muted-foreground mt-2">
                                        Relevance score: {(result.score * 100).toFixed(1)}%
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {results.length === 0 && !isSearching && searchQuery.trim() !== '' && !error && (
                            <div className="text-center text-sm text-muted-foreground p-4">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 