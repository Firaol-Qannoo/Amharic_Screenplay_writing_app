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
import { Share } from "lucide-react";
import flasher from "@flasher/flasher";

export function InviteCollaboratorDialog({ scriptId }) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    invitee_email: "",
    role: "Writer", // default role
    script_id: scriptId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/invitations", {
      onSuccess: () => {
        reset();
        setOpen(false);
        // Optional: show toast
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Share className="mr-2 h-4 w-4" />
          Invite Collaborators
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite a Collaborator</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="invitee_email">Email Address</Label>
            <Input
              id="invitee_email"
              type="email"
              value={data.invitee_email}
              onChange={(e) => setData("invitee_email", e.target.value)}
              required
            />
            {errors.invitee_email && (
              <p className="text-red-500 text-sm">{errors.invitee_email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={data.role}
              onChange={(e) => setData("role", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Writer">Writer</option>
              <option value="Artist">Artist</option>
              <option value="Director">Director</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}