/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Save } from "lucide-react";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import html2pdf from "html2pdf.js";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

import { useDispatch } from "react-redux";
//const [activeTextFieldId, setactiveTextFieldId] = useState()

import { nanoid } from "nanoid";
import {
    addScene,
    addLine,
    editSceneMeta,
    selectActiveScript,
} from "@/features/activeScriptSlice";
import {
    addCharacter,
    initCharacter,
    selectcharacters,
    updateCharacter,
} from "../../features/Characters";
import { elements } from "../../../../public/data/elements";
import { initScript } from "../../features/activeScriptSlice";
import { router } from "@inertiajs/react";
import { pdfstyle } from "../../../../public/data/pdfstyle";
import { store } from "../../app/store";

export function EditorField({ script, scenes, scenecharacters, user }) {
   
    const dispatch = useDispatch();
    const [selectedElement, setselectedElement] = useState("scene_heading");

    const onElementChange = (value) => {
       
        setselectedElement(value);
    };

    const [importedScript, setimportedScript] = useState(null);
    const characters = useSelector(selectcharacters);
    const [content, setcontent] = useState();
    const activeScriptState = useSelector(selectActiveScript);

    const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
    const targetUrl =
        "https://amharic-spelling-checker-demo.onrender.com/spellcheck";

   const saveScript = () => {
       
        const lastTextArea = document.querySelector(".board > div:last-of-type textarea");
        if (lastTextArea) {
            if (lastTextArea.getAttribute("data-type") == "character") {
                let charId = nanoid();
                let char = characters.find(
                    (character) => character.name === lastTextArea?.value
                );

                if (char) {
                    let updatedInScene = [...char.inScene];
                    let found = false;

                    updatedInScene = updatedInScene.map((sceneObj) => {
                        if (sceneObj.hasOwnProperty(sceneId)) {
                            found = true;
                            return { [sceneId]: sceneObj[sceneId] + 1 };
                        }
                        return sceneObj;
                    });

                    if (!found) {
                        updatedInScene.push({ [sceneId]: 1 });
                    }

                    dispatch(
                        updateCharacter({
                            id: char.id,
                            updates: { inScene: updatedInScene },
                        })
                    );

                    let character = { id: char.id, text: lastTextArea?.value };
                    setline({ ...line, character });
                    dispatch(addLine({
                        sceneId,
                        line: { ...line, character },
                    }))
                } else {
                    dispatch(
                        addCharacter({
                            id: charId,
                            name: lastTextArea?.value,
                            role: null,
                            description: null,
                            relationships: [],
                            inScene: [{ [sceneId]: 1 }],
                        })
                    );

                    let character = { id: charId, text: lastTextArea?.value };
                    setline({ ...line, character });
                    dispatch(addLine({
                        sceneId,
                        line: { ...line, character },
                    }))
                }


            }

            if (
                lastTextArea?.getAttribute("data-type") == "character_emotion"
            ) {
                let emotion = { id: nanoid(), text: lastTextArea?.value };
                setline({ ...line, emotion });
                dispatch(addLine({
                        sceneId,
                        line: { ...line, character },
                    }))
            }

            if (lastTextArea?.getAttribute("data-type") == "dialogue") {
                let dialogue = { id: nanoid(), text: lastTextArea?.value };
                let fullLine = { ...line, dialogue };
                setline(fullLine);
                dispatch(
                    addLine({
                        sceneId,
                        line: { lineId: nanoid(), ...fullLine },
                    })
                );
                setline({});
            }
            if (lastTextArea?.getAttribute("data-type") == "scene_heading") {
                let sceneID = nanoid();

                setsceneId(sceneID);

                setemptyScript(false);
                let sceneHead = { id: nanoid(), text: lastTextArea?.value };
               
                dispatch(
                    addScene({ user, id: sceneID, sceneHead, sceneDesc: null })
                );
            }
            if (lastTextArea?.getAttribute("data-type") == "action") {
                let action = { id: nanoid(), text: lastTextArea?.value };

                dispatch(
                    addLine({ sceneId, line: { lineId: nanoid(), action } })
                );
            }
            if (
                lastTextArea?.getAttribute("data-type") == "scene_description"
            ) {
                setemptyScript(false);
                let sceneDesc = { id: nanoid(), text: lastTextArea?.value };
                dispatch(editSceneMeta({ sceneId, sceneDesc }));
            }
        }
        const latestActiveScriptState = store.getState().activeScript; 
        const latestCharacters = store.getState().characters;
       
        router.post(
            `/scripts/${script.id}/scenes`,
            {
                scenes: latestActiveScriptState.scenes,
                characters: latestCharacters,
            },
            {
                onSuccess: () => {
                    console.log("Scenes saved successfully!");
                },
                onError: (errors) => {
                    console.error("Failed to save scenes:", errors);
                },
            }
        );
    };

    const scheduleHandler = () => {
        router.post("/production-schedule", {
            scenes: activeScriptState.scenes,
        });
    };

    const [suggWords, setsuggWords] = useState([]);
    const [dive, setdive] = useState(false);
    const exportScript = () => {
        let boardtopdf = document.createElement("div");
        boardtopdf.style.width = "80%";

        activeScriptState.scenes?.map((scence) => {
            if (scence.sceneHead.text) {
                let element = pdfstyle["scene_heading"];
                let ele = document.createElement(element?.tag);
                ele.innerText = scence.sceneHead.text;
                ele.setAttribute("class", element?.style);
                ele.addEventListener("change", onchange);
                ele.setAttribute("data-type", "scene_heading");
                ele.setAttribute("id", scence.sceneHead.id);
                boardtopdf.appendChild(ele);
            }
            if (scence.sceneDesc.text) {
                let element = pdfstyle["scene_description"];
                let ele = document.createElement(element?.tag);
                ele.innerText = scence.sceneDesc.text;
                ele.setAttribute("class", element?.style);
                ele.addEventListener("change", onchange);
                ele.setAttribute("data-type", "scene_description");
                ele.setAttribute("id", scence.sceneDesc.id);
                boardtopdf.appendChild(ele);
            }

            scence.lines.map((line) => {
                for (let key in line) {
                    if (key == "action") {
                        let element = pdfstyle["action"];
                        let ele = document.createElement(element?.tag);
                        ele.innerText = line[key].text;
                        ele.setAttribute("class", element?.style);
                        ele.addEventListener("change", onchange);
                        ele.setAttribute("data-type", "action");
                        ele.setAttribute("id", line[key].id);
                        boardtopdf.appendChild(ele);
                    } else {
                        if (key == "character") {
                            let element = pdfstyle["character"];
                            let ele = document.createElement(element?.tag);
                            ele.innerText = line[key].text;
                            ele.setAttribute("class", element?.style);
                            ele.addEventListener("change", onchange);
                            ele.setAttribute("data-type", "character");
                            ele.setAttribute("id", line[key].id);
                            boardtopdf.appendChild(ele);
                        } else if (key == "dialogue") {
                            let element = pdfstyle["dialogue"];
                            let ele = document.createElement(element?.tag);
                            ele.innerText = line[key].text;
                            ele.setAttribute("class", element?.style);
                            ele.addEventListener("change", onchange);
                            ele.setAttribute("data-type", "dialogue");
                            ele.setAttribute("id", line[key].id);
                            boardtopdf.appendChild(ele);
                        } else if (key == "emotion") {
                            let element = pdfstyle["character_emotion"];
                            let ele = document.createElement(element?.tag);
                            ele.innerText = line[key].text;
                            ele.setAttribute("class", element?.style);
                            ele.addEventListener("change", onchange);
                            ele.setAttribute("data-type", "character_emotion");
                            ele.setAttribute("id", line[key].id);
                            boardtopdf.appendChild(ele);
                        }
                    }
                }
            });
        });

        html2pdf()
            .set({
                margin: 10,
                filename: `${script.title}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(boardtopdf)
            .save()
            .then(() => {
                console.log("PDF generated");
            })
            .catch((err) => {
                console.error("PDF generation error:", err);
            });

      
    };
    const exportScriptAspf = () => {
        const blob = new Blob(
            [
                JSON.stringify({
                    script,
                    scenes: activeScriptState.scenes,
                    characters,
                    user,
                }),
            ],
            { type: "text/plain" }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${script.title}.aspf`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    useEffect(() => {
        const textarea = document.querySelector(".board > div:last-of-type textarea");
        const box = document.getElementById("suggestion-box");
        if (!textarea || !box) return;

        if (suggWords.length === 0) {
            box.style.display = "none";
            return;
        }

        box.innerHTML = "";
        if (suggWords.length > 0) {
            JSON.parse(suggWords).suggestions.forEach((sug) => {
                const item = document.createElement("div");
                item.textContent = sug;
                item.className = "px-4 py-2 hover:bg-gray-100 cursor-pointer";
                item.onclick = () => {
                    const words = textarea.value.split(" ");
                    words.pop();
                    words.push(sug);
                    textarea.value = words.join(" ") + " ";
                    textarea.focus();
                    box.style.display = "none";
                };
                box.appendChild(item);
            });

            const rect = textarea.getBoundingClientRect();
            box.style.top = `${rect.bottom + window.scrollY}px`;
            box.style.left = `${rect.left + window.scrollX}px`;
            box.style.width = `${rect.width}px`;
            box.style.display = "block";
        }
    }, [suggWords]);

    const [line, setline] = useState(null);

    const [sceneId, setsceneId] = useState(null);
    const [emptyScript, setemptyScript] = useState(true);
    useEffect(() => {
        console.log(selectedElement)
        const lastTextArea =  document.querySelector(".board > div:last-of-type textarea");
       
        if (lastTextArea) {
           
            if (lastTextArea.getAttribute("data-type") == "character") {
                let charId = nanoid();
                let char = characters.find(
                    (character) => character.name === lastTextArea?.value
                );

                if (char) {
                    let updatedInScene = [...char.inScene];
                    let found = false;

                    updatedInScene = updatedInScene.map((sceneObj) => {
                        if (sceneObj.hasOwnProperty(sceneId)) {
                            found = true;
                            return { [sceneId]: sceneObj[sceneId] + 1 };
                        }
                        return sceneObj;
                    });

                    if (!found) {
                        updatedInScene.push({ [sceneId]: 1 });
                    }

                    dispatch(
                        updateCharacter({
                            id: char.id,
                            updates: { inScene: updatedInScene },
                        })
                    );

                    let character = { id: char.id, text: lastTextArea?.value };
                    setline({ ...line, character });
                } else {
                    dispatch(
                        addCharacter({
                            id: charId,
                            name: lastTextArea?.value,
                            role: null,
                            description: null,
                            relationships: [],
                            inScene: [{ [sceneId]: 1 }],
                        })
                    );

                    let character = { id: charId, text: lastTextArea?.value };
                    setline({ ...line, character });
                }
            }

            if (
                lastTextArea?.getAttribute("data-type") == "character_emotion"
            ) {
                let emotion = { id: nanoid(), text: lastTextArea?.value };
                setline({ ...line, emotion });
            }

            if (lastTextArea?.getAttribute("data-type") == "dialogue") {
                  
                let dialogue = { id: nanoid(), text: lastTextArea?.value };
                let fullLine = { ...line, dialogue };
                setline(fullLine);
                dispatch(
                    addLine({
                        sceneId,
                        line: { lineId: nanoid(), ...fullLine },
                    })
                );
                setline({});
            }
            if (lastTextArea?.getAttribute("data-type") == "scene_heading") {
               console.log("object")
                let sceneID = nanoid();
                setsceneId(sceneID);
              
                setemptyScript(false);
                let sceneHead = { id: nanoid(), text: lastTextArea?.value };
               dispatch(
                    addScene({ user, id: sceneID, sceneHead, sceneDesc: null })
                );
               
            }
            if (lastTextArea?.getAttribute("data-type") == "action") {
                let action = { id: nanoid(), text: lastTextArea?.value };

                dispatch(
                    addLine({ sceneId, line: { lineId: nanoid(), action } })
                );
            }
            if (
                lastTextArea?.getAttribute("data-type") == "scene_description"
            ) {
                setemptyScript(false);
                let sceneDesc = { id: nanoid(), text: lastTextArea?.value };
                dispatch(editSceneMeta({ sceneId, sceneDesc }));
            }
        }

        if (dive) {
        

            let element = elements[selectedElement];
             let wrapper = document.createElement("div");
                    

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = "None"; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;
      let color =script.user_id ==user.id ? "000000" :user.id;
            wrapper.className = element?.style
            let ele = document.createElement(element?.tag);
            ele.setAttribute("class", element?.style);
             ele.setAttribute("style", `color: #${color}`);
            element?.style == "character" && ele.setAttribute("char", true);
            ele.setAttribute("data-type", selectedElement);
            
            ele.setAttribute("id", new Date().getTime());
            
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
            setTimeout(() => {
                ele.focus();
            }, 0);
            setcontent(document.querySelector(".board").innerHTML);

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
        }
    }, [selectedElement]);
    const onchange = (e) => {
        
    };
    useEffect(() => {
        let color = "000000";
        let name = "Anonymous";
        if (scenes) {
            // save chars on redux if exists
              scenecharacters && dispatch(initCharacter(scenecharacters));
            // save scenes on redux if exists
            scenes && dispatch(initScript({ scenes: scenes }));
            // iterate scene
            scenes?.map((scence) => {
                color =script.user_id ==scence.user.id ? "000000" :scence.user.userColor;
                
                name = scence.user.first_name==user.first_name ? script.user_id== user.id ?"You ( Creator )" : "You": script.user_id== scence.user.id ? scence.user.first_name +` ( Creator )` : scence.user.first_name;

                if (scence.sceneHead.text) {
                    let element = elements["scene_heading"];
                    let wrapper = document.createElement("div");
                   wrapper.className = `${element?.style} relative group block`;

                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-15 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                  
                    let ele = document.createElement(element?.tag);
                    ele.innerText = scence.sceneHead.text;
                    ele.setAttribute(
                        "class",
                        element?.style + ` cursor-default `
                    );
                    ele.setAttribute("style", `color: #${color}`);
                    ele.addEventListener("change", onchange);
                    ele.setAttribute("data-type", "scene_heading");
                    ele.setAttribute("id", scence.sceneHead.id);

                  
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                }
                if (scence.sceneDesc.text) {
                    let element = elements["scene_description"];
                     let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                    let ele = document.createElement(element?.tag);
                    ele.innerText = scence.sceneDesc.text;
                    ele.setAttribute("class", element?.style);
                    ele.setAttribute("style", `color: #${color}`);
                    ele.addEventListener("change", onchange);
                    ele.setAttribute("data-type", "scene_description");
                    ele.setAttribute("id", scence.sceneDesc.id);
              
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                }

                scence.lines.map((line) => {
                    for (let key in line) {
                        if (key == "action") {
                            let element = elements["action"];
                             let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                            let ele = document.createElement(element?.tag);
                            ele.innerText = line[key].text;
                            ele.setAttribute("class", element?.style);
                            ele.setAttribute("style", `color: #${color}`);
                            ele.addEventListener("change", onchange);
                            ele.setAttribute("data-type", "action");
                            ele.setAttribute("id", line[key].id);
                          
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                        } else {
                            if (key == "character") {
                                let element = elements["character"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                                let ele = document.createElement(element?.tag);
                                ele.innerText = line[key].text;
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute("data-type", "character");
                                ele.setAttribute("id", line[key].id);
                              
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                            } else if (key == "dialogue") {
                                let element = elements["dialogue"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                                let ele = document.createElement(element?.tag);
                                ele.innerText = line[key].text;
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute("data-type", "dialogue");
                                ele.setAttribute("id", line[key].id);
                           
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                            } else if (key == "emotion") {
                                let element = elements["character_emotion"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
                    let tooltip = document.createElement("div");
                    tooltip.innerText = name; 
                    tooltip.className = `
    absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
    bg-gray-700 text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity 
    pointer-events-none z-10
`;

                                let ele = document.createElement(element?.tag);
                                ele.innerText = line[key].text;
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute(
                                    "data-type",
                                    "character_emotion"
                                );
                                ele.setAttribute("id", line[key].id);
                              
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                            }
                        }
                    }
                });
            });

            let element = elements[selectedElement];
             let wrapper = document.createElement("div");
                    wrapper.className =element?.style;
                    let tooltip = document.createElement("div");
                    tooltip.innerText = ""; 
                    tooltip.className = element?.style
 let color2 =script.user_id ==user.id ? "000000" :user.id;
            let ele = document.createElement(element?.tag);
            ele.setAttribute("class", element?.style);
            element?.style == "character" && ele.setAttribute("char", true);
            ele.setAttribute("data-type", selectedElement);
             ele.setAttribute("style", `color: #${color2}`);
            ele.setAttribute("id", new Date().getTime());
             
                    wrapper.appendChild(tooltip);
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
            setTimeout(() => {
                ele.focus();
            }, 0);
            setcontent(document.querySelector(".board").innerHTML);
            setdive(true);
     
        }
    }, []);

    return (
        <div className="flex fixed  w-[70vw] h-full flex-col border rounded-md">
            <div className=" flex flex-wrap items-center gap-1 border-b p-1">
                <div className="flex items-center mr-2">
                    <Select
                        defaultValue={selectedElement}
                        onValueChange={(value) => onElementChange(value)}
                    >
                        <SelectTrigger className="h-8 w-[130px]  text-xs">
                            <SelectValue placeholder="Element Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                disabled={
                                    selectedElement == "character" ||
                                    emptyScript ||
                                    selectedElement == "scene_heading"
                                }
                                value="scene_heading"
                            >
                                Scene Heading
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "character" ||
                                    selectedElement == "scene_description" ||
                                    selectedElement == "character_emotion" ||
                                    selectedElement == "action"
                                }
                                value="scene_description"
                            >
                                Scene Description
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "character" ||
                                    emptyScript ||
                                    selectedElement == "scene_description" ||
                                    selectedElement == "scene_heading" ||
                                    selectedElement == "action"
                                }
                                value="action"
                            >
                                Action
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "character" ||
                                    selectedElement == "emotion"
                                }
                                value="character"
                            >
                                Character
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "scene_heading" ||
                                    emptyScript ||
                                    selectedElement == "scene_description" ||
                                    selectedElement == "dialogue" ||
                                    selectedElement == "action"
                                }
                                value="dialogue"
                            >
                                Dialogue
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "scene_heading" ||
                                    emptyScript ||
                                    selectedElement == "scene_description" ||
                                    selectedElement == "action" ||
                                    selectedElement == "dialogue" ||
                                    selectedElement == "character_emotion"
                                }
                                value="character_emotion"
                            >
                                Emotion
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center border-l pl-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                        <ToggleGroupItem
                            value="left"
                            size="sm"
                            className="h-8 w-8"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="center"
                            size="sm"
                            className="h-8 w-8"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex items-center border-l pl-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add Comment</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {!user.invitation && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <Users className="h-4 w-4" />
                                    <span className="text-xs">
                                        Invite Collaborators
                                    </span>
                                    <Plus className="h-3 w-3 opacity-50" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share Script</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    )}
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
                        <Menubar className="border-none">
                        {(!user?.invitation || user.invitation.role?.includes("Director")) && (
                            <MenubarMenu>
                                <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => router.visit(`/scripts/${script.id}/storyboard`)}
                                >
                                <Save className="h-4 w-4" />
                                <span className="text-xs">Storyboard</span>
                                </Button>
                            </MenubarMenu>
                                    )}
                            {(!user?.invitation || user.invitation.role?.includes("Artist")) && (
                            <MenubarMenu>
                                {" "}
                                <Button
                                    variant="ghost"
                                    onClick={scheduleHandler}
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <Save className="h-4 w-4" />
                                    <span className="text-xs">
                                        Production Schedule
                                    </span>
                                </Button>
                            </MenubarMenu>
                            )}
                            <MenubarMenu>
                                {" "}
                                <Button
                                    variant="ghost"
                                    onClick={saveScript}
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <Save className="h-4 w-4" />
                                    <span className="text-xs">Save</span>
                                </Button>
                            </MenubarMenu>
                            <MenubarMenu>
                                 {!user.invitation && (
                                <MenubarTrigger>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-1"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span className="text-xs">Export</span>
                                    </Button>
                                </MenubarTrigger>
                                 )}
                                <MenubarContent>
                                    <MenubarItem>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={exportScriptAspf}
                                            className="h-8 gap-1"
                                        >
                                            <FileDown className="h-4 w-4" />
                                            <span className="text-xs">
                                                as ASPF
                                            </span>
                                        </Button>
                                    </MenubarItem>
                                    <MenubarItem>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={exportScript}
                                            className="h-8 gap-1"
                                        >
                                            <FileDown clayssName="h-4 w-4" />
                                            <span className="text-xs">
                                                {" "}
                                                as PDF
                                            </span>
                                        </Button>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>

                <TabsContent value="write" className="flex-1 p-0 m-0">
                    <div
                        id="suggestions-box"
                        className="absolute bg-white border rounded-md shadow-md z-50 max-h-40 overflow-auto hidden"
                    ></div>

                    <div className="board h-[70vh] overflow-y-scroll  py-5 px-10 bg-gray-100">
                        {}
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
                            style={{
                                fontFamily:
                                    'Nyala, "Abyssinica SIL", sans-serif',
                            }}
                        >
                            <pre
                                className="whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: content }}
                            ></pre>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
