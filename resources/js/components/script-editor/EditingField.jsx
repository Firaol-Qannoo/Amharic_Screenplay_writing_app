/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, Save } from "lucide-react"
import { useSelector } from "react-redux"

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

import { useDispatch} from "react-redux"
// const [activeTextFieldId, setactiveTextFieldId] = useState()

import { nanoid } from "nanoid"
import { addScene,addLine, editSceneMeta, selectActiveScript } from "@/features/activeScriptSlice"
import { addCharacter, selectCharacterRelationship } from "../../features/Characters"
import { elements } from "../../../../public/data/elements"

export function EditorField() {
 
const dispatch = useDispatch()
const [selectedElement, setselectedElement] = useState("scene_heading") 

const onElementChange = (value)=>{
  setselectedElement(value)

}
const [importedScript, setimportedScript] = useState(null)
const characters = useSelector(selectCharacterRelationship)
const [content,setcontent] = useState()
const activeScriptState = useSelector(selectActiveScript)
const newSceneIndex = activeScriptState.scenes.length;
// save script
const saveScript = () =>{
  console.log(activeScriptState)
  console.log(JSON.stringify(activeScriptState))
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
    if(suggWords.length>0){
  
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
      box.style.display = 'block';}
  
}, [suggWords])

const [line, setline] = useState(null)
// element format
const [sceneId, setsceneId] = useState(null)
const [emptyScript, setemptyScript] = useState(true)
useEffect(() => {
 
 const lastTextArea = document.querySelector("textarea:last-child")
 if(lastTextArea){
 
  if(lastTextArea.getAttribute("data-type")=="character"){
    
  dispatch(addCharacter({
    id: nanoid(),
   name: lastTextArea?.value,
    role: null,
    description: null,
    relationships: [],
  }));
  let character= {id: nanoid(),text: lastTextArea?.value}
setline({...line,character})
 }
 if(lastTextArea?.getAttribute("data-type")=="character_emotion"){
  let emotion= {id: nanoid(),text: lastTextArea?.value}
  setline({...line,emotion})
 }

 if(lastTextArea?.getAttribute("data-type")=="dialogue"){
  let dialogue= {id: nanoid(),text: lastTextArea?.value}
  let fullLine = {...line, dialogue}
  setline(fullLine)
  dispatch(addLine({ sceneId, line: {lineId: nanoid(), ...fullLine} }))
  setline({})


 }
 if(lastTextArea?.getAttribute("data-type")=="scene_heading"){
  let sceneID= nanoid()
  setsceneId(sceneID)
 
  setemptyScript(false)
  let sceneHead= {id: nanoid(),text: lastTextArea?.value}
  console.log({id: sceneID, sceneHead, sceneDesc: null})
  dispatch(addScene({id: sceneID, sceneHead, sceneDesc: null}))
  console.log(activeScriptState)
 }
 if(lastTextArea?.getAttribute("data-type")=="action"){
 
  let action= {id: nanoid(),text: lastTextArea?.value}

  dispatch(addLine({sceneId, line: {lineId: nanoid(), action}}))


 }
 if(lastTextArea?.getAttribute("data-type")=="scene_description"){
  setemptyScript(false)
  let sceneDesc= {id: nanoid(),text: lastTextArea?.value}
  dispatch(editSceneMeta({sceneId, sceneDesc}))

 }
 
 
}

  let element = elements[selectedElement];
  let ele = document.createElement(element?.tag);
  ele.setAttribute("class", element?.style);
  element?.style=="character" &&   ele.setAttribute("char", true);
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
  
    const raw = JSON.stringify({word: lastWord});
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
  
    fetch(targetUrl, requestOptions)
      .then((response) => response.text())
      .then((result) =>  setsuggWords(result))
      .catch((error) => console.error("Error:", error));

  }
});

}, [selectedElement]);



