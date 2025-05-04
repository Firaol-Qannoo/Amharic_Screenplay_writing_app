let mainStyle ="field-sizing-content resize-none border-none focus:border-none text-md  outline-none focus:outline-none"
export const elements =
{

    scene_heading: {
        tag: "textarea",
        style: `${mainStyle} px-5 text-xl mb-3 font-bold underline  block`,
        value: "Scene Heading"
    },
    scene_description: {
        tag: "textarea",
        style: `${mainStyle} px-5 text-md mb-4 font-bold italic block`,
        value: "Scene Heading"
    },
    action: {
        tag: "textarea",
        style: `${mainStyle} px-5 text-md mb-3 font-semibold italic block`,
        value: "Action"
    },
    character: {
        tag: "textarea",
        style: `${mainStyle} pl-5 text-md mb-2 font-bold inline text-blue-800 char`,
        value: "Scene Heading"
    },
    
    character_emotion: {
        tag: "textarea",
        style: `${mainStyle} px-2 text-md mb-2 text-blue-600 font-light inline`,
        value: "Scene Description"
    },
    dialogue: {
        tag: "textarea",
        style: `${mainStyle} px-5 text-md mb-3 font-light block`,
        value: "Scene Heading"
    }
}