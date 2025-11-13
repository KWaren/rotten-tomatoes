'use client';
import { useState, useEffect } from 'react';

export default function UsersPage({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Compter les admins et actifs
  const adminCount = users.filter(u => u.isAdmin).length;
  const activeCount = users.filter(u => u.isActive).length;

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || (u.isAdmin ? 'admin' : 'user') === roleFilter;
    const matchesStatus = !statusFilter || (u.isActive ? 'active' : 'inactive') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Supprimer un utilisateur
  const deleteUser = async (userId, userName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${userName}" ?`)) {
      try {
        const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter(u => u._id !== userId));
          setMessage(`Utilisateur "${userName}" supprimé.`);
        } else {
          setErrors(['Erreur lors de la suppression.']);
        }
      } catch (err) {
        console.error(err);
        setErrors(['Erreur lors de la suppression.']);
      }
    }
  };

  // Auto-hide messages
  useEffect(() => {
    if (message || errors.length) {
      const timer = setTimeout(() => {
        setMessage('');
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, errors]);

  return (
    <div className="p-6 max-w-full">

      {/* Messages */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg flex items-center justify-between">
          <p className="text-green-800 font-medium">{message}</p>
          <button onClick={() => setMessage('')} className="text-green-500 hover:text-green-700">
            ✕
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-red-800 font-medium mb-2">Erreurs détectées :</p>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
          <button onClick={() => setErrors([])} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h2>
          <p className="text-gray-600">Gérer et administrer les comptes utilisateurs</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total utilisateurs</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Administrateurs</p>
          <h3 className="text-2xl font-bold text-gray-900">{adminCount}</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Utilisateurs actifs</p>
          <h3 className="text-2xl font-bold text-gray-900">{activeCount}</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Rechercher par nom, email..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date création</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">User</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Actif</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => alert('Voir: ' + user.name)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition">Voir</button>
                      <button onClick={() => alert('Edit: ' + user.name)} className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition">Edit</button>
                      <button onClick={() => deleteUser(user._id, user.name)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition">Supprimer</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajouter Utilisateur */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un utilisateur</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Nom complet" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="text" placeholder="Nom d'utilisateur" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="password" placeholder="Mot de passe" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="flex items-center">
                <input type="checkbox" checked className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"/>
                <label className="ml-2 text-sm text-gray-700">Compte actif</label>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition">Annuler</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
