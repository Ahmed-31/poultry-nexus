import React, { useEffect, useState } from "react";
import { getRoles, createRole, deleteRole } from "@/src/services/rolesService";
import { getAvailablePermissions } from "@/src/services/usersService";
import Modal from "@/components/ui/Modal";
import Button from "@/Components/ui/Button2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch roles and permissions on mount
  useEffect(() => {
    fetchRoles();
    loadPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      console.log("Roles API response:", response); // Debugging output
      if (Array.isArray(response)) {
        setRoles(response);
      } else {
        console.error("Invalid roles data format", response);
        setRoles([]);
      }
    } catch (error) {
      console.error("Error fetching roles", error);
      toast.error("Failed to fetch roles");
      setRoles([]);
    }
  };
  
  // Load permissions with debugging
  const loadPermissions = async () => {
    try {
      const perms = await getAvailablePermissions();
      console.log("Permissions API response:", perms); // Debugging output
  
      if (Array.isArray(perms) && perms.length > 0) {
        // Convert string array into objects with id and name
        const formattedPermissions = perms.map((perm, index) => ({
          id: index, // Using index as a temporary ID
          name: perm,
        }));
  
        setPermissions(formattedPermissions);
      } else {
        console.error("Invalid permissions format", perms);
        setPermissions([]);
      }
    } catch (error) {
      console.error("Failed to load permissions", error);
      toast.error("Failed to fetch permissions");
      setPermissions([]);
    }
  };
  
  
  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      toast.warning("Role name cannot be empty");
      return;
    }
    if (selectedPermissions.size === 0) {
      toast.warning("Select at least one permission");
      return;
    }

    setLoading(true);
    try {
      await createRole({ name: roleName, permissions: Array.from(selectedPermissions) });
      fetchRoles();
      setRoleName("");
      setSelectedPermissions(new Set());
      setIsModalOpen(false);
      toast.success("Role created successfully");
    } catch (error) {
      console.error("Error creating role", error);
      toast.error("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteRole(id);
      fetchRoles();
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role", error);
      toast.error("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId) => {
    setSelectedPermissions((prev) => {
      const newPermissions = new Set(prev);
      newPermissions.has(permId) ? newPermissions.delete(permId) : newPermissions.add(permId);
      return new Set([...newPermissions]); // Ensuring React detects state changes
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Roles Management</h2>
      <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Create Role
      </Button>

      <h4 className="text-2xl font-bold mt-6 text-gray-800">Existing Roles</h4>
      <ul className="mt-3 bg-gray-50 p-4 rounded-lg">
        {roles.length > 0 ? (
          roles.map((role) => (
            <li key={role.id} className="flex justify-between py-2 border-b last:border-none items-center">
              <span className="font-semibold text-gray-800">{role.name}</span>
              <div>
                <Button className="text-blue-500 hover:text-blue-700 mr-3">Edit</Button>
                <Button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteRole(role.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No roles available.</p>
        )}
      </ul>

      {isModalOpen && (
        <div
          className="fixed inset-0 w-auto bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-4">Create Role</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              disabled={loading}
            />
            <h6 className="text-lg font-semibold mb-2">Permissions:</h6>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permissions.length > 0 ? (
                permissions.map((perm, index) => (
                  <label key={perm.id || index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={selectedPermissions.has(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      disabled={loading}
                    />
                    {perm.name || `Permission ${index + 1}`} {/* Fallback name */}
                  </label>
                ))
              ) : (
                <p className="text-gray-600">No permissions available.</p>
              )}
            </div>
            <Button onClick={handleCreateRole} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">
              {loading ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