useEffect(()=>{
  let tempScript = {
    "scenes": [
        {
            "id": "ghQi_UREjqIRQP65VpVz0",
            "sceneHead": {
                "id": "OzvQihiZiYw1iUvHGPmgk",
                "text": "ውጪ-አውቶቢስ ተራ መስቀለኛ ዋናው መንገድ-ንጋት"
            },
            "sceneDesc": {
                "id": "B_24bDwfk9CYhlauNG8p9",
                "text": "ከጎጃም በረንዳ አውቶብስ ተራ፣ ከመሳለሚያ አውቶቢስ ተራ፣ ከሚካኤል አውቶቢስ ተራ፣ ከሰባተኛ አውቶቢስ ተራ የሚያመሩት \nልክ አውቶቢስ ተራ ፊት ለፊት በመስቀለኛ የሚገናኙት መንገዶች ፍፁም ጭር ብለው ይታያሉ። ሱቆች ሁሉ ተዘግተዋል። \nበያንዳዶቹ መንገዶች ፎርግራውንድ በርቀት ወይም በቅርበት የሚነበቡ የተቃውሞ መፈክሮች ይታያሉ። መፈክሮቹ በወረቀት \nየተፃፉ፣ ቤየ ግድግዳው የተለጠፉ፣ በየ መስኮቱና በየ ቆሮቆሮው የተቸከቸኩ ሲሆኑ፣ አፃፃአፋቸውም የተለያየ የቀለም ቅይጥና \nየአጣጣል ቄንጥ ያላቸው ናቸው።አብዬታዊነት በፅኑው ይስተዋልባቸዋል።"
            },
            "lines": [
                {
                    "lineId": "PPxxb3XIceKhbCjlAwacE",
                    "character": {
                        "id": "mPoHdE9Cio3I7G6-tINzM",
                        "text": "ስፖርተኛ"
                    },
                    "dialogue": {
                        "id": "nKQZ8wJz1MB5wkI7LrSpe",
                        "text": "ይቅርታ!!ሻምበል ይነበብ በላይ እርሶ ኖት"
                    }
                },
                {
                    "lineId": "fGxMRUK0gi9zAot1cn4x4",
                    "character": {
                        "id": "V4IVqJNj19dDDR5GlE3we",
                        "text": "ሻምበል"
                    },
                    "emotion": {
                        "id": "XyxjR_AHSXB3ggXSafMZ6",
                        "text": "በንቀት እና በቁጣ"
                    },
                    "dialogue": {
                        "id": "6wozrStpY7TiFmK8B81cc",
                        "text": "አዎ ነኝ!! ምንድነው!!"
                    }
                },
                {
                    "lineId": "hDAjGYhMO-sg_vncpK1MI",
                    "character": {
                        "id": "b7LZKihYFH28-Ts4otDGU",
                        "text": "ስፖርተኛ"
                    },
                    "dialogue": {
                        "id": "FxH8JEbgvp89t8_fmZd3N",
                        "text": "ይህ የተፈረደቦት ፍርድ ነው!!"
                    }
                }
            ]
        },
        {
            "id": "M4d8xfMO2BECGVWu1dQvc",
            "sceneHead": {
                "id": "ej512IG9OpN80qSvIXUz3",
                "text": "ውጪ -የመንደር ስፖርት ሜዳ -ንጋት"
            },
            "sceneDesc": {
                "id": "v5yFF71iWoXY3btdz4a11",
                "text": null
            },
            "lines": [
                {
                    "lineId": "M3R69pwKo76hjxE1QI9FL",
                    "character": {
                        "id": "RsXA__9IPqKQ-gK-szImV",
                        "text": "ቤቢ"
                    },
                    "dialogue": {
                        "id": "tNA659UM1euIQbYNONsUe",
                        "text": "ኳስ በመሬት እናንት ሰዎች …/ለራሱ / ዘንድሮ መሬት የያዘ፣መውደቂያውን\nያሳምራል! …አማርኛ አይደለም እንዴ ምናገረው? …/ለራሱ / ምን አይነት\nጉድ ነው ዘንድሮ የመጣብን? አንድ ቛንቛ እየተነጋገረ እንዴት መግባባት\nይሳነዋል ሰው? ….ነው ገልብጣችሁ ነው የምትሰሙት?!(ለራሱ) አዳሜ\nእየገለበጥክ ስትሰሚ፣ ምን አገባኝ ትገለበጫታለሽ ከነሱ አልፈው እኔን\nሳያስገለብጡኝ ይቀራሉ ዘንድሮ?..."
                    }
                },
                {
                    "lineId": "8gZpkXtqCjbnt_U-_FnxX",
                    "action": {
                        "id": "ebnashcOuV75WhoaaS1vd",
                        "text": "ጆኒ የተባለው ጆሊው ተጫዋች ኳሷን እያሽሞነሞነ ቄንጥ ይሰራባታል"
                    }
                },
               
                {
                    "lineId": "wi6egFsci8nsCRXX5YHjY",
                    "character": {
                        "id": "ff_0uYkXmPfgDOBg7insE",
                        "text": "ሰዋሰው"
                    },
                    "dialogue": {
                        "id": "NBfwnHBtDOIH1X1SBbo_2",
                        "text": "እንዴ"
                    }
                }
            ]
        }
    ]
}

if(importedScript){
  
  importedscript.scenes.map((scence)=>{
    if(scence.sceneHead.text){
      let element = elements["scene_heading"];
      let ele = document.createElement(element?.tag);
      ele.innerText = scence.sceneHead.text
      ele.setAttribute("class", element?.style);
      ele.setAttribute("data-type", "scene_heading");
      ele.setAttribute("id", new Date().getTime());
      document.querySelector('.board').appendChild(ele);
    }
    if(scence.sceneDesc.text){
      let element = elements["scene_description"];
      let ele = document.createElement(element?.tag);
      ele.innerText = scence.sceneDesc.text
      ele.setAttribute("class", element?.style);
      ele.setAttribute("data-type", "scene_description");
      ele.setAttribute("id", new Date().getTime());
      document.querySelector('.board').appendChild(ele);
    }
    
    scence.lines.map(line=>{
      for (let key in line) { 
        if(key == "action"){
          let element = elements["action"];
          let ele = document.createElement(element?.tag);
          ele.innerText = line[key].text
          ele.setAttribute("class", element?.style);
          ele.setAttribute("data-type", "action");
          ele.setAttribute("id", new Date().getTime());
          document.querySelector('.board').appendChild(ele);
        }
        else {
            if(key =="character"){
              let element = elements["character"];
              let ele = document.createElement(element?.tag);
              ele.innerText = line[key].text
              ele.setAttribute("class", element?.style);
              ele.setAttribute("data-type", "character");
              ele.setAttribute("id", new Date().getTime());
              document.querySelector('.board').appendChild(ele);
            }
            else if(key =="dialogue"){
              let element = elements["dialogue"];
              let ele = document.createElement(element?.tag);
              ele.innerText = line[key].text
              ele.setAttribute("class", element?.style);
              ele.setAttribute("data-type", "dialogue");
              ele.setAttribute("id", new Date().getTime());
              document.querySelector('.board').appendChild(ele);
            }
            else if(key =="emotion"){
              let element = elements["character_emotion"];
              let ele = document.createElement(element?.tag);
              ele.innerText = line[key].text
              ele.setAttribute("class", element?.style);
              ele.setAttribute("data-type", "character_emotion");
              ele.setAttribute("id", new Date().getTime());
              document.querySelector('.board').appendChild(ele);
            }
        }
      }
    })
    
    
    })
}
},[])


  return (
    <div className="flex fixed  w-[70vw] h-full flex-col border rounded-md">
      <div className=" flex flex-wrap items-center gap-1 border-b p-1">
      <div className="flex items-center mr-2">
        <Select  defaultValue={selectedElement}
          onValueChange={(value)=>onElementChange(value)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Element Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled={selectedElement=="character"||emptyScript|| selectedElement=="scene_heading"} value="scene_heading">Scene Heading</SelectItem>
            <SelectItem disabled={selectedElement=="character" || selectedElement=="scene_description"||selectedElement=="character_emotion" ||selectedElement=="action"} value="scene_description">Scene Description</SelectItem>
            <SelectItem disabled={selectedElement=="character" ||emptyScript|| selectedElement=="scene_description"||selectedElement=="scene_heading"||selectedElement=="action"} value="action">Action</SelectItem>
            <SelectItem disabled={selectedElement=="character"} value="character">Character</SelectItem>
            <SelectItem disabled={selectedElement=="scene_heading" ||emptyScript ||selectedElement=="scene_description"||selectedElement=="dialogue"||selectedElement=="action"} value="dialogue">Dialogue</SelectItem>
            <SelectItem disabled={selectedElement=="scene_heading" ||emptyScript ||selectedElement=="scene_description"||selectedElement=="action" ||selectedElement=="dialogue" || selectedElement=="character_emotion"} value="character_emotion">Emotion</SelectItem>
           
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

          <div className="board h-[70vh] overflow-y-scroll  py-5 px-70">
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

