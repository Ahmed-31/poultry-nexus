import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { updateCurrentUser } from '../services/usersService';
import { fetchUser } from '../services/authService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [editAuthPassword, setEditAuthPassword] = useState('');
  const [showEditAuth, setShowEditAuth] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUser();
        const userData = response.data;
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        showAlert('Failed to load user data.', 'error');
      }
    };

    loadUser();
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && editedUser.name && editedUser.email) {
      saveChanges();
    }
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const toggleEditPrompt = () => {
    setShowEditAuth(true);
  };

  const confirmEditAccess = async () => {
    if (!editAuthPassword) {
      showAlert('Please enter your password to edit your profile.', 'warning');
      return;
    }
    try {
      setIsEditing(true);
      setShowEditAuth(false);
      setEditAuthPassword('');
    } catch (error) {
      showAlert('Invalid password. Please try again.', 'error');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user);
    setConfirmPassword('');
    setShowPassword(false);
    setAlert({ message: '', type: '' });
  };

  const saveChanges = async () => {
    if (editedUser.password) {
      if (!isStrongPassword(editedUser.password)) {
        showAlert('Password must be at least 8 characters and include letters and numbers.', 'warning');
        return;
      }
      if (editedUser.password !== confirmPassword) {
        showAlert('Passwords do not match.', 'warning');
        return;
      }
    }

    try {
      setIsSaving(true);
      const response = await updateCurrentUser(editedUser, confirmPassword);
      setUser(response);
      cancelEdit();
      showAlert('Profile updated successfully!', 'success');

      if (editedUser.password) {
        showAlert('Password updated. Redirecting to homepage...', 'info');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showAlert(error.response?.data?.message || 'Error updating user', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">👤 User Profile Management</h1>

      {alert.message && (
        <div
          className={`mb-4 p-3 rounded ${
            alert.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : alert.type === 'error'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : alert.type === 'warning'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-blue-100 text-blue-700 border border-blue-300'
          }`}
        >
          {alert.message}
        </div>
      )}

      {showEditAuth && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">🔒 Confirm Password to Edit Profile</h2>
          <input
            type="password"
            placeholder="Enter your password"
            value={editAuthPassword}
            onChange={(e) => setEditAuthPassword(e.target.value)}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={confirmEditAccess}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowEditAuth(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table-auto w-full mb-6 border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Field</th>
            <th className="px-4 py-2 border">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border font-semibold">Name</td>
            <td className="px-4 py-2 border">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                user.name
              )}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border font-semibold">Email</td>
            <td className="px-4 py-2 border">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                user.email
              )}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border font-semibold">Password</td>
            <td className="px-4 py-2 border">
              {isEditing ? (
                <div className="relative mb-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={editedUser.password || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="border px-2 py-1 rounded w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                '********'
              )}

              {isEditing && editedUser.password && (
                <p
                  className={`text-sm mt-1 ${
                    isStrongPassword(editedUser.password) ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {isStrongPassword(editedUser.password)
                    ? 'Strong password'
                    : 'Weak password'}
                </p>
              )}
            </td>
          </tr>

          {isEditing && (
            <tr>
              <td className="px-4 py-2 border font-semibold">Confirm Password</td>
              <td className="px-4 py-2 border">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="border px-2 py-1 rounded w-full pr-10"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={saveChanges}
              disabled={isSaving}
              className={`px-4 py-2 rounded text-white ${
                isSaving ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditPrompt}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
