"use client";

import { useState, useEffect } from "react";
import logo from "../../public/Logo.png";
import { get_popular_movies, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/movie/MovieCard";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadMovies = async () => {
      const data = await get_popular_movies(1);
      const tmdbMovies = data.results.slice(0, 12);

      const dbResponse = await fetch("/api/movies", { cache: "no-store" });
      const dbData = await dbResponse.json();
      const dbMovies = dbData.movies || [];

      const enrichedMovies = tmdbMovies.map((tmdbMovie) => {
        const dbMovie = dbMovies.find((m) => m.tmdbId === tmdbMovie.id);
        if (dbMovie) {
          return {
            ...tmdbMovie,
            averageRating: dbMovie.averageRating,
            _count: dbMovie._count,
            ratings: dbMovie.ratings,
            favorites: dbMovie.favorites,
          };
        }
        return tmdbMovie;
      });

      setMovies(enrichedMovies);
    };
    loadMovies();
  }, []);

  const handleProtectedNavigate = async (e, href) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json || !json.user) {
        router.push("/login");
        return;
      }

      router.push(href);
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 uppercase">
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
        <div className="flex gap-3">
          <Link
            href="/login"
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex gap-2"
          >
            Login
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </Link>
          <Link
            href="/register"
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex gap-2"
          >
            Sign Up
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/woman-enjoys-movie-alone-dark-cinema_932138-44337.jpg"
              alt="Hero background"
              fill
              style={{ objectFit: "cover" }}
              loading="eager"
              className="opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" />
          </div>
          <div className="relative container mx-auto px-4 z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* <p className="text-red-500 font-bold text-lg">MOVIE DISCOVERY PLATFORM</p> */}
              <h2 className="text-4xl md:text-6xl font-extrabold my-4">
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
                  onClick={(e) => handleProtectedNavigate(e, "/movies")}
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
        <section className="container mx-auto px-4 py-24 text-center">
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
            onClick={(e) => handleProtectedNavigate(e, "/")}
            className="text-xl bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center gap-4 w-max mt-20 mx-auto animate-pulse"
          >
            See More{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
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
              <h4 className="text-2xl font-bold mb-4 ">
                TOMATOETER & AUDIENCE SCORE
              </h4>
              <p className="text-gray-400">
                Get a clear picture of a movie's quality with our aggregated
                "Tomatometer" score from professional critics and the "Audience
                Score" from our user community.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-lg">
              <p className="text-red-500 text-5xl font-extrabold mb-4">02</p>
              <h4 className="text-2xl font-bold mb-12">READ & WRITE REVIEWS</h4>
              <p className="text-gray-400">
                Dive deep into reviews from a wide range of critics and users.
                Share your own take and engage in lively discussions with fellow
                movie fans.
              </p>
            </div>
            <div className="bg-neutral-900 p-8 rounded-lg">
              <p className="text-red-500 text-5xl font-extrabold mb-4">03</p>
              <h4 className="text-2xl font-bold mb-4">
                {" "}
                YOUR PERSONAL MOVIE GUIDE{" "}
              </h4>
              <p className="text-gray-400">
                Receive tailored recommendations based on your rating history
                and taste. Our algorithm helps you discover hidden gems and
                movies you're sure to love.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
