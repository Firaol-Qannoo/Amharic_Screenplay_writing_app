/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, MessageCircle, Save } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { InviteCollaboratorDialog } from "@/components/invite-collaborator-dialog";

export function EditorField({ script, scenes, scenecharacters, user }) {
   const { t } = useTranslation();
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
        console.log(scenes.length, script)
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
    wrapper.className = `${element?.style} relative group block wrapper`;

    // Tooltip
    let tooltip = document.createElement("div");
    tooltip.innerText = name;
    tooltip.className = `
        absolute -top-6 left-1/2 text-nowrap -translate-x-1/2 
        bg-gray-700 text-white text-xs px-2 py-1 rounded 
        opacity-0 group-hover:opacity-100 transition-opacity 
        pointer-events-none z-10
    `;

    // Main Element
    let ele = document.createElement(element?.tag);
    ele.innerText = scence.sceneHead.text;
    ele.setAttribute("class", element?.style + ` cursor-default focus:outline-none`);
    ele.setAttribute("style", `color: #${color}`);
    ele.setAttribute("data-type", "scene_heading");
    ele.setAttribute("id", scence.sceneHead.id);
    ele.setAttribute("tabindex", "0"); // make focusable
    ele.addEventListener("change", onchange);

    // Floating Comment Button (hidden initially)
    const commentBtn = document.createElement("button");
    commentBtn.innerText = "💬";
    commentBtn.className = `
        comment-button absolute top-2 right-2 bg-blue-500 text-white rounded-full w-7 h-7 
        flex items-center justify-center hover:bg-blue-600 transition-all text-sm hidden
    `;

    // Comment Box + Save
    const commentBox = document.createElement("div");
    commentBox.className = "absolute top-10 right-2 bg-white p-2 rounded shadow border hidden z-20";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter comment...";
    input.className = "border px-2 py-1 text-sm w-48";

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.className = "ml-2 px-3 py-1 bg-green-500 text-white rounded text-sm";

    saveBtn.onclick = () => {
        console.log("Comment saved for ID:", ele.id);
        console.log("Comment:", input.value);
         dispatch(editSceneMeta({ sceneId: ele.id, comment: input.value, user: user }));
        commentBox.classList.add("hidden");
    };

    commentBox.appendChild(input);
    commentBox.appendChild(saveBtn);

    commentBtn.onclick = () => {
        commentBox.classList.toggle("hidden");
        input.focus();
    };

    // Append to wrapper
    wrapper.appendChild(tooltip);
    wrapper.appendChild(ele);
    wrapper.appendChild(commentBtn);
    wrapper.appendChild(commentBox);

    document.querySelector(".board").appendChild(wrapper);
}

// ====== Global Focus Management ======
document.addEventListener("focusin", (e) => {
    // Hide all comment buttons first
    document.querySelectorAll(".comment-button").forEach(btn => {
        btn.classList.add("hidden");
    });

    // Show only the one inside the focused wrapper
    const wrapper = e.target.closest(".wrapper");
    if (wrapper) {
        const btn = wrapper.querySelector(".comment-button");
        if (btn) btn.classList.remove("hidden");
    }
});

