import MovieCard from "./components/MovieCard.tsx";
import type { Movie } from "./types/Movie.ts";

type HomepageProps = {
    movies: Movie[];
    loading: boolean;
};

export default function Homepage({ movies, loading, loadMore, currentPage, totalPages }: HomepageProps & { loadMore: () => void; currentPage: number; totalPages: number }) {
    return (
        <div style={{ padding: "1rem" }}>
            {loading && <p>Lade Filme...</p>}

            <div className="movie-grid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {currentPage < totalPages && (
                <div className="loadmore-container">
                    <button className="btn-loadmore" onClick={loadMore}>Load More results</button>
                </div>
            )}
            {currentPage >= totalPages && movies.length > 0 && <p>Keine weiteren Ergebnisse</p>}
        </div>
    );
}