"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ResearchAssistant } from "@/components/research-assistant"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Globe } from "lucide-react"
import educationalResources from "@/data/educational-resources.json"

export default function ResearchPage() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [downloadedBooks, setDownloadedBooks] = useState<string[]>([])
  const [isResearchOpen, setIsResearchOpen] = useState(false)

  const handleSignInToggle = () => setIsSignedIn(!isSignedIn)

  const handleResourceAccess = (resource: any, accessType: "view" | "download" | "preview") => {
    console.log("[v0] Resource access:", resource.title, accessType)

    if (accessType === "view" && resource.onlineUrl) {
      window.open(resource.onlineUrl, "_blank")
    } else if (accessType === "download" && resource.downloadUrl) {
      window.open(resource.downloadUrl, "_blank")
      setDownloadedBooks((prev) => [...prev, resource.title])
    } else if (accessType === "preview" && resource.previewUrl) {
      window.open(resource.previewUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isSignedIn={isSignedIn} onSignInToggle={handleSignInToggle} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Research Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover and access educational resources from Rwanda Education Board. Search through textbooks, find study
            materials, and download resources for your academic journey.
          </p>

          <Button onClick={() => setIsResearchOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-5 w-5 mr-2" />
            Start Research
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Official REB Textbooks</h3>
            <p className="text-muted-foreground">
              Access official Rwanda Education Board textbooks for S4, S5, and S6 levels across all subjects.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <Globe className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Direct Online Access</h3>
            <p className="text-muted-foreground">
              View and download resources directly from elearning.reb.rw with authentic links.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <Search className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
            <p className="text-muted-foreground">
              Filter by grade level, subject, language, and keywords to find exactly what you need.
            </p>
          </div>
        </div>

        <ResearchAssistant
          isOpen={isResearchOpen}
          onClose={() => setIsResearchOpen(false)}
          resources={educationalResources.rwandanEducationalDatabase}
          selectedGrade={selectedGrade}
          onGradeFilter={setSelectedGrade}
          downloadedBooks={downloadedBooks}
          onResourceAccess={handleResourceAccess}
        />
      </main>
    </div>
  )
}
