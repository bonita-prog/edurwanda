"use client"

import { useState, useEffect } from "react"
import { Globe, Search, Eye, BookMarked, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Resource {
  id: string
  title: string
  type: string
  source: string
  subject: string
  level: string
  language: string
  description: string
  keywords: string[]
  onlineUrl: string
  downloadUrl: string
  previewUrl: string
  fileSize: string
  pages: number
  isOnlineAvailable: boolean
  grade: string
}

interface ResearchAssistantProps {
  isOpen: boolean
  onClose: () => void
  resources: Resource[]
  selectedGrade: string
  onGradeFilter: (grade: string) => void
  downloadedBooks: string[]
  onResourceAccess: (resource: Resource, accessType: "view" | "download" | "preview") => void
}

export function ResearchAssistant({
  isOpen,
  onClose,
  resources,
  selectedGrade,
  onGradeFilter,
  downloadedBooks,
  onResourceAccess,
}: ResearchAssistantProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredResults, setFilteredResults] = useState(resources)

  useEffect(() => {
    let results = resources

    if (searchQuery.trim()) {
      results = results.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
          resource.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.source.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedGrade !== "all") {
      results = results.filter(
        (resource) =>
          resource.level.toLowerCase().includes(selectedGrade.toLowerCase()) ||
          resource.level.includes(`Senior ${selectedGrade.slice(-1)}`),
      )
    }

    setFilteredResults(results)
  }, [searchQuery, selectedGrade, resources])

  const grades = [
    { key: "all", label: "All" },
    { key: "s4", label: "S4" },
    { key: "s5", label: "S5" },
    { key: "s6", label: "S6" },
  ]

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Geography",
    "History",
    "English",
    "Psychology",
    "ICT",
  ]

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            REB Educational Resources - Direct Access to S4, S5 & S6 Textbooks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search REB textbooks by subject, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 mr-4">
              <span className="text-sm font-medium text-muted-foreground">Grade:</span>
              {grades.map((grade) => (
                <Badge
                  key={grade.key}
                  variant={selectedGrade === grade.key ? "default" : "outline"}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onGradeFilter(grade.key)}
                >
                  {grade.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSearchQuery(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <Card key={result.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{result.title}</h4>
                        {result.isOnlineAvailable && (
                          <Badge variant="default" className="bg-green-600">
                            <Globe className="h-3 w-3 mr-1" />
                            REB Official
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{result.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{result.type}</Badge>
                        <Badge variant="secondary">{result.subject}</Badge>
                        <Badge variant="outline">{result.level}</Badge>
                        <Badge variant="outline">{result.language}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>📄 {result.pages} pages</span>
                        <span>💾 {result.fileSize}</span>
                        <span>🏛️ {result.source}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onResourceAccess(result, "view")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Online
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onResourceAccess(result, "preview")}>
                          <BookMarked className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onResourceAccess(result, "download")}
                          className={
                            downloadedBooks.includes(result.title) ? "bg-green-600 hover:bg-green-700 text-white" : ""
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {downloadedBooks.includes(result.title) ? "Downloaded ✓" : "Download PDF"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No textbooks found</h3>
                <p className="mb-2">No REB textbooks found matching your search criteria.</p>
                <p className="text-sm">Try searching by subject name or grade level.</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Showing {filteredResults.length} of {resources.length} official REB textbooks
                {selectedGrade !== "all" && ` for ${selectedGrade.toUpperCase()}`}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Direct access to elearning.reb.rw
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
