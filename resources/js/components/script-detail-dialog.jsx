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
import { useTranslation } from "react-i18next";

export function ScriptDetailsDialog({ script }) {
    const { t } = useTranslation();
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
                    <p className="mt-2"> <b>{t("invited_script_detail.viewDetails")}: </b> {script.type}</p>
                    <p> <b>{t("invited_script_detail.genre")}: </b> {script.genre}</p>
                    <p> <b>{t("invited_script_detail.createdAt")}:</b> {dayjs(script.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                    {script.updated_at && <p> <b>{t("invited_script_detail.lastUpdated")}:</b> {dayjs(script.updated_at).format('YYYY-MM-DD HH:mm:ss')}</p>}
                    <p> <b>{t("invited_script_detail.pages")}: </b> {script.pages || 'N/A'}</p>
                    <p> <b>{t("invited_script_detail.sharedBy")}:</b> {script.user.first_name || script.user.email}</p>
                    {/* Add more details as needed */}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}