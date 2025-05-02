
import { CharacterNetwork } from "@/components/script-editor/character-network"
import { AiAssistant } from "@/components/script-editor/ai-assistant"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsDialog } from "@/components/settings-dialog"
import { ArrowLeft, User } from "lucide-react"
import { Link, usePage } from '@inertiajs/react' // Import usePage hook
import { useState, useEffect } from "react" // Import useEffect
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditorField } from "../../components/script-editor/EditingField"

export default function EditorPage() {
  const [showNetworkView, setShowNetworkView] = useState(false)
  // Use the usePage hook to access the current page data, including the 'script' prop
  const { props } = usePage();
  const { script } = props;

  // You might want to set up an initial state for your editor content
  const [editorContent, setEditorContent] = useState("");

  // useEffect to update editor content when the script prop changes
  useEffect(() => {
    if (script && script.content) {
      setEditorContent(script.content);
    } else {
      setEditorContent(""); // Or some default content
    }
  }, [script]);

  // Function to handle changes in the editor content (you'll need to implement this
  // based on your AmharicEditor component)
  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
    // You might want to implement autosaving or a "Save" button here
    // and send the updated content to your backend.
  };

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
                {/* Display the script title dynamically */}
                <span className="font-medium">{script?.title || "No title available"}</span>
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
              // Pass the dynamic content to your editor component
              <EditorField value={editorContent} onChange={handleEditorChange} />
            )}
          </div>
          <AiAssistant />
        </main>
      </section>
    </div>
  )
}