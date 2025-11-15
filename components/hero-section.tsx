"use client"

import { ArrowRight, Search, Star, Users, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeroSectionProps {
  selectedGrade: string
  onGradeFilter: (grade: string) => void
  mainSearchQuery: string
  onSearchQueryChange: (query: string) => void
  onMainSearch: () => void
}

export function HeroSection({
  selectedGrade,
  onGradeFilter,
  mainSearchQuery,
  onSearchQueryChange,
  onMainSearch,
}: HeroSectionProps) {
  const grades = [
    { key: "all", label: "All Levels", description: "Browse all resources" },
    { key: "s4", label: "Senior 4", description: "Foundation level" },
    { key: "s5", label: "Senior 5", description: "Advanced level" },
    { key: "s6", label: "Senior 6", description: "Pre-university" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Empowering <span className="text-primary">Rwandan Education</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
          Access curriculum-aligned textbooks, interactive tutorials, calculators, and research tools designed for
          Rwandan schools and students in Senior 4, 5, and 6.
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Select Your Grade Level</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {grades.map((grade) => (
              <button
                key={grade.key}
                onClick={() => onGradeFilter(grade.key)}
                className={`group px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedGrade === grade.key
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                    : "bg-background text-foreground border-border hover:border-primary hover:shadow-md hover:scale-102"
                }`}
              >
                <div className="text-sm font-semibold">{grade.label}</div>
                <div
                  className={`text-xs mt-1 ${
                    selectedGrade === grade.key ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {grade.description}
                </div>
              </button>
            ))}
          </div>
          {selectedGrade !== "all" && (
            <p className="text-sm text-muted-foreground mt-3">
              Showing resources for {grades.find((g) => g.key === selectedGrade)?.label}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${selectedGrade !== "all" ? grades.find((g) => g.key === selectedGrade)?.label + " " : ""}resources in Kinyarwanda, English, or French...`}
              className="pl-10 h-12 text-base"
              value={mainSearchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onMainSearch()}
            />
          </div>
          <Button size="lg" className="h-12 px-8" onClick={onMainSearch}>
            Explore Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent" />
            <span>5,000+ Rwanda-Aligned Resources</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-accent" />
            <span>25,000+ S4-S6 Students</span>
          </div>
          <div className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span>REB Approved Content</span>
          </div>
        </div>
      </div>
    </section>
  )
}
