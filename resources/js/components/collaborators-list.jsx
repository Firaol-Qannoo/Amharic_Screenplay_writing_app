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
import { router } from "@inertiajs/react";

export function CollaboratorsListDialog({ collaborators = [], script }) {
  const [open, setOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editRoles, setEditRoles] = useState([]);

  const ALL_ROLES = ["Writer", "Artist", "Director"];

  const handleView = (user) => setViewUser(user);
  const closeView = () => setViewUser(null);

  const startEdit = (user) => {
    setEditUser(user);
    let userRoles = [];
    try {
      if (Array.isArray(user.invitation?.role)) {
        userRoles = user.invitation.role;
      } else if (typeof user.invitation?.role === "string") {
        userRoles = user.invitation.role.split(",").map((r) => r.trim());
      }
      setEditRoles(userRoles);
    } catch (e) {
      console.error("Error parsing user roles on startEdit:", e);
      setEditRoles([]);
    }
  };
  

  const cancelEdit = () => {
    setEditUser(null);
    setEditRoles([]);
  };

  const toggleRole = (role) => {
    setEditRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };

  const saveEdit = () => {
    if (!editUser) return;

    console.log("script.id:", script?.id, "editUser.id:", editUser?.id);
    console.log("roles", editRoles);

    router
      .put(`/update-collaborator-role/${script.id}/${editUser.id}`, {
        role: editRoles, 
      })
      .then(() => {
        setEditUser(null);
        router.visit(window.location.pathname, {
          preserveScroll: true,
          replace: true,
        });
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        // TODO: Add user-friendly error feedback
      });
  };

  return (
    <>
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
                    <th className="px-4 py-2 border-b">Role(s)</th>
                    <th className="px-4 py-2 border-b">Joined</th>
                    <th className="px-4 py-2 border-b">Last Updated</th>
                    <th className="px-4 py-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {collaborators.map((user, index) => {
                   let userRoles = [];
                   try {
                     if (Array.isArray(user.invitation?.role)) {
                       userRoles = user.invitation.role;
                     } else if (typeof user.invitation?.role === "string") {
                       userRoles = user.invitation.role.split(",").map((r) => r.trim());
                     } else {
                       userRoles = [];
                     }
                   } catch (e) {
                     console.error("Error parsing user roles for display:", e);
                     userRoles = [];
                   }
                   
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-4 py-2 border-b text-gray-500">{index + 1}</td>
                        <td className="px-4 py-2 border-b">{user.first_name || "N/A"}</td>
                        <td className="px-4 py-2 border-b">{user.email}</td>
                        <td className="px-4 py-2 border-b">
                          {editUser && editUser.id === user.id ? (
                            <div className="flex flex-wrap gap-2">
                              {ALL_ROLES.map((role) => (
                                <button
                                  key={role}
                                  onClick={() => toggleRole(role)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    editRoles.includes(role)
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                              <div className="mt-2 flex space-x-2 w-full">
                                <button
                                  onClick={saveEdit}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : userRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {userRoles.map((role, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "—"
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
                              if (
                                window.confirm("Are you sure you want to delete this Collaborator?")
                              ) {
                                router
                                  .delete(`/delete-collab/${script.id}/${user.id}`)
                                  .then(() => {
                                    console.log("Collaborator deleted successfully");
                                    router.visit(window.location.pathname, {
                                      preserveScroll: true,
                                      replace: true,
                                    });
                                  })
                                  .catch((error) => {
                                    console.error("Error deleting collaborator:", error);
                                  });
                              }
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">No collaborators found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
              <p>
                <strong>Role(s):</strong>{" "}
                {(() => {
                  try {
                    let roles = [];
                        try {
                          if (Array.isArray(viewUser.invitation?.role)) {
                            roles = viewUser.invitation.role;
                          } else if (typeof viewUser.invitation?.role === "string") {
                            roles = viewUser.invitation.role.split(",").map((r) => r.trim());
                          }
                        } catch (e) {
                          console.error("Error parsing view user roles:", e);
                        }
                    return roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {roles.map((role, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "N/A"
                    );
                  } catch (e) {
                    console.error("Error parsing view user roles:", e);
                    return "N/A";
                  }
                })()}
              </p>
              <p><strong>Joined:</strong> {dayjs(viewUser.created_at).format("YYYY-MM-DD")}</p>
              <p><strong>Last Updated:</strong> {dayjs(viewUser.updated_at).format("YYYY-MM-DD")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}