import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
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
import flasher from '@flasher/flasher'
import { useTranslation } from "react-i18next";


export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    genre: "",
    thumbnail: null,
    type: "film", // ✅ default type is "film"
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("genre", data.genre);
    formData.append("type", data.type);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    post("/scripts", {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        setOpen(false);
        window.location.href = "/editor";
        flasher.success('Post created from the frontend!');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <FilePlus className="mr-2 h-4 w-4" />
          {t("create-script.newScript")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("create-script.createEmptyScript")}</DialogTitle>
        </DialogHeader>

        {/* Type Selector (Film / Theatre) */}
        <div className="space-y-2">
          <Label>{t("create-script.type")}</Label>
          <div className="flex items-center mt-4 space-x-4">
            <div>
              <input
                type="radio"
                id="film"
                name="type"
                className="hidden"
                value="film"
                checked={data.type === "film"}
                onChange={() => setData("type", "film")}
              />
              <Label htmlFor="film" className={`${data.type === "film" ? "border-2 bg-gray-600 border-blue-300": ""} px-4 py-2 border-gray-700 rounded-2xl`}>{t("create-script.film")}</Label>
            </div>
            <div>
              <input
                type="radio"
                id="theatre"
                name="type"
                value="theatre"
                className="hidden"
                checked={data.type === "theatre"}
                onChange={() => setData("type", "theatre")}
              />
              <Label htmlFor="theatre" className={`${data.type === "theatre" ? "border-2 bg-gray-600 border-blue-300": ""} px-4 py-2 border-gray-700 rounded-2xl`}>{t("create-script.theatre")}</Label>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("create-script.title")}</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("create-script.description")}</Label>
            <Input
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">{t("create-script.genre")}</Label>
            <Input
              id="genre"
              value={data.genre}
              onChange={(e) => setData("genre", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">{t("create-script.thumbnail")}</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setData("thumbnail", file);
              }}
            />
            {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
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
