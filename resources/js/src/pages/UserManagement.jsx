import React, { useState, useEffect } from 'react';
import { getUsersTable, deleteUser } from '../services/usersService';
import { Trash2, Pencil, Search, XCircle, PlusCircle, FileDown } from 'lucide-react';
import AddUserModal from '@/src/components/UserManagement/AddUserModal';
import EditUserModal from '@/src/components/UserManagement/EditUserModal';
import ConfirmModal from '@/src/components/UserManagement/ConfirmModal';
import { saveAs } from 'file-saver';
import toast ,{ Toaster } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [users, searchTerm, selectedRole, selectedPermission]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersTable();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.success('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success('User deleted successfully.');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.success('Error deleting user.');
    } finally {
      setUserToDelete(null);
    }
  };

  const applyFilters = () => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(term);
      const roleMatchTerm = user.role?.toLowerCase().includes(term);
      const permMatchTerm = user.permissions.some(p => p.toLowerCase().includes(term));

      const roleFilterMatch = selectedRole ? user.role === selectedRole : true;
      const permFilterMatch = selectedPermission ? user.permissions.includes(selectedPermission) : true;

      return (nameMatch || roleMatchTerm || permMatchTerm) && roleFilterMatch && permFilterMatch;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const getUniqueRoles = () => [...new Set(users.map(user => user.role).filter(Boolean))];
  const getUniquePermissions = () => [...new Set(users.flatMap(user => user.permissions || []))];
  const clearFilters = () => { setSelectedRole(''); setSelectedPermission(''); };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Permissions'];
    const rows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.role,
      user.permissions.join(', ')
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users_export.csv');
    toast.success('Users exported to CSV.');
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto mt-10">

      <h1 className="text-3xl font-semibold mb-6 text-gray-800">👥 User Management</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center border rounded px-2 py-1 w-full sm:w-1/3 bg-white shadow-sm">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name, role, or permission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <XCircle size={16} className="text-gray-400 hover:text-gray-600 ml-1" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm min-h-[40px]">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 bg-white shadow-sm"
          >
            <option value="">All Roles</option>
            {getUniqueRoles().map((role, i) => (
              <option key={i} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 bg-white shadow-sm"
          >
            <option value="">All Permissions</option>
            {getUniquePermissions().map((perm, i) => (
              <option key={i} value={perm}>{perm}</option>
            ))}
          </select>

          {(selectedRole || selectedPermission) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm shadow"
          >
            <PlusCircle size={16} className="mr-1" /> Add User
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm shadow"
          >
            <FileDown size={16} className="mr-1" /> Export CSV
          </button>
        </div>
      </div>

      <div className="text-gray-500 text-sm mb-2">
        Showing {filteredUsers.length} users, Page {currentPage} of {totalPages}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Role</th>
                <th className="px-4 py-3 border-b">Permissions</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150 text-sm text-gray-700">
                  <td className="px-4 py-3 border-b font-medium">{user.name}</td>
                  <td className="px-4 py-3 border-b">{user.email}</td>
                  <td className="px-4 py-3 border-b">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs capitalize">
                      {user.role || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">
                    {user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((perm, i) => (
                          <span key={i} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                            {perm}
                          </span>
                        ))}
                      </div>
                    ) : 'None'}
                  </td>
                  <td className="px-4 py-3 border-b flex items-center gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={() => {
            setShowAddModal(false);
            loadUsers();
            toast.success('User added successfully.');
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={() => {
            setEditUser(null);
            loadUsers();
            toast.success('User updated successfully.');
          }}
        />
      )}

      {userToDelete && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.name}?`}
          onConfirm={confirmDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
