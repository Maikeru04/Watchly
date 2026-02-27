import { useEffect, useRef, useState } from "react";
import MovieCard from "./components/MovieCard.tsx";
import type { Movie } from "./types/Movie.ts";
import { movieService } from "./api/MovieService.ts";
import type {Series} from "./types/Series.ts";

type HomepageProps = {
    searchQuery: string;
};

export default function Homepage({ searchQuery }: HomepageProps) {

    const [movies, setMovies] = useState<(Movie | Series)[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const activeRequestRef = useRef(0);

    useEffect(() => {
        if (!searchQuery) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMovies([]);
            return;
        }

        const fetchMovies = async () => {
            setLoading(true);

            const requestId = ++activeRequestRef.current;

            const { results, total_pages } =
                await movieService(searchQuery, 1);

            if (requestId !== activeRequestRef.current) return;

            setMovies(results);
            setCurrentPage(1);
            setTotalPages(total_pages);
            setLoading(false);
        };

        fetchMovies();
    }, [searchQuery]);

    const loadMore = async () => {
        if (currentPage >= totalPages) return;

        const nextPage = currentPage + 1;
        const requestId = ++activeRequestRef.current;

        const { results } = await movieService(searchQuery, nextPage);

        if (requestId !== activeRequestRef.current) return;

        setMovies(prev => [...prev, ...results]);
        setCurrentPage(nextPage);
    };

    return (
        <div style={{ padding: "1rem" }}>
            {loading && <p>Lade Filme...</p>}

            <div className="movie-grid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {currentPage < totalPages && searchQuery && (
                <div className="loadmore-container">
                    <button className="btn-loadmore" onClick={loadMore}>
                        Load More results
                    </button>
                </div>
            )}

            {currentPage >= totalPages && movies.length > 0 && (
                <p>Keine weiteren Ergebnisse</p>
            )}
        </div>
    );
}