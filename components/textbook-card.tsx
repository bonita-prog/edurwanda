"use client"

import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TextbookCardProps {
  book: {
    title: string
    subject: string
    rating: number
    downloads: string
    language: string
    grade: string
    topics: string
    previewUrl?: string
    downloadUrl?: string
  }
  isDownloaded: boolean
  onDownload: (book: any) => void
  onView: (book: any) => void
}

export function TextbookCard({ book, isDownloaded, onDownload, onView }: TextbookCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <CardDescription>{book.subject}</CardDescription>
            <p className="text-xs text-muted-foreground mt-1">{book.topics}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {book.rating && <Badge variant="secondary">{book.rating} ★</Badge>}
            <Badge variant="outline" className="text-xs">
              {book.language}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{book.downloads || 0} downloads</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(book)}
              title="View Book"
              disabled={!book.previewUrl}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onDownload(book)}
              title="Download Book"
              disabled={!book.downloadUrl}
              className={isDownloaded ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Download className="h-4 w-4" />
              {isDownloaded && <span className="ml-1">✓</span>}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
