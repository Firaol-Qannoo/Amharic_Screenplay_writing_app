import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Pencil, Trash, Eye, X } from "lucide-react";
import dayjs from "dayjs";
import { router } from '@inertiajs/react';

export function CollaboratorsListDialog({ collaborators = [], script }) {
  const [open, setOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // New states for editing role
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("");

  const handleEdit = (user) => {
    console.log("Edit", user);
  };

  const handleDelete = (user) => {
    console.log("Delete", user);
  };

  const handleView = (user) => {
    setViewUser(user);
  };

  const closeView = () => {
    setViewUser(null);
  };

  // Start editing role for a user
  const startEdit = (user) => {
    setEditUser(user);
    setEditRole(user.invitation?.role || "Writer");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditUser(null);
    setEditRole("");
  };

  // Save edited role
  const saveEdit = () => {
    if (!editUser) return;

    router.put(`/update-collaborator-role/${script.id}/${editUser.id}`, { role: editRole })
      .then(() => {
        setEditUser(null);
        // Refresh page or data to show update
        router.visit(window.location.pathname, { preserveScroll: true, replace: true });
      })
      .catch((error) => {
        console.error("Error updating role:", error);
      });
  };

  return (
    <>
      {/* Main Dialog */}
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
                      <td className="px-4 py-2 border-b">
                        {editUser && editUser.id === user.id ? (
                          <>
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="Writer">Writer</option>
                              <option value="Artist">Artist</option>
                              <option value="Director">Director</option>
                            </select>
                            <div className="mt-2 flex space-x-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                          </>
                        ) : (
                          user.invitation?.role || "—"
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {dayjs(user.created_at).format("YYYY-MM-DD")}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {dayjs(user.updated_at).format("YYYY-MM-DD")}
                      </td>
                      <td className="px-4 py-2 border-b flex space-x-2 items-center">
                        <Eye
                          size={21}
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={() => handleView(user)}
                        />
                        {!editUser && (
                          <Pencil
                            size={21}
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700"
                            onClick={() => startEdit(user)}
                          />
                        )}
                        <Trash
                          size={21}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this Collaborator?')) {
                              router.delete(`/delete-collab/${script.id}/${user.id}`)
                                .then(() => {
                                  console.log('Collaborator deleted successfully');
                                  router.visit(window.location.pathname, {
                                    preserveScroll: true,
                                    replace: true,
                                  });
                                })
                                .catch((error) => {
                                  console.error('Error deleting collaborator:', error);
                                });
                            }
                          }}
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

      {/* View Details Slide Dialog */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/10">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl border border-gray-200 animate-slideDown">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
              <X
                className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={closeView}
              />
            </div>
            <div className="px-6 py-4 space-y-3 text-gray-700">
              <p><strong>Name:</strong> {viewUser.first_name || "N/A"}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Role:</strong> {viewUser.invitation?.role || "N/A"}</p>
              <p><strong>Joined:</strong> {dayjs(viewUser.created_at).format("YYYY-MM-DD")}</p>
              <p><strong>Last Updated:</strong> {dayjs(viewUser.updated_at).format("YYYY-MM-DD")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}