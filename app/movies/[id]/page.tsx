import { get_movie_details } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const getImageUrl = (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/default-Movie-image.jpg';
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
    return `${baseUrl}/${size}${path}`;
};

// Helper pour formater la durée
const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
};

// Helper pour formater l'argent
const formatMoney = (amount: number): string => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('us-EN', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default async function MovieDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    let movie;

    try {
        movie = await get_movie_details(Number(id));
    } catch (error) {
        console.error('Erreur lors du chargement du film:', error);
        notFound();
    }

    const director = movie.credits?.crew.find((person) => person.job === 'Director');
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-4xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-white-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                            </svg>
                            </span>
                            <h1 className="text-2xl md:text-3xl font-bold text-red-600">
                                My Rotten Tomatoes
                            </h1>
                        </Link>

                        <nav className="flex gap-4 md:gap-6 text-sm md:text-base">
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
                        </nav>
                    </div>
                </div>
            </header>

            <div className="relative h-[300px] md:h-[500px] w-full">
                <Image
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />

                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href="/movies"
                        className="inline-flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src={getImageUrl(movie.poster_path, 'w500')}
                                alt={movie.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-xl">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {movie.title}
                                </h1>
                                {movie.original_title !== movie.title && (
                                    <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-2">
                                        ({movie.original_title})
                                    </p>
                                )}
                                {movie.tagline && (
                                    <p className="text-xl text-gray-700 dark:text-gray-300 italic">
                                        "{movie.tagline}"
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-lg">
                                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-lg">
                                    <span className="text-yellow-600 dark:text-yellow-400 text-2xl">⭐</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                        ({movie.vote_count} votes)
                                    </span>
                                </div>

                                <span className="text-gray-700 dark:text-gray-300">{releaseYear}</span>
                                <span className="text-gray-700 dark:text-gray-300">{formatRuntime(movie.runtime)}</span>
                                <span className="text-gray-700 dark:text-gray-300 capitalize">{movie.status}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {director && (
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Director:</span>
                                    <span>{director.name}</span>
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                    Synopsis
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                    {movie.overview || 'Aucun synopsis disponible.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {movie.budget > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatMoney(movie.budget)}</p>
                                    </div>
                                )}
                                {movie.revenue > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatMoney(movie.revenue)}</p>
                                    </div>
                                )}
                                {movie.homepage && (
                                    <div className="col-span-2">
                                        <a
                                            href={movie.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-600 hover:text-red-700 font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-blue-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                            </svg>
                                            Official site
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {movie.credits && movie.credits.cast.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Casting Principal
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movie.credits.cast.slice(0, 12).map((actor) => (
                                <div key={actor.id} className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                                        <Image
                                            src={getImageUrl(actor.profile_path, 'w185')}
                                            alt={actor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {actor.name}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                        {actor.character}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {movie.production_companies.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Production
                        </h2>
                        <div className="flex flex-wrap gap-6">
                            {movie.production_companies.map((company) => (
                                <div key={company.id} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    {company.logo_path && (
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src={getImageUrl(company.logo_path, 'w92')}
                                                alt={company.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <span className="text-sm">{company.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="flex justify-center items-center gap-2 text-gray-400">
                        © 2025 My Rotten Tomatoes - Made with
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        by 2WLG Team
                    </p>
                </div>
            </footer>
        </div>
    );
}
