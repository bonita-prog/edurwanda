// components/tutorial-card.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Star } from "lucide-react"

interface TutorialCardProps {
  title: string
  description: string
  subject: string
  grade: string
  rating: number
  url: string
  thumbnail?: string
  duration?: string
  views?: number
  onWatch?: (url: string) => void
}

export function TutorialCard({
  title,
  description,
  subject,
  grade,
  rating,
  url,
  thumbnail,
  duration,
  views = 0,
  onWatch,
}: TutorialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative" onClick={() => onWatch && onWatch(url)}>
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {grade.toUpperCase()}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{subject}</Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {duration || "0:00"}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {rating}
          </div>
          <span>{views}</span>
        </div>
        <button
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
          onClick={() => onWatch && onWatch(url)}
        >
          Watch Tutorial
        </button>
      </CardContent>
    </Card>
  )
}
