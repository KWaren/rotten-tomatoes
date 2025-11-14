"use client";

import React, { useState } from "react";
import { maskEmail, timeAgo, formatDateToMonthYear } from "./utils";
import EditCommentModal from "./EditCommentModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function CommentCard({
  comment,
  currentUserId,
  onDelete,
  onEdit,
}) {
  const author = comment.user?.name
    ? `${comment.user.name} ${comment.user.surname || ""}`
    : comment.user?.email
    ? maskEmail(comment.user.email.toLowerCase())
    : "꩜";
  const isOwner =
    currentUserId != null && String(currentUserId) === String(comment.userId);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <li className="rounded p-3 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-start justify-start gap-4">
        <div className="font-semibold text-gray-900 dark:text-white text-xl bg-red-600 w-min py-3 px-4 uppercase rounded-full">
          ꩜
        </div>

        <div>
          <div className="text-xs text-gray-500">
            Posted <i>{timeAgo(comment.createdAt)}</i> on{" "}
            {formatDateToMonthYear(comment.createdAt)}
          </div>
          <h2 className="text-bold text-red-600 font-bold text-lg">
            <span className="text-gray-500 text-xs">
              <i>by </i>
            </span>
            {author}
          </h2>
          {isOwner && (
          <div className="flex gap-2 items-center">
            <button
              className="text-sm text-white inline-flex items-center cursor-pointer gap-2 rounded-full hover:bg-neutral-400 py-1.5 hover:px-3"
              onClick={() => setEditModalOpen(true)}
              aria-label="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              <span>Edit</span>
            </button>
            <button
              className="text-sm text-red-600 inline-flex items-center cursor-pointer gap-2 rounded-full hover:bg-red-100 py-2 px-3"
              onClick={() => setDeleteModalOpen(true)}
              aria-label="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}

        </div>
        
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-300">
        
        <div className="whitespace-pre-wrap wrap-break-word max-w-full">
              {comment.content}
            </div>
      </div>

      {isEditModalOpen && (
        <EditCommentModal
          comment={comment}
          onClose={() => setEditModalOpen(false)}
          onSave={onEdit}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => onDelete(comment.id)}
        />
      )}
    </li>
  );
}
