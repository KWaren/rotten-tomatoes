'use client';

import UpdateUserModal from "@/components/users/UpdateUserModal";
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  // Fields for new user
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'USER',
    verified: false,
  });

  // Fetch users on page load
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setErrors(['Failed to load users']);
        }
      } catch (err) {
        console.error(err);
        setErrors(['An error occurred while loading users']);
      }
    }
    loadUsers();
  }, []);

  // Create user
  const createUser = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrors([errorData.error || 'Failed to create user']);
        return;
      }

      const createdUser = await res.json();

      setUsers([createdUser, ...users]);
      setMessage(`User "${createdUser.name}" created successfully!`);

      setShowAddModal(false);
      setNewUser({
        name: '',
        surname: '',
        email: '',
        password: '',
        role: 'USER',
        verified: false,
      });
    } catch (err) {
      console.error(err);
      setErrors(['Unexpected error when creating user']);
    }
  };

  // Delete user
  const deleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete "${userName}"?`)) {
      try {
        const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter((u) => u.id !== userId));
          setMessage(`User "${userName}" deleted successfully.`);
        } else {
          setErrors(['Failed to delete user.']);
        }
      } catch (err) {
        console.error(err);
        setErrors(['An unexpected error occurred.']);
      }
    }
  };

  // Auto hide messages
  useEffect(() => {
    if (message || errors.length) {
      const timer = setTimeout(() => {
        setMessage('');
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, errors]);

  // Stats
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const activeCount = users.filter((u) => u.verified).length;

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.surname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || u.role.toLowerCase() === roleFilter;
    const matchesStatus =
      !statusFilter || (u.verified ? 'active' : 'inactive') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 max-w-full">
      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg flex items-center justify-between">
          <p className="text-green-800 font-medium">{message}</p>
          <button
            onClick={() => setMessage('')}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* ERRORS */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-red-800 font-medium mb-2">Errors:</p>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setErrors([])}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h2>
          <p className="text-gray-600">Manage and administer user accounts</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Add User
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Administrators</p>
          <h3 className="text-2xl font-bold text-gray-900">{adminCount}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <h3 className="text-2xl font-bold text-gray-900">{activeCount}</h3>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-gray-800 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name} {user.surname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.profession || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">{user.email}</td>

                    <td className="px-6 py-4">
                      {user.role === 'ADMIN' ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {user.verified ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 text-sm rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE USER MODAL */}
      <UpdateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onUpdate={(updatedUser) => {
          setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        }}
      />

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center text-gray-800 justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={createUser}>
              <input
                type="text"
                placeholder="First Name"
                className="w-full border rounded-lg px-4 py-2"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                className="w-full border rounded-lg px-4 py-2"
                value={newUser.surname}
                onChange={(e) =>
                  setNewUser({ ...newUser, surname: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />

              <select
                className="w-full border rounded-lg px-4 py-2"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={newUser.verified}
                  onChange={(e) =>
                    setNewUser({ ...newUser, verified: e.target.checked })
                  }
                />
                <label className="ml-2 text-sm">Active account</label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
