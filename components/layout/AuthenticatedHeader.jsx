"use client";

import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/auth/LogoutButton";
import logo from "../../public/Logo.png";

export default function AuthenticatedHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              className="px-0 py-0"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-red-600">
              My Rotten Tomatoes
            </h1>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-sm md:text-base">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/favorites"
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Favorites
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
            >
              Profile
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
