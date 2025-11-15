"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Calculator, FileText, BookOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function ToolsPage() {
  const router = useRouter()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Calculator state
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  // Notebook state
  const [notes, setNotes] = useState<{ id: number; title: string; content: string }[]>([])
  const [selectedNote, setSelectedNote] = useState<{ id: number; title: string; content: string } | null>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")

useEffect(() => {
  if (activeModal === "research") {
    router.push("/research")
    setActiveModal(null)
  }
}, [activeModal, router])

  // Load notes from localStorage on mount
useEffect(() => {
  const storedNotes = localStorage.getItem("digitalNotes")
  if (storedNotes) {
    const parsedNotes = JSON.parse(storedNotes)
    if (parsedNotes.length > 0) {
      setNotes(parsedNotes)
      setSelectedNote(parsedNotes[0])
      setNoteTitle(parsedNotes[0].title)
      setNoteContent(parsedNotes[0].content)
    } else {
      // fallback to a sample note if array is empty
      const sampleNote = { id: Date.now(), title: "Sample Note", content: "This is a sample note. Click to edit or create new notes." }
      setNotes([sampleNote])
      setSelectedNote(sampleNote)
      setNoteTitle(sampleNote.title)
      setNoteContent(sampleNote.content)
    }
  } else {
    const sampleNote = { id: Date.now(), title: "Sample Note", content: "This is a sample note. Click to edit or create new notes." }
    setNotes([sampleNote])
    setSelectedNote(sampleNote)
    setNoteTitle(sampleNote.title)
    setNoteContent(sampleNote.content)
  }
  }, [])


  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("digitalNotes", JSON.stringify(notes))
  }, [notes])

  const handleSignInToggle = () => setIsSignedIn(!isSignedIn)

  // Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }
    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+": return firstValue + secondValue
      case "-": return firstValue - secondValue
      case "×": return firstValue * secondValue
      case "÷": return firstValue / secondValue
      case "=": return secondValue
      default: return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clearCalculator = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  // Notebook functions
  const saveNote = () => {
    if (!selectedNote) return
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? { ...note, title: noteTitle, content: noteContent } : note
    )
    setNotes(updatedNotes)
    setSelectedNote({ ...selectedNote, title: noteTitle, content: noteContent })
  }

  const createNewNote = () => {
    const newNote = { id: Date.now(), title: "New Note", content: "" }
    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    setSelectedNote(newNote)
    setNoteTitle(newNote.title)
    setNoteContent(newNote.content)
  }

  const deleteNote = (noteId: number) => {
    if (notes.length > 1) {
      const filteredNotes = notes.filter((note) => note.id !== noteId)
      setNotes(filteredNotes)
      if (selectedNote?.id === noteId) {
        setSelectedNote(filteredNotes[0])
        setNoteTitle(filteredNotes[0].title)
        setNoteContent(filteredNotes[0].content)
      }
    }
  }

  const tools = [
    {
      id: "calculator",
      title: "Scientific Calculator",
      description: "Perform mathematical calculations with basic arithmetic operations",
      icon: Calculator,
      features: ["Basic arithmetic", "Clear function", "Decimal support", "Easy-to-use interface"],
    },
    {
      id: "notebook",
      title: "Digital Notebook",
      description: "Create, edit, and organize your study notes digitally",
      icon: FileText,
      features: ["Create multiple notes", "Edit and save notes", "Delete unwanted notes", "Simple text editor"],
    },
    {
      id: "formulas",
      title: "Formula Reference",
      description: "Quick access to important formulas across different subjects",
      icon: BookOpen,
      features: ["Mathematics formulas", "Physics equations", "Chemistry formulas", "Organized by subject"],
    },
    {
      id: "research",
      title: "Research Assistant",
      description: "Search and access educational resources and textbooks",
      icon: Search,
      features: ["Search textbooks", "Filter by subject", "Grade-level filtering", "Direct download links"],
    },
  ]

  const formulas = {
    Mathematics: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / 2a" },
      { name: "Pythagorean Theorem", formula: "a² + b² = c²" },
      { name: "Area of Circle", formula: "A = πr²" },
      { name: "Distance Formula", formula: "d = √((x₂-x₁)² + (y₂-y₁)²)" },
    ],
    Physics: [
      { name: "Newton's Second Law", formula: "F = ma" },
      { name: "Kinetic Energy", formula: "KE = ½mv²" },
      { name: "Ohm's Law", formula: "V = IR" },
      { name: "Wave Speed", formula: "v = fλ" },
    ],
    Chemistry: [
      { name: "Ideal Gas Law", formula: "PV = nRT" },
      { name: "Molarity", formula: "M = n/V" },
      { name: "pH Formula", formula: "pH = -log[H⁺]" },
      { name: "Density", formula: "ρ = m/V" },
    ],
  }

  const renderToolModal = () => {
    switch (activeModal) {
      case "calculator":
        return (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Scientific Calculator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded text-right text-2xl font-mono">{display}</div>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={clearCalculator} className="col-span-2 bg-transparent">Clear</Button>
                <Button variant="outline" onClick={() => inputOperation("÷")}>÷</Button>
                <Button variant="outline" onClick={() => inputOperation("×")}>×</Button>
                <Button variant="outline" onClick={() => inputNumber("7")}>7</Button>
                <Button variant="outline" onClick={() => inputNumber("8")}>8</Button>
                <Button variant="outline" onClick={() => inputNumber("9")}>9</Button>
                <Button variant="outline" onClick={() => inputOperation("-")}>-</Button>
                <Button variant="outline" onClick={() => inputNumber("4")}>4</Button>
                <Button variant="outline" onClick={() => inputNumber("5")}>5</Button>
                <Button variant="outline" onClick={() => inputNumber("6")}>6</Button>
                <Button variant="outline" onClick={() => inputOperation("+")} className="row-span-2">+</Button>
                <Button variant="outline" onClick={() => inputNumber("1")}>1</Button>
                <Button variant="outline" onClick={() => inputNumber("2")}>2</Button>
                <Button variant="outline" onClick={() => inputNumber("3")}>3</Button>
                <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2">0</Button>
                <Button variant="outline" onClick={() => inputNumber(".")}>.</Button>
                <Button variant="default" onClick={performCalculation}>=</Button>
              </div>
            </div>
          </DialogContent>
        )

      case "notebook":
        return (
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Digital Notebook</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 h-96">
              <div className="w-1/3 border-r pr-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Notes</h3>
                  <Button size="sm" onClick={createNewNote}>+ New</Button>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-2 rounded cursor-pointer border ${selectedNote?.id === note.id ? "bg-primary/10 border-primary" : "hover:bg-gray-50"}`}
                      onClick={() => {
                        setSelectedNote(note)
                        setNoteTitle(note.title)
                        setNoteContent(note.content)
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium truncate">{note.title}</span>
                        {notes.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}>×</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-4">
                  <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note title..." className="font-semibold" />
                  <Textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Start writing your note..." className="h-64 resize-none" />
                  <Button onClick={saveNote}>Save Note</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )

      case "formulas":
        return (
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Formula Reference</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {Object.entries(formulas).map(([subject, formulaList]) => (
                <div key={subject}>
                  <h3 className="text-lg font-semibold mb-3 text-primary">{subject}</h3>
                  <div className="space-y-2">
                    {formulaList.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{item.name}</div>
                        <div className="font-mono text-sm mt-1 bg-gray-50 p-2 rounded">{item.formula}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        )
      case "research":
        router.push("/research")
        setActiveModal(null)
        return null
        

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation  />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Educational Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access powerful educational tools designed to enhance your learning experience. From calculators to note-taking, we've got everything you need for academic success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <tool.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => setActiveModal(tool.id)} className="w-full">
                    Launch Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        {renderToolModal()}
      </Dialog>
    </div>
  )
}
