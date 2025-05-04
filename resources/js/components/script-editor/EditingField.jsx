/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, Save } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  MessageSquare,
  Plus,
  Underline,
  Users,
} from "lucide-react"

import { nanoid } from "nanoid"
import { addScene, addLine, editSceneMeta, selectActiveScript } from "@/features/activeScriptSlice"
import { addCharacter, selectCharacterRelationship } from "../../features/Characters"
import { elements } from "../../../../public/data/elements"
import { router } from "@inertiajs/react" // Import the router object

export function EditorField({ script }) { // Receive script as a prop
  // console.log("Script prop received in EditorField:", script);
  const dispatch = useDispatch()
  const [selectedElement, setselectedElement] = useState("scene_heading")

  const onElementChange = (value) => {
    setselectedElement(value)
  }

  const characters = useSelector(selectCharacterRelationship)
  const [content, setcontent] = useState("")
  const activeScriptState = useSelector(selectActiveScript)
  const newSceneIndex = activeScriptState.scenes.length;

  // Save script function using Inertia
  const saveScript = () => {
    router.post(`/scripts/${script.id}/scenes`, { scenes: activeScriptState.scenes }, {
      onSuccess: () => {
        console.log('Scenes saved successfully!');
        // Optionally, provide user feedback (e.g., a toast notification)
      },
      onError: (errors) => {
        console.error('Failed to save scenes:', errors);
        // Optionally, display error messages to the user
      },
    });
  }

  // word suggestion

  const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
  const targetUrl = "https://amharic-spelling-checker-demo.onrender.com/spellcheck";

  const [suggWords, setsuggWords] = useState([])

  useEffect(() => {

    const textarea = document.querySelector('.board textarea:last-child');
    const box = document.getElementById('suggestion-box');
    if (!textarea || !box) return;

    if (suggWords.length === 0) {
      box.style.display = 'none';
      return;
    }

    box.innerHTML = '';
    if (suggWords.length > 0) {

      JSON.parse(suggWords).suggestions.forEach((sug) => {
        const item = document.createElement('div');
        item.textContent = sug;
        item.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
        item.onclick = () => {
          const words = textarea.value.split(" ");
          words.pop();
          words.push(sug);
          textarea.value = words.join(" ") + " ";
          textarea.focus();
          box.style.display = 'none';
        };
        box.appendChild(item);
      });


      const rect = textarea.getBoundingClientRect();
      box.style.top = `${rect.bottom + window.scrollY}px`;
      box.style.left = `${rect.left + window.scrollX}px`;
      box.style.width = `${rect.width}px`;
      box.style.display = 'block';
    }

  }, [suggWords])

  const [line, setline] = useState(null)
  // element format
  const [emptyScript, setemptyScript] = useState(true)
  useEffect(() => {

    const lastTextArea = document.querySelector("textarea:last-child")
    if (lastTextArea) {

      if (lastTextArea.getAttribute("data-type") == "character") {

        dispatch(addCharacter({
          id: nanoid(),
          name: lastTextArea?.value,
          role: null,
          description: null,
          relationships: [],
        }));
        setline({ ...line, character: lastTextArea?.value })
      }
      if (lastTextArea?.getAttribute("data-type") == "character_emotion") {
        setline({ ...line, emotion: lastTextArea?.value })
      }

      if (lastTextArea?.getAttribute("data-type") == "dialogue") {
        let fullLine = { ...line, dialogue: lastTextArea?.value }
        setline(fullLine)
        dispatch(addLine({ index: newSceneIndex - 1, ...fullLine }))
        setline({})


      }
      if (lastTextArea?.getAttribute("data-type") == "scene_heading") {
        setemptyScript(false)
        dispatch(addScene())


        dispatch(editSceneMeta({ index: newSceneIndex, sceneHead: lastTextArea?.value }))


      }
      if (lastTextArea?.getAttribute("data-type") == "action") {


        dispatch(addLine({ index: newSceneIndex - 1, action: lastTextArea?.value }))


      }
      if (lastTextArea?.getAttribute("data-type") == "scene_description") {
        setemptyScript(false)
        dispatch(editSceneMeta({ index: newSceneIndex - 1, sceneDesc: lastTextArea?.value }))

      }


    }

    let element = elements[selectedElement];
    let ele = document.createElement(element?.tag);
    ele.setAttribute("class", element?.style);
    element?.style == "character" && ele.setAttribute("char", true);
    ele.setAttribute("data-type", selectedElement);
    ele.setAttribute("id", new Date().getTime());
    document.querySelector('.board').appendChild(ele);
    setTimeout(() => {
      ele.focus();
    }, 0);
    setcontent(document.querySelector('.board').innerHTML)

    // spell chk

    ele.addEventListener("input", async (e) => {
      const value = e.target.value.trim();
      const lastWord = value.split(" ").pop();

      if (lastWord?.length > 200) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");

        const raw = JSON.stringify({ word: lastWord });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        fetch(targetUrl, requestOptions)
          .then((response) => response.text())
          .then((result) => setsuggWords(result))
          .catch((error) => console.error("Error:", error));

      }
    });

  }, [selectedElement]);




  return (
    <div className="flex h-full flex-col border rounded-md">
      <div className="flex flex-wrap items-center gap-1 border-b p-1">
        <div className="flex items-center mr-2">
          <Select defaultValue={selectedElement}
            onValueChange={(value) => onElementChange(value)}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Element Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={selectedElement == "character" || emptyScript || selectedElement == "scene_heading"} value="scene_heading">Scene Heading</SelectItem>
              <SelectItem disabled={selectedElement == "character" || selectedElement == "scene_description" || selectedElement == "character_emotion" || selectedElement == "action"} value="scene_description">Scene Description</SelectItem>
              <SelectItem disabled={selectedElement == "character" || emptyScript || selectedElement == "scene_description" || selectedElement == "scene_heading" || selectedElement == "action"} value="action">Action</SelectItem>
              <SelectItem disabled={selectedElement == "character"} value="character">Character</SelectItem>
              <SelectItem disabled={selectedElement == "scene_heading" || emptyScript || selectedElement == "scene_description" || selectedElement == "dialogue" || selectedElement == "action"} value="dialogue">Dialogue</SelectItem>
              <SelectItem disabled={selectedElement == "scene_heading" || emptyScript || selectedElement == "scene_description" || selectedElement == "action" || selectedElement == "dialogue" || selectedElement == "character_emotion"} value="character_emotion">Emotion</SelectItem>

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
            <Button variant="ghost" onClick={saveScript} size="sm" className="h-8 gap-1">
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
          <div id="suggestions-box" className="absolute bg-white border rounded-md shadow-md z-50 max-h-40 overflow-auto hidden">
          </div>

          <div className="board h-[100vh] py-5 px-10">
          </div>
          <div
            id="suggestion-box"
            className="absolute bg-white border border-gray-300 rounded shadow-md z-50 hidden text-sm max-h-40 overflow-auto"
          ></div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <div className="h-full overflow-auto p-4">
            <div
              className="max-w-[600px] mx-auto p-8 bg-white dark:bg-black border rounded-md"
              style={{ fontFamily: 'Nyala, "Abyssinica SIL", sans-serif' }}
            >

              <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }}></pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}