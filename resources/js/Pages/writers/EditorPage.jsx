"use client"

import { AmharicEditor } from "@/components/script-editor/amharic-editor"
import { CharacterNetwork } from "@/components/script-editor/character-network"
import { AiAssistant } from "@/components/script-editor/ai-assistant"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsDialog } from "@/components/settings-dialog"
import { ArrowLeft, User } from "lucide-react"
import { Link } from '@inertiajs/react'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditorPage({ script }) {
  const [showNetworkView, setShowNetworkView] = useState(false)

  return (
    <div className="flex w-[100vw] px-8 min-h-screen">
      <section className="flex px-8 flex-9 flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={"/dashboard"}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {/* Display the script title here */}
                <span className="font-medium">{script.title || "No title available"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs"
                onClick={() => setShowNetworkView(!showNetworkView)}
              >
                {showNetworkView ? "ስክሪፕት አሳይ" : "ግንኙነት ኔትወርክ አሳይ"}
              </Button>
              <ThemeToggle />
              <SettingsDialog />
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 py-6">
          <div className="container max-w-6xl">
            {showNetworkView ? (
              <Card className="h-[600px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">የገጸ ባህሪዎች ግንኙነት ኔትወርክ</CardTitle>
                </CardHeader>
                <CardContent className="h-[540px]">
                  <CharacterNetwork />
                </CardContent>
              </Card>
            ) : (
              <AmharicEditor />
            )}
          </div>
          <AiAssistant />
        </main>
      </section>
    </div>
  )
}