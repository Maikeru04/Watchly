import type {Movie} from "../types/Movie.ts";
import axios from "axios";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}:MovieCardProps) {
    function addToWatchlist() {
        axios.post(`/api/watchlist/c7d9e2f4-9a11-4b55-92aa-3b0f87654321/movie/${movie.id}`)
    }
    return(
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
    )
}