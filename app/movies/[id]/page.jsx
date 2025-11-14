import { notFound } from "next/navigation";
import MovieClientPage from "../../../components/movie/MovieClientPage";

async function getMovieFromDB(id) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/movies/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const movie = await getMovieFromDB(id);

  if (!movie) notFound();

  return <MovieClientPage movie={movie} />;
}
