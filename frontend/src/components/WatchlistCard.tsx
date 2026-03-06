import { useEffect, useState } from "react";
import type { Watchlist } from "../types/Watchlist.ts";
import type {Movie} from "../types/Movie.ts";
import MovieWatchlistCard from "./MovieWatchlistCard.tsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaPen, FaTrash} from "react-icons/fa";
import CreateEditWatchlistModal from "./CreateEditWatchlistModal.tsx";

type WatchlistCardProps = {
    watchlist: Watchlist;
    onUpdate: () => void;
};


export default function WatchlistCard({ watchlist, onUpdate }: WatchlistCardProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        async function fetchMovies() {
            try {
                const responses = await Promise.all(
                    watchlist.items.map(async (item) => {

                        const endpoint =
                            item.media_type === "movie"
                                ? `/movie/${item.itemID}`
                                : `/tv/${item.itemID}`;

                        const res = await fetch(
                            `${import.meta.env.VITE_API_URL}/${endpoint}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                                },
                            }
                        );
                        return res.json();
                    })
                );

                setMovies(responses.map((movie, index) => ({
                    ...movie,
                    media_type: watchlist.items[index].media_type
                })));
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, [watchlist.items]);

    async function handleDrop(e: React.DragEvent, targetWatchlistId: string) {
        const movieId = e.dataTransfer.getData("movieId");
        const fromWatchlist = e.dataTransfer.getData("fromWatchlist");
        const mediaType = e.dataTransfer.getData("media_type");
        const rating = e.dataTransfer.getData("rating");

        if (!movieId || !fromWatchlist || fromWatchlist === targetWatchlistId) return;

        try {
            await axios.delete(`/api/watchlist/${fromWatchlist}/movie`, {
                data: {
                    itemID: movieId,
                    media_type: mediaType,
                    rating: rating
                }
            });

            await axios.post(`/api/watchlist/${targetWatchlistId}/movie`, {
                itemID: movieId,
                media_type: mediaType,
                rating: rating
            }, { withCredentials: true });

            onUpdate()

        } catch (err) {
            console.error("Move failed", err);
        }
    }

    function deleteWatchlist() {
        axios.delete(`/api/watchlist/${watchlist.id}`)
        globalThis.location.reload()
    }

    function editWatchlist() {
        setModalOpen(true);
    }

    function navHome() {
        nav("/")
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
                    <div className={"watchlist-card-top-text"}>
                        <h1>{watchlist.name}</h1>
                        <p>{watchlist.description}</p>
                    </div>
                    <div className={"watchlist-card-top-button"}>
                        {watchlist.id !== "Completed" && (
                            <>
                                <button className={"btn"} onClick={editWatchlist}><FaPen/></button>
                                <button className={"btn"} onClick={deleteWatchlist}><FaTrash/></button>

                            </>
                        )}
                    </div>
                </div>

            {movies.length === 0 && watchlist.id !== "Completed" ? (
                <div className={"empty-watchlist"}>
                    <button className={"btn"} onClick={navHome}>Browse for movies</button>
                </div>
            ) : (
                movies.map((movie) => (
                    <MovieWatchlistCard key={movie.id} movie={movie} watchlistID={watchlist.id}/>
                )))
            }
                <div className={"watchlist-card-bottom"}>
                    <p>{watchlist.id}</p>
                </div>

            {modalOpen && <CreateEditWatchlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {
                    globalThis.location.reload()
                }}
                watchlist={watchlist}
            />}
            </div>



    );
}