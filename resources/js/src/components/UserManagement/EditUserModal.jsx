import React, { useState, useEffect } from 'react';
import { updateUser, getAvailablePermissions } from '@/src/services/usersService';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [form, setForm] = useState({ ...user });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const perms = await getAvailablePermissions();
        setAvailablePermissions(perms);
      } catch (err) {
        console.error('Failed to load permissions', err);
      }
    };
    loadPermissions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePermission = (perm) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateUser(user.id, form);
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error('Update user error', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit User</h2>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full border rounded px-3 py-2"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full border rounded px-3 py-2"
            value={form.role}
            onChange={handleChange}
          />
          <div>
            <p className="font-medium mb-1 text-sm">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {availablePermissions.map((perm, idx) => (
                <label key={idx} className="text-xs">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={form.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
