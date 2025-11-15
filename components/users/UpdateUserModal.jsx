"use client";

import { useState, useEffect } from "react";

export default function UpdateUserModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "",
    profession: "",
    birthday: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        role: user.role || "USER",
        profession: user.profession || "",
        birthday: user.birthday ? user.birthday.split('T')[0] : "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      
      alert("Utilisateur mis à jour avec succès !");
      if (onUpdate) onUpdate(updatedUser);
      onClose();
      
      // Recharger la page pour afficher les modifications
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 text-gray-800 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Modifier l&apos;utilisateur : {user?.name}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nom</label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profession</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date de naissance</label>
            <input
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
