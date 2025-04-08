import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlignCenter,
  AlignLeft,
  Bold,
  ChevronDown,
  Heading1,
  Heading2,
  Italic,
  List,
  MessageSquare,
  Plus,
  Underline,
  Users,
} from "lucide-react"

export function FormattingToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1">
      <div className="flex items-center mr-2">
        <Select defaultValue="scene">
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Element Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scene">Scene Heading</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="character">Character</SelectItem>
            <SelectItem value="dialogue">Dialogue</SelectItem>
            <SelectItem value="parenthetical">Parenthetical</SelectItem>
            <SelectItem value="transition">Transition</SelectItem>
            <SelectItem value="shot">Shot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center border-l pl-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline (Ctrl+U)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center border-l pl-2">
        <ToggleGroup type="single" defaultValue="left">
          <ToggleGroupItem value="left" size="sm" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm" className="h-8 w-8">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center border-l pl-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 1</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 2</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center border-l pl-2 ml-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Invite Collaborators</span>
                <Plus className="h-3 w-3 opacity-50" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share Script</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

