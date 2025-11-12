import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/default-Movie-image.jpg';
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  return `${baseUrl}/${size}${path}`;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800">
        <div className="relative aspect-2/3 w-full bg-gray-200 dark:bg-gray-700">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 min-h-14 text-gray-900 dark:text-white">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {releaseYear}
            </span>

            <div className="flex items-center gap-1">
              <span className="text-yellow-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-yellow-300">
                <path strokeLinecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              </span> 
              <span className="font-medium text-gray-900 dark:text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {movie.vote_count} votes
          </div>
        </div>
      </div>
    </Link>
  );
}
