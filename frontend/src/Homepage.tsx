import MovieCard from "./components/MovieCard.tsx";
import type { Movie } from "./types/Movie.ts";

type HomepageProps = {
    movies: Movie[];
    loading: boolean;
};

export default function Homepage({ movies, loading }: HomepageProps) {
    return (
        <div>
            {loading && <p>Lade Filme...</p>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}