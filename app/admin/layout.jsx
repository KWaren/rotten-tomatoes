"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const linkClass = (href) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${
      pathname === href
        ? "bg-blue-200 text-blue-600"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        console.log("API /me response:", data); // debug
        setUser(data.user); // ← récupérer l'objet user directement
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) router.push("/login");
      else console.error("Logout failed");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleProfileRedirect = () => {
    router.push("/profile");
  };

  return (
    <div className="bg-gray-50 text-black min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          {/* User Menu */}
          {user && (
            <div
              onClick={handleProfileRedirect}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span className="text-gray-700 font-medium hidden md:block">
                {user.name} {user.surname}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-40 mt-14 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4">
          <nav className="space-y-1">
            <Link href="/admin" className={linkClass("/admin")}>
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              <span>Users</span>
            </Link>
            <Link href="/admin/movies" className={linkClass("/admin/movies")}>
              <span>Movies</span>
            </Link>
            <Link
              href="/admin/movies-tmdb"
              className={linkClass("/admin/movies-tmdb")}
            >
              <span>Add from TMDB</span>
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 mt-14 p-6">{children}</main>
    </div>
  );
}
