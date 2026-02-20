import { useEffect, useState } from "react";
import type { Watchlist } from "../types/Watchlist.ts";
import type {Movie} from "../types/Movie.ts";
import MovieWatchlistCard from "./MovieWatchlistCard.tsx";

type WatchlistCardProps = {
    watchlist: Watchlist;
};


export default function WatchlistCard({ watchlist }: WatchlistCardProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const responses = await Promise.all(
                    watchlist.itemIDs.map(async (id) => {
                        const res = await fetch(
                            `${import.meta.env.VITE_API_URL}/movie/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                                },
                            }
                        );
                        return res.json();
                    })
                );

                setMovies(responses);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, [watchlist.itemIDs]);

    if (loading) return <p>Loading movies...</p>;

    return (
            <div className={"watchlist-card"}>
                <div className={"watchlist-card-top"}>
                    <h1>{watchlist.name}</h1>
                    <p>{watchlist.description}</p>
                </div>

                <h2>Movies:</h2>
                {movies.map((movie) => (
                    <MovieWatchlistCard key={movie.id} movie={movie} />
                ))}

                <div className={"watchlist-card-bottom"}>
                    <p>{watchlist.id}</p>
                </div>
            </div>

    );
}