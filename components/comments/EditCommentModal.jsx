"use client";

import React, { useState } from "react";

export default function EditCommentModal({ comment, onClose, onSave }) {
  const [text, setText] = useState(comment.content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave(comment.id, text.trim());
      onClose();
    } catch (err) {
      console.error("Failed to save comment", err);
      // Optionally, show an error message to the user
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Modifier le commentaire</h2>
        <textarea
          className="w-full border-none outline-none rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          disabled={saving}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button                                                                 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
            disabled={!text.trim() || saving}
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
