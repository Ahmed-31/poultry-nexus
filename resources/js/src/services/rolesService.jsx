import api from "./axios";

// Fetch all roles
export async function getRoles() {
  try {
      const token = localStorage.getItem("authToken"); // Retrieve stored token

      if (!token) {
          throw new Error("No auth token found. User might be logged out.");
      }

      const response = await fetch("http://poultry-nexus.loc/api/roles", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`, // Send token in header
              "Accept": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
  } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
  }
}



// Fetch a single role by ID
export const getRoleById = async (id) => {
  try {
    const response = await api.get(`/api/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching role by ID (${id}):`, error);
    throw error;
  }
};

// Create a new role
export const createRole = async (roleData) => {
  try {
    const response = await api.post("/api/roles", roleData);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

// Update an existing role (NEW FUNCTION)
export const updateRole = async (id, roleData) => {
  try {
    const response = await api.put(`/api/roles/${id}`, roleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating role (${id}):`, error);
    throw error;
  }
};

// Delete a role
export const deleteRole = async (id) => {
  try {
    await api.delete(`/api/roles/${id}`);
  } catch (error) {
    console.error(`Error deleting role (${id}):`, error);
    throw error;
  }
};
