import { useEffect, useState } from "react";
import type { Watchlist } from "../types/Watchlist.ts";
import type {Movie} from "../types/Movie.ts";
import MovieWatchlistCard from "./MovieWatchlistCard.tsx";
import axios from "axios";

type WatchlistCardProps = {
    watchlist: Watchlist;
    onUpdate: () => void;
};


export default function WatchlistCard({ watchlist, onUpdate }: WatchlistCardProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);

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

    async function handleDrop(e: React.DragEvent, targetWatchlistId: string) {
        const movieId = e.dataTransfer.getData("movieId");
        const fromWatchlist = e.dataTransfer.getData("fromWatchlist");

        if (!movieId || !fromWatchlist || fromWatchlist === targetWatchlistId) return;

        try {
            await axios.delete(`/api/watchlist/${fromWatchlist}/movie/${movieId}`);

            await axios.post(`/api/watchlist/${targetWatchlistId}/movie/${movieId}`);

            onUpdate()

        } catch (err) {
            console.error("Move failed", err);
        }
    }

    if (loading) return <p>Loading movies...</p>;

    return (
        <div
            className={`watchlist-card ${isDragOver ? "drag-over" : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
                setIsDragOver(false);
                handleDrop(e, watchlist.id);
            }}
        >
                <div className={"watchlist-card-top"}>
                    <h1>{watchlist.name}</h1>
                    <p>{watchlist.description}</p>
                </div>

                {movies.map((movie) => (
                    <MovieWatchlistCard key={movie.id} movie={movie} watchlistID={watchlist.id}/>
                ))}

                <div className={"watchlist-card-bottom"}>
                    <p>{watchlist.id}</p>
                </div>
            </div>

    );
}