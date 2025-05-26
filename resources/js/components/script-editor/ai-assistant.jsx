 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { BotIcon, X, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"; 


export function AiAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    setTimeout(() => {
      setIsGenerating(false)
      setPrompt("")
    }, 2000)
  }

  return (
    <>
      
      <Button
        variant={isOpen ? "secondary" : "outline"}
        size="sm"
        className="fixed right-4 bottom-20 h-10 w-10 rounded-full p-0 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BotIcon className={`h-5 w-5 ${isOpen ? "text-primary" : ""}`} />
      </Button>

      
      {isOpen && (
        <Card className="fixed right-4 top-32 w-80 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BotIcon  className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{t("ai_assistant.title")}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{t("ai_assistant.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
             
              <div className="space-y-2">
             
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("ai_assistant.ask")}</h3>
              <Textarea
                placeholder={t("ai_assistant.placeholder")}
                className="min-h-[80px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}>
              <Zap className="h-4 w-4" />
             <Button>{isGenerating ? t("ai_assistant.generating") : t("ai_assistant.generate")}</Button>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

