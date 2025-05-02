import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import dayjs from 'dayjs';

export function ScriptDetailsDialog({ script }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/30">
                    <Eye className="h-4 w-4 text-white cursor-pointer" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{script.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p>{script.description}</p>
                    <p className="mt-2"> <b>Category: </b> {script.type}</p>
                    <p> <b>Genre: </b> {script.genre}</p>
                    <p> <b>Created At:</b> {dayjs(script.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                    {script.updated_at && <p> <b>Last Updated:</b> {dayjs(script.updated_at).format('YYYY-MM-DD HH:mm:ss')}</p>}
                    <p> <b>Pages: </b> {script.pages || 'N/A'}</p>
                    <p> <b>Shared by:</b> {script.user.first_name || script.user.email}</p>
                    {/* Add more details as needed */}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}