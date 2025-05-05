import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
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
import flasher from "@flasher/flasher";
import { Pencil } from "lucide-react";

export function UpdateScript({ script }) {
  const [open, setOpen] = useState(false);

  const { data, setData, processing, errors, reset } = useForm({
    title: script.title || "",
    description: script.description || "",
    genre: script.genre || "",
    thumbnail: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("genre", data.genre);
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }
    formData.append("_method", "PUT"); // method spoofing for Laravel

    router.post(`/scripts/${script.id}`, formData, {
      forceFormData: true,
      onSuccess: () => {
        setOpen(false);
        // flasher.success("Script updated successfully!");
      },
      onError: (err) => {
        // console.error("Form submission failed:", err);
        // flasher.error("Failed to update the script.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Script</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={data.genre}
              onChange={(e) => setData("genre", e.target.value)}
            />
            {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>

            <div className="rounded-md border p-2 w-40 h-40 flex items-center justify-center bg-muted">
              {data.thumbnail ? (
                <img
                  src={URL.createObjectURL(data.thumbnail)}
                  alt="New Thumbnail Preview"
                  className="object-cover rounded h-full w-full"
                />
              ) : script.thumbnail ? (
                <img
                  src={`/${script.thumbnail}`}
                  alt="Current Thumbnail"
                  className="object-cover rounded h-full w-full"
                />
              ) : (
                <span className="text-sm text-muted-foreground">No image</span>
              )}
            </div>

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
              <p className="text-red-500 text-sm">{errors.thumbnail}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
