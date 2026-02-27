import type {Movie} from "../types/Movie.ts";
import {useState} from "react";
import CreateAddToWatchlistModal from "./CreateAddToWatchlistModal.tsx";
import type {Series} from "../types/Series.ts";

type MovieCardProps = {
    movie: Movie | Series
}

export default function MovieCard({movie}:MovieCardProps) {

    const [modalOpen, setModalOpen] = useState(false);

    const isMovie = movie.media_type === "movie";

    const title = isMovie ? movie.title : movie.name;
    const date = isMovie ? movie.release_date : movie.first_air_date;

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
                <h3>{isMovie ? "🎬" : "📺"} {title}</h3>
                <p>
                    {isMovie ? "Release:" : "First Air:"}{" "}
                    {date ? `${date.split("-")[2]}.${date.split("-")[1]}.${date.split("-")[0]}` : ""}
                </p>
                <p>Rating: {Math.round(movie.vote_average * 10) / 10} / 10⭐</p>
                <button onClick={addToWatchlist}>Add to Watchlist</button>
            </div>
        </div>

            {modalOpen && <CreateAddToWatchlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {

                }}
                movie={movie}
            />}
        </>
    )
}