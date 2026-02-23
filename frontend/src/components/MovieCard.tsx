import type {Movie} from "../types/Movie.ts";
import {useState} from "react";
import CreateAddToWatchlistModal from "./CreateAddToWatchlistModal.tsx";
import {useNavigate} from "react-router-dom";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}:MovieCardProps) {

    const [modalOpen, setModalOpen] = useState(false);
    const nav = useNavigate();

    function addToWatchlist() {
        setModalOpen(true);
    }
    return(
        <>
        <div className="movie-card"
            style={{
                backgroundImage: movie.poster_path
                    ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                    : `url(/image_not_found.jpg)`
            }}
        >
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>
                    Release: {movie.release_date ? `${movie.release_date.split("-")[2]}.${movie.release_date.split("-")[1]}.${movie.release_date.split("-")[0]}` : ""}
                </p>
                <p>Rating: {Math.round(movie.vote_average * 10) / 10} / 10⭐</p>
                <button onClick={addToWatchlist}>Add to Watchlist</button>
            </div>
        </div>

            {modalOpen && <CreateAddToWatchlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {
                    nav("/")
                }}
                movie={movie}
            />}
        </>
    )
}