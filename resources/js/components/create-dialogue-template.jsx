import { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  
    LayoutTemplate,

} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus } from "lucide-react";
import flasher from "@flasher/flasher";
import { useTranslation } from "react-i18next";

export function CreateDialogTemplate(template = true) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        genre: "",
        thumbnail: null,
        type: "", 
    });
   const [tempType, settempType] = useState(null)
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("genre", data.genre);
        formData.append("type", data.type);
        formData.append("template", data.type);
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
 console.log("temp ",data.type)
        post("/scripts", {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                window.location.href = "/editor";
                flasher.success("Post created from the frontend!");
            },
        });
    };
 
    const changeTempType = (type) =>{
       
            settempType(type);
            setData("template", type);
            setData("type", type);
        
    }
const templateCategories = [
    {
        name: "Film",
        templates: [
            {
                id: "f1",
                name: "film script Template",
                description: "Gives standard layout of sample script for film.",
            },
        ],
    },
    {
        name: "Theatre",
        templates: [
            {
                id: "t1",
                name: "theatre script Template",
                description: "Gives standard layout of sample script for theatre.",
            },
        ],
    },
];
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LayoutTemplate className="mr-2 h-4 w-4" />
                    {t("dashboard.main.templatesButton")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("create-script.useTemplate")}
                    </DialogTitle>
                </DialogHeader>

                                        <div className=" flex  w-full gap-2">
                                            {templateCategories.map((category) => (
                                                <div key={category.name}  className={` space-y-4 w-full`}>
                                                    <h3 className="text-lg font-medium">
                                                        {category.name}
                                                    </h3>
                                                    <div  className="grid gap-4   w-full ">
                                                        {category.templates.map((template) => (
                                                            <Card
                                                                key={template.id}
                                                                onClick={()=>changeTempType(category.name)} className={`${tempType==category.name ? "border-2 bg-gray-600 border-blue-300": ""} cursor-pointer`}
                                                         
                                                            >
                                                                <CardHeader>
                                                                    <CardTitle className="text-base">
                                                                        {template.name}
                                                                    </CardTitle>
                                                                    <CardDescription>
                                                                        {template.description}
                                                                    </CardDescription>
                                                                </CardHeader>
                                                                <CardFooter>
                                                                    <Button variant="outline" size="sm">
                                                                        Use Template
                                                                    </Button>
                                                                </CardFooter>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                  

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            {t("create-script.title")}
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t("create-script.description")}
                        </Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="genre">
                            {t("create-script.genre")}
                        </Label>
                        <Input
                            id="genre"
                            value={data.genre}
                            onChange={(e) => setData("genre", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">
                            {t("create-script.thumbnail")}
                        </Label>
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) setData("thumbnail", file);
                            }}
                        />
                        {errors.thumbnail && (
                            <p className="text-red-500 text-sm">
                                {errors.thumbnail}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {t("create-script.create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
