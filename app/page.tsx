"use client"
import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { TextbookCard } from "@/components/textbook-card"
import { Calculator, FileText, BookOpen, Search, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import educationalData from "@/data/educational-resources.json"


export default function HomePage() {
  const { featuredTextbooks } = educationalData
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [mainSearchQuery, setMainSearchQuery] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [downloadedBooks, setDownloadedBooks] = useState<string[]>([])

  const filterByGrade = (grade: string) => {
    setSelectedGrade(grade)
  }

  const handleMainSearch = () => {
    window.location.href = `/research?search=${encodeURIComponent(mainSearchQuery)}`
  }

  const handleBookDownload = (book: any) => {
    if (book.downloadUrl) {
      window.open(book.downloadUrl, "_blank")
      setDownloadedBooks((prev) => [...prev, book.title])
    }
  }

  const handleBookView = (book: any) => {
    if (book.viewUrl) {
      window.open(book.viewUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isSignedIn={isSignedIn} onSignInToggle={() => setIsSignedIn(!isSignedIn)} />

      <HeroSection
        selectedGrade={selectedGrade}
        onGradeFilter={filterByGrade}
        mainSearchQuery={mainSearchQuery}
        onSearchQueryChange={setMainSearchQuery}
        onMainSearch={handleMainSearch}
      />

      {/* Featured Textbooks Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Textbooks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick access to popular REB-approved textbooks for S4, S5 & S6
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTextbooks.slice(0, 3).map((book, index) => (
              <TextbookCard
                key={index}
                book={book}
                isDownloaded={downloadedBooks.includes(book.title)}
                onDownload={handleBookDownload}
                onView={handleBookView}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/textbooks">
              <Button variant="outline" size="lg" className="bg-transparent">
                View All {featuredTextbooks.length} Textbooks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Tools Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Educational Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful calculators, notebooks, and interactive learning tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calculator,
                title: "Scientific Calculator",
                desc: "Advanced mathematical calculations",
              },
              {
                icon: FileText,
                title: "Digital Notebook",
                desc: "Take and organize study notes",
              },
              {
                icon: BookOpen,
                title: "Formula Reference",
                desc: "Quick access to formulas",
              },
              {
                icon: Search,
                title: "Research Assistant",
                desc: "Find educational resources",
              },
            ].map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tools">
              <Button variant="outline" size="lg" className="bg-transparent">
                Access All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Research Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Research & Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive educational database and contribute resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Search Educational Database</CardTitle>
                <CardDescription>
                  Find textbooks, tutorials, and resources from Rwanda's educational database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• 50+ REB-approved textbooks</li>
                  <li>• Grade-specific filtering (S4, S5, S6)</li>
                  <li>• Subject categorization</li>
                  <li>• Direct download links</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Contribute Resources</CardTitle>
                <CardDescription>
                  Share your knowledge and help build Rwanda's educational resource library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>• Upload textbooks and tutorials</li>
                  <li>• Share research papers</li>
                  <li>• Create study guides</li>
                  <li>• Support fellow learners</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/research">
              <Button variant="outline" size="lg" className="bg-transparent">
                Explore Research Hub <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">EduRwanda</h3>
          <p className="text-muted-foreground mb-6">
            Empowering Rwandan students with quality educational resources aligned with national curriculum standards.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/textbooks" className="hover:text-foreground transition-colors">
              Textbooks
            </Link>
            <Link href="/tutorials" className="hover:text-foreground transition-colors">
              Tutorials
            </Link>
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <Link href="/research" className="hover:text-foreground transition-colors">
              Research
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
