"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"
import tutorialsData from "@/data/tutorials.json"
import { TutorialCard } from "@/components/tutorial-card"

// Helper to get YouTube thumbnail
function getYouTubeThumbnail(url: string) {
  const match = url.match(/v=([a-zA-Z0-9_-]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/placeholder.svg"
}

// Helper to get YouTube video ID
function getYouTubeId(url: string) {
  const match = url.match(/v=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// LocalStorage view tracking
function getViews(videoId: string) {
  const views = JSON.parse(localStorage.getItem("tutorialViews") || "{}")
  return views[videoId] || 0
}

function incrementViews(videoId: string) {
  const views = JSON.parse(localStorage.getItem("tutorialViews") || "{}")
  views[videoId] = (views[videoId] || 0) + 1
  localStorage.setItem("tutorialViews", JSON.stringify(views))
  return views[videoId]
}

// Convert ISO 8601 duration to mm:ss or hh:mm:ss
function formatDuration(isoDuration: string) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"
  const hours = parseInt(match[1] || "0")
  const minutes = parseInt(match[2] || "0")
  const seconds = parseInt(match[3] || "0")
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
  return `${minutes}:${seconds.toString().padStart(2,"0")}`
}

export default function TutorialsPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewsData, setViewsData] = useState<{ [key: string]: number }>({})
  const [durations, setDurations] = useState<{ [key: string]: string }>({})

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  // Load views from localStorage
  useEffect(() => {
    const initialViews: { [key: string]: number } = {}
    tutorialsData.forEach((t) => {
      const id = getYouTubeId(t.url)
      if (id) initialViews[id] = getViews(id)
    })
    setViewsData(initialViews)
  }, [])

  // Fetch video durations from YouTube API
  useEffect(() => {
    const fetchDurations = async () => {
      const ids = tutorialsData.map(t => getYouTubeId(t.url)).filter(Boolean)
      if (ids.length === 0 || !API_KEY) return

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids.join(",")}&key=${API_KEY}`
      )
      const data = await response.json()
      const durationMap: { [key: string]: string } = {}
      data.items.forEach((item: any) => {
        durationMap[item.id] = formatDuration(item.contentDetails.duration)
      })
      setDurations(durationMap)
    }

    fetchDurations()
  }, [])

  const handleWatch = (url: string) => {
    const id = getYouTubeId(url)
    if (id) {
      const newViews = incrementViews(id)
      setViewsData(prev => ({ ...prev, [id]: newViews }))
    }
    window.open(url, "_blank")
  }

  const filteredTutorials = tutorialsData.filter(tutorial => {
    const matchesGrade = selectedGrade === "all" || tutorial.grade === selectedGrade
    const matchesSubject = selectedSubject === "all" || tutorial.subject.toLowerCase() === selectedSubject.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGrade && matchesSubject && matchesSearch
  })

  const subjects = ["all", ...Array.from(new Set(tutorialsData.map(t => t.subject)))]

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
            <h1 className="text-4xl font-bold text-foreground mb-4">Interactive Tutorials</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Step-by-step video tutorials covering all subjects for S4, S5 & S6 students
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials by title, subject, or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">Grade:</span>
              {["all", "s4", "s5", "s6"].map(g => (
                <Button
                  key={g}
                  variant={selectedGrade === g ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGrade(g)}
                  className="text-xs"
                >
                  {g === "all" ? "All Levels" : g.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">Subject:</span>
              {subjects.map(s => (
                <Button
                  key={s}
                  variant={selectedSubject === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(s)}
                  className="text-xs"
                >
                  {s === "all" ? "All Subjects" : s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredTutorials.length} Tutorial{filteredTutorials.length !== 1 ? "s" : ""} Available
            </h2>
          </div>

          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((t, i) => {
                const id = getYouTubeId(t.url)
                return (
                  <TutorialCard
                    key={i}
                    title={t.title}
                    description={t.description}
                    subject={t.subject}
                    grade={t.grade}
                    rating={t.rating}
                    url={t.url}
                    thumbnail={getYouTubeThumbnail(t.url)}
                    duration={id ? durations[id] || "0:00" : "0:00"}
                    views={id ? viewsData[id] || 0 : 0}
                    onWatch={handleWatch}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No tutorials found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => { setSelectedGrade("all"); setSelectedSubject("all"); setSearchQuery(""); }}
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
