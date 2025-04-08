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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus } from "lucide-react";

export function CreateDialog() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("film"); // this is the Film/Theatre toggle

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    genre: "",
    // category, optionally send this to backend if/when needed
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Category selected:', category);
    post("/scripts", {
      data: {
        ...data,
        type: category, // this is the correct field to store film/theatre
      },
      onSuccess: () => {
        setOpen(false);
        window.location.href = "/editor";
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <FilePlus className="mr-2 h-4 w-4" />
          New Script
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Empty Script</DialogTitle>
        </DialogHeader>

        {/* Tabs for selecting Film or Theatre */}
        <Tabs defaultValue="film" onValueChange={setCategory}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="film">Film</TabsTrigger>
            <TabsTrigger value="theatre">Theatre</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={data.genre}
              onChange={(e) => setData("genre", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
