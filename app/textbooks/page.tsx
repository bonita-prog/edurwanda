"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { TextbookCard } from "@/components/textbook-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"

import educationalData from "@/data/educational-resources.json"

interface BooksType {
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

export default function TextbooksPage() {
  const { rwandanEducationalDatabase } = educationalData

  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [downloadedBooks, setDownloadedBooks] = useState<string[]>([])

  const filteredTextbooks = rwandanEducationalDatabase.filter((book) => {
    const matchesGrade = selectedGrade === "all" || book.grade === selectedGrade
    const matchesSubject =
      selectedSubject === "all" || book.subject.toLowerCase() === selectedSubject.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.topics.includes(searchQuery.toLowerCase())
    return matchesGrade && matchesSubject && matchesSearch
  })

  const subjects = ["all", ...Array.from(new Set(rwandanEducationalDatabase.map((book) => book.subject)))]

  const handleBookDownload = (book: any) => {
    if (book.downloadUrl) {
      window.open(book.downloadUrl, "_blank")
      setDownloadedBooks((prev) => (prev.includes(book.title) ? prev : [...prev, book.title]))
    } else {
      alert("Download URL not available for this book.")
    }
  }

  const handleBookView = (book: any) => {
    if (book.previewUrl) {
      window.open(book.previewUrl, "_blank")
    } else {
      alert("Preview not available for this book.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">All Textbooks</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete collection of REB-approved textbooks for Senior 4, 5 & 6 students
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search textbooks by title, subject, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">Grade:</span>
              {["all", "s4", "s5", "s6"].map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGrade(grade)}
                  className="text-xs"
                >
                  {grade === "all" ? "All Levels" : grade.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Subject Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">Subject:</span>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className="text-xs"
                >
                  {subject === "all" ? "All Subjects" : subject}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Textbooks Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredTextbooks.length} Textbook{filteredTextbooks.length !== 1 ? "s" : ""} Found
            </h2>
            <div className="text-sm text-muted-foreground">
              Showing results for {selectedGrade === "all" ? "all grades" : selectedGrade.toUpperCase()}
              {selectedSubject !== "all" && ` in ${selectedSubject}`}
            </div>
          </div>

          {filteredTextbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTextbooks.map((book, index) => (
                <TextbookCard
                  key={index}
                  book={book as unknown as BooksType}
                  isDownloaded={downloadedBooks.includes(book.title)}
                  onDownload={handleBookDownload}
                  onView={handleBookView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No textbooks found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGrade("all")
                  setSelectedSubject("all")
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