document.addEventListener("focusout", (e) => {
    const wrapper = e.target.closest(".wrapper");
    if (wrapper) {
        setTimeout(() => {
            const active = document.activeElement;
            if (!wrapper.contains(active)) {
                const btn = wrapper.querySelector(".comment-button");
                if (btn) btn.classList.add("hidden");
            }
        }, 100); // delay to allow input/save clicks
    }
});

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
 let color2 =script.user_id ==user.id ? "" :user.id;
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
         if(scenes.length==0 && script.template) {
         
           scenes =  [
        {
            "id": "QksVFGMwg9HDC2HNyjJUZ",
            "user": {
                "role": "Writer",
                "first_name": "Eyob Betemariam",
                "email": "eyob2etemariam@gmail.com",
                "avatar": null,
                "userColor": "EF85E6",
                "updated_at": "2025-05-25T10:35:10.776000Z",
                "created_at": "2025-05-25T10:35:10.776000Z",
                "script_id": [
                    "6832f437ee0690df9c0301a4",
                    "6832fe40ee0690df9c0301a9"
                ],
                "id": "6832f25eee0690df9c0301a2"
            },
            "sceneHead": {
                "id": "XsBahvl04-VYJ0ScVVuob",
                "text": "1-ውጪ-አውቶቢስ ተራ መስቀለኛ ዋናው መንገድ-ንጋት"
            },
            "sceneDesc": {
                "id": "QI9vn-9F0j51JqJju86Ya",
                "text": "ከጎጃም በረንዳ አውቶብስ ተራ፣ ከመሳለሚያ አውቶቢስ ተራ፣ ከሚካኤል አውቶቢስ ተራ፣ ከሰባተኛ አውቶቢስ ተራ የሚያመሩት \nልክ አውቶቢስ ተራ ፊት ለፊት በመስቀለኛ የሚገናኙት መንገዶች ፍፁም ጭር ብለው ይታያሉ። ሱቆች ሁሉ ተዘግተዋል። \nበያንዳዶቹ መንገዶች ፎርግራውንድ በርቀት ወይም በቅርበት የሚነበቡ የተቃውሞ መፈክሮች ይታያሉ። መፈክሮቹ በወረቀት \nየተፃፉ፣ ቤየ ግድግዳው የተለጠፉ፣ በየ መስኮቱና በየ ቆሮቆሮው የተቸከቸኩ ሲሆኑ፣ አፃፃአፋቸውም የተለያየ የቀለም ቅይጥና \nየአጣጣል ቄንጥ ያላቸው ናቸው።አብዬታዊነት በፅኑው ይስተዋልባቸዋል።"
            },
            "lines": []
        },
        {
            "id": "yZ_8hYPejVUWwlqu0Hd3Z",
            "user": {
                "role": "Writer",
                "first_name": "Eyob Betemariam",
                "email": "eyob2etemariam@gmail.com",
                "avatar": null,
                "userColor": "EF85E6",
                "updated_at": "2025-05-25T10:35:10.776000Z",
                "created_at": "2025-05-25T10:35:10.776000Z",
                "script_id": [
                    "6832f437ee0690df9c0301a4",
                    "6832fe40ee0690df9c0301a9"
                ],
                "id": "6832f25eee0690df9c0301a2"
            },
            "sceneHead": {
                "id": "AAxOpHpfX5xg7kdrxSenC",
                "text": "2-ውጭ-ያልተወቀ መንገድ-ማለዳ"
            },
            "sceneDesc": {
                "id": "FtO6SOSvuViwx23kV6Rav",
                "text": "የአንድ ግቢ በር በርቀት ይታያል፡፡ጀርባውን የምናየው ሰው ስክሪን ውስጥ ገብቶ ይቆማል፡፡የቤቱን በራፍ እንደሚያይ \nእናውቃለን፡፡በድንገት ያ በር ይከፈታል፡፡ይሄኔ ጀርባውን የምናየው ሰው በሶምሶማ ወደ በሩ ይጠጋል፡፡የማናውቀው ሰው እግር \nረጅም መንገድ ዱብ ዱብ እያለ ሲሮጥ ይታያል፡፡እጁን ወዲያ ወዲህ እያደረገ ወደ ፊት ይሄዳል፡፡ከጀርባው ጸጉሩ የዘመኑን ፋሽን \nአፍሮን ያፋሸነ ነው፡፡ከፊት ለፊቱ የአንድ ትልቅ ቤት በሩ ይከፈትና የድሮ ፔጆ መኪና ወፈር ያለውን ሹፌርንና ካጠገቡ \nየተቀመጠችውን ሜስቱን ይዛ ትወጣለች፡፡ ያ የማናየው የጠዋት እስፖርተኛ እያለከለከ ወደ መኪናዋ ይጠጋል፡፡መኪናዋ ከግቢው \nትወጣና የሯጩን መንገድ ትዘጋለች፡፡ሹፊሩ በንቀት መንገድ የዘጋበትን ሯጭ ያይና ዋናው መንገድ ውስጥ ለመግባት መኪና መኖር \nአለመኖሩን ግራ ቀኝ ያያል፡፡ይቺ ሰአት መኪናዋም ሯጩም የቆሙባት ሰአት ናት፡፡ በዚህ ጌዜ የማናው ስፖርተኛ ወደ መኪናዋ \nመስኮት ጠጋ ብሎ"
            },
            "lines": [
                {
                    "lineId": "6wUJMWF-VYh5X_UIWWFto",
                    "character": {
                        "id": "OtUbCdnM61uSHpbAe_Q2K",
                        "text": "ስፖርተኛ"
                    },
                    "dialogue": {
                        "id": "8Y5lqb_BltaOoW1IQ_EQU",
                        "text": "ይቅርታ!!ሻምበል ይነበብ በላይ እርሶ ኖት"
                    }
                },
                {
                    "lineId": "KSUzlpxRPnQplrBPvJv9E",
                    "character": {
                        "id": "n148bQ0TjIxRUPmI0ruWf",
                        "text": "ሻምበል"
                    },
                    "emotion": {
                        "id": "lMq3PsZUkXhcd0XAHrVyV",
                        "text": "በንቀት እና በቁጣ"
                    },
                    "dialogue": {
                        "id": "JXMU9wHt78tk-6K1rMStr",
                        "text": "አዎ ነኝ!! ምንድነው!!"
                    }
                }
            ]
        }
    ]
           
            scenes?.map((scence) => {
              
   
   if (scence.sceneHead.text) {
    let element = elements["scene_heading"];
    let wrapper = document.createElement("div");
    wrapper.className = `${element?.style} relative group block wrapper`;

   
    let ele = document.createElement(element?.tag);
  
    ele.setAttribute("class", element?.style + ` cursor-default focus:outline-none`);
    ele.setAttribute("style", `color: #${color}`);
    ele.setAttribute("placeholder", scence.sceneHead.text);
    ele.setAttribute("data-type", "scene_heading");
    ele.setAttribute("id", scence.sceneHead.id);
    ele.setAttribute("tabindex", "0"); // make focusable
    ele.addEventListener("change", onchange);

    // Floating Comment Button (hidden initially)
    const commentBtn = document.createElement("button");
    commentBtn.innerText = "💬";
    commentBtn.className = `
        comment-button absolute top-2 right-2 bg-blue-500 text-white rounded-full w-7 h-7 
        flex items-center justify-center hover:bg-blue-600 transition-all text-sm hidden
    `;

    // Comment Box + Save
    const commentBox = document.createElement("div");
    commentBox.className = "absolute top-10 right-2 bg-white p-2 rounded shadow border hidden z-20";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter comment...";
    input.className = "border px-2 py-1 text-sm w-48";

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.className = "ml-2 px-3 py-1 bg-green-500 text-white rounded text-sm";

    saveBtn.onclick = () => {
        console.log("Comment saved for ID:", ele.id);
        console.log("Comment:", input.value);
         dispatch(editSceneMeta({ sceneId: ele.id, comment: input.value, user: user }));
        commentBox.classList.add("hidden");
    };

    commentBox.appendChild(input);
    commentBox.appendChild(saveBtn);

    commentBtn.onclick = () => {
        commentBox.classList.toggle("hidden");
        input.focus();
    };

    // Append to wrapper
 
    wrapper.appendChild(ele);
    wrapper.appendChild(commentBtn);
    wrapper.appendChild(commentBox);

    document.querySelector(".board").appendChild(wrapper);
}

// ====== Global Focus Management ======
document.addEventListener("focusin", (e) => {
    // Hide all comment buttons first
    document.querySelectorAll(".comment-button").forEach(btn => {
        btn.classList.add("hidden");
    });

    // Show only the one inside the focused wrapper
    const wrapper = e.target.closest(".wrapper");
    if (wrapper) {
        const btn = wrapper.querySelector(".comment-button");
        if (btn) btn.classList.remove("hidden");
    }
});

document.addEventListener("focusout", (e) => {
    const wrapper = e.target.closest(".wrapper");
    if (wrapper) {
        setTimeout(() => {
            const active = document.activeElement;
            if (!wrapper.contains(active)) {
                const btn = wrapper.querySelector(".comment-button");
                if (btn) btn.classList.add("hidden");
            }
        }, 100); // delay to allow input/save clicks
    }
});

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
                  
                    ele.setAttribute("class", element?.style);
                    ele.setAttribute("style", `color: #${color}`);
                    ele.setAttribute("placeholder", scence.sceneDesc.text);
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

             

                            let ele = document.createElement(element?.tag);
                           
                            ele.setAttribute("class", element?.style);
                            ele.setAttribute("style", `color: #${color}`);
                            ele.setAttribute("placeholder", line[key].text);
                            ele.addEventListener("change", onchange);
                            ele.setAttribute("data-type", "action");
                            ele.setAttribute("id", line[key].id);
                          
                
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                        } else {
                            if (key == "character") {
                                let element = elements["character"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

           

                                let ele = document.createElement(element?.tag);
                           
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.setAttribute("placeholder",line[key].text);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute("data-type", "character");
                                ele.setAttribute("id", line[key].id);
                
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                            } else if (key == "dialogue") {
                                let element = elements["dialogue"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
        
                                let ele = document.createElement(element?.tag);
                              
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.setAttribute("placeholder", line[key].text);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute("data-type", "dialogue");
                                ele.setAttribute("id", line[key].id);
            
                    wrapper.appendChild(ele);
                    document.querySelector(".board").appendChild(wrapper);
                            } else if (key == "emotion") {
                                let element = elements["character_emotion"];
                                 let wrapper = document.createElement("div");
                    wrapper.className =
                        element?.style

                    
     
                                let ele = document.createElement(element?.tag);
                              
                                ele.setAttribute("class", element?.style);
                                ele.setAttribute("style", `color: #${color}`);
                                ele.setAttribute("placeholder", line[key].text);
                                ele.addEventListener("change", onchange);
                                ele.setAttribute(
                                    "data-type",
                                    "character_emotion"
                                );
                                ele.setAttribute("id", line[key].id);
                              
           
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
 let color2 =script.user_id ==user.id ? "" :user.id;
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
                        <SelectTrigger className="h-8 w-[170px]  text-xs">
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
                                {t("editor_field.tools.scene_heading")}
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
                                 {t("editor_field.tools.scene_description")}
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
                                {t("editor_field.tools.action")}
                            </SelectItem>
                            <SelectItem
                                disabled={
                                    selectedElement == "character" ||
                                    selectedElement == "emotion"
                                }
                                value="character"
                            >
                                {t("editor_field.tools.character")}
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
                                {t("editor_field.tools.dialogue")}
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
                                {t("editor_field.tools.emotion")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

              


                <div className="flex items-center border-l pl-2 ml-auto">

                    {!user.invitation && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                               <InviteCollaboratorDialog scriptId={script.id} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share Script</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    )}
                </div>
            </div>

                <div className="flex items-center justify-end border-b px-4">
                   

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
                                <span className="text-xs">{t("editor_field.editor.storyboard")}</span>
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
                                        {t("editor_field.editor.production_schedule")}
                                    </span>
                                </Button>
                            </MenubarMenu>
                            )}
                                             <MenubarMenu>
  {/* Button to open Comments Preview */}
  <MenubarTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="text-xs">{t("editor_field.comment")}</span>
    </Button>
  </MenubarTrigger>

  {/* Dropdown Content */}
  <MenubarContent className="w-64 max-h-72 overflow-y-auto">
    
  {scenes.map((scene,index) => {
    
  return (
    scene.comments &&
    scene.comments.length > 0 && (
      <div key={scene.id} className="border-b last:border-b-0">
        {/* Scene Heading */}
        <div className="bg-muted px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground">
          {"SCENE: "  +scene.sceneHead.text} 
          </p>
        </div>

        {/* Comments */}
        {scene.comments.map((cmt) => (
            
          <div key={cmt.id} style={{
  color: script.user_id === cmt.user.id
    ? "#000000"
    : `#${cmt.user.userColor}`
}}
 className={`py-2 border-t px-4 text-xl`}>
            <p className="text-lg font-semibold ">
              {cmt.user.first_name}
            </p>
            <p className="text-sm">{cmt.comment}</p>
          </div>
        ))}
      </div>
    )
  );
})}



  </MenubarContent>
</MenubarMenu>
                            <MenubarMenu>
                                {" "}
                                <Button
                                    variant="ghost"
                                    onClick={saveScript}
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <Save className="h-4 w-4" />
                                    <span className="text-xs">{t("editor_field.editor.save")}</span>
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
                                        <span className="text-xs">{t("editor_field.editor.export")}</span>
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
                                               {t("editor_field.editor.export_as_aspf")}
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
                                                {t("editor_field.editor.export_as_pdf")}
                                            </span>
                                        </Button>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>

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
                

        </div>
    );
}
