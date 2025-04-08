import { useState } from "react"
import { FormattingToolbar } from "./formatting-toolbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileDown, Save } from "lucide-react"

export function AmharicEditor() {
  const [content, setContent] = useState(``)

  return (
    <div className="flex h-full flex-col border rounded-md">
      <FormattingToolbar />

      <Tabs defaultValue="write" className="flex-1">
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-9 w-auto">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Save className="h-4 w-4" />
              <span className="text-xs">Save</span>
            </Button>
          
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <FileDown className="h-4 w-4" />
              <span className="text-xs">Export</span>
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="flex-1 p-0 m-0">
          <div className="h-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-base resize-none focus:outline-none bg-background"
              style={{ fontFamily: 'Nyala, "Abyssinica SIL", sans-serif' }}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <div className="h-full overflow-auto p-4">
            <div
              className="max-w-[600px] mx-auto p-8 bg-white dark:bg-black border rounded-md"
              style={{ fontFamily: 'Nyala, "Abyssinica SIL", sans-serif' }}
            >
              <pre className="whitespace-pre-wrap">{content}</pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

