import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Pencil, Trash, Eye } from "lucide-react";
import dayjs from "dayjs";

export function CollaboratorsListDialog({ collaborators = [] }) {
  const [open, setOpen] = useState(false);

  const handleEdit = (user) => {
    console.log("Edit", user);
    // Add edit logic or open a modal
  };

  const handleDelete = (user) => {
    console.log("Delete", user);
    // Add delete confirmation logic
  };

  const handleView = (user) => {
    console.log("View Details", user);
    // Redirect or open detail modal
  };

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
          <DialogTitle className="text-xl font-semibold">Collaborators</DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          {Array.isArray(collaborators) && collaborators.length > 0 ? (
            <table className="min-w-full table-auto border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Joined</th>
                  <th className="px-4 py-2 border-b">Last Updated</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {collaborators.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-2 border-b text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{user.first_name || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.invitation?.role || "—"}</td>
                    <td className="px-4 py-2 border-b">
                      {dayjs(user.created_at).format("YYYY-MM-DD")}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {dayjs(user.updated_at).format("YYYY-MM-DD")}
                    </td>
                    <td className="px-4 py-2 border-b flex space-x-2">
                      <Eye
                        size={16}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => handleView(user)}
                      />
                      <Pencil
                        size={16}
                        className="cursor-pointer text-yellow-500 hover:text-yellow-700"
                        onClick={() => handleEdit(user)}
                      />
                      <Trash
                        size={16}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(user)}
                      />
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