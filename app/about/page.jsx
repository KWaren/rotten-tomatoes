"use client";

import { useState, useEffect, use } from "react";
import { get_popular_movies, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/movie/MovieCard";

export default function AboutPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await get_popular_movies(1);
      setMovies(data.results.slice(0, 12));
    };
    loadMovies();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 uppercase">
          <span className="text-4xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 text-white-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
              />
            </svg>
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">
            My Rotten Tomatoes
          </h1>
        </Link>
        {/* <nav className="hidden md:flex gap-8 items-center">
          <Link href="/about" className="hover:text-red-500 transition-colors">
            About
          </Link>
          <Link href="/movies" className="hover:text-red-500 transition-colors">
            Movies
          </Link>
          <Link
            href="/#gallery"
            className="hover:text-red-500 transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/#gameplay"
            className="hover:text-red-500 transition-colors"
          >
            Gameplay
          </Link>
        </nav> */}
        <Link
          href="/register"
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex gap-2"
        >
          Sign Up
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        </Link>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/woman-enjoys-movie-alone-dark-cinema_932138-44337.jpg"
              alt="Hero background"
              layout="fill"
              objectFit="cover"
              loading="eager"
              className="opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </div>
          <div className="relative container mx-auto px-4 z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* <p className="text-red-500 font-bold text-lg">MOVIE DISCOVERY PLATFORM</p> */}
              <h2 className="text-6xl font-extrabold my-4">
                DISCOVER OR BE DISCOVERED
              </h2>
              <p className="text-lg">
                Stranded in a sea of endless movie choices? You must make the
                unthinkable choice: which movie to watch next. How far will you
                go to find the perfect film?
              </p>
              <div className="flex gap-4 mt-8 justify-center">
                <Link
                  href="/movies"
                  className="bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition-colors"
                >
                  BROWSE MOVIES
                </Link>
                <a
                  href="#features"
                  className="border border-gray-600 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Info Bar */}
        <section className="container mx-auto bg-neutral-900/60 py-8 shadow-lg">
          <div className="container mx-auto px-4 flex justify-around text-center">
            <div>
              <p className="text-4xl font-bold text-red-500">1M+</p>
              <p className="text-gray-400">Movies Rated</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-500">10k+</p>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-500">500k+</p>
              <p className="text-gray-400">Comments</p>
            </div>
          </div>
        </section>

        {/* Listing Section */}
        <section
          className="container mx-auto px-4 py-24 text-center"
        >
          <h3 className="text-4xl font-bold mb-4">TRENDING NOW</h3>
          <hr className="mx-auto text-red-500 w-1/12 mb-4" />
          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-16">
            From blockbuster hits to indie gems, this is what's trending. Watch,
            rate, and join the discussion on the most popular titles of the
            moment.
          </p>
          <div className="grid md:grid-cols-4 gap-12">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Link
            href="/"
            className="text-xl bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center gap-4 w-max mt-20 mx-auto animate-pulse"
          >
            See More{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 pb-y-24 text-center"
        >
          <h3 className="text-4xl font-bold mb-4">
            FEATURES THAT WILL HOOK YOU
          </h3>
          <hr className="mx-auto text-red-500 w-1/12 mb-4" />
          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-16">
            Experience movie discovery like never before with our groundbreaking
            systems and mechanics.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-neutral-900 p-8 rounded-lg">
              <p className="text-red-500 text-5xl font-extrabold mb-4">01</p>
              <h4 className="text-2xl font-bold mb-4 ">TOMATOETER & AUDIENCE SCORE</h4>
              <p className="text-gray-400">
               Get a clear picture of a movie's quality with our aggregated "Tomatometer" score
     from professional critics and the "Audience Score" from our user community.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-lg">
              <p className="text-red-500 text-5xl font-extrabold mb-4">02</p>
              <h4 className="text-2xl font-bold mb-12">
                READ & WRITE REVIEWS
              </h4>
              <p className="text-gray-400">
                Dive deep into reviews from a wide range of critics and users. Share your own take
     and engage in lively discussions with fellow movie fans.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-lg">
              <p className="text-red-500 text-5xl font-extrabold mb-4">03</p>
              <h4 className="text-2xl font-bold mb-4"> YOUR PERSONAL MOVIE GUIDE </h4>
              <p className="text-gray-400">
                Receive tailored recommendations based on your rating history and taste. Our
     algorithm helps you discover hidden gems and movies you're sure to love.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* <footer className="bg-neutral-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 My Rotten Tomatoes</p>
        </div>
      </footer> */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="flex justify-center items-center gap-2 text-gray-400">
            © 2025 My Rotten Tomatoes - Made with
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            by 2WLG Team
          </p>
        </div>
      </footer>
    </div>
  );
}
