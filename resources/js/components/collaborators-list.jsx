import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import dayjs from "dayjs";

export function CollaboratorsListDialog({ collaborators = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <User className="mr-2 h-4 w-4" />
          Collaborators
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Collaborators
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
        {Array.isArray(collaborators) && collaborators.length > 0 ? (
            <table className="min-w-full table-auto border border-gray-200 rounded-md">
             <thead className="bg-gray-100">
            <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-2 border-b">#</th> 
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Joined</th>
                <th className="px-4 py-2 border-b">Last Updated</th>
            </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
            {collaborators.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-2 border-b text-gray-500">{index + 1}</td> 
                <td className="px-4 py-2 border-b">{user.first_name || "N/A"}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                    {dayjs(user.created_at).format("YYYY-MM-DD")}
                </td>
                <td className="px-4 py-2 border-b">
                    {dayjs(user.updated_at).format("YYYY-MM-DD")}
                </td>
                </tr>
            ))}
            </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">No collaborators found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
