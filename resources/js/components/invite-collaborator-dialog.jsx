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
import { Checkbox } from "@/components/ui/checkbox"; 
import { Share } from "lucide-react";
import flasher from "@flasher/flasher";

export function InviteCollaboratorDialog({ scriptId }) {
  const [open, setOpen] = useState(false);
  

  const { data, setData, post, processing, errors, reset } = useForm({
    invitee_email: "",
    role: [], 
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

  const availableRoles = ["Writer", "Artist", "Director"];

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
            <Label>Roles</Label>
            <div className="space-y-2">
            {availableRoles.map((role) => (
  <div key={role} className="flex items-center space-x-2">
    <Checkbox
      id={role}
      checked={Array.isArray(data.role) && data.role.includes(role)}
      onCheckedChange={(checked) => {
        const isChecked = checked === true;
        const roles = Array.isArray(data.role) ? data.role : [];
        const newRoles = isChecked
          ? [...roles, role]
          : roles.filter((r) => r !== role);
        setData("role", newRoles);
      }}
    />
    <label htmlFor={role} className="text-sm">
      {role}
    </label>
  </div>
))}


            </div>
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