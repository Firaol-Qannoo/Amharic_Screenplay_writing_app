// "use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronRight, Clock, Film } from "lucide-react"
import React from "react"

// Sample data for scheduled scripts
const scheduledScripts = [
  {
    id: "s1",
    title: "የሰማይ ልጆች",
    sceneNumber: "Scene 12-15",
    date: "today",
    time: "10:00 AM",
    description: "Family confrontation scene where the main character reveals the truth about their past.",
    location: "Interior - Living Room",
    characters: ["Abebe", "Kebede", "Almaz"],
    notes: "Focus on emotional tension and lighting to create dramatic atmosphere.",
  },
  {
    id: "s2",
    title: "የሰማይ ልጆች",
    sceneNumber: "Scene 16",
    date: "today",
    time: "2:30 PM",
    description: "Resolution scene with reconciliation between siblings.",
    location: "Exterior - Garden",
    characters: ["Abebe", "Almaz"],
    notes: "Use natural lighting, shoot during golden hour if possible.",
  },
  {
    id: "s3",
    title: "ጉዞ ወደ ዋልድያ",
    sceneNumber: "Scene 8",
    date: "yesterday",
    time: "3:00 PM",
    description: "Comedy scene where the travelers get lost and encounter local villagers.",
    location: "Exterior - Rural Road",
    characters: ["Tadesse", "Bekele", "Village Elder"],
    notes: "Improvisation encouraged for the interaction with villagers.",
  },
  {
    id: "s4",
    title: "የአዲስ አበባ ምሽት",
    sceneNumber: "Scene 22-23",
    date: "tomorrow",
    time: "9:00 AM",
    description: "Romantic evening scene at a restaurant overlooking the city.",
    location: "Exterior - Restaurant Terrace",
    characters: ["Hanna", "Dawit"],
    notes: "Need to capture city lights and night atmosphere.",
  },
  {
    id: "s5",
    title: "ታሪካዊ ጀግና",
    sceneNumber: "Scene 45",
    date: "tomorrow",
    time: "1:00 PM",
    description: "Battle preparation scene with the hero rallying troops.",
    location: "Exterior - Military Camp",
    characters: ["Alemu", "General", "Soldiers"],
    notes: "Large scene with many extras, coordinate with production team.",
  },
]

interface ScriptDetailProps {
  script: (typeof scheduledScripts)[0]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ScriptDetail({ script, open, onOpenChange }: ScriptDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            {script.title} - {script.sceneNumber}
          </DialogTitle>
          <DialogDescription>
            Scheduled for {script.date === "today" ? "Today" : script.date === "yesterday" ? "Yesterday" : "Tomorrow"}{" "}
            at {script.time}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{script.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Location</h4>
            <p className="text-sm text-muted-foreground">{script.location}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Characters</h4>
            <div className="flex flex-wrap gap-1">
              {script.characters.map((character, index) => (
                <span key={index} className="text-sm bg-muted px-2 py-1 rounded-md">
                  {character}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-muted-foreground">{script.notes}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ScheduleList() {
  const [selectedScript, setSelectedScript] = useState<(typeof scheduledScripts)[0] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleShowDetail = (script: (typeof scheduledScripts)[0]) => {
    setSelectedScript(script)
    setDetailOpen(true)
  }

  const today = scheduledScripts.filter((script) => script.date === "today")
  const yesterday = scheduledScripts.filter((script) => script.date === "yesterday")
  const tomorrow = scheduledScripts.filter((script) => script.date === "tomorrow")

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Schedule</h2>
      </div>

      {today.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 text-primary">Today</h3>
          <div className="space-y-3">
            {today.map((script) => (
              <Card key={script.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{script.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Film className="mr-1 h-3 w-3" />
                        {script.sceneNumber}
                        <span className="mx-2">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        {script.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleShowDetail(script)}>
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tomorrow.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 text-primary">Tomorrow</h3>
          <div className="space-y-3">
            {tomorrow.map((script) => (
              <Card key={script.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{script.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Film className="mr-1 h-3 w-3" />
                        {script.sceneNumber}
                        <span className="mx-2">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        {script.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleShowDetail(script)}>
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {yesterday.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 text-muted-foreground">Yesterday</h3>
          <div className="space-y-3">
            {yesterday.map((script) => (
              <Card key={script.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{script.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Film className="mr-1 h-3 w-3" />
                        {script.sceneNumber}
                        <span className="mx-2">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        {script.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleShowDetail(script)}>
                      Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedScript && <ScriptDetail script={selectedScript} open={detailOpen} onOpenChange={setDetailOpen} />}
    </div>
  )
}

