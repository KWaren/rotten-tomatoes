"use client";

import { useState, useEffect } from "react";

export default function UpdateUserModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    profession: "",
    birthday: "",
    email: "",
    role: "USER",
    verified: false,
  });

  // Remplir automatiquement les champs lorsque l'user est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        profession: user.profession || "",
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
        email: user.email || "",
        role: user.role || "USER",
        verified: user.verified || false,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      alert("Utilisateur mis à jour !");
      onUpdate && onUpdate(updated);
      onClose();
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Erreur mise à jour");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Modifier l’utilisateur : {user?.name}
        </h2>

        {/* FORM */}
        <form className="space-y-4" onSubmit={updateUser}>
          
          {/* Name + Surname */}
          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
            required
          />

          {/* Profession */}
          <input
            type="text"
            placeholder="Profession"
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.profession}
            onChange={(e) =>
              setFormData({ ...formData, profession: e.target.value })
            }
            required
          />

          {/* Birthday */}
          <input
            type="date"
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          {/* Role */}
          <select
            className="w-full border border-gray-500 rounded-lg px-4 py-2"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Verified */}
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={formData.verified}
              onChange={(e) =>
                setFormData({ ...formData, verified: e.target.checked })
              }
            />
            <label className="ml-2 text-sm">Active account</label>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 cursor-pointer rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
