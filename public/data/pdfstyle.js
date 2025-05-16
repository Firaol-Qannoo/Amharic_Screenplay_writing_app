let mainStyle ="text-md w-[100%]"
export const pdfstyle =
{

    scene_heading: {
        tag: "h1",
        style: `${mainStyle} px-5 text-xl mb-2 font-bold underline  block`,
        value: "Scene Heading"
    },
    scene_description: {
        tag: "h1",
        style: `${mainStyle} px-5 text-md mb-3 font-bold italic block`,
        value: "Scene Heading"
    },
    action: {
        tag: "h1",
        style: `${mainStyle} px-5 text-md mb-2 font-semibold italic block`,
        value: "Action"
    },
    character: {
        tag: "h1",
        style: `${mainStyle} pl-5 text-md mb-1 font-bold inline text-[#0000ff] char`,
        value: "Scene Heading"
    },
    
    character_emotion: {
        tag: "h1",
        style: `${mainStyle} px-2 text-md mb-1 text-[#0000ff] font-light inline`,
        value: "Scene Description"
    },
    dialogue: {
        tag: "h1",
        style: `${mainStyle} px-5 text-md mb-2 font-light block`,
        value: "Scene Heading"
    }
}