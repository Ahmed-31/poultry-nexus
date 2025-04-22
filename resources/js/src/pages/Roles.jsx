import React, { useEffect, useState } from "react";
import { getRoles, createRole, deleteRole } from "@/src/services/rolesService";
import { getAvailablePermissions } from "@/src/services/usersService";
import Modal from "@/components/ui/Modal";
import Button from "@/Components/ui/Button2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";
import Select from "react-select";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
    loadPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
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

  const loadPermissions = async () => {
    try {
      const perms = await getAvailablePermissions();
      if (Array.isArray(perms)) {
        const formatted = perms.map((perm, index) => ({
          id: index,
          name: perm,
        }));
        setPermissions(formatted);
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

  const permissionOptions = permissions.map((perm) => ({
    value: perm.id,
    label: perm.name,
  }));

  return (
    <div className="min-h-screen overflow-auto p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
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
            <Select
              isMulti
              options={permissionOptions}
              value={permissionOptions.filter((opt) => selectedPermissions.has(opt.value))}
              onChange={(selected) => {
                const updatedSet = new Set(selected.map((opt) => opt.value));
                setSelectedPermissions(updatedSet);
              }}
              isDisabled={loading}
              className="mb-2"
              styles={{
                control: (base) => ({
                  ...base,
                  maxHeight: 120,
                  overflowY: "auto",
                  flexWrap: "wrap",
                }),
                valueContainer: (base) => ({
                  ...base,
                  maxHeight: 100,
                  overflowY: "auto",
                }),
                menu: (base) => ({
                  ...base,
                  maxHeight: 150,
                  overflowY: "auto",
                }),
              }}
            />

            {selectedPermissions.size > 0 && (
              <div className="text-sm text-gray-700 mt-2">
                Selected:{" "}
                {Array.from(selectedPermissions)
                  .map((id) => permissions.find((p) => p.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}

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
